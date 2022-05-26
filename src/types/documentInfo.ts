import type { RxJsonSchema } from "rxdb";

export type DocumentRole = "admin" | "viewer" | "editor";

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

export interface DocumentMeta {
  /**title of the document */
  title?: string;

  /**document author */
  author?: string;

  /**document description */
  description?: string;

  /**url of document cover image */
  cover?: string;

  /**number of pages */
  pageCount?: number;

  // outline of the document
  outline?: DocumentOutline;
}

export interface DocumentMember {
  /**id of member document */
  documentId: string;

  /**id of member account */
  accountId: string;

  /**role of member */
  role: DocumentRole;

  /**time when membership request was created */
  createdAt: string;

  /**time when account was accepted as member of document */
  acceptedAt?: string;
}

/**DocumentInfo provides information about document, like associated file,
 * document type, metadata like author, title, description, cover and such.
 */
export interface DocumentInfo {
  /**unique document id */
  id: string;

  /**document creation time */
  createdAt: string;

  /**document last update time */
  updatedAt: string;

  /**document deletion time */
  deletedAt?: string;

  /**hash of file assocaited with document */
  fileHash?: string;

  /**type of the document */
  type?: DocumentType;

  /**metadata associated with document */
  meta: DocumentMeta;

  /**list of document members */
  members: DocumentMember[];

  // account that created document
  createdBy: string;
}

export const documentInfoSchema: RxJsonSchema<DocumentInfo> = {
  title: "document info schema",
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
    fileHash: {
      type: "string",
    },
    type: {
      type: "string",
    },
    members: {
      type: "array",
      items: {
        type: "object",
        properties: {
          accountId: {
            type: "string",
          },
          role: {
            type: "string",
            enum: ["admin", "viewer", "editor"] as string[],
          },
          createdAt: {
            type: "string",
            format: "date-time",
          },
          acceptedAt: {
            type: "string",
            format: "date-time",
          },
        },
        required: ["accountId", "role", "createdAt"] as string[],
      },
    },
    meta: {
      type: "object",
      properties: {
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
      },
    },
    createdBy: {
      type: "string",
    },
  },
  required: ["id", "createdAt", "updatedAt", "createdBy"],
} as const;
