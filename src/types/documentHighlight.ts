import type { RxJsonSchema } from "rxdb";

export enum HighlightColor {
  RED = "red",
  YELLOW = "yellow",
  GREEN = "green",
  BLUE = "blue",
}

export interface DocumentHighlight {
  /**unique document highlight id */
  id: string;

  /**highlight creation time */
  createdAt: string;

  /**highlight last update time */
  updatedAt: string;

  /**highlight deletion time */
  deletedAt?: string;

  /**id of document that highlight is for */
  documentId: string;

  /**location of a highlight (depends on document type) */
  location?: any;

  /**content associated with highlight (depends of document type) */
  content?: any;

  /**user who created the highlight */
  createdBy: string;
}

export const documentHighlightSchema: RxJsonSchema<DocumentHighlight> = {
  title: "document highlight schema",
  description: "schema for document highlights",
  version: 0,
  keyCompression: true,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
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
    documentId: {
      type: "string",
    },
    location: {
      type: "object",
    },
    content: {
      type: "object",
    },
    createdBy: {
      type: "string",
      ref: "users",
    },
  },
  required: ["id", "documentId"],
} as const;
