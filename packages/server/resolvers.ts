import { PubSub } from "graphql-subscriptions";

import { DBSubscriber } from "./db";
import { Resolvers } from "./src/generated/graphql";

const pubSubChannels = (ctx: { accountId: string }) => ({
  accountInfo: `${ctx.accountId}-account-info`,
});

export interface GqlContext {
  accountId: string;
}

export async function createResolvers(
  subscriber: DBSubscriber
): Promise<Resolvers> {
  const pubsub = new PubSub();

  subscriber.notifications.on("db_events", async (event) => {
    const channels = pubSubChannels({ accountId: event.record.id });
    if (event.table === "accountInfo") {
      pubsub.publish(pubSubChannels({ accountId }));
    }
  });

  const resolvers: Resolvers<GqlContext> = {
    Query: {},
    Subscription: {
      changedAccountInfo: {
        subscribe: (_, _args, ctx) => ({
          [Symbol.asyncIterator]: () =>
            pubsub.asyncIterator(pubSubChannels(ctx).accountInfo),
        }),
      },
    },
  };

  return resolvers;
}
