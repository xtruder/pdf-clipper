import type { RxJsonSchema } from "rxdb";

/**DocumentReadingInfo provides reading information associated with
 * account/document */
export interface DocumentReadingInfo {
  /**unique account id */
  id?: string;

  /**account creation time */
  createdAt: string;

  /**account last update time */
  updatedAt: string;

  /**id of associated document */
  documentId: string;

  /**id of associated account */
  accountId: string;

  /**last reading page */
  lastPage?: number;

  /**screenshot url of page */
  screenshot?: string;

  /**information of reading location */
  location?: any;
}

export const documentReadingInfoSchema: RxJsonSchema<DocumentReadingInfo> = {
  title: "document reading info",
  version: 0,
  keyCompression: true,
  primaryKey: {
    // where should the composed string be stored
    key: "id",
    // fields that will be used to create the composed key
    fields: ["accountId", "documentId"] as string[],
    // separator which is used to concat the fields values.
    separator: "|",
  },
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
    accountId: {
      type: "string",
    },
    documentId: {
      type: "string",
    },
    lastPage: {
      type: "number",
    },
    screenshot: {
      type: "string",
    },
    location: {
      type: "object",
    },
  },
  required: ["accountId", "documentId"],
} as const;
