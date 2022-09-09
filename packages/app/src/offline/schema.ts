import { makeExecutableSchema } from "@graphql-tools/schema";

import typeDefs from "./schema.graphql?raw";
import resolvers from "./resolvers";

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default schema;
