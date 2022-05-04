import DataLoader from "dataloader";

import {
  Account,
  DocumentInfo,
  DocumentMember,
  FileInfo,
  Maybe,
} from "./generated/graphql";
import { Persistence } from "./types";

export class DataLoaders {
  accounts: DataLoader<string, Maybe<Account>>;
  files: DataLoader<string, Maybe<FileInfo>>;
  documents: DataLoader<string, Maybe<DocumentInfo>>;
  documentMembers: DataLoader<string, DocumentMember[]>;
  accountDocuments: DataLoader<string, DocumentMember[]>;

  constructor(persistence: Persistence) {
    this.accounts = new DataLoader(persistence.getAccounts);
    this.files = new DataLoader(persistence.getFiles);
    this.documents = new DataLoader(persistence.getDocuments);
    this.documentMembers = new DataLoader(persistence.getDocumentsMembers);
    this.accountDocuments = new DataLoader(persistence.getAccountsDocuments);
  }
}
