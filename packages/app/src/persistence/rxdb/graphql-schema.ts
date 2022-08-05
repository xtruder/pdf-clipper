import { JsonSchema, RxJsonSchema } from "rxdb";
import {
  GraphQLBoolean,
  GraphQLFieldConfig,
  GraphQLInputObjectType,
  GraphQLInputType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLOutputType,
  GraphQLScalarType,
  GraphQLSchema,
  GraphQLString,
  printSchema,
} from "graphql";

import collectionCreators from "./collections";

const typeCache: Record<string, any> = {};
const memoize = <T>(name: string, value: T): T => {
  if (typeCache[name]) return typeCache[name];
  typeCache[name] = value;
  return value;
};

const UUIDScalar = new GraphQLScalarType({
  name: "UUID",
});

const JSONScalar = new GraphQLScalarType({
  name: "JSON",
});

const DateTimeScalar = new GraphQLScalarType({
  name: "DateTime",
});

const genScalarType = (schema: JsonSchema): GraphQLScalarType => {
  switch (schema.type) {
    case "string":
      switch (schema.format) {
        case "date-time":
          return DateTimeScalar;
        case "uuid":
          return UUIDScalar;
        default:
          return GraphQLString;
      }
    case "number":
      return GraphQLInt;
    case "boolean":
      return GraphQLBoolean;
    default:
      throw new Error("invalid scalar type: " + schema.type);
  }
};

const genInputType = (schema: JsonSchema): GraphQLInputType => {
  switch (schema.type) {
    case "string":
    case "number":
    case "boolean":
      return genScalarType(schema);
    case "object":
      if (schema.properties)
        return genInputObjectType((schema as any).title, schema);
      else return JSONScalar;
    case "array":
      if (
        !schema.items ||
        typeof schema.items !== "object" ||
        Array.isArray(schema.items)
      )
        throw new Error("json schema array items must be of type object");

      return new GraphQLList(genInputType(schema.items));
    default:
      if (Array.isArray(schema.type))
        return genInputType({ ...schema, type: schema.type[0] });

      throw new Error("invalid json schema type: " + schema.type);
  }
};

const genType = (schema: JsonSchema): GraphQLOutputType => {
  switch (schema.type) {
    case "string":
    case "number":
    case "boolean":
      return genScalarType(schema);
    case "object":
      if (schema.properties)
        return genObjectType((schema as any).title, schema);
      else return JSONScalar;
    case "array":
      if (
        !schema.items ||
        typeof schema.items !== "object" ||
        Array.isArray(schema.items)
      )
        throw new Error("json schema array items must be of type object");

      return new GraphQLList(genType(schema.items));
    default:
      if (Array.isArray(schema.type))
        return genType({ ...schema, type: schema.type[0] });

      throw new Error("invalid json schema type: " + schema.type);
  }
};

const genObjectType = (name: string, schema: JsonSchema) =>
  memoize(
    name,
    new GraphQLObjectType({
      name,
      description: schema.description,
      fields: {
        ...Object.fromEntries(
          Object.entries(schema.properties || {}).map(
            ([propName, property]) => [
              propName,
              schema.required?.includes(propName)
                ? { type: new GraphQLNonNull(genType(property)) }
                : { type: genType(property) },
            ]
          )
        ),
        _deleted: { type: GraphQLBoolean },
      },
    })
  );

const genBulkUpdateType = (schema: RxJsonSchema<any>) => {
  const name = `${schema.title!}BulkUpdate`;

  return memoize(
    name,
    new GraphQLObjectType({
      name,
      fields: {
        id: {
          type: new GraphQLNonNull(GraphQLString),
          description: "Unique ID of bulk update",
        },
        lwt: {
          type: new GraphQLNonNull(GraphQLInt),
          description: "Bulk update last write time as number",
        },
        updated: {
          type: new GraphQLNonNull(
            new GraphQLList(
              new GraphQLNonNull(genObjectType(schema.title!, schema as any))
            )
          ),
          description: "List of updated docs",
        },
      },
    })
  );
};

const genInputObjectType = (name: string, schema: JsonSchema) =>
  new GraphQLInputObjectType({
    name,
    description: schema.description,
    fields: {
      ...Object.fromEntries(
        Object.entries(schema.properties || {}).map(([propName, property]) => [
          propName,
          schema.required?.includes(propName)
            ? { type: new GraphQLNonNull(genInputType(property)) }
            : { type: genInputType(property) },
        ])
      ),
      _deleted: { type: GraphQLBoolean },
    },
  });

const updateError = new GraphQLObjectType({
  name: "UpdateError",
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: "Id of the resource that failed update",
    },
    error: {
      type: GraphQLString,
      description: "Error string associated with upd",
    },
  },
});

const genUpdateResultType = (schema: RxJsonSchema<any>) =>
  new GraphQLObjectType({
    name: `${schema.title!}UpdateResult`,
    fields: {
      updated: {
        type: new GraphQLNonNull(
          new GraphQLList(
            new GraphQLNonNull(genObjectType(schema.title!, schema as any))
          )
        ),
        description:
          "list of updated documents that have been successfully processed",
      },
      rejected: {
        type: new GraphQLNonNull(
          new GraphQLList(
            new GraphQLNonNull(genObjectType(schema.title!, schema as any))
          )
        ),
        description: "list of rejected documents, with current returned state",
      },
      errors: {
        type: new GraphQLList(new GraphQLNonNull(updateError)),
        description: "List of errors associated with rejected documents",
      },
    },
  });

const genUpdateItemProp = (
  schema: RxJsonSchema<any>
): GraphQLFieldConfig<any, any> => ({
  type: new GraphQLNonNull(genUpdateResultType(schema)),
  args: {
    input: {
      type: new GraphQLNonNull(
        new GraphQLList(
          new GraphQLNonNull(
            genInputObjectType(schema.title! + "Input", schema as any)
          )
        )
      ),
    },
  },
});

export const getSubscribeOperationNameForSchema = (schema: RxJsonSchema<any>) =>
  `sync${schema.title!}Updates`;

const genSubscriptionType = (schemas: Record<string, RxJsonSchema<any>>) =>
  new GraphQLObjectType({
    name: "Subscription",
    fields: Object.fromEntries(
      Object.entries(schemas).map(([, schema]) => [
        getSubscribeOperationNameForSchema(schema),
        {
          type: new GraphQLNonNull(genBulkUpdateType(schema)),
        },
      ])
    ),
  });

export const getQueryOperationNameForSchema = (schema: RxJsonSchema<any>) =>
  `get${schema.title!}Changes`;

const genQueryType = (schemas: Record<string, RxJsonSchema<any>>) =>
  new GraphQLObjectType({
    name: "Query",
    fields: Object.fromEntries(
      Object.entries(schemas).map(([, schema]) => [
        getQueryOperationNameForSchema(schema),
        {
          type: new GraphQLNonNull(genBulkUpdateType(schema)),
          args: {
            since: {
              type: GraphQLString,
            },
            limit: {
              type: GraphQLInt,
              defaultValue: 100,
            },
          },
        },
      ])
    ),
  });

export const getMutaionOperationNameForSchema = (schema: RxJsonSchema<any>) =>
  `push${schema.title}Changes`;

const genMutationType = (schemas: Record<string, RxJsonSchema<any>>) =>
  new GraphQLObjectType({
    name: "Mutation",
    fields: Object.fromEntries(
      Object.entries(schemas).map(([, schema]) => [
        getMutaionOperationNameForSchema(schema),
        genUpdateItemProp(schema),
      ])
    ),
  });

const jsonSchemas = Object.fromEntries(
  Object.entries(collectionCreators).map(([name, c]) => [name, c.schema])
);

export const schema = new GraphQLSchema({
  mutation: genMutationType(jsonSchemas),
  subscription: genSubscriptionType(jsonSchemas),
  query: genQueryType(jsonSchemas),
});

export const rawSchema = printSchema(schema);
