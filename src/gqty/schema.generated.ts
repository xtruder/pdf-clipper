/**
 * GQTY AUTO-GENERATED CODE: PLEASE DO NOT MODIFY MANUALLY
 */

import { SchemaUnionsKey } from "gqty";

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: string;
  Upload: any;
}

export interface AccountUpdateInput {
  /** id of the account to update */
  id: Scalars["ID"];
  /** name of the account */
  name?: InputMaybe<Scalars["String"]>;
  /** update timestamp */
  timestamp: Scalars["DateTime"];
}

export interface DocumentMetaInput {
  /** document author */
  author?: InputMaybe<Scalars["String"]>;
  /** url of document cover image */
  cover?: InputMaybe<Scalars["String"]>;
  /** document description */
  description?: InputMaybe<Scalars["String"]>;
  /** document outline */
  outline?: InputMaybe<DocumentOutlineInput>;
  /** number of pages in document */
  pageCount?: InputMaybe<Scalars["Int"]>;
  /** title of the document */
  title?: InputMaybe<Scalars["String"]>;
}

export interface DocumentOutlineInput {
  items: Array<OutlineNodeInput>;
}

export enum DocumentRole {
  ADMIN = "ADMIN",
  EDITOR = "EDITOR",
  VIEWER = "VIEWER",
}

export enum DocumentType {
  PDF = "PDF",
}

export enum HighlightColor {
  BLUE = "BLUE",
  GREEN = "GREEN",
  RED = "RED",
  YELLOW = "YELLOW",
}

export interface OutlineNodeInput {
  items?: InputMaybe<Array<OutlineNodeInput>>;
  location?: InputMaybe<Scalars["String"]>;
  pageNumber?: InputMaybe<Scalars["Int"]>;
  title: Scalars["String"];
  top?: InputMaybe<Scalars["Int"]>;
}

export interface UpsertDocumentHighlightInput {
  /** content associated with highlight serialized as JSON */
  content?: InputMaybe<Scalars["String"]>;
  /** whether highlight has been deleted */
  deleted?: InputMaybe<Scalars["Boolean"]>;
  /** unique highlight id */
  id?: InputMaybe<Scalars["ID"]>;
  /** location of a highlight serialized as JSON */
  location?: InputMaybe<Scalars["String"]>;
}

export interface UpsertDocumentInput {
  /** hash of file associated with document */
  fileHash?: InputMaybe<Scalars["String"]>;
  /** unique document ID */
  id?: InputMaybe<Scalars["ID"]>;
  /** metadata associates with document */
  meta?: InputMaybe<DocumentMetaInput>;
  /** type of the document */
  type?: InputMaybe<DocumentType>;
}

export interface UpsertFileInput {
  /** sha256 hash of file */
  hash?: InputMaybe<Scalars["String"]>;
  /** file mime type */
  mimeType?: InputMaybe<Scalars["String"]>;
  /** sources where file can be retrived */
  sources?: InputMaybe<Array<Scalars["String"]>>;
}

export const scalarsEnumsHash: import("gqty").ScalarsEnumsHash = {
  Boolean: true,
  DateTime: true,
  DocumentRole: true,
  DocumentType: true,
  HighlightColor: true,
  ID: true,
  Int: true,
  String: true,
  Upload: true,
};
export const generatedSchema = {
  Account: {
    __typename: { __type: "String!" },
    createdAt: { __type: "DateTime!" },
    deletedAt: { __type: "DateTime" },
    documents: { __type: "[AccountDocument!]!" },
    id: { __type: "ID!" },
    name: { __type: "String" },
    updatedAt: { __type: "DateTime!" },
  },
  AccountDocument: {
    __typename: { __type: "String!" },
    acceptedAt: { __type: "DateTime!" },
    createdAt: { __type: "DateTime!" },
    document: { __type: "Document" },
    role: { __type: "DocumentRole!" },
  },
  AccountInfo: {
    __typename: { __type: "String!" },
    id: { __type: "ID!" },
    name: { __type: "String" },
  },
  AccountUpdateInput: {
    id: { __type: "ID!" },
    name: { __type: "String" },
    timestamp: { __type: "DateTime!" },
  },
  Document: {
    __typename: { __type: "String!" },
    createdAt: { __type: "DateTime!" },
    createdBy: { __type: "AccountInfo!" },
    deletedAt: { __type: "DateTime" },
    file: { __type: "FileInfo" },
    highlights: {
      __type: "[DocumentHighlight!]!",
      __args: { limit: "Int", offset: "Int" },
    },
    id: { __type: "ID!" },
    members: { __type: "[DocumentMember!]!" },
    meta: { __type: "DocumentMeta!" },
    type: { __type: "DocumentType!" },
    updatedAt: { __type: "DateTime!" },
  },
  DocumentChange: {
    __typename: { __type: "String!" },
    deleted: { __type: "Boolean" },
    highlights: { __type: "[DocumentHighlightChange!]" },
    members: { __type: "[DocumentMemberChange!]" },
    meta: { __type: "DocumentMeta" },
    timestamp: { __type: "DateTime!" },
  },
  DocumentHighlight: {
    __typename: { __type: "String!" },
    content: { __type: "HighlightContent!" },
    createdAt: { __type: "DateTime!" },
    createdBy: { __type: "AccountInfo!" },
    deletedAt: { __type: "DateTime" },
    id: { __type: "ID!" },
    index: { __type: "Int!" },
    location: { __type: "String!" },
    updatedAt: { __type: "DateTime!" },
  },
  DocumentHighlightChange: {
    __typename: { __type: "String!" },
    content: { __type: "HighlightContent!" },
    createdBy: { __type: "AccountInfo!" },
    deleted: { __type: "Boolean" },
    id: { __type: "ID!" },
    location: { __type: "String!" },
  },
  DocumentMember: {
    __typename: { __type: "String!" },
    acceptedAt: { __type: "DateTime" },
    account: { __type: "Account!" },
    createdAt: { __type: "DateTime!" },
    role: { __type: "DocumentRole!" },
  },
  DocumentMemberChange: {
    __typename: { __type: "String!" },
    accepted: { __type: "Boolean" },
    accountId: { __type: "ID!" },
    createdBy: { __type: "AccountInfo!" },
    deleted: { __type: "Boolean" },
    role: { __type: "DocumentRole" },
  },
  DocumentMeta: {
    __typename: { __type: "String!" },
    author: { __type: "String" },
    cover: { __type: "String" },
    description: { __type: "String" },
    keywords: { __type: "[String!]" },
    pageCount: { __type: "Int" },
    title: { __type: "String" },
  },
  DocumentMetaInput: {
    author: { __type: "String" },
    cover: { __type: "String" },
    description: { __type: "String" },
    outline: { __type: "DocumentOutlineInput" },
    pageCount: { __type: "Int" },
    title: { __type: "String" },
  },
  DocumentOutlineInput: { items: { __type: "[OutlineNodeInput!]!" } },
  DocumentReadingInfo: {
    __typename: { __type: "String!" },
    account: { __type: "AccountInfo!" },
    createdAt: { __type: "DateTime!" },
    deletedAt: { __type: "DateTime" },
    lastPage: { __type: "Int" },
    location: { __type: "String" },
    screenshot: { __type: "String" },
    updatedAt: { __type: "DateTime!" },
  },
  FileInfo: {
    __typename: { __type: "String!" },
    createdAt: { __type: "DateTime!" },
    createdBy: { __type: "AccountInfo!" },
    hash: { __type: "String!" },
    mimeType: { __type: "String!" },
    sources: { __type: "[String!]" },
    updatedAt: { __type: "DateTime!" },
    url: { __type: "String" },
  },
  HighlightContent: {
    __typename: { __type: "String!" },
    $on: { __type: "$HighlightContent!" },
  },
  OutlineNodeInput: {
    items: { __type: "[OutlineNodeInput!]" },
    location: { __type: "String" },
    pageNumber: { __type: "Int" },
    title: { __type: "String!" },
    top: { __type: "Int" },
  },
  TextImageHighlightContent: {
    __typename: { __type: "String!" },
    color: { __type: "HighlightColor" },
    image: { __type: "String" },
    text: { __type: "String" },
  },
  UpsertDocumentHighlightInput: {
    content: { __type: "String" },
    deleted: { __type: "Boolean" },
    id: { __type: "ID" },
    location: { __type: "String" },
  },
  UpsertDocumentInput: {
    fileHash: { __type: "String" },
    id: { __type: "ID" },
    meta: { __type: "DocumentMetaInput" },
    type: { __type: "DocumentType" },
  },
  UpsertFileInput: {
    hash: { __type: "String" },
    mimeType: { __type: "String" },
    sources: { __type: "[String!]" },
  },
  mutation: {
    __typename: { __type: "String!" },
    removeMeFromDocument: { __type: "Boolean!", __args: { documentId: "ID!" } },
    updateAccount: {
      __type: "Account!",
      __args: { account: "AccountUpdateInput!" },
    },
    uploadFile: { __type: "FileInfo!", __args: { file: "Upload!" } },
    upsertDocument: {
      __type: "Document!",
      __args: { document: "UpsertDocumentInput!" },
    },
    upsertDocumentHighlight: {
      __type: "DocumentHighlight!",
      __args: { documentId: "ID!", highlight: "UpsertDocumentHighlightInput!" },
    },
    upsertFileInfo: {
      __type: "FileInfo!",
      __args: { fileInfo: "UpsertFileInput" },
    },
  },
  query: {
    __typename: { __type: "String!" },
    account: { __type: "Account", __args: { id: "ID!" } },
    currentAccount: { __type: "Account!" },
    document: { __type: "Document!", __args: { id: "ID!" } },
    fileInfo: { __type: "FileInfo", __args: { fileHash: "String!" } },
  },
  subscription: {
    __typename: { __type: "String!" },
    accountDocumentUpdates: {
      __type: "AccountDocument!",
      __args: { accountId: "ID!" },
    },
    documentChanges: { __type: "DocumentChange", __args: { id: "ID!" } },
  },
  [SchemaUnionsKey]: { HighlightContent: ["TextImageHighlightContent"] },
} as const;

export interface Account {
  __typename?: "Account";
  /**
   * Account creation time
   */
  createdAt: ScalarsEnums["DateTime"];
  /**
   * Account deletion time
   */
  deletedAt?: Maybe<ScalarsEnums["DateTime"]>;
  /**
   * list of documents that account is member of
   */
  documents: Array<AccountDocument>;
  /**
   * Account ID
   */
  id: ScalarsEnums["ID"];
  /**
   * Optional account name
   */
  name?: Maybe<ScalarsEnums["String"]>;
  /**
   * Account last update time
   */
  updatedAt: ScalarsEnums["DateTime"];
}

export interface AccountDocument {
  __typename?: "AccountDocument";
  /**
   * Time when account was accepted as member of document
   */
  acceptedAt: ScalarsEnums["DateTime"];
  /**
   * document member creation time
   */
  createdAt: ScalarsEnums["DateTime"];
  /**
   * document associated with account
   */
  document?: Maybe<Document>;
  /**
   * Role of account for document
   */
  role: ScalarsEnums["DocumentRole"];
}

export interface AccountInfo {
  __typename?: "AccountInfo";
  /**
   * account ID
   */
  id: ScalarsEnums["ID"];
  /**
   * optional account name
   */
  name?: Maybe<ScalarsEnums["String"]>;
}

export interface Document {
  __typename?: "Document";
  /**
   * document creation time
   */
  createdAt: ScalarsEnums["DateTime"];
  /**
   * account that created document
   */
  createdBy: AccountInfo;
  /**
   * document deletion time
   */
  deletedAt?: Maybe<ScalarsEnums["DateTime"]>;
  /**
   * file associated with document
   */
  file?: Maybe<FileInfo>;
  /**
   * list of highlights associated with document
   */
  highlights: (args?: {
    limit?: Maybe<Scalars["Int"]>;
    offset?: Maybe<Scalars["Int"]>;
  }) => Array<DocumentHighlight>;
  /**
   * unique document ID
   */
  id: ScalarsEnums["ID"];
  /**
   * list of document members
   */
  members: Array<DocumentMember>;
  /**
   * metadata associated with document
   */
  meta: DocumentMeta;
  /**
   * type of the document
   */
  type: ScalarsEnums["DocumentType"];
  /**
   * document last update time
   */
  updatedAt: ScalarsEnums["DateTime"];
}

export interface DocumentChange {
  __typename?: "DocumentChange";
  /**
   * whether document has been deleted
   */
  deleted?: Maybe<ScalarsEnums["Boolean"]>;
  /**
   * changes regarding document highlights
   */
  highlights?: Maybe<Array<DocumentHighlightChange>>;
  /**
   * changes regarding document members
   */
  members?: Maybe<Array<DocumentMemberChange>>;
  /**
   * whether document meta has been updated
   */
  meta?: Maybe<DocumentMeta>;
  /**
   * timestamp of change
   */
  timestamp: ScalarsEnums["DateTime"];
}

export interface DocumentHighlight {
  __typename?: "DocumentHighlight";
  /**
   * content associated with highlight
   */
  content: HighlightContent;
  /**
   * highlight creation time
   */
  createdAt: ScalarsEnums["DateTime"];
  /**
   * highlight author ID
   */
  createdBy: AccountInfo;
  /**
   * highlight deletion time
   */
  deletedAt?: Maybe<ScalarsEnums["DateTime"]>;
  /**
   * unique highlight id
   */
  id: ScalarsEnums["ID"];
  /**
   * highlight index, used for sorting
   */
  index: ScalarsEnums["Int"];
  /**
   * highlight location
   */
  location: ScalarsEnums["String"];
  /**
   * highlight last udpate time
   */
  updatedAt: ScalarsEnums["DateTime"];
}

export interface DocumentHighlightChange {
  __typename?: "DocumentHighlightChange";
  /**
   * whether highlight content has been changed
   */
  content: HighlightContent;
  /**
   * who has made a change
   */
  createdBy: AccountInfo;
  /**
   * whether highlight has been deleted
   */
  deleted?: Maybe<ScalarsEnums["Boolean"]>;
  /**
   * unique highlight id
   */
  id: ScalarsEnums["ID"];
  /**
   * whether highlight location has been changed
   */
  location: ScalarsEnums["String"];
}

export interface DocumentMember {
  __typename?: "DocumentMember";
  /**
   * Time when account was accepted as member of document
   */
  acceptedAt?: Maybe<ScalarsEnums["DateTime"]>;
  /**
   * member account
   */
  account: Account;
  /**
   * document member creation time
   */
  createdAt: ScalarsEnums["DateTime"];
  /**
   * Role of account for document
   */
  role: ScalarsEnums["DocumentRole"];
}

export interface DocumentMemberChange {
  __typename?: "DocumentMemberChange";
  /**
   * whether member has been accepted
   */
  accepted?: Maybe<ScalarsEnums["Boolean"]>;
  /**
   * account id that membership has been changed for
   */
  accountId: ScalarsEnums["ID"];
  /**
   * who has made a change
   */
  createdBy: AccountInfo;
  /**
   * whether member has been deleted
   */
  deleted?: Maybe<ScalarsEnums["Boolean"]>;
  /**
   * whether ddocument role has been changed
   */
  role?: Maybe<ScalarsEnums["DocumentRole"]>;
}

/**
 * user provided document metadata
 */
export interface DocumentMeta {
  __typename?: "DocumentMeta";
  /**
   * document author
   */
  author?: Maybe<ScalarsEnums["String"]>;
  /**
   * url of document cover image
   */
  cover?: Maybe<ScalarsEnums["String"]>;
  /**
   * document description
   */
  description?: Maybe<ScalarsEnums["String"]>;
  /**
   * keywords associated with document
   */
  keywords?: Maybe<Array<ScalarsEnums["String"]>>;
  /**
   * number of document pages
   */
  pageCount?: Maybe<ScalarsEnums["Int"]>;
  /**
   * title of the document
   */
  title?: Maybe<ScalarsEnums["String"]>;
}

export interface DocumentReadingInfo {
  __typename?: "DocumentReadingInfo";
  /**
   * account that reading info is associated with
   */
  account: AccountInfo;
  /**
   * document creation time
   */
  createdAt: ScalarsEnums["DateTime"];
  /**
   * document deletion time
   */
  deletedAt?: Maybe<ScalarsEnums["DateTime"]>;
  /**
   * last read page
   */
  lastPage?: Maybe<ScalarsEnums["Int"]>;
  /**
   * last reading location
   */
  location?: Maybe<ScalarsEnums["String"]>;
  /**
   * url of screenshot image
   */
  screenshot?: Maybe<ScalarsEnums["String"]>;
  /**
   * document last update time
   */
  updatedAt: ScalarsEnums["DateTime"];
}

export interface FileInfo {
  __typename?: "FileInfo";
  /**
   * file creation time
   */
  createdAt: ScalarsEnums["DateTime"];
  /**
   * account that created file
   */
  createdBy: AccountInfo;
  /**
   * sha256 hash of file
   */
  hash: ScalarsEnums["String"];
  /**
   * file mime type
   */
  mimeType: ScalarsEnums["String"];
  /**
   * alternative file sources
   */
  sources?: Maybe<Array<ScalarsEnums["String"]>>;
  /**
   * file last update time
   */
  updatedAt: ScalarsEnums["DateTime"];
  /**
   * primary url of file
   */
  url?: Maybe<ScalarsEnums["String"]>;
}

export interface HighlightContent {
  __typename?: "TextImageHighlightContent";
  $on: $HighlightContent;
}

export interface TextImageHighlightContent {
  __typename?: "TextImageHighlightContent";
  /**
   * color associated with highlight
   */
  color?: Maybe<ScalarsEnums["HighlightColor"]>;
  /**
   * url of highlight image
   */
  image?: Maybe<ScalarsEnums["String"]>;
  /**
   * text associated with highlight
   */
  text?: Maybe<ScalarsEnums["String"]>;
}

export interface Mutation {
  __typename?: "Mutation";
  /**
   * removes account from document
   */
  removeMeFromDocument: (args: {
    documentId: Scalars["ID"];
  }) => ScalarsEnums["Boolean"];
  /**
   * updates account
   */
  updateAccount: (args: { account: AccountUpdateInput }) => Account;
  /**
   * uploads file and returns file information
   */
  uploadFile: (args: { file: Scalars["Upload"] }) => FileInfo;
  /**
   * creates or updates a document
   */
  upsertDocument: (args: { document: UpsertDocumentInput }) => Document;
  /**
   * creates or updates document highlight
   */
  upsertDocumentHighlight: (args: {
    documentId: Scalars["ID"];
    highlight: UpsertDocumentHighlightInput;
  }) => DocumentHighlight;
  upsertFileInfo: (args?: { fileInfo?: Maybe<UpsertFileInput> }) => FileInfo;
}

export interface Query {
  __typename?: "Query";
  account: (args: { id: Scalars["ID"] }) => Maybe<Account>;
  /**
   * returns information about current account
   */
  currentAccount: Account;
  /**
   * gets document by id
   */
  document: (args: { id: Scalars["ID"] }) => Document;
  fileInfo: (args: { fileHash: Scalars["String"] }) => Maybe<FileInfo>;
}

export interface Subscription {
  __typename?: "Subscription";
  /**
   * subscribes to account document updates
   */
  accountDocumentUpdates: (args: {
    accountId: Scalars["ID"];
  }) => AccountDocument;
  documentChanges: (args: { id: Scalars["ID"] }) => Maybe<DocumentChange>;
}

export interface SchemaObjectTypes {
  Account: Account;
  AccountDocument: AccountDocument;
  AccountInfo: AccountInfo;
  Document: Document;
  DocumentChange: DocumentChange;
  DocumentHighlight: DocumentHighlight;
  DocumentHighlightChange: DocumentHighlightChange;
  DocumentMember: DocumentMember;
  DocumentMemberChange: DocumentMemberChange;
  DocumentMeta: DocumentMeta;
  DocumentReadingInfo: DocumentReadingInfo;
  FileInfo: FileInfo;
  Mutation: Mutation;
  Query: Query;
  Subscription: Subscription;
  TextImageHighlightContent: TextImageHighlightContent;
}
export type SchemaObjectTypesNames =
  | "Account"
  | "AccountDocument"
  | "AccountInfo"
  | "Document"
  | "DocumentChange"
  | "DocumentHighlight"
  | "DocumentHighlightChange"
  | "DocumentMember"
  | "DocumentMemberChange"
  | "DocumentMeta"
  | "DocumentReadingInfo"
  | "FileInfo"
  | "Mutation"
  | "Query"
  | "Subscription"
  | "TextImageHighlightContent";

export interface $HighlightContent {
  TextImageHighlightContent?: TextImageHighlightContent;
}

export interface GeneratedSchema {
  query: Query;
  mutation: Mutation;
  subscription: Subscription;
}

export type MakeNullable<T> = {
  [K in keyof T]: T[K] | undefined;
};

export interface ScalarsEnums extends MakeNullable<Scalars> {
  DocumentRole: DocumentRole | undefined;
  DocumentType: DocumentType | undefined;
  HighlightColor: HighlightColor | undefined;
}
