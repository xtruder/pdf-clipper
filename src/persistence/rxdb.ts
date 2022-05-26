import { createRxDatabase, RxCollection, RxDatabase, addRxPlugin } from "rxdb";
import { debug as _debug } from "debug";
import { getRxStorageDexie } from "rxdb/plugins/dexie";
import { RxDBReplicationGraphQLPlugin } from "rxdb/plugins/replication-graphql";

import {
  useRxCollection as _useRxCollection,
  useRxDocument as _useRxDocument,
} from "rxdb-hooks";

import {
  AccountInfo,
  accountInfoSchema,
  DocumentHighlight,
  documentHighlightSchema,
  DocumentInfo,
  documentInfoSchema,
  DocumentReadingInfo,
  documentReadingInfoSchema,
  FileInfo,
  fileInfoSchema,
} from "~/types";
import { setupReplication } from "./hasura";

addRxPlugin(RxDBReplicationGraphQLPlugin);

export type DatabaseCollections = {
  /**collection of account informations */
  account_info: RxCollection<AccountInfo>;

  /**collection of document informations */
  document_info: RxCollection<DocumentInfo>;

  /**collection of document highlights */
  document_highlight: RxCollection<DocumentHighlight>;

  /**collection of document reading information */
  document_reading_info: RxCollection<DocumentReadingInfo>;

  /**collection of information about file informations */
  file_info: RxCollection<FileInfo>;
};

export type Database = RxDatabase<DatabaseCollections>;

export type DatabaseCollectionType<
  N extends keyof DatabaseCollections,
  C = DatabaseCollections[N]
> = C extends RxCollection<infer U> ? U : never;

export async function initDB(accountId: string): Promise<Database> {
  if (!accountId) throw new Error("accountId not set");

  const database = await createRxDatabase<DatabaseCollections>({
    name: `db-${accountId}`,
    storage: getRxStorageDexie(),
  });

  await database.addCollections({
    account_info: {
      schema: accountInfoSchema,
    },
    document_info: {
      schema: documentInfoSchema,
    },
    document_highlight: {
      schema: documentHighlightSchema,
    },
    document_reading_info: {
      schema: documentReadingInfoSchema,
    },
    file_info: {
      schema: fileInfoSchema,
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

  /**remove all highlights associated with document on delete */
  database.document_info.postRemove(async (doc, _) => {
    await database.document_highlight
      .find()
      .where({ documentId: doc.id })
      .remove();
  }, false);

  setupReplication(database);

  return database;
}
