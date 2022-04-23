import { readFileSync } from "fs";
import dotenv from "dotenv";

import { createResolvers } from "./resolvers";
import { startServer } from "./server";
import { createDBSubscriber } from "./db";

// load env variables
dotenv.config();

async function main() {
  const port = parseInt(process.env.PORT || "5001");

  const subscriber = await createDBSubscriber({
    connectionString: process.env.DATABASE_URL!,
  });
  const resolvers = await createResolvers(subscriber);

  // load graphql schema
  const schemaPath = require.resolve("./schema.gql");
  const typeDefs = readFileSync(schemaPath).toString("utf-8");

  await startServer(typeDefs, resolvers, { port });
}

main();
