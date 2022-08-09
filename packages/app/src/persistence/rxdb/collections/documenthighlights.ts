import { RxCollection, RxDocument, RxJsonSchema } from "rxdb";
import { first, map, firstValueFrom } from "rxjs";

import { DocumentHighlight } from "~/types";
import { DocumentDocument } from "./documents";
import { Database } from "./types";

export type DocumentHighlightDocument = RxDocument<
  DocumentHighlight,
  typeof methods
>;

export type DocumentHighlightCollection = RxCollection<
  DocumentHighlight,
  typeof methods
>;

export const schema: RxJsonSchema<DocumentHighlight> = {
  title: "DocumentHighlight",
  description: "schema for document highlights",
  type: "object",
  version: 0,
  primaryKey: "id",
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

export const methods = {
  async populateDocument<T>(
    this: RxDocument<DocumentHighlight, T>
  ): Promise<DocumentDocument> {
    return this.populate("documentId");
  },
};

export function initCollection(
  collection: DocumentHighlightCollection,
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

  const populateFromDoc = async (highlight: DocumentHighlight) => {
    const document = await firstValueFrom(
      db.documents.findOne({ selector: { id: highlight.documentId } }).$.pipe(
        first((d) => !!d),
        map((d) => d!)
      )
    );

    highlight.documentType = document.type;
    highlight.local = document.local;
  };

  // propagate document type and local from document
  collection.preInsert(populateFromDoc, true);
  collection.preSave(populateFromDoc, true);
}
