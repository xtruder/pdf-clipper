import { RxJsonSchema, RxDocument, RxCollection } from "rxdb";

import { DocumentMember } from "~/types";
import { CollectionCreator } from "./types";

export type DocumentMemberDocument = RxDocument<DocumentMember>;
export type DocumentMemberCollection = RxCollection<DocumentMember>;

export const schema: RxJsonSchema<DocumentMember> = {
  title: "document schema",
  description: "schema holding account documents",
  version: 0,
  primaryKey: {
    key: "id",
    fields: ["documentId", "accountId"],
    separator: "|",
  },
  type: "object",
  properties: {
    id: {
      type: "string",
      maxLength: 100,
    },
    documentId: {
      type: "string",
      format: "uuid",
      ref: "document",
    },
    accountId: {
      type: "string",
      format: "uuid",
      ref: "account",
    },
    createdAt: {
      type: "string",
      format: "date-time",
    },
    deletedAt: {
      type: "string",
      format: "date-time",
    },
    acceptedAt: {
      type: "string",
      format: "date-time",
    },
    role: {
      type: "string",
      enum: ["admin", "viewer", "editor"],
    },
    createdBy: {
      type: "string",
      format: "uuid",
    },
  },
  required: ["accountId", "documentId"],
};

export default (): CollectionCreator<DocumentMember> => ({
  name: "documentmembers",
  schema,
  registerHooks(collection: DocumentMemberCollection) {
    collection.preInsert(
      (data) => (data.createdAt = new Date().toISOString()),
      true
    );

    collection.preRemove(
      (data) => (data.deletedAt = new Date().toISOString()),
      true
    );
  },
});
