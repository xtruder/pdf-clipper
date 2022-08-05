import { RxDatabase } from "rxdb";

import { AccountInfoCollection, AccountInfoDocument } from "./accountinfos";
import { AccountCollection, AccountDocument } from "./accounts";
import { BlobInfoCollection, BlobInfoDocument } from "./blobinfos";
import {
  DocumentHighlightCollection,
  DocumentHighlightDocument,
} from "./documenthighlights";
import {
  DocumentMemberCollection,
  DocumentMemberDocument,
} from "./documentmembers";
import { DocumentCollection, DocumentDocument } from "./documents";
import { SessionCollection, SessionDocument } from "./sessions";

export type DatabaseCollections = {
  accounts: AccountCollection;
  accountinfos: AccountInfoCollection;
  documents: DocumentCollection;
  documentmembers: DocumentMemberCollection;
  documenthighlights: DocumentHighlightCollection;
  sessions: SessionCollection;
  blobinfos: BlobInfoCollection;
};

export type Database = RxDatabase<DatabaseCollections>;

export type {
  AccountDocument,
  AccountCollection,
  AccountInfoDocument,
  AccountInfoCollection,
  DocumentDocument,
  DocumentCollection,
  DocumentHighlightDocument,
  DocumentHighlightCollection,
  DocumentMemberDocument,
  DocumentMemberCollection,
  BlobInfoDocument,
  BlobInfoCollection,
  SessionDocument,
  SessionCollection,
};
