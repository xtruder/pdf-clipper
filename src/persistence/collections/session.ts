import { RxCollection, RxDocument, RxJsonSchema } from "rxdb";

import { Session } from "~/types";
import { CollectionCreator } from "./types";

export type SessionDocument = RxDocument<Session>;
export type SessionCollection = RxCollection<Session>;

export const schema: RxJsonSchema<Session> = {
  title: "session schema",
  description: "schema for session",
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
      format: "uuid",
      maxLength: 36,
    },
    accountId: {
      type: "string",
      format: "uuid",
      ref: "accounts",
    },
    createdAt: {
      type: "string",
      format: "date-time",
    },
    syncDocuments: {
      type: "array",
      ref: "documents",
      items: {
        type: "string",
      },
    },
  },
  required: ["id", "accountId"],
};

export default (): CollectionCreator<Session> => ({
  name: "sessions",
  schema,
  registerHooks(collection: SessionCollection) {
    collection.preInsert(
      (data) => (data.createdAt = new Date().toISOString()),
      true
    );
  },
});
