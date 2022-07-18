import { debug as _debug } from "debug";

import { addRxPlugin, createRxDatabase, RxDatabase } from "rxdb";

// rxdb plugins
import { getRxStorageDexie } from "rxdb/plugins/dexie";
import { RxDBValidatePlugin } from "rxdb/plugins/validate";
import { RxDBUpdatePlugin } from "rxdb/plugins/update";
import { RxDBLeaderElectionPlugin } from "rxdb/plugins/leader-election";
import { RxDBLocalDocumentsPlugin } from "rxdb/plugins/local-documents";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";

import { NativeFS } from "./nativefs";

import { CollectionCreator } from "./collections/types";
import accountCollectionCreator, {
  AccountCollection,
} from "./collections/account";
import accountInfoCollectionCreator, {
  AccountInfoCollection,
} from "./collections/accountInfo";
import documentCollectionCreator, {
  DocumentCollection,
} from "./collections/document";
import documentMemberCollectionCreator, {
  DocumentMemberCollection,
} from "./collections/documentMember";
import documentHighlightCollectionCreator, {
  DocumentHighlightCollection,
} from "./collections/documentHighlight";
import sessionCollectionCreator, {
  SessionCollection,
} from "./collections/session";

export type DatabaseCollections = {
  accounts: AccountCollection;
  accountinfos: AccountInfoCollection;
  documents: DocumentCollection;
  documentmembers: DocumentMemberCollection;
  documenthighlights: DocumentHighlightCollection;
  sessions: SessionCollection;
};

export type Database = RxDatabase<DatabaseCollections>;

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

export async function initDB(fs: NativeFS): Promise<Database> {
  const database = await createRxDatabase<DatabaseCollections>({
    name: "db",
    storage: getRxStorageDexie(),
    multiInstance: true,
  });

  const collectionCreators: CollectionCreator<any, any>[] = [
    accountCollectionCreator(),
    accountInfoCollectionCreator(),
    documentCollectionCreator(fs),
    documentMemberCollectionCreator(),
    documentHighlightCollectionCreator(fs),
    sessionCollectionCreator(),
  ];

  await database.addCollections(
    Object.fromEntries(
      collectionCreators.map((collection) => [collection.name, collection])
    )
  );

  const collections = Object.values(database.collections);

  collectionCreators.forEach((creator) => {
    const collection = collections.find(
      (collection) => collection.name === creator.name
    )!;

    creator.registerHooks?.(collection, database);
  });

  collections.map((c) => {
    const debug = _debug(`rxdb:${c.name}`);
    const getId = (data: any) => data[c.schema.primaryPath];

    c.preInsert((data) => debug(`inserting doc: ${getId(data)}`, data), true);
    c.postInsert((data) => debug(`doc inserted: ${getId(data)}`, data), true);
    c.preSave((data) => debug(`doc saving: ${getId(data)}`, data), true);
    c.postSave((data) => debug(`doc saved: ${getId(data)}`, data), true);
    c.preRemove((data) => debug(`doc removing: ${getId(data)}`, data), true);
    c.postRemove((data) => debug(`doc removed: ${getId(data)}`, data), true);
  });

  return database;
}
