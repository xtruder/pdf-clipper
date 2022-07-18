import { readFileSync } from "fs";

import { appPort } from "./config";
import { AppDataSource } from "./data-source";
import { startInstrumentation } from "./instrumentation";
import { resolvers } from "./resolvers";
import { startServer } from "./server";
import { logger } from "./logging";

// AppDataSource.initialize()
//   .then(async () => {
//     console.log("Inserting a new user into the database...");
//     const account = new Account();
//     account.name = "burek";

//     await AppDataSource.manager.save(account);
//     console.log("Saved a new user with id: " + account.id);

//     console.log("Loading users from the database...");
//     const accounts = await AppDataSource.manager.find(Account);
//     console.log("Loaded users: ", accounts);

//     console.log(
//       "Here you can setup and run express / fastify / any other framework."
//     );
//   })
//   .catch((error) => console.log(error));

async function main() {
  await startInstrumentation();

  // initialize data source
  logger.info("initializing data source");
  await AppDataSource.initialize();

  logger.info("loading graphql schema");

  const typeDefs = readFileSync(
    require.resolve("./graphql.schema.graphql")
  ).toString("utf-8");

  logger.info("starting server");
  const { graphqlURL } = await startServer(typeDefs, resolvers, {
    port: appPort,
  });

  logger.info(`🚀 Server ready at ${graphqlURL}`);
}

main();
