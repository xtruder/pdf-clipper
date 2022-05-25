import { ApolloQueryResult, FetchResult } from "@apollo/client";

export const handleQueryResp = <T>(result: ApolloQueryResult<T>): T => {
  if (result.error) throw result.error;
  if (result.errors)
    throw new AggregateError(
      result.errors,
      "GraphQL error: " + result.errors[0].message
    );

  return result.data;
};

export const handleFetchResp = <T>(result: FetchResult<T>): T | undefined => {
  if (result.errors)
    throw new AggregateError(
      result.errors,
      "GraphQL error: " + result.errors[0].message
    );

  if (!result.data) return null;

  return result.data;
};
