import createSubscriber, { Subscriber } from "pg-listen";

export interface DBSubscriberOptions {
  connectionString: string;
}

export interface DBEvent {
  timestamp: string;
  action: string;
  table: string;
  record: Record<string, any>;
  old?: Record<string, any>;
}

export type DBSubscriber = Subscriber<{
  db_events: DBEvent;
}>;

export async function createDBSubscriber(
  options: DBSubscriberOptions
): Promise<DBSubscriber> {
  const { connectionString } = options;

  // Accepts the same connection config object that the "pg" package would take
  const subscriber: DBSubscriber = createSubscriber({ connectionString });

  subscriber.notifications.on("db_events", (payload) => {
    // Payload as passed to subscriber.notify() (see below)
    console.log("Received notification in 'db_events':", payload);
  });

  subscriber.events.on("error", (error) => {
    console.error("Fatal database connection error:", error);
    process.exit(1);
  });

  process.on("exit", () => {
    subscriber.close();
  });

  await subscriber.connect();
  await subscriber.listenTo("db_events");

  return subscriber;
}
