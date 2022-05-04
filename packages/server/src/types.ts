import { Maybe } from "./generated/graphql";
import {
  AccountDocumentModel,
  AccountModel,
  DocumentMemberModel,
  DocumentModel,
  FileModel,
} from "./models";

export interface Persistence {
  getAccounts(
    accountIds: string | readonly string[]
  ): Promise<Maybe<AccountModel>[]>;
  getFiles(fileHashes: string | readonly string[]): Promise<Maybe<FileModel>[]>;
  getDocuments(documentIds: readonly string[]): Promise<Maybe<DocumentModel>[]>;
  getDocumentsMembers(
    documentIds: readonly string[] | string
  ): Promise<Array<DocumentMemberModel[]>>;
  getAccountsDocuments(
    accountIds: string | readonly string[]
  ): Promise<Array<AccountDocumentModel[]>>;
}
