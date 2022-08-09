import { RxCollection, RxDocument, RxJsonSchema } from "rxdb";

import { Account } from "~/types";

export type AccountDocument = RxDocument<Account>;
export type AccountCollection = RxCollection<Account>;

export const schema: RxJsonSchema<Account> = {
  title: "Account",
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
    name: {
      type: "string",
    },
  },
  required: ["id"],
};

export function initCollection(collection: AccountCollection) {
  collection.preInsert(
    (data) => (data.createdAt = new Date().toISOString()),
    true
  );

  collection.preSave(
    (data) => (data.updatedAt = new Date().toISOString()),
    true
  );

  collection.preRemove(
    (data) => (data.deletedAt = new Date().toISOString()),
    true
  );
}
