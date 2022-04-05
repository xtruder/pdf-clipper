import { RxCollectionBase, RxDatabase } from "rxdb";
import {
  AccountInfo,
  DocumentHighlight,
  DocumentInfo,
  DocumentReadingInfo,
  FileInfo,
} from "~/types";

import { MyDatabaseCollections } from "./db";
import { MutableResource, Persistence, SyncableResource } from "../persistence";
import { Subscription } from "rxjs";

// simple syncable resource identified by id
export class RxDBSyncableResource<T> implements SyncableResource<T> {
  private removeSubscription?: Subscription;
  private updateSubscription?: Subscription;

  constructor(
    private collection: RxCollectionBase<any, T, any>,
    private query: Parameters<RxCollectionBase<any, T, any>["find"]>[0],
    private subscribeFilter: (id: string, value: T | null) => boolean
  ) {}

  async get(): Promise<T | null> {
    const result = await this.collection.find(this.query).exec();

    // if no results have been found
    if (!result.length) return null;

    // return first result and get only data
    return result[0].toJSON();
  }

  async write(value: T): Promise<void> {
    await this.collection.atomicUpsert(value);
  }

  subscribe(func: (value: T | null) => void) {
    this.updateSubscription = this.collection.update$.subscribe((change) => {
      if (this.subscribeFilter(change.documentId, change.documentData as T))
        func(change.documentData as T);
    });

    this.removeSubscription = this.collection.remove$.subscribe((change) => {
      if (this.subscribeFilter(change.documentId, change.documentData))
        func(null);
    });
  }

  async reset(): Promise<void> {
    if (this.updateSubscription) this.updateSubscription.unsubscribe();
    if (this.removeSubscription) this.removeSubscription.unsubscribe();

    const result = await this.collection.find(this.query).exec();
    if (!result.length) return;

    await this.collection.bulkRemove(result.map((doc) => doc.id));
  }
}

export class RxDBPersistence implements Persistence {
  constructor(private db: RxDatabase<MyDatabaseCollections>) {}

  accountInfo(accountId: string): SyncableResource<AccountInfo> {
    return new RxDBSyncableResource(
      this.db!.accountinfos,
      {
        selector: { id: accountId },
      },
      (id) => id === accountId
    );
  }

  documentInfo(docId: string): SyncableResource<DocumentInfo> {
    return new RxDBSyncableResource(
      this.db!.documentinfos,
      { selector: { id: docId } },
      (id) => id === docId
    );
  }

  documentReadingInfo(
    accountId: string,
    docId: string
  ): SyncableResource<DocumentReadingInfo> {
    return new RxDBSyncableResource(
      this.db!.documentreadinginfos,
      { selector: { docId, accountId } },
      (id) => id === `${accountId}|${docId}`
    );
  }

  documentHighlight(
    docId: string,
    highlightId: string
  ): SyncableResource<DocumentHighlight | null> {
    return new RxDBSyncableResource(
      this.db!.documenthighlights,
      { selector: { docId, id: highlightId } },
      (id) => id === highlightId
    );
  }

  documentHighlightIds(docId: string): SyncableResource<string[]> {
    const getHighlightIds = async () => {
      const results = await this.db!.documenthighlights.find({
        selector: { docId },
      }).exec();

      return results.map((h) => h.id);
    };

    let subscription: Subscription | undefined;
    return {
      get: () => getHighlightIds(),
      subscribe: (func) => {
        subscription = this.db!.documenthighlights.$.subscribe(async (_) =>
          func(await getHighlightIds())
        );
      },
      async write() {},
      async reset() {
        if (subscription) subscription.unsubscribe();
      },
    };
  }

  fileInfo(fileId: string): MutableResource<FileInfo> {
    return new RxDBSyncableResource(
      this.db!.fileinfos,
      { selector: { id: fileId } },
      (id) => id === fileId
    );
  }
}
