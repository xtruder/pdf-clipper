import {
  InMemoryLiveQueryStore,
  InMemoryLiveQueryStoreParameter,
} from "@n1ru4l/in-memory-live-query-store";
import { execute as defaultExecute, GraphQLResolveInfo } from "graphql";
import { IMiddlewareTypeMap } from "graphql-middleware";
import { IMiddlewareResolver } from "graphql-middleware/dist/types";
import Redis from "ioredis";

import { GqlContext } from "./resolvers";

const CHANNEL = "LIVE_QUERY_INVALIDATIONS";

export type LiveQueryStore = Pick<
  InMemoryLiveQueryStore,
  "invalidate" | "makeExecute"
>;

export class RedisLiveQueryStore {
  pub: Redis.Redis;
  sub: Redis.Redis;
  liveQueryStore: InMemoryLiveQueryStore;

  constructor(redisUrl: string, parameter?: InMemoryLiveQueryStoreParameter) {
    this.pub = new Redis(redisUrl);
    this.sub = new Redis(redisUrl);
    this.liveQueryStore = new InMemoryLiveQueryStore(parameter);

    this.sub.subscribe(CHANNEL, (err) => {
      if (err) throw err;
    });

    this.sub.on("message", (channel, resourceIdentifier) => {
      if (channel === CHANNEL && resourceIdentifier)
        this.liveQueryStore.invalidate(resourceIdentifier);
    });
  }

  async invalidate(identifiers: Array<string> | string) {
    if (typeof identifiers === "string") {
      identifiers = [identifiers];
    }
    for (const identifier of identifiers) {
      this.pub.publish(CHANNEL, identifier);
    }
  }

  makeExecute(args: typeof defaultExecute) {
    return this.liveQueryStore.makeExecute(args as any);
  }
}

type MiddlewareResolver = IMiddlewareResolver<any, GqlContext, any>;
type MiddlewareCallback<TSource, TArgs> = (
  parent: TSource,
  args: TArgs,
  context: GqlContext,
  info: GraphQLResolveInfo
) => Promise<void> | void;

const runAfter =
  <TSource = any, TArgs = any>(
    callback: MiddlewareCallback<TSource, TArgs>
  ): MiddlewareResolver =>
  async (resolve, ...rest) => {
    const result = await resolve(...rest);
    await callback(...rest);
    return result;
  };

export const liveQueryInvalidate: IMiddlewareTypeMap<any, GqlContext, any> = {
  Mutation: {
    updateAccount: runAfter((_, { id }, { liveQueryStore }) =>
      liveQueryStore.invalidate(`Account:${id}`)
    ),
    createDocument: runAfter((_root, _args, { liveQueryStore }) =>
      liveQueryStore.invalidate("Query.me")
    ),
    updateDocument: runAfter((_, { id }, { liveQueryStore }) =>
      liveQueryStore.invalidate(`Document:${id}`)
    ),
    deleteDocument: runAfter((_root, _args, { liveQueryStore }) =>
      liveQueryStore.invalidate("Query.me")
    ),
    createDocumentHighlight: runAfter((_, { documentId }, { liveQueryStore }) =>
      liveQueryStore.invalidate(`Query.document:${documentId}`)
    ),
    updateDocumentHighlight: runAfter((_, { documentId }, { liveQueryStore }) =>
      liveQueryStore.invalidate(`Query.document:${documentId}`)
    ),
    deleteDocumentHighlight: runAfter((_, { documentId }, { liveQueryStore }) =>
      liveQueryStore.invalidate(`Query.document:${documentId}`)
    ),
  },
};
