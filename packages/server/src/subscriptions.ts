import createSubscriber from "pg-listen";

const subscriber = createSubscriber({ connectionString: databaseURL });

export async function* onNotification<T>(channel: string): AsyncGenerator<T> {
  let notifications: T[] = [];
  let resolve: () => void;
  let promise = new Promise((r: any) => (resolve = r));

  const handleNotification = (payload: T) => {
    notifications.push(payload);

    // create a new promise to be resolved
    resolve();
    promise = new Promise((r: any) => (resolve = r));
  };

  try {
    subscriber.notifications.on<string>(channel, handleNotification);

    while (true) {
      // await for a new notification
      await promise;

      // yield all notifications
      for (const notification of notifications) yield notification;

      // reset notifications array
      notifications = [];
    }
  } finally {
    subscriber.notifications.removeListener(channel, handleNotification);
  }
}
