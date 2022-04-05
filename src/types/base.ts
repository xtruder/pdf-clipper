/**Resource defines a type that other resources extend */
export interface BaseResource {
  id: string;

  createdAt?: string;

  updatedAt?: string;
}

export const baseSchemaProps = {
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
};
