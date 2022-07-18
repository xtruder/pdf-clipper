import { RxJsonSchema, RxDocument, RxCollection } from "rxdb";

import { AccountInfo } from "~/types";
import { CollectionCreator } from "./types";

export type AccountInfoDocument = RxDocument<AccountInfo>;
export type AccountInfoCollection = RxCollection<AccountInfo>;

export const schema: RxJsonSchema<AccountInfo> = {
  title: "account infoschema",
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
    name: {
      type: "string",
    },
  },
  required: ["id"],
};

export default (): CollectionCreator<AccountInfo> => ({
  name: "accountinfos",
  schema,
});
