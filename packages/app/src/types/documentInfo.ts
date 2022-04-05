import type { RxCollection, RxDocument, RxJsonSchema } from "rxdb";

import { BaseResource, baseSchemaProps } from "./base";

export enum DocumentType {
  PDF = "pdf",
}

export interface OutlinePosition {
  pageNumber?: number;
  location?: any;
  top?: number;
}

export interface OutlineNode extends OutlinePosition {
  title: string;
  items: OutlineNode[];
}

export interface DocumentOutline {
  items: OutlineNode[];
}

/**Document info provides information about document, like associated file,
 * document type, metadata like author, title, description, cover and such.
 */
export interface DocumentInfo extends BaseResource {
  // id of the file for document
  fileId?: string;

  // type of the document
  type?: DocumentType;

  // document title
  title?: string;

  // document author
  author?: string;

  // document description
  description?: string;

  // document cover image
  cover?: string;

  // number of pages that document has
  pageCount?: number;

  // outline of the document
  outline?: DocumentOutline;

  // account that created document
  creator?: string;
}

export const documentInfoSchema: RxJsonSchema<DocumentInfo> = {
  title: "document schema",
  version: 0,
  keyCompression: true,
  primaryKey: "id",
  type: "object",
  properties: {
    fileId: {
      type: "string",
    },
    type: {
      type: "string",
    },
    title: {
      type: "string",
    },
    author: {
      type: "string",
    },
    description: {
      type: "string",
    },
    cover: {
      type: "string",
    },
    pageCount: {
      type: "number",
    },
    outline: {
      type: "object",
    },
    creator: {
      type: "string",
    },
    ...baseSchemaProps,
  },
  required: ["id"],
} as const;

export type DocumentInfoDocument = RxDocument<DocumentInfo>;

export type DocumentInfoCollection = RxCollection<DocumentInfo>;
