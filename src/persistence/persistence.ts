import {
  AccountInfo,
  DocumentInfo,
  DocumentReadingInfo,
  Highlight,
} from "~/models";
import { FileInfo } from "~/models/files";

export interface ReadableResource<T> {
  get(): Promise<T | null>;
}

export interface WritableResource<T> {
  write(value: T): Promise<void>;
  reset(): Promise<void>;
}

export interface SubscribableResource<T> {
  subscribe(func: (value: T) => void): Promise<any> | any;
}

export interface SyncableResource<T>
  extends ReadableResource<T>,
    WritableResource<T>,
    SubscribableResource<T> {}

export interface MutableResource<T>
  extends ReadableResource<T>,
    WritableResource<T> {}

export interface Persistence {
  accountInfo(): SyncableResource<AccountInfo>;
  documentInfo(docId: string): SyncableResource<DocumentInfo>;
  readingInfo(
    accountId: string,
    docId: string
  ): SyncableResource<DocumentReadingInfo>;
  documentHighlights(docId: string): SyncableResource<Highlight[]>;
  highlightImage(
    docId: string,
    highlightId: string,
    timestamp: number
  ): MutableResource<string>;
  fileInfo(fileId: string): MutableResource<FileInfo>;
}
