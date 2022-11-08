import express from "express";
import cors from "cors";

import type { RequestHandler, Express } from "express";

import type { BlobStorage } from "./db/blob-storage";

export type ServerOptions = {
  port: number;
  graphqlServer: RequestHandler;
  blobStorage: BlobStorage;
};

export const createServer = ({
  graphqlServer,
  blobStorage,
}: ServerOptions): Express => {
  const app = express();

  app.use(cors());

  app.use("/graphql", graphqlServer);

  app.get("/files/:hash", (req, res) => {
    blobStorage
      .getFileStream(req.params.hash)
      .then((stream) => stream.pipe(res))
      .catch((err) => res.status(500).send(err));
  });

  return app;
};
