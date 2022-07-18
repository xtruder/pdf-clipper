import { RxCollection, RxDocument, RxJsonSchema } from "rxdb";
import { sha256 } from "~/lib/crypto";

import { CollectionCreator } from "./types";
import { Document, DocumentFile } from "~/types";
import { NativeFS } from "../nativefs";
import { Database } from "../rxdb";

export type DocumentMethods = {
  putFile<T>(this: RxDocument<Document, T>, file: File): Promise<DocumentFile>;
  getCachedFile(this: RxDocument<Document, any>): Promise<File | null>;
};

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
    file: {
      type: "object",
      properties: {
        kind: {
          type: "string",
          enum: ["main"],
        },
        hash: {
          type: "string",
          maxLength: 64,
        },
        size: {
          type: "number",
        },
        mimeType: {
          type: "string",
        },
        source: {
          type: "string",
          format: "uri",
        },
      },
      required: ["hash", "mimeType", "size"],
    },
    fileHash: {
      type: "string",
      ref: "fileInfo",
    },
    local: {
      type: "boolean",
      default: false,
    },
  },
  required: ["id"],
};

export default (
  fs: NativeFS
): CollectionCreator<Document, DocumentMethods> => ({
  name: "documents",
  schema,
  methods: {
    /**saves a file to local file system and adds file information to document */
    async putFile<T>(
      this: RxDocument<Document, T>,
      file: File
    ): Promise<DocumentFile> {
      const hash = await sha256(await file.arrayBuffer());

      if (this.file?.hash === hash) return this.file;

      await fs.saveFile(hash, file);

      const fileInfo: DocumentFile = {
        hash,
        mimeType: file.type,
        size: file.size,
      };

      await this.atomicPatch({ file: fileInfo });

      this.collection._docCache;

      return fileInfo;
    },

    /**gets cached file */
    async getCachedFile(this: RxDocument<Document, any>): Promise<File | null> {
      if (!this.file?.hash) return null;
      if (!(await fs.fileExists(this.file.hash))) return null;

      return fs.getFile(this.file.hash);
    },
  },
  registerHooks(collection: DocumentCollection, _db: Database) {
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
