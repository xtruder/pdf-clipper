import { RxCollection, RxDocument, RxJsonSchema } from "rxdb";

import { BlobInfo } from "~/types";

export type BlobInfoDocument = RxDocument<BlobInfo>;
export type BlobInfoCollection = RxCollection<BlobInfo>;

export const schema: RxJsonSchema<BlobInfo> = {
  title: "BlobInfo",
  description: "schema for blobinfos collection",
  type: "object",
  version: 0,
  primaryKey: "hash",
  properties: {
    hash: {
      type: "string",
      maxLength: 64,
    },
    createdAt: {
      type: "string",
      format: "date-time",
    },
    updatedAt: {
      type: "string",
      format: "date-time",
    },
    createdBy: {
      type: "string",
      format: "uuid",
    },
    type: {
      type: "string",
      enum: ["docfile", "highlightimg"],
    },
    mimeType: {
      type: "string",
    },
    size: {
      type: "number",
    },
    source: {
      type: "string",
      format: "uri",
    },
    sync: {
      type: "boolean",
      default: true,
    },
  },
  required: ["hash", "type", "mimeType", "size"],
};

export function initCollection(collection: BlobInfoCollection) {
  collection.preInsert(
    (data) => (data.createdAt = new Date().toISOString()),
    true
  );

  collection.preSave(
    (data) => (data.updatedAt = new Date().toISOString()),
    true
  );
}
