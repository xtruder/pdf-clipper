import type { RxJsonSchema } from "rxdb";

export interface AccountDocument {
  /**id of document */
  documentId: string;

  /**relation creation time */
  createdAt: string;

  /**account role for a document */
  role: "admin" | "viewer" | "editor";
}

export interface AccountInfo {
  /**unique account id */
  id: string;

  /**account creation time */
  createdAt: string;

  /**account last update time */
  updatedAt: string;

  /**name associated with account */
  name?: string;

  /**documents associated with account */
  documents: AccountDocument[];
}

export const accountInfoSchema: RxJsonSchema<AccountInfo> = {
  title: "account info oschema",
  description: "schema for AccountInfo document",
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
    name: {
      type: "string",
    },
    documents: {
      type: "array",
      items: {
        type: "object",
        properties: {
          documentId: {
            type: "string",
            ref: "documents",
          },
          createdAt: {
            type: "string",
            format: "date-time",
          },
          role: {
            type: "string",
            enum: ["admin", "viewer", "editor"] as string[],
          },
        },
      },
    },
  },
  required: ["id"],
} as const;
