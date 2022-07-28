import { RxCollection, RxDocument, RxJsonSchema } from "rxdb";

import { CollectionCreator } from "./types";
import { Document } from "~/types";

export type DocumentMethods = {};

export type DocumentDocument = RxDocument<Document, DocumentMethods>;
export type DocumentCollection = RxCollection<Document, DocumentMethods>;

export const schema: RxJsonSchema<Document> = {
  title: "document schema",
  description: "schema holding documents",
  version: 0,
  primaryKey: "id",
  type: "object",
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

export default (): CollectionCreator<Document, DocumentMethods> => ({
  name: "documents",
  schema,
  registerHooks(collection: DocumentCollection) {
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
  },
});

// export type DocumentLocalDocument = RxLocalDocument<
//   RxCollection<Document>,
//   DocumentLocalData
// >;
