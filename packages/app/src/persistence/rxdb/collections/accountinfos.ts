import { RxCollection, RxDocument, RxJsonSchema } from "rxdb";

import { AccountInfo } from "~/types";

export type AccountInfoDocument = RxDocument<AccountInfo>;
export type AccountInfoCollection = RxCollection<AccountInfo>;

export const schema: RxJsonSchema<AccountInfo> = {
  title: "AccountInfo",
  description: "schema for account",
  type: "object",
  version: 0,
  primaryKey: "id",
  properties: {
    id: {
      type: "string",
      format: "uuid",
      maxLength: 36,
    },
    name: {
      type: "string",
    },
    updatedAt: {
      type: "string",
      format: "date-time",
    },
  },
  required: ["id"],
};
