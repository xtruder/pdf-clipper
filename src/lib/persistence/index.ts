import { syncedStore, getYjsValue } from "@syncedstore/core";

import { WebrtcProvider } from "y-webrtc";
import { IndexeddbPersistence } from "y-indexeddb";

import { Highlight } from "~/models";

export function highlightSyncedStore(id: string) {
  const store = syncedStore({
    highlights: [] as Highlight[],
    fragment: "text",
  });

  const doc = getYjsValue(store);

  const webrtcProvider = new WebrtcProvider(`${id}-highlights`, doc as any);
  const provider = new IndexeddbPersistence(`${id}-highlights`, doc as any);

  const disconnect = () => webrtcProvider.disconnect();
  const connect = () => webrtcProvider.connect();

  return { store, connect, disconnect };
}
