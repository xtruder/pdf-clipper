import express from "express";

import { router } from "./actions";
import { expressLogger, logger } from "./logging";
import { serverPort } from "./config";

export function startServer() {
  logger.info("starting server");

  const app = express();

  app.use(express.json());
  app.use(expressLogger);

  app.use("/actions", router);

  app.listen(serverPort, () =>
    logger.info(`server is listening on port ${serverPort}`)
  );
}
