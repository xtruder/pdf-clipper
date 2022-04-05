import { debug as _debug } from "debug";

import { NativeFS } from "~/lib/nativefs";
//import { KVPersistence, LocalStorageResource } from "~/persistence/keyvalue";
import { Persistence } from "~/persistence/persistence";
import { RxDBPersistence } from "~/persistence/rxdb";
import { initDB } from "~/persistence/rxdb/db";

// create persistent storage
const db = await initDB();
export let persistence: Persistence = new RxDBPersistence(db);

// new KVPersistence(
//   (name, key, value) => new LocalStorageResource(name, key, value)
// );

// create NativeFS for local file storage
export const fs: NativeFS = await NativeFS.usePrivateDirectory();
