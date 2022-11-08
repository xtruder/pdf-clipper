import { createClient as createUrqlClient } from "urql";

import { toast } from "react-toastify";
import { pipe, tap } from "wonka";

// urql exchanges
import { devtoolsExchange } from "@urql/devtools";
import { dedupExchange, errorExchange } from "urql";
import { cacheExchange } from "@urql/exchange-graphcache";
import { multipartFetchExchange } from "@urql/exchange-multipart-fetch";
import { executeExchange } from "@urql/exchange-execute";
import scalarExchange from "urql-custom-scalars-exchange";

import {
  dexieLiveQueryExchange,
  liveQueryExchange,
  skipExchange,
} from "~/lib/urql";

import { Database } from "~/offline/db";
import { GqlContext } from "~/offline/resolvers";
import schema, { introspectionSchema } from "~/offline/schema";
import { DocumentHighlightFragment } from "~/fragments";
import { getDocumentHighlightsQuery } from "~/containers/HighlightListView";

import {
  CreateDocumentHighlightMutation,
  CreateDocumentHighlightMutationVariables,
} from "./graphql";
import { MyOperationContext } from "./hooks";
import { fetchWithTimeout } from "./utils";

export interface ClientArgs {
  url: string;
  db: Database;
  accountId: string;
}

export const createClient = ({ url, db, accountId }: ClientArgs) => {
  const context: GqlContext = {
    db,
    accountId,
  };

  return createUrqlClient({
    url,
    suspense: true,
    maskTypename: true,
    fetch: fetchWithTimeout(3000),
    requestPolicy: "cache-first",
    fetchOptions: {
      headers: {
        accountid: accountId,
      },
    },
    exchanges: [
      devtoolsExchange,
      dedupExchange,
      skipExchange({
        exchange: cacheExchange({
          schema: introspectionSchema,
          keys: {
            DocumentMeta: () => null,
            BlobInfo: (data: any) => data.hash,
          },
          updates: {
            Mutation: {
              createDocumentHighlight(
                { createDocumentHighlight }: CreateDocumentHighlightMutation,
                _args,
                cache,
                _info
              ) {
                cache.updateQuery(
                  {
                    query: getDocumentHighlightsQuery,
                    variables: {
                      documentId: createDocumentHighlight.document.id,
                      source: "remote",
                    },
                  },
                  (data) => {
                    data?.document.highlights.push(createDocumentHighlight);
                    return data;
                  }
                );
              },
            },
          },
          optimistic: {
            createDocumentHighlight(
              { highlight }: CreateDocumentHighlightMutationVariables,
              _cache,
              _info
            ): CreateDocumentHighlightMutation["createDocumentHighlight"] {
              return {
                __typename: "DocumentHighlight",
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: {
                  __typename: "AccountInfo",
                  id: accountId,
                  name: null,
                },
                document: {
                  __typename: "Document",
                  id: highlight.documentId,
                },
                content: {},
                image: null,
                ...highlight,
              };
            },
            updateDocumentHighlight(
              { highlight }: { highlight: any },
              cache,
              _info
            ) {
              return {
                __typename: "DocumentHighlight",
                ...cache.readFragment(DocumentHighlightFragment, {
                  id: highlight.id,
                } as any),
                ...highlight,
              };
            },
          },
          // resolvers: {
          //   BlobInfo: {
          //     blob: async (parent, args, cache, info) => {
          //       return null;
          //     },
          //   },
          // },
        }),

        // skip this exchange if offline is not true
        shouldSkip: (op) => op.context.source === "local",
      }),
      scalarExchange({
        schema: introspectionSchema,
        scalars: {
          JSON(value: any) {
            return JSON.parse(value);
          },
        },
      }),
      errorExchange({
        onError: (error, operation) => {
          const context = operation.context as MyOperationContext;

          if (context.propagateError) {
            let prefix = context.errorPrefix ?? "Error: ";
            toast.error(`${prefix}${error.toString()}`);
            console.error(error);
          }
        },
      }),

      skipExchange({
        exchange: dexieLiveQueryExchange({
          schema,
          context,
        }),

        // skip this exchange if offline is not true
        shouldSkip: (op) => op.context.source === "remote",
      }),
      skipExchange({
        exchange: executeExchange({
          schema,
          context,
        }),

        // skip this exchange if offline is not true
        shouldSkip: (op) => op.context.source === "remote",
      }),

      ({ forward }) =>
        (ops$) =>
          pipe(
            ops$,
            tap((op) =>
              console.log(
                "new operation",
                op.kind,
                (op.query.definitions[0] as any).name.value,
                op.key,
                op
              )
            ),
            forward
          ),

      liveQueryExchange(),
      multipartFetchExchange,
    ],
  });
};
