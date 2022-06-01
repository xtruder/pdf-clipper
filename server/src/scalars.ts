import * as uuid from "uuid";

import { ValidationError } from "apollo-server-errors";
import { GraphQLScalarType, Kind } from "graphql";

export const idScalar = new GraphQLScalarType<string, string>({
  name: "ID",

  description: "UUID scalar type",

  serialize(value: string): string {
    return value;
  },

  parseValue(value: string): string {
    if (value === "") return "00000000-0000-0000-0000-000000000000";

    if (!uuid.validate(value))
      throw new ValidationError(`error parsing uuid ${value}`);

    return value;
  },

  parseLiteral(ast): string | null {
    if (ast.kind === Kind.STRING) {
      if (ast.value === "") return "00000000-0000-0000-0000-000000000000";

      if (!uuid.validate(ast.value))
        throw new Error(`error parsing uuid ${ast.value}`);

      return ast.value;
    }

    return null;
  },
});

export const dateTimeScalar = new GraphQLScalarType<Date, string>({
  name: "DateTime",

  description: "DateTime custom scalar type",

  serialize(value: Date): string {
    return value.toISOString();
  },

  parseValue(value: string): Date {
    const date = new Date(value); // Convert incoming integer to Date

    if (isNaN(date.valueOf())) throw new ValidationError("invalid date");

    return date;
  },

  parseLiteral(ast): Date | null {
    if (ast.kind === Kind.STRING) {
      const date = new Date(ast.value); // Convert hard-coded AST string to Date

      if (isNaN(date.valueOf())) throw new ValidationError("invalid date");

      return date;
    }

    return null; // Invalid hard-coded value (not an integer)
  },
});

export const JSONScalar = new GraphQLScalarType<any, string>({
  name: "JSON",

  description: "JSON scalar type",

  serialize(value: any): string {
    return JSON.stringify(value);
  },

  parseValue(value: string): any {
    return JSON.parse(value);
  },

  parseLiteral(ast): any | null {
    if (ast.kind === Kind.STRING) {
      return JSON.parse(ast.value);
    }

    return null;
  },
});
