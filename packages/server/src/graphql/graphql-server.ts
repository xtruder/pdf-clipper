import {
  createYoga,
  pipe,
  Plugin,
  useLogger,
  YogaInitialContext,
} from "graphql-yoga";
import { createFetch } from "@whatwg-node/fetch";
import {
  ExecutionArgs,
  GraphQLSchema,
  OperationDefinitionNode,
  parse,
} from "graphql";
import { useGraphQLMiddleware } from "@envelop/graphql-middleware";

import { applyLiveQueryJSONDiffPatchGenerator } from "@n1ru4l/graphql-live-query-patch-jsondiffpatch";
import { getLogger } from "../logging";
import { getExecutionArgsContext } from "./utils";

import { LiveQueryStore } from "./live-query";
import { GqlContext } from "./resolvers";

import { createLoaders, Loaders } from "../db/loaders";
import { permissions } from "./permissions";
import { BlobStorage } from "../db/blob-storage";

export type ServerOptions = {
  schema: GraphQLSchema;
  blobStorage: BlobStorage;
  liveQueryStore: LiveQueryStore;
};

interface ExecuteContext {
  liveQueryStore: LiveQueryStore;
  loaders: Loaders;
}

export function createGraphQLServer({
  schema,
  blobStorage,
  liveQueryStore,
}: ServerOptions) {
  const logger = getLogger("graphql-yoga");

  const liveQueryPlugin: Plugin<ExecuteContext> = {
    onExecute: (params) => {
      const myExecute = (args: ExecutionArgs) => {
        const context = getExecutionArgsContext<GqlContext>(args);

        for (const [, loader] of Object.entries(context?.loaders ?? {})) {
          loader.clearAll();
        }

        return params.executeFn(args);
      };

      const executeFn = liveQueryStore.makeExecute(myExecute);

      params.setExecuteFn((args) =>
        pipe(executeFn(args), applyLiveQueryJSONDiffPatchGenerator)
      );
    },
  };

  const loggerPlugin = useLogger({
    logFn: (eventName: string, events: any) => {
      switch (eventName) {
        case "execute-start":
        case "subscribe-start":
          const context: YogaInitialContext = events.args.contextValue;

          if (context.params.query) {
            const doc = parse(context.params.query as string);
            const op: OperationDefinitionNode = doc.definitions[0] as any;

            logger.info(
              "%s: '%s', variables: %O",
              op.directives?.find((d) => d.name.value === "live")
                ? "live " + op.operation
                : op.operation,
              op.name?.value,
              context.params.variables ?? {}
            );
          }
          break;
        case "execute-end":
        case "subscribe-end":
          logger.info("request end");
      }
    },
    skipIntrospection: false,
  });

  const server = createYoga({
    schema,
    fetchAPI: createFetch({
      useNodeFetch: true,
      formDataLimits: {
        fileSize: 20000000,
        files: 1,
      },
    }),
    // we use custom logging plugin
    logging: false,
    cors: true,
    maskedErrors: false,
    plugins: [
      liveQueryPlugin,
      useGraphQLMiddleware([permissions]),
      loggerPlugin,
    ],
    context: ({ request }): GqlContext & ExecuteContext => ({
      accountId: (
        request.headers.get("accountId") ||
        "1391b1f3-abe5-4b1f-8520-e2582cde320e"
      ).toString(),
      liveQueryStore,
      loaders: createLoaders(),
      blobStorage,
    }),
  });

  return server;
}
