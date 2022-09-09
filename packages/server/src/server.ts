import { constraintDirective } from "graphql-constraint-directive";
import { createServer, Plugin } from "@graphql-yoga/node";

import { makeExecutableSchema } from "@graphql-tools/schema";
import { IResolvers } from "@graphql-tools/utils";

import { flow } from "./util/flow";
import { logger } from "./logging";
import { GqlContext } from "./resolvers";
import { getFileUrl, getImageUrl, saveFile, saveImage } from "./minio";
import { InMemoryLiveQueryStore } from "@n1ru4l/in-memory-live-query-store";
import { applyLiveQueryJSONDiffPatchGenerator } from "@n1ru4l/graphql-live-query-patch-jsondiffpatch";

export type ServerOptions = {
  port?: number;
};

interface ExecuteContext {
  liveQueryStore: InMemoryLiveQueryStore;
}

export async function startServer(
  typeDefs: any,
  resolvers: IResolvers,
  options: ServerOptions
) {
  const { port = 4000 } = options;

  let schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });
  schema = constraintDirective()(schema);

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

  const liveQueryStore = new InMemoryLiveQueryStore();

  const server = createServer({
    port,
    schema,
    multipart: {
      fileSize: 20000000,
      files: 1,
    },
    logging: logger,
    cors: true,
    plugins: [liveQueryPlugin],
    context: ({ req }): GqlContext & ExecuteContext => ({
      accountId: (
        req.headers["accountid"] || "c633bd68-30ce-4116-b54e-3054dc8caebc"
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
