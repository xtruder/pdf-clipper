import { RxJsonSchema, RxDocument, RxCollection } from "rxdb";

import { sha256 } from "~/lib/crypto";
import { DocumentHighlight, HighlightImageInfo } from "~/types";

import { NativeFS } from "../nativefs";
import { Database } from "../rxdb";
import { DocumentDocument } from "./document";

import { CollectionCreator } from "./types";

export type DocumentHighlightMethods = {
  putImage<T>(
    this: RxDocument<DocumentHighlight, T>,
    image: Blob
  ): Promise<HighlightImageInfo>;
  getCachedImage(this: RxDocument<Document, any>): Promise<Blob | null>;
  populateDocument<T>(
    this: RxDocument<DocumentHighlight, T>
  ): Promise<DocumentDocument>;
};
export type DocumentHighlightDocument = RxDocument<
  DocumentHighlight,
  DocumentHighlightMethods
>;
export type DocumentHighlightCollection = RxCollection<
  DocumentHighlight,
  DocumentHighlightMethods
>;

export const schema: RxJsonSchema<DocumentHighlight> = {
  title: "document highlight schema",
  description: "schema for document highlights",
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
      format: "uuid",
      maxLength: 36,
    },
    documentId: {
      type: "string",
      format: "uuid",
      ref: "documents",
    },
    documentType: {
      type: "string",
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
      ref: "account",
    },
    content: {
      type: "object",
    },
    location: {
      type: "object",
    },
    sequence: {
      type: "string",
    },
    image: {
      type: ["object", "null"],
      properties: {
        hash: {
          type: "string",
          minLength: 64,
          maxLength: 64,
        },
        mimeType: {
          type: "string",
        },
        source: {
          type: "string",
          format: "uri",
        },
      },
      required: ["hash", "mimeType"],
    },
    local: {
      type: "boolean",
      default: false,
    },
  },
  required: ["id", "documentId"],
};

export default (
  fs: NativeFS
): CollectionCreator<DocumentHighlight, DocumentHighlightMethods> => ({
  name: "documenthighlights",
  schema,
  methods: {
    /**saves a image to local file system and adds image information to document */
    async putImage<T>(
      this: RxDocument<DocumentHighlight, T>,
      image: Blob
    ): Promise<HighlightImageInfo> {
      const hash = await sha256(await image.arrayBuffer());

      if (this.image?.hash === hash) return this.image;

      await fs.saveFile(hash, image);

      const imageInfo: HighlightImageInfo = {
        hash,
        mimeType: image.type,
      };

      await this.atomicPatch({ image: imageInfo });

      return imageInfo;
    },

    /**gets cached highlight image as file */
    async getCachedImage<T>(
      this: RxDocument<DocumentHighlight, T>
    ): Promise<Blob | null> {
      if (!this.image?.hash) return null;
      if (!(await fs.fileExists(this.image.hash))) return null;

      return fs.getFile(this.image.hash);
    },

    async populateDocument<T>(
      this: RxDocument<DocumentHighlight, T>
    ): Promise<DocumentDocument> {
      return this.populate("documentId");
    },
  },
  registerHooks(collection: DocumentHighlightCollection, db: Database) {
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

    const updateDocType = async (highlight: DocumentHighlight) => {
      const document = await db.documents
        .findOne({ selector: { id: highlight.documentId } })
        .exec();
      if (!document) throw new Error("invalid document id");

      // propagate documentType to highlight
      highlight.documentType = document.type;
    };

    // propagate document type to document highlight
    collection.preInsert(updateDocType, true);
    collection.preSave(updateDocType, true);
  },
});
