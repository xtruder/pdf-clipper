import * as uuid from "uuid";

import { GraphQLScalarType, Kind } from "graphql";
import { ValidationError } from "apollo-server-errors";

export const uuidScalar = new GraphQLScalarType<string, string>({
  name: "UUID",

  description: "UUID scalar type",

  serialize(value: unknown): string {
    if (typeof value === "string") {
      return value;
    }

    throw new ValidationError("invalid uuid value: " + value);
  },

  parseValue(value: unknown): string {
    if (typeof value !== "string")
      throw new Error("invalid uuid value: " + value);

    if (value === "") return "00000000-0000-0000-0000-000000000000";

    if (!uuid.validate(value))
      throw new ValidationError(`error parsing uuid ${value}`);

    return value;
  },

  parseLiteral(ast): string {
    if (ast.kind === Kind.STRING) {
      if (ast.value === "") return "00000000-0000-0000-0000-000000000000";

      if (!uuid.validate(ast.value))
        throw new ValidationError(`error parsing uuid ${ast.value}`);

      return ast.value;
    }

    throw new ValidationError(`invalid uuid kind: ${ast.kind}`);
  },
});

export const dateTimeScalar = new GraphQLScalarType<Date, string>({
  name: "DateTime",

  description: "DateTime custom scalar type",

  serialize(value: unknown): string {
    if (!(value instanceof Date))
      throw new ValidationError(`invalid date value: ${value}`);

    return value.toISOString();
  },

  parseValue(value: unknown): Date {
    if (typeof value !== "string" || !((value as any) instanceof Date))
      throw new ValidationError("invalid date");

    const date = new Date(value); // Convert incoming integer to Date

    if (isNaN(date.valueOf())) throw new ValidationError("invalid date");

    return date;
  },

  parseLiteral(ast): Date {
    if (ast.kind === Kind.STRING) {
      const date = new Date(ast.value); // Convert hard-coded AST string to Date

      if (isNaN(date.valueOf())) throw new ValidationError("invalid date");

      return date;
    }

    throw new ValidationError(`invalid date kind: ${ast.kind}`);
  },
});

export const JSONScalar = new GraphQLScalarType<any, string>({
  name: "JSON",

  description: "JSON scalar type",

  serialize(value: any): string {
    return JSON.stringify(value);
  },

  parseValue(value: unknown): any {
    if (typeof value !== "string")
      throw new ValidationError("error parsing JSON value");

    return JSON.parse(value);
  },

  parseLiteral(ast): any {
    if (ast.kind === Kind.STRING) {
      return JSON.parse(ast.value);
    }

    throw new ValidationError(`invalid JSON kind: ${ast.kind}`);
  },
});
