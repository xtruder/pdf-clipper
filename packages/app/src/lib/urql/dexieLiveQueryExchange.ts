import {
  filter,
  share,
  pipe,
  mergeMap,
  takeUntil,
  fromObservable,
  merge,
  map,
} from "wonka";

import { Exchange, getOperationName, makeResult, Operation } from "urql";

import {
  execute,
  ExecutionArgs,
  getOperationAST,
  GraphQLSchema,
} from "graphql";
import { isLiveQueryOperationDefinitionNode } from "@n1ru4l/graphql-live-query";

import { liveQuery } from "dexie";

const isLiveQuery = (operation: Operation) => {
  if (operation.kind !== "query") return false;

  const definition = getOperationAST(operation.query);

  const isLiveQuery =
    !!definition &&
    isLiveQueryOperationDefinitionNode(definition, operation.variables as any);

  return isLiveQuery;
};

export interface DexieLiveQueryExchangeArgs {
  schema: GraphQLSchema;
  rootValue?: any;
  context: ((op: Operation) => any) | any;
}

export const dexieLiveQueryExchange =
  ({ context, schema, rootValue }: DexieLiveQueryExchangeArgs): Exchange =>
  ({ forward }) =>
  (ops$) => {
    const sharedOps$ = share(ops$);

    const executedOps$ = pipe(
      sharedOps$,
      filter(isLiveQuery),
      mergeMap((operation: Operation) => {
        const teardown$ = pipe(
          sharedOps$,
          filter((op) => op.kind === "teardown" && op.key === operation.key)
        );

        const contextValue =
          typeof context === "function" ? context(operation) : context;

        // Filter undefined values from variables before calling execute()
        // to support default values within directives.
        const variableValues = Object.create(null);
        if (operation.variables) {
          for (const key in operation.variables) {
            if (operation.variables[key] !== undefined) {
              variableValues[key] = operation.variables[key];
            }
          }
        }

        const args: ExecutionArgs = {
          schema,
          document: operation.query,
          rootValue,
          contextValue,
          variableValues,
          operationName: getOperationName(operation.query),
        };

        // run graphql execute and wrap it into dexie live query
        // liveQuery will record all queries made to dexie and will re-run
        // execute whenever any of query results changes
        const result$ = liveQuery(() => execute(args));

        return pipe(
          fromObservable(result$),
          map((result) => makeResult(operation, result)),
          takeUntil(teardown$)
        );
      })
    );

    // forward all operations that are not live queries
    const forwardedOps$ = pipe(
      sharedOps$,
      filter((operation) => !isLiveQuery(operation)),
      forward
    );

    return merge([executedOps$, forwardedOps$]);
  };
