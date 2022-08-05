import { addRxPlugin, createRxDatabase, RxCollection } from "rxdb";
import debug from "debug";

// rxdb plugins
import { getRxStorageDexie } from "rxdb/plugins/dexie";
import { RxDBValidatePlugin } from "rxdb/plugins/validate";
import { RxDBUpdatePlugin } from "rxdb/plugins/update";
import { RxDBLeaderElectionPlugin } from "rxdb/plugins/leader-election";
import { RxDBLocalDocumentsPlugin } from "rxdb/plugins/local-documents";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";

import collectionCreators, {
  Database,
  DatabaseCollections,
} from "./collections";

// validate data
addRxPlugin(RxDBValidatePlugin);

// enable updates using mongo-query-syntax
addRxPlugin(RxDBUpdatePlugin);

// enable leader election
addRxPlugin(RxDBLeaderElectionPlugin);

// enable local documents
addRxPlugin(RxDBLocalDocumentsPlugin);

// enable dev mode
addRxPlugin(RxDBDevModePlugin);

export async function initDB(): Promise<Database> {
  const storage = getRxStorageDexie();

  const database = await createRxDatabase<DatabaseCollections>({
    name: "db",
    storage,
    multiInstance: true,
  });

  const collections: DatabaseCollections = await database.addCollections(
    collectionCreators
  );

  // initialize collections
  for (const [name, c] of Object.entries(collectionCreators)) {
    const collection = (
      collections as Record<string, RxCollection<any, any, any>>
    )[name];

    if ("initCollection" in c) {
      c.initCollection(collection, database);
    }
  }

  // setup debug logging on collections
  for (const [, c] of Object.entries(collections)) {
    const log = debug(`rxdb:${c.name}`);
    const getId = (data: any) => data[c.schema.primaryPath];

    c.preInsert((data) => log(`inserting doc: ${getId(data)}`, data), true);
    c.postInsert((data) => log(`doc inserted: ${getId(data)}`, data), true);
    c.preSave((data) => log(`doc saving: ${getId(data)}`, data), true);
    c.postSave((data) => log(`doc saved: ${getId(data)}`, data), true);
    c.preRemove((data) => log(`doc removing: ${getId(data)}`, data), true);
    c.postRemove((data) => log(`doc removed: ${getId(data)}`, data), true);
  }

  return database;
}
