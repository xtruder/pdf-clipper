import { JTDSchemaType } from "ajv/dist/jtd";

export interface Message {
  /**name defines unique name of the message */
  name: string;

  /**accountId defines id of the account that created message */
  accountId: string;

  /**timestamp defines time when event was created */
  timestamp: Date;

  /**data defines additional data assocaiated with event */
  data: Record<string, any>;
}

export const eventSchema: JTDSchemaType<Message> = {
  properties: {
    name: {
      type: "string",
    },
    accountId: {
      type: "string",
    },
    timestamp: {
      type: "timestamp",
    },
    data: {
      values: {},
    },
  },
};
