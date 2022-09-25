import { createServer, Plugin } from "@graphql-yoga/node";
import { useGraphQLMiddleware } from "@envelop/graphql-middleware";

import { makeExecutableSchema } from "@graphql-tools/schema";

import { applyLiveQueryJSONDiffPatchGenerator } from "@n1ru4l/graphql-live-query-patch-jsondiffpatch";

import { flow } from "./util/flow";
import { logger } from "./logging";
import { GqlContext } from "./resolvers";
//import { getFileUrl, getImageUrl, saveFile, saveImage } from "./minio";
import { permissions } from "./permissions";
import {
  liveQueryInvalidate,
  LiveQueryStore,
  RedisLiveQueryStore,
} from "./liveQuery";

export type ServerOptions = {
  port?: number;
};

interface ExecuteContext {
  liveQueryStore: LiveQueryStore;
}

export async function startServer(
  typeDefs: any,
  resolvers: any,
  options: ServerOptions
) {
  const { port = 4000 } = options;

  let schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const liveQueryPlugin: Plugin<ExecuteContext> = {
    onExecute: (onExecuteContext) => {
      onExecuteContext.setExecuteFn(
        flow(
          onExecuteContext.args.contextValue.liveQueryStore.makeExecute(
            onExecuteContext.executeFn
          ),
          applyLiveQueryJSONDiffPatchGenerator
        ) as any
      );
    },
  };

  const liveQueryStore = new RedisLiveQueryStore("", {});

  const server = createServer({
    port,
    schema,
    multipart: {
      fileSize: 20000000,
      files: 1,
    },
    logging: logger,
    cors: true,
    maskedErrors: false,
    plugins: [
      liveQueryPlugin,
      useGraphQLMiddleware([permissions, liveQueryInvalidate]),
    ],
    context: ({ req }): GqlContext & ExecuteContext => ({
      accountId: (
        req.headers["accountid"] || "1391b1f3-abe5-4b1f-8520-e2582cde320e"
      ).toString(),
      liveQueryStore,
      // getFileUrl,
      // getImageUrl,
      // saveFile,
      // saveImage,
    }),
  });

  await server.start();

  return {
    graphqlURL: `http://localhost:${port}/graphql`,
    stop: () => server.stop(),
  };
}
