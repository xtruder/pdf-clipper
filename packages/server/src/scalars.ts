import { GraphQLScalarType, Kind } from "graphql";
import { GraphQLYogaError } from "@graphql-yoga/node";

export const dateTimeScalar = new GraphQLScalarType<Date, string>({
  name: "DateTime",

  description: "DateTime custom scalar type",

  serialize(value: unknown): string {
    if (!(value instanceof Date))
      throw new GraphQLYogaError(`invalid date value: ${value}`, {
        code: "VALIDATION_ERROR",
      });

    return value.toISOString();
  },

  parseValue(value: unknown): Date {
    if (typeof value !== "string" || !((value as any) instanceof Date))
      throw new GraphQLYogaError(`invalid date value: ${value}`, {
        code: "VALIDATION_ERROR",
      });

    const date = new Date(value); // Convert incoming integer to Date

    if (isNaN(date.valueOf()))
      throw new GraphQLYogaError(`invalid date value: ${value}`, {
        code: "VALIDATION_ERROR",
      });
    return date;
  },

  parseLiteral(ast): Date {
    if (ast.kind === Kind.STRING) {
      const date = new Date(ast.value); // Convert hard-coded AST string to Date

      if (isNaN(date.valueOf()))
        throw new GraphQLYogaError(`invalid date value: ${ast.value}`, {
          code: "VALIDATION_ERROR",
        });
      return date;
    }

    throw new GraphQLYogaError(`invalid date kind: ${ast.kind}`, {
      code: "VALIDATION_ERROR",
    });
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
      throw new GraphQLYogaError(`error parsing JSON value: ${value}`, {
        code: "VALIDATION_ERROR",
      });
    return JSON.parse(value);
  },

  parseLiteral(ast): any {
    if (ast.kind === Kind.STRING) {
      return JSON.parse(ast.value);
    }

    throw new GraphQLYogaError(`invalid JSON kind: ${ast.kind}`, {
      code: "VALIDATION_ERROR",
    });
  },
});
