import http from "http";
import express from "express";

import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";

import { makeExecutableSchema } from "@graphql-tools/schema";
import { TypeSource, IResolvers } from "@graphql-tools/utils";

export type ServerOptions = {
  port?: number;
};

export async function startServer(
  typeDefs: TypeSource,
  resolvers: IResolvers,
  options: ServerOptions
) {
  const { port = 4000 } = options;

  // Required logic for integrating with Express
  const app = express();
  const httpServer = http.createServer(app);

  const schema = makeExecutableSchema({ typeDefs, resolvers });

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
    context: ({ req }) => {},
    plugins: [
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

  server.applyMiddleware({ app });

  // Modified server startup
  await new Promise((resolve: any) => httpServer.listen({ port }, resolve));
  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
  );
}
