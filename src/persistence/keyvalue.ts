import { debug as _debug, Debugger } from "debug";
import * as localForage from "localforage";

import {
  AccountPublic,
  DocumentInfo,
  DocumentReadingInfo,
  DocumentHighlight,
  FileInfo,
} from "~/types";

import { Persistence, SyncableResource } from "./persistence";

localForage.config({
  driver: localForage.INDEXEDDB, // Force WebSQL; same as using setDriver()
  name: "pdf-clipper",
  version: 1.0,
  storeName: "state", // Should be alphanumeric, with underscores.
  description: "pdf-clipper storage",
});

const debug = _debug("persistence:keyvalue");

export class MemoryResource<T> implements SyncableResource<T> {
  private subscribers: Array<(value: T) => Promise<any> | any> = [];
  private value: T | null = null;
  private debug: Debugger;

  constructor(name: string, value: T | null = null) {
    this.debug = debug.extend(name);
    this.value = value;
  }

  async get(): Promise<T | null> {
    this.debug("getting value", this.value);
    return this.value;
  }

  async write(value: T) {
    this.debug("setting value", value);

    this.value = value;
  }

  async reset() {
    this.debug("value reset called", this.value);
    this.value = null;
  }

  async subscribe(fn: (value: T) => void) {
    this.debug("subscribing", fn);
    this.subscribers.push(fn);
  }
}

export class LocalStorageResource<T> implements SyncableResource<T> {
  private subscribers: Array<(value: T) => Promise<any> | any> = [];
  private value: T | null = null;
  private debug: Debugger;

  constructor(
    private name: string,
    private key: string,
    value: T | null = null
  ) {
    this.debug = debug.extend(this.name);

    (async () => {
      if (await localForage.getItem(`${this.name}-${this.key}`)) return;
      else if (value)
        localStorage.setItem(`${this.name}-${this.key}`, JSON.stringify(value));
    })();
  }

  async get(): Promise<T | null> {
    const value = await localForage.getItem<T>(`${this.name}-${this.key}`);
    this.debug("getting value", this.key, value);

    if (!value) return null;

    return value;
  }

  async write(value: T) {
    this.debug("setting value", value);

    if (!value) await localForage.removeItem(`${this.name}-${this.key}`);

    await localForage.setItem(`${this.name}-${this.key}`, value);
  }

  async reset() {
    this.debug("value reset called", this.value);
    await localForage.removeItem(`${this.name}-${this.key}`);
  }

  async subscribe(fn: (value: T) => void) {
    this.debug("subscribing", fn);
    this.subscribers.push(fn);
  }
}

type ResourceConstructor = <T>(
  name: string,
  key: string,
  value: T | null
) => SyncableResource<T>;

export class KVPersistence implements Persistence {
  private _accountInfo: Record<string, SyncableResource<AccountPublic>> = {};
  private _documentInfo: Record<string, SyncableResource<DocumentInfo>> = {};
  private _readingInfo: Record<string, SyncableResource<DocumentReadingInfo>> =
    {};
  private _documentHighlight: Record<
    string,
    SyncableResource<DocumentHighlight>
  > = {};
  private _documentHighlightIds: Record<string, SyncableResource<string[]>> =
    {};
  private _highlightImage: Record<string, SyncableResource<string>> = {};
  private _fileInfo: Record<string, SyncableResource<FileInfo>> = {};

  constructor(
    private resourceConstructor: ResourceConstructor = (name, _, value) =>
      new MemoryResource(name, value)
  ) {}

  private memoized = <T>(
    name: string,
    store: Record<string, SyncableResource<T>>,
    key: string,
    value: T | null
  ) => {
    if (store[key]) return store[key];

    store[key] = this.resourceConstructor(name, key, value);

    return store[key];
  };

  accountInfo = (accountId: string) =>
    this.memoized("accountInfo", this._accountInfo, accountId, null);

  document = (docId: string) =>
    this.memoized("docInfo", this._documentInfo, docId, {
      id: docId,
    });

  documentReadingInfo = (accountId: string, docId: string) =>
    this.memoized("readingInfo", this._readingInfo, `${accountId}-${docId}`, {
      id: `${accountId}|${docId}`,
      accountId,
      docId,
    });

  documentHighlight = (docId: string, highlightId: string) =>
    this.memoized(
      "documentHighlight",
      this._documentHighlight,
      `${docId}-${highlightId}`,
      null
    );

  documentHighlightIds(docId: string): SyncableResource<string[]> {
    return this.memoized(
      "documentHighlightIds",
      this._documentHighlightIds,
      docId,
      [] as string[]
    );
  }

  highlightImage = (docId: string, highlightId: string, timestamp: number) =>
    this.memoized(
      "highlightImage",
      this._highlightImage,
      `${docId}-${highlightId}-${timestamp}`,
      null
    );

  fileInfo = (fileId: string) =>
    this.memoized("fileInfo", this._fileInfo, fileId, {
      id: fileId,
      sources: [] as string[],
    });
}
