import { RxCollection, RxDocument, RxJsonSchema } from "rxdb";
import { BlobInfo } from "~/types";
import { CollectionCreator } from "./types";

export type BlobInfoMethods = {};

export type BlobInfoDocument = RxDocument<BlobInfo, BlobInfoMethods>;
export type BlobInfoCollection = RxCollection<BlobInfo, BlobInfoMethods>;

export const schema: RxJsonSchema<BlobInfo> = {
  title: "blobinfo schema",
  description: "schema for blobinfos collection",
  version: 0,
  primaryKey: "hash",
  type: "object",
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

export default (): CollectionCreator<BlobInfo> => ({
  name: "blobinfos",
  schema,
  registerHooks(collection: BlobInfoCollection) {
    collection.preInsert(
      (data) => (data.createdAt = new Date().toISOString()),
      true
    );

    collection.preSave(
      (data) => (data.updatedAt = new Date().toISOString()),
      true
    );
  },
});
