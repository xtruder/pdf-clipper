import { Exchange, subscriptionExchange } from "urql";
import { getOperationAST } from "graphql";
import { Repeater } from "@repeaterjs/repeater";
import { debug } from "debug";

import { isLiveQueryOperationDefinitionNode } from "@n1ru4l/graphql-live-query";
import { applyAsyncIterableIteratorToSink } from "@n1ru4l/push-pull-async-iterable-iterator";
import { applyLiveQueryJSONDiffPatch } from "@n1ru4l/graphql-live-query-patch-jsondiffpatch";
import { ExecutionLivePatchResult } from "@n1ru4l/graphql-live-query-patch";

const log = debug("liveQueryExchange");

function makeEventStreamSource(url: string) {
  return new Repeater<ExecutionLivePatchResult>(async (push, end) => {
    log("eventsource openening", url);

    const eventsource = new EventSource(url);

    eventsource.onopen = function () {
      log("eventsource opened", url);
    };

    eventsource.onmessage = function (event) {
      log("eventsource event", event);

      const data = JSON.parse(event.data);
      push(data);
      if (eventsource.readyState === 2) {
        log("evensource ended", url);
        end();
      }
    };

    eventsource.onerror = function (error) {
      log("eventsource error", error);
      end(new Error("error with eventsource stream"));
    };

    await end;

    log("eventsource closing", url);
    eventsource.close();
  });
}

export const liveQueryExchange: () => Exchange = () =>
  subscriptionExchange({
    isSubscriptionOperation({ query, variables, kind }) {
      if (kind === "teardown") return false;

      const definition = getOperationAST(query);
      const isSubscription =
        definition?.kind === "OperationDefinition" &&
        definition.operation === "subscription";

      const isLiveQuery =
        !!definition &&
        isLiveQueryOperationDefinitionNode(definition, variables as any);

      return isSubscription || isLiveQuery;
    },
    forwardSubscription(operation) {
      const targetUrl = new URL(operation.context.url);
      targetUrl.searchParams.append("query", operation.query);

      if (operation.variables) {
        targetUrl.searchParams.append(
          "variables",
          JSON.stringify(operation.variables)
        );
      }

      log("forward subscription operation", operation);

      return {
        subscribe: (sink) => {
          const unsub = applyAsyncIterableIteratorToSink(
            applyLiveQueryJSONDiffPatch(
              makeEventStreamSource(targetUrl.toString())
            ),
            sink
          );
          return {
            unsubscribe: () => {
              log("unsubscribing", targetUrl.toString());
              unsub();
            },
          };
        },
      };
    },
    enableAllOperations: true,
  });
