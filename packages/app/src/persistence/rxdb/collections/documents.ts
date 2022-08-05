import { RxCollection, RxDocument, RxJsonSchema } from "rxdb";

import { Document } from "~/types";

export type DocumentDocument = RxDocument<Document>;
export type DocumentCollection = RxCollection<Document>;

export const schema: RxJsonSchema<Document> = {
  title: "Document",
  description: "schema holding documents",
  type: "object",
  version: 0,
  primaryKey: "id",
  properties: {
    id: {
      type: "string",
      format: "uuid",
      maxLength: 36,
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
    createdBy: {
      type: "string",
      format: "uuid",
    },
    type: {
      type: "string",
      enum: ["PDF"],
    },
    fileHash: {
      type: "string",
      ref: "blobinfos",
    },
    meta: {
      type: "object",
      default: {},
    },
    members: {
      type: "array",
      ref: "account",
      items: {
        type: "string",
        format: "uuid",
      },
    },
    local: {
      type: "boolean",
      default: false,
    },
  },
  required: ["id"],
};

export function initCollection(collection: DocumentCollection) {
  collection.preInsert(
    (data) => (data.createdAt = new Date().toISOString()),
    true
  );

  collection.preSave(
    (data) => (data.updatedAt = new Date().toISOString()),
    true
  );

  collection.preRemove(
    (data) => (data.deletedAt = new Date().toISOString()),
    true
  );
}
