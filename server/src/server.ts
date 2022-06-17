import http from "http";
import express from "express";

import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { constraintDirective } from "graphql-constraint-directive";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
//import apolloWinstonLoggingPlugin from "apollo-winston-logging-plugin";

import { makeExecutableSchema } from "@graphql-tools/schema";
import { IResolvers } from "@graphql-tools/utils";

//import { logger } from "./logging";
import { createLoaders } from "./loaders";
import { GqlContext } from "./resolvers";
import { getFileUrl, saveFile } from "./minio";
import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.js";

export type ServerOptions = {
  port?: number;
};

export async function startServer(
  typeDefs: any,
  resolvers: IResolvers,
  options: ServerOptions
) {
  const { port = 4000 } = options;

  // Required logic for integrating with Express
  const app = express();
  const httpServer = http.createServer(app);

  let schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });
  schema = constraintDirective()(schema);

  // Creating the WebSocket server
  const wsServer = new WebSocketServer({
    // This is the `httpServer` we created in a previous step.
    server: httpServer,

    // Pass a different path here if your ApolloServer serves at
    // a different path.
    path: "/graphql",
  });

  const serverCleanup = useServer({ schema }, wsServer);

  // Same ApolloServer initialization as before, plus the drain plugin.
  const server = new ApolloServer({
    schema,
    context: ({ req }): GqlContext => {
      return {
        ...createLoaders(),
        accountId: (
          req.headers["accountid"] || "c633bd68-30ce-4116-b54e-3054dc8caebc"
        ).toString(),
        saveFile,
        getFileUrl,
      };
    },
    plugins: [
      // logging using winston
      // apolloWinstonLoggingPlugin({
      //   winstonInstance: logger,
      // }) as any,

      ApolloServerPluginDrainHttpServer({ httpServer }),

      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

  // This middleware should be added before calling `applyMiddleware`.
  app.use(graphqlUploadExpress());

  server.applyMiddleware({ app });

  // Modified server startup
  await new Promise((resolve: any) => httpServer.listen({ port }, resolve));

  return {
    graphqlURL: `http://localhost:${port}${server.graphqlPath}`,
  };
}
