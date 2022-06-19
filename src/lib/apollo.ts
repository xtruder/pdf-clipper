import {
  OperationVariables,
  TypedDocumentNode,
  QueryHookOptions,
  ApolloQueryResult,
  useApolloClient,
  DocumentNode,
} from "@apollo/client";
import { useRef, useMemo, useSyncExternalStore, useCallback } from "react";

import { deepEqual } from "./utils";

export function useSuspendedQuery<TData = any, TVariables = OperationVariables>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  props?: QueryHookOptions<TData, TVariables>
): ApolloQueryResult<TData> {
  const client = useApolloClient();
  const snapShotCache = useRef<ApolloQueryResult<TData>>();

  const observedQuery = useMemo(
    () => client.watchQuery<TData, TVariables>({ query, ...props }),
    [query, JSON.stringify(props)]
  );

  const subscribe = useCallback(
    (store: () => void) => {
      const sub = observedQuery.subscribe(() => store());
      return () => sub.unsubscribe();
    },
    [observedQuery]
  );

  const getSnapshot = useCallback(() => {
    const result = observedQuery.getCurrentResult();
    const isEqual = deepEqual(snapShotCache.current, result);

    const newValue = (
      isEqual ? snapShotCache.current : result
    ) as ApolloQueryResult<TData>;

    if (!isEqual) {
      snapShotCache.current = newValue;
    }

    return newValue;
  }, [observedQuery]);

  const data = useSyncExternalStore(subscribe, getSnapshot);

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
