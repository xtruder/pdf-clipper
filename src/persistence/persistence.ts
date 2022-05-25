import {
  AccountPublic,
  DocumentInfo,
  DocumentReadingInfo,
  DocumentHighlight,
  FileInfo,
} from "~/types";

export interface ReadableResource<T> {
  get(): Promise<T | null>;
}

export interface WritableResource<T> {
  write(value: T | null): Promise<void>;
  reset(): Promise<void>;
}

export interface SubscribableResource<T> {
  subscribe(func: (value: T | null) => void): Promise<any> | any;
}

export interface SyncableResource<T>
  extends ReadableResource<T>,
    WritableResource<T>,
    SubscribableResource<T> {}

export interface MutableResource<T>
  extends ReadableResource<T>,
    WritableResource<T> {}

export interface Persistence {
  accountInfo(accountId: string): SyncableResource<AccountPublic>;

  accountDocuments(accountId: string): SyncableResource<DocumentInfo[]>;

  /**information about document */
  document(documentId: string): SyncableResource<DocumentInfo>;

  /**A single highlight for a document by id */
  documentHighlight(
    docId: string,
    highlightId: string
  ): SyncableResource<DocumentHighlight | null>;

  /** List of document highlight ids for a document */
  documentHighlightIds(docId: string): SyncableResource<string[]>;

  /**Reading info associated with account and document */
  documentReadingInfo(
    accountId: string,
    docId: string
  ): SyncableResource<DocumentReadingInfo>;

  /**image of highlight area */
  // highlightImage(
  //   docId: string,
  //   highlightId: string,
  //   timestamp: number
  // ): MutableResource<string>;

  /**information about file */
  fileInfo(fileId: string): MutableResource<FileInfo>;
}
