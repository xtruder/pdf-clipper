import { makeExecutableSchema } from "@graphql-tools/schema";
import { port } from "./config";
import { MinioStorage } from "./db/blob-storage";
import { AppDataSource } from "./db/data-source";
import { createGraphQLServer } from "./graphql/graphql-server";
import { startInstrumentation } from "./instrumentation";
import { RedisLiveQueryStore } from "./graphql/live-query";
import { logger } from "./logging";
import { resolvers } from "./graphql/resolvers";
import { typeDefs } from "./graphql/schema";
import { createServer } from "./server";

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
  logger.info("starting instrumentation");
  await startInstrumentation();

  // initialize data source
  logger.info("initializing data source");
  await AppDataSource.initialize();

  logger.debug("creating blob storage");
  const blobStorage = new MinioStorage(
    {
      endPoint: "localhost",
      port: 9000,
      useSSL: false,
      accessKey: "8kiOWgHm0lW7HK1o",
      secretKey: "MRBxJT1zVQLs2g0gbDRfPzQpWgfn3Oqb",
    },
    "files"
  );

  logger.debug("creating redis live query store");
  const liveQueryStore = new RedisLiveQueryStore("", {});

  logger.info("loading graphql schema");
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  logger.debug("creating graphql server");
  const graphqlServer = createGraphQLServer({
    schema,
    liveQueryStore,
    blobStorage,
  });

  logger.debug("creating server");
  const server = createServer({
    port,
    graphqlServer,
    blobStorage,
  });

  logger.info("starting server listener");
  const listener = server.listen(port, () => {
    logger.info(`server started on localhost:${port}`);
  });

  let isShuttingDown = false;
  process.on("SIGINT", () => {
    if (isShuttingDown) {
      return;
    }

    isShuttingDown = true;
    listener.close();
  });
}

if (require.main === module) {
  main();
}
