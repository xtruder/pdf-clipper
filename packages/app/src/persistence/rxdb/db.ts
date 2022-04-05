import { createRxDatabase, RxDatabase } from "rxdb";
import { debug as _debug } from "debug";
import { getRxStorageDexie } from "rxdb/plugins/dexie";

import {
  AccountInfoCollection,
  accountInfoSchema,
  DocumentHighlightCollection,
  documentHighlightSchema,
  DocumentInfoCollection,
  documentInfoSchema,
  DocumentReadingInfoCollection,
  documentReadingInfoSchema,
  FileInfoCollection,
  fileInfoSchema,
} from "~/types";

export type MyDatabaseCollections = {
  accountinfos: AccountInfoCollection;
  documentinfos: DocumentInfoCollection;
  documentreadinginfos: DocumentReadingInfoCollection;
  documenthighlights: DocumentHighlightCollection;
  fileinfos: FileInfoCollection;
};

export type MyDatabase = RxDatabase<MyDatabaseCollections>;

export async function initDB(): Promise<MyDatabase> {
  const database = await createRxDatabase<MyDatabaseCollections>({
    name: "db",
    storage: getRxStorageDexie(),
  });

  await database.addCollections({
    accountinfos: {
      schema: accountInfoSchema,
    },
    documentinfos: {
      schema: documentInfoSchema,
    },
    documentreadinginfos: {
      schema: documentReadingInfoSchema,
    },
    fileinfos: {
      schema: fileInfoSchema,
    },
    documenthighlights: {
      schema: documentHighlightSchema,
    },
  });

  Object.entries(database.collections).forEach(([name, collection]) => {
    const debug = _debug(`rxdb:${name}`);

    collection.preInsert((data) => {
      console.log("pre insert called");
      data.createdAt = new Date().toISOString();
    }, true);

    collection.preSave((data) => {
      data.updatedAt = new Date().toISOString();
    }, true);

    collection.postInsert((docData) => {
      debug(`doc insert ${docData.id}:`, docData);
    }, false);

    collection.postSave((docData) => {
      debug(`doc save ${docData.id}:`, docData);
    }, false);

    collection.postRemove((docData) => {
      debug(`doc remove ${docData.id}:`, docData);
    }, false);
  });

  return database;
}
