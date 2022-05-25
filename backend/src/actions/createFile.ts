import { Request, RequestHandler, Response } from "express";
import fetch from "node-fetch";
import { hasuraAdminSecret, hasuraGraphqlURL } from "../config";

import { minioClient as mc } from "./minio";
import { createFileArgs, Mutations } from "./types";

const createFileOperation = `mutation createFile($sources: jsonb) {
  insertFile(object: {sources: $sources}) {
    id
    sources
  }
}`;

const executeInsert = async (
  variables: createFileArgs
): Promise<{ data: Mutations; errors: any[] }> => {
  const fetchResponse = await fetch(hasuraGraphqlURL, {
    method: "POST",
    body: JSON.stringify({
      query: createFileOperation,
      variables,
    }),
    headers: {
      "X-Hasura-Admin-Secret": hasuraAdminSecret,
    },
  });

  const data = await fetchResponse.json();
  console.log("DEBUG: ", data);

  return data;
};

export const createFileHandler: RequestHandler = async (
  req: Request,
  res: Response
) => {
  console.log(req.body);

  // get request input
  const params: createFileArgs = req.body.input;

  // get session variables
  const { "x-hasura-user-id": userId } = req.body.session_variables;

  console.log(req.body.session_variables);

  // execute the parent operation in Hasura
  const {
    data: { insertFile: data },
    errors,
  } = await executeInsert({ ...params, createdBy: userId });
  if (errors) return res.status(400).json(errors[0]);
  if (!data) return res.status(500).send(new Error("missing data"));

  data.uploadUrl = await mc.presignedPutObject("uploads", data.id);

  // tag object with userId
  await mc.setObjectTagging("uploads", data.id, {
    userId,
  });

  // success
  return res.json(data);
};
