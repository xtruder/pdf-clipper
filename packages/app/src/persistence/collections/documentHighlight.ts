import { RxJsonSchema, RxDocument, RxCollection } from "rxdb";

import { DocumentHighlight } from "~/types";

import { Database } from "../rxdb";
import { DocumentDocument } from "./document";

import { CollectionCreator } from "./types";

export type DocumentHighlightMethods = {
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
    imageHash: {
      type: ["string", "null"],
      ref: "blobinfos",
    },
    local: {
      type: "boolean",
      default: false,
    },
  },
  required: ["id", "documentId"],
};

export default (): CollectionCreator<
  DocumentHighlight,
  DocumentHighlightMethods
> => ({
  name: "documenthighlights",
  schema,
  methods: {
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
