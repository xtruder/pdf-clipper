import { RequestHandler, Request, Response } from "express";
import fetch from "node-fetch";

import { minioClient as mc } from "./minio";
import { Maybe, uuid } from "./types";
import { logger as _logger } from "../logging";
import { hasuraAdminSecret, hasuraGraphqlURL } from "../config";
import { PostPolicyResult } from "minio";

const logger = _logger.child({ action: "createDocumentImagePostPolicy" });

const getDocumentOperation = `query getDocument($documentId: uuid!) {
  document(id: $documentId) {
    id
  }
}
`;

type GetDocumentResp = {
  document: Maybe<{
    id: uuid;
  }>;
};

type CreateDocumentImagePostPolicyArgs = {
  documentId: string;
};

type CreateDocumentImagePostPolicyOutput = {
  postURL: string;
  formData: any;
};

// execute the parent operation in Hasura
const getDocument = async (
  userId: string,
  documentId: string
): Promise<{ data: GetDocumentResp; errors: any[] }> => {
  logger.info("fetching document", { userId, documentId });

  const fetchResponse = await fetch(hasuraGraphqlURL, {
    method: "POST",
    body: JSON.stringify({
      query: getDocumentOperation,
      variables: {
        documentId,
      },
    }),
    headers: {
      "X-Hasura-Admin-Secret": hasuraAdminSecret,
      "x-hasura-user-id": userId,
    },
  });

  return await fetchResponse.json();
};

export const createDocumentImagePostPolicy: RequestHandler = async (
  req: Request,
  res: Response
) => {
  // get request input
  const params: CreateDocumentImagePostPolicyArgs = req.body.input;

  // get session variables
  const { "x-hasura-user-id": userId } = req.body.session_variables;

  // execute the parent operation in Hasura
  const {
    data: { document },
    errors,
  } = await getDocument(userId, params.documentId);
  if (errors) return res.status(400).json(errors[0]);
  if (!document)
    return res.status(404).send({
      message: "document not found",
    });

  logger.info("creating document image post policy");

  const policy = mc.newPostPolicy();

  // set short expiery of 1 hour, after that new policy has to be requested
  var expires = new Date();
  expires.setSeconds(3600);

  policy.setExpires(expires);
  policy.setBucket("images");
  policy.setKeyStartsWith(`document/${document.id}/images`);
  policy.setContentLengthRange(10, 1024 * 1024);
  policy.setContentType("image/png");

  let result: PostPolicyResult | undefined;
  try {
    result = await mc.presignedPostPolicy(policy);
  } catch (err) {
    return res.status(400).json(err);
  }

  const data: CreateDocumentImagePostPolicyOutput = result;

  return res.json(data);
};
