import { makeExecutableSchema } from "@graphql-tools/schema";
import { introspectionFromSchema } from "graphql";

import typeDefs from "./schema.graphql?raw";
import resolvers from "./resolvers";

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export const introspectionSchema = introspectionFromSchema(schema);

export default schema;
