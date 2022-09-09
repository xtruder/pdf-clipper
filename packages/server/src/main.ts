import { appPort } from "./config";
import { AppDataSource } from "./data-source";
import { startInstrumentation } from "./instrumentation";
import { resolvers } from "./resolvers";
import { startServer } from "./server";
import { logger } from "./logging";
import { typeDefs } from "./schema";

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

  logger.info("starting server");
  const { graphqlURL, stop } = await startServer(typeDefs, resolvers, {
    port: appPort,
  });

  logger.info(`🚀 Server ready at ${graphqlURL}`);

  let isShuttingDown = false;
  process.on("SIGINT", () => {
    if (isShuttingDown) {
      return;
    }

    isShuttingDown = true;
    stop();
  });
}

if (require.main === module) {
  main();
}
