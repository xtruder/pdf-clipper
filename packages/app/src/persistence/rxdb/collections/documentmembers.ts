import { RxCollection, RxDocument, RxJsonSchema } from "rxdb";

import { DocumentMember } from "~/types";

export type DocumentMemberDocument = RxDocument<DocumentMember>;
export type DocumentMemberCollection = RxCollection<DocumentMember>;

export const schema: RxJsonSchema<DocumentMember> = {
  title: "DocumentMember",
  description: "schema holding account documents",
  type: "object",
  version: 0,
  primaryKey: {
    key: "id",
    fields: ["documentId", "accountId"],
    separator: "|",
  },
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
    updatedAt: {
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

export function initCollection(collection: DocumentMemberCollection) {
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
