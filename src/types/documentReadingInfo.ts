import type { RxCollection, RxDocument, RxJsonSchema } from "rxdb";

import { BaseResource, baseSchemaProps } from "./base";

/**Document reading info provides reading information associated with
 * account/document */
export interface DocumentReadingInfo extends BaseResource {
  // id of the account
  accountId: string;

  // id of the document
  docId: string;

  // last reading page
  lastPage?: number;

  // screenshot of page
  screenshot?: string;

  // information about reading location
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
    fields: ["accountId", "docId"] as string[],
    // separator which is used to concat the fields values.
    separator: "|",
  },
  type: "object",
  properties: {
    accountId: {
      type: "string",
    },
    docId: {
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
    ...baseSchemaProps,
  },
  required: ["id", "accountId", "docId"],
} as const;

export type DocumentReadingInfoDocument = RxDocument<DocumentReadingInfo>;

export type DocumentReadingInfoCollection = RxCollection<DocumentReadingInfo>;
