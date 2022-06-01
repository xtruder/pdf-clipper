/**
 * GQTY: You can safely modify this file and Query Fetcher based on your needs
 */

import { createClient } from "gqty";
import type { QueryFetcher } from "gqty";

import { createReactClient } from "@gqty/react";
import { createSubscriptionsClient } from "@gqty/subscriptions";

import { extractFiles } from "extract-files";

import type {
  GeneratedSchema,
  SchemaObjectTypes,
  SchemaObjectTypesNames,
} from "./schema.generated";
import { generatedSchema, scalarsEnumsHash } from "./schema.generated";

const queryFetcher: QueryFetcher = async function (
  query,
  variables,
  fetchOptions
) {
  const extracted = extractFiles({
    query,
    variables,
  });

  // extract files from request and make multipart form data upload
  if (extracted.files.size > 0) {
    const form = new FormData();
    form.append("operations", JSON.stringify(extracted.clone));

    const map: Record<number, string[]> = {};
    let i = 0;
    extracted.files.forEach((paths) => {
      map[++i] = paths;
    });
    form.append("map", JSON.stringify(map));
    i = 0;
    extracted.files.forEach((_paths, file) => {
      form.append(++i + "", file as File);
    });

    const response = await fetch("/api/graphql", {
      method: "POST",
      headers: {},
      body: form,
      mode: "cors",
    });

    const json = await response.json();

    return json;
  }

  // Modify "/api/graphql" if needed
  const response = await fetch("/api/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    mode: "cors",
    ...fetchOptions,
  });

  const json = await response.json();

  return json;
};

const subscriptionsClient =
  typeof window !== "undefined"
    ? createSubscriptionsClient({
        wsEndpoint: () => {
          // Modify if needed
          const url = new URL("/api/graphql", window.location.href);
          url.protocol = url.protocol.replace("http", "ws");
          return url.href;
        },
      })
    : undefined;

export const client = createClient<
  GeneratedSchema,
  SchemaObjectTypesNames,
  SchemaObjectTypes
>({
  schema: generatedSchema,
  scalarsEnumsHash,
  queryFetcher,
  subscriptionsClient,
});

const { query, mutation, mutate, subscription, resolved, refetch, track } =
  client;

export { query, mutation, mutate, subscription, resolved, refetch, track };

const {
  graphql,
  useQuery,
  usePaginatedQuery,
  useTransactionQuery,
  useLazyQuery,
  useRefetch,
  useMutation,
  useMetaState,
  prepareReactRender,
  useHydrateCache,
  prepareQuery,
  useSubscription,
} = createReactClient<GeneratedSchema>(client, {
  defaults: {
    // Set this flag as "true" if your usage involves React Suspense
    // Keep in mind that you can overwrite it in a per-hook basis
    suspense: false,

    // Set this flag based on your needs
    staleWhileRevalidate: false,
  },
});

export {
  graphql,
  useQuery,
  usePaginatedQuery,
  useTransactionQuery,
  useLazyQuery,
  useRefetch,
  useMutation,
  useMetaState,
  prepareReactRender,
  useHydrateCache,
  prepareQuery,
  useSubscription,
};

export * from "./schema.generated";
