import type { RxCollection, RxDocument, RxJsonSchema } from "rxdb";

import { BaseResource, baseSchemaProps } from "./base";

export interface AccountInfo extends BaseResource {
  // name associated with account
  name?: string;

  // list of all account document ids
  documentIds: string[];
}

export const accountInfoSchema: RxJsonSchema<AccountInfo> = {
  title: "account schema",
  description: "schema for account",
  version: 0,
  keyCompression: true,
  primaryKey: "id",
  type: "object",
  properties: {
    name: {
      type: "string",
    },
    documentIds: {
      type: "array",
      items: {
        type: "string",
      },
    },
    ...baseSchemaProps,
  },
  required: ["id"],
} as const;

export type AccountInfoDocument = RxDocument<AccountInfo>;

export type AccountInfoCollection = RxCollection<AccountInfo>;
