import { RxCollection, RxDocument, RxJsonSchema } from "rxdb";
import { first, firstValueFrom, map } from "rxjs";

import { DocumentMember } from "~/types";
import { Database } from "./types";

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
    local: {
      type: "boolean",
      default: false,
    },
  },
  required: ["accountId", "documentId"],
};

export function initCollection(
  collection: DocumentMemberCollection,
  db: Database
) {
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

  const populateFromDoc = async (member: DocumentMember) => {
    const document = await firstValueFrom(
      db.documents.findOne({ selector: { id: member.documentId } }).$.pipe(
        first((d) => !!d),
        map((d) => d!)
      )
    );

    member.local = document.local;
  };

  // propagate document type and local from document
  collection.preInsert(populateFromDoc, true);
  collection.preSave(populateFromDoc, true);
}
