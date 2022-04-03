import { debug as _debug } from "debug";

import { NativeFS } from "~/lib/nativefs";
import { KVPersistence, LocalStorageResource } from "~/persistence/keyvalue";
import { Persistence } from "~/persistence/persistence";

// create persistent storage
export let persistence: Persistence = new KVPersistence(
  (name, key, value) => new LocalStorageResource(name, key, value)
);

// cache NativeFS
let fs: NativeFS;

export async function getPrivateDirectory() {
  if (fs) return fs;

  return (fs = await NativeFS.usePrivateDirectory());
}
