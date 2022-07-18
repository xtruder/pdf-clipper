import { RxCollection, RxDocument, RxJsonSchema } from "rxdb";

import { Account } from "~/types";
import { CollectionCreator } from "./types";

export type AccountDocument = RxDocument<Account>;
export type AccountCollection = RxCollection<Account>;

export const schema: RxJsonSchema<Account> = {
  title: "account schema",
  description: "schema for account",
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
      format: "uuid",
      maxLength: 36,
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
    default: {
      type: "boolean",
    },
  },
  required: ["id"],
};

export default (): CollectionCreator<Account> => ({
  name: "accounts",
  schema,
  registerHooks(collection: AccountCollection) {
    collection.preInsert(
      (data) => (data.createdAt = new Date().toISOString()),
      true
    );

    collection.preSave(
      (data) => (data.updatedAt = new Date().toISOString()),
      true
    );
  },
});
