import { JTDSchemaType } from "ajv/dist/jtd";

export interface Account {
  /**accountId defines unique id of the account */
  accountId: string;

  /**email defines email associated with account */
  email?: string;

  /**deleted defines whether account is deleted */
  deleted?: boolean;
}

export const accountSchema: JTDSchemaType<Account> = {
  properties: {
    accountId: {
      type: "string",
    },
  },
  optionalProperties: {
    email: {
      type: "string",
    },
    deleted: {
      type: "boolean",
    },
  },
};
