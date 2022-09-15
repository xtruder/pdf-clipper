import { createClient as createUrqlClient } from "urql";

// urql exchanges
import { dedupExchange } from "urql";
import { cacheExchange } from "@urql/exchange-graphcache";
import { multipartFetchExchange } from "@urql/exchange-multipart-fetch";
import { executeExchange } from "@urql/exchange-execute";
import {
  dexieLiveQueryExchange,
  liveQueryExchange,
  skipExchange,
} from "~/lib/urql";

import { Database } from "~/offline/db";
import { GqlContext } from "~/offline/resolvers";
import schema from "~/offline/schema";

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
    exchanges: [
      dedupExchange,
      cacheExchange({
        keys: {
          DocumentMeta: () => null,
          BlobInfo: (data: any) => data.hash,
        },
      }),
      skipExchange({
        exchange: dexieLiveQueryExchange({
          schema,
          context,
        }),

        // skip this exchange if offline is not true
        shouldSkip: ({ context: { offline } }) => !!!offline,
      }),
      skipExchange({
        exchange: executeExchange({
          schema,
          context,
        }),

        // skip this exchange if offline is not true
        shouldSkip: ({ context: { offline } }) => !!!offline,
      }),
      liveQueryExchange(),
      multipartFetchExchange,
    ],
  });
};
