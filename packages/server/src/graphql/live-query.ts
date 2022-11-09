import Redis from "ioredis";

import { ExecutionArgs } from "graphql";

import {
  InMemoryLiveQueryStore,
  InMemoryLiveQueryStoreParameter,
} from "@n1ru4l/in-memory-live-query-store";

import { getLogger } from "../logging";

const CHANNEL = "LIVE_QUERY_INVALIDATIONS";

export type LiveQueryStore = Pick<
  InMemoryLiveQueryStore,
  "invalidate" | "makeExecute"
>;

export class RedisLiveQueryStore implements LiveQueryStore {
  private pub: Redis;
  private sub: Redis;
  private liveQueryStore: InMemoryLiveQueryStore;
  private logger = getLogger("redis-live-query-store");

  constructor(redisUrl: string, parameter?: InMemoryLiveQueryStoreParameter) {
    this.pub = new Redis(redisUrl);
    this.sub = new Redis(redisUrl);
    this.liveQueryStore = new InMemoryLiveQueryStore(parameter);

    this.sub.subscribe(CHANNEL, (err) => {
      if (err) {
        return this.logger.error("error subscribing to redis", err);
      }

      return this.logger.debug("subscribed to %s", CHANNEL);
    });

    this.sub.on("message", (channel: string, resourceIdentifier: string) => {
      if (channel === CHANNEL && resourceIdentifier) {
        this.logger.debug("invalidating resource %s", resourceIdentifier);

        this.liveQueryStore
          .invalidate(resourceIdentifier)
          .catch((err) => this.logger.error("invalidate error", err));
      }
    });
  }

  async invalidate(identifiers: Array<string> | string) {
    if (typeof identifiers === "string") {
      identifiers = [identifiers];
    }
    for (const identifier of identifiers) {
      this.logger.debug("publish invalidation", identifier);
      this.pub.publish(CHANNEL, identifier);
    }
  }

  makeExecute: LiveQueryStore["makeExecute"] = (executeFn) => {
    const liveExecuteFn = this.liveQueryStore.makeExecute(executeFn);

    return (args: ExecutionArgs) => {
      return liveExecuteFn(args);
    };
  };
}
