import { RequestHandler, Request, Response } from "express";
import fetch from "node-fetch";

import { minioClient as mc } from "./minio";
import { Maybe, uuid } from "./types";
import { logger as _logger } from "../logging";
import { hasuraAdminSecret, hasuraGraphqlURL } from "../config";

const logger = _logger.child({ action: "createFileDownloadUrl" });

const getFileOperation = `query getFile($fileId: uuid!) {
  file(id: $fileId) {
    id
  }
}
`;

type GetFileResp = {
  file: Maybe<{
    id: uuid;
  }>;
};

type CreateFileDownloadUrlArgs = {
  fileId: string;
};

type CreateFileDownloadUrlOutput = {
  id: uuid;
  url: string;
};

// execute the parent operation in Hasura
const execute = async (
  variables: CreateFileDownloadUrlArgs,
  userId: string
): Promise<{ data: GetFileResp; errors: any[] }> => {
  const fetchResponse = await fetch(hasuraGraphqlURL, {
    method: "POST",
    body: JSON.stringify({
      query: getFileOperation,
      variables,
    }),
    headers: {
      "X-Hasura-Admin-Secret": hasuraAdminSecret,
      "x-hasura-user-id": userId,
    },
  });

  const data = await fetchResponse.json();
  logger.info("getting data", data);

  return data;
};

export const getFileUrlHandler: RequestHandler = async (
  req: Request,
  res: Response
) => {
  // get request input
  const params: CreateFileDownloadUrlArgs = req.body.input;

  // get session variables
  const { "x-hasura-user-id": userId } = req.body.session_variables;

  // execute the parent operation in Hasura
  const {
    data: { file },
    errors,
  } = await execute(params, userId);
  if (errors) return res.status(400).json(errors[0]);
  if (!file)
    return res.status(404).send({
      message: "file not found",
    });

  logger.info("getting presigned url");

  // create presigned object for downloading file
  let url: string;
  try {
    url = await mc.presignedGetObject("uploads", file.id);
  } catch (err) {
    return res.status(400).json(err);
  }

  const data: CreateFileDownloadUrlOutput = { id: file.id, url };

  return res.json(data);
};
