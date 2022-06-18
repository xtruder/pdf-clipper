import {
  OperationVariables,
  TypedDocumentNode,
  QueryHookOptions,
  ApolloQueryResult,
  useApolloClient,
} from "@apollo/client";
import { DocumentNode } from "graphql";
import { useRef, useState, useSyncExternalStore } from "react";

import { deepEqual } from "./utils";

export function useSuspendedQuery<TData = any, TVariables = OperationVariables>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  props?: QueryHookOptions<TData, TVariables>
): ApolloQueryResult<TData> {
  const client = useApolloClient();
  const snapShotCache = useRef<ApolloQueryResult<TData>>();

  const [observedQuery] = useState(() => {
    const obsQuery = client.watchQuery<TData, TVariables>({ query, ...props });
    return obsQuery;
  });

  const data = useSyncExternalStore(
    (store) => {
      const unSub = observedQuery.subscribe(() => {
        store();
      });
      return () => {
        unSub.unsubscribe();
      };
    },
    () => {
      const result = observedQuery.getCurrentResult();
      const isEqual = deepEqual(snapShotCache.current, result);

      const newValue = (
        isEqual ? snapShotCache.current : result
      ) as ApolloQueryResult<TData>;

      if (!isEqual) {
        snapShotCache.current = newValue;
      }

      return newValue;
    }
  );

  const cache = client.readQuery<TData, TVariables>({ query, ...props });

  if (!cache) {
    const { fetchPolicy, ...newProps } = props ?? {};
    const policy = client.defaultOptions.query?.fetchPolicy;

    throw client.query({
      query,
      ...newProps,
      fetchPolicy: policy,
    });
  }

  return data;
}
