import { constraintDirective } from "graphql-constraint-directive";
import { createServer } from "@graphql-yoga/node";

import { makeExecutableSchema } from "@graphql-tools/schema";
import { IResolvers } from "@graphql-tools/utils";

import { logger } from "./logging";
import { GqlContext } from "./resolvers";
import { getFileUrl, getImageUrl, saveFile, saveImage } from "./minio";

export type ServerOptions = {
  port?: number;
};

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

  const server = createServer({
    port,
    schema,
    multipart: {
      fileSize: 20000000,
      files: 1,
    },
    logging: logger,
    cors: true,
    context: ({ req }): GqlContext => ({
      accountId: (
        req.headers["accountid"] || "c633bd68-30ce-4116-b54e-3054dc8caebc"
      ).toString(),
      getFileUrl,
      getImageUrl,
      saveFile,
      saveImage,
    }),
  });

  await server.start();

  return {
    graphqlURL: `http://localhost:${port}/graphql`,
  };
}
