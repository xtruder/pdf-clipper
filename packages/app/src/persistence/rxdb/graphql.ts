import {
  GraphQLSchemaFromRxSchemaInput,
  graphQLSchemaFromRxSchema,
} from "rxdb/plugins/replication-graphql";

import {
  accountInfoSchema,
  documentInfoSchema,
  documentReadingInfoSchema,
  documentHighlightSchema,
  fileInfoSchema,
} from "../../types";

const defaultCollectionProps = {
  feedKeys: ["id", "updatedAt"],
  deletedFlag: "deleted",
  subscriptionParams: {
    token: "String!",
  },
};

export const graphQLGenerationInput: GraphQLSchemaFromRxSchemaInput = {
  accountInfo: {
    schema: accountInfoSchema,
    ...defaultCollectionProps,
  },
  documentInfo: {
    schema: documentInfoSchema,
    ...defaultCollectionProps,
  },
  documentReadingInfo: {
    schema: documentReadingInfoSchema,
    ...defaultCollectionProps,
  },
  documentHighlight: {
    schema: documentHighlightSchema,
    ...defaultCollectionProps,
  },
  fileInfo: {
    schema: fileInfoSchema,
    ...defaultCollectionProps,
  },
};

export const schema = graphQLSchemaFromRxSchema(graphQLGenerationInput);
