import type { RxCollection, RxDocument, RxJsonSchema } from "rxdb";

import { BaseResource, baseSchemaProps } from "./base";

export enum DocumentHighlightColor {
  RED = "red",
  YELLOW = "yellow",
  GREEN = "green",
  BLUE = "blue",
}

export interface DocumentHighlight extends BaseResource {
  docId: string;

  /** location of a highlight (depends on document type) */
  location: any;

  /** content associated with highlight (depends of document type) */
  content: any;

  /** owner who created the highlight */
  author?: string;
}

export const documentHighlightSchema: RxJsonSchema<DocumentHighlight> = {
  title: "document highlight schema",
  description: "schema for document highlights",
  version: 0,
  keyCompression: true,
  primaryKey: "id",
  type: "object",
  properties: {
    docId: {
      type: "string",
    },
    location: {
      type: "object",
    },
    content: {
      type: "object",
    },
    author: {
      type: "string",
    },
    ...baseSchemaProps,
  },
  required: ["id", "docId"],
} as const;

export type DocumentHighlightDocument = RxDocument<DocumentHighlight>;

export type DocumentHighlightCollection = RxCollection<DocumentHighlight>;
