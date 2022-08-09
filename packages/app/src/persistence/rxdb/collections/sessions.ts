import { RxCollection, RxDocument, RxJsonSchema } from "rxdb";

import { Session } from "~/types";

export type SessionDocument = RxDocument<Session>;
export type SessionCollection = RxCollection<Session>;

export const schema: RxJsonSchema<Session> = {
  title: "Session",
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
    updatedAt: {
      type: "string",
      format: "date-time",
    },
    deletedAt: {
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

export function initCollection(collection: SessionCollection) {
  collection.preInsert(
    (data) => (data.createdAt = new Date().toISOString()),
    true
  );

  collection.preSave(
    (data) => (data.updatedAt = new Date().toISOString()),
    true
  );
}
