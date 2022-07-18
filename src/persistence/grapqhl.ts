import {
  GraphQLSchemaFromRxSchemaInput,
  graphQLSchemaFromRxSchema,
} from "rxdb/plugins/replication-graphql";

import {
  accountSchema,
  documentSchema,
  documentHighlightSchema,
} from "./collections";

const defaultCollectionProps = {
  feedKeys: ["id", "updatedAt"],
  deletedFlag: "deletedAt",
  subscriptionParams: {
    token: "String!",
  },
};

export const graphQLGenerationInput: GraphQLSchemaFromRxSchemaInput = {
  account: {
    schema: accountSchema,
    ...defaultCollectionProps,
  },
  document: {
    schema: documentSchema,
    ...defaultCollectionProps,
  },
  // documentReadingInfo: {
  //   schema: documentReadingInfoSchema,
  //   ...defaultCollectionProps,
  // },
  documentHighlight: {
    schema: documentHighlightSchema,
    ...defaultCollectionProps,
  },
};

export const schema = graphQLSchemaFromRxSchema(graphQLGenerationInput);
