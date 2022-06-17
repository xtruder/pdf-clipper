export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
  JSON: any;
  Upload: any;
};

export type Account = {
  __typename?: 'Account';
  /** Account creation time */
  createdAt: Scalars['DateTime'];
  /** Account deletion time */
  deletedAt?: Maybe<Scalars['DateTime']>;
  /** list of documents that account is member of */
  documents: Array<AccountDocument>;
  /** Account ID */
  id: Scalars['ID'];
  /** Optional account name */
  name?: Maybe<Scalars['String']>;
  /** Account last update time */
  updatedAt: Scalars['DateTime'];
};

export type AccountDocument = {
  __typename?: 'AccountDocument';
  /** Time when account was accepted as member of document */
  acceptedAt: Scalars['DateTime'];
  /** document member creation time */
  createdAt: Scalars['DateTime'];
  /** account that created document member */
  createdBy: AccountInfo;
  /** document associated with account */
  document?: Maybe<Document>;
  /** Role of account for document */
  role: DocumentRole;
};

export type AccountInfo = {
  __typename?: 'AccountInfo';
  /** account ID */
  id: Scalars['ID'];
  /** optional account name */
  name?: Maybe<Scalars['String']>;
};

export type AccountUpdateInput = {
  /** id of the account to update */
  id: Scalars['ID'];
  /** name of the account */
  name?: InputMaybe<Scalars['String']>;
  /** update timestamp */
  timestamp: Scalars['DateTime'];
};

export type Document = {
  __typename?: 'Document';
  /** document creation time */
  createdAt: Scalars['DateTime'];
  /** account that created document */
  createdBy: AccountInfo;
  /** document deletion time */
  deletedAt?: Maybe<Scalars['DateTime']>;
  /** file associated with document */
  file?: Maybe<FileInfo>;
  /** list of highlights associated with document */
  highlights: Array<DocumentHighlight>;
  /** unique document ID */
  id: Scalars['ID'];
  /** list of document members */
  members: Array<DocumentMember>;
  /** metadata associated with document */
  meta: DocumentMeta;
  /** type of the document */
  type: DocumentType;
  /** document last update time */
  updatedAt: Scalars['DateTime'];
};


export type DocumentHighlightsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

export type DocumentChange = {
  __typename?: 'DocumentChange';
  /** whether document has been deleted */
  deleted?: Maybe<Scalars['Boolean']>;
  /** changes regarding document highlights */
  highlights?: Maybe<Array<DocumentHighlightChange>>;
  /** changes regarding document members */
  members?: Maybe<Array<DocumentMemberChange>>;
  /** whether document meta has been updated */
  meta?: Maybe<DocumentMeta>;
  /** timestamp of change */
  timestamp: Scalars['DateTime'];
};

export type DocumentHighlight = {
  __typename?: 'DocumentHighlight';
  /** content associated with highlight */
  content: Scalars['JSON'];
  /** highlight creation time */
  createdAt: Scalars['DateTime'];
  /** highlight author ID */
  createdBy: AccountInfo;
  /** highlight deletion time */
  deletedAt?: Maybe<Scalars['DateTime']>;
  /** unique highlight id */
  id: Scalars['ID'];
  /** highlight location */
  location: Scalars['JSON'];
  /** highlight last udpate time */
  updatedAt: Scalars['DateTime'];
};

export type DocumentHighlightChange = {
  __typename?: 'DocumentHighlightChange';
  /** whether highlight content has been changed */
  content: Scalars['JSON'];
  /** who has made a change */
  createdBy: AccountInfo;
  /** whether highlight has been deleted */
  deleted?: Maybe<Scalars['Boolean']>;
  /** unique highlight id */
  id: Scalars['ID'];
  /** whether highlight location has been changed */
  location: Scalars['JSON'];
};

export type DocumentMember = {
  __typename?: 'DocumentMember';
  /** Time when account was accepted as member of document */
  acceptedAt?: Maybe<Scalars['DateTime']>;
  /** member account */
  account: AccountInfo;
  /** document member creation time */
  createdAt: Scalars['DateTime'];
  /** account that created document member */
  createdBy: AccountInfo;
  /** Role of account for document */
  role: DocumentRole;
};

export type DocumentMemberChange = {
  __typename?: 'DocumentMemberChange';
  /** whether member has been accepted */
  accepted?: Maybe<Scalars['Boolean']>;
  /** account id that membership has been changed for */
  accountId: Scalars['ID'];
  /** who has made a change */
  createdBy: AccountInfo;
  /** whether member has been deleted */
  deleted?: Maybe<Scalars['Boolean']>;
  /** whether ddocument role has been changed */
  role?: Maybe<DocumentRole>;
};

export type DocumentMemberInput = {
  /** whether document member is accepted */
  accepted?: InputMaybe<Scalars['Boolean']>;
  /** id of account to update */
  accountId: Scalars['ID'];
  /** role of document member */
  role?: InputMaybe<DocumentRole>;
};

/** user provided document metadata */
export type DocumentMeta = {
  __typename?: 'DocumentMeta';
  /** document author */
  author?: Maybe<Scalars['String']>;
  /** url of document cover image */
  cover?: Maybe<Scalars['String']>;
  /** document description */
  description?: Maybe<Scalars['String']>;
  /** keywords associated with document */
  keywords?: Maybe<Array<Scalars['String']>>;
  /** number of document pages */
  pageCount?: Maybe<Scalars['Int']>;
  /** title of the document */
  title?: Maybe<Scalars['String']>;
};

export type DocumentMetaInput = {
  /** document author */
  author?: InputMaybe<Scalars['String']>;
  /** url of document cover image */
  cover?: InputMaybe<Scalars['String']>;
  /** document description */
  description?: InputMaybe<Scalars['String']>;
  /** document outline */
  outline?: InputMaybe<DocumentOutlineInput>;
  /** number of pages in document */
  pageCount?: InputMaybe<Scalars['Int']>;
  /** title of the document */
  title?: InputMaybe<Scalars['String']>;
};

export type DocumentOutlineInput = {
  items: Array<OutlineNodeInput>;
};

export type DocumentReadingInfo = {
  __typename?: 'DocumentReadingInfo';
  /** account that reading info is associated with */
  account: AccountInfo;
  /** document creation time */
  createdAt: Scalars['DateTime'];
  /** document deletion time */
  deletedAt?: Maybe<Scalars['DateTime']>;
  /** last read page */
  lastPage?: Maybe<Scalars['Int']>;
  /** last reading location */
  location?: Maybe<Scalars['String']>;
  /** url of screenshot image */
  screenshot?: Maybe<Scalars['String']>;
  /** document last update time */
  updatedAt: Scalars['DateTime'];
};

export enum DocumentRole {
  Admin = 'ADMIN',
  Editor = 'EDITOR',
  Viewer = 'VIEWER'
}

export enum DocumentType {
  Pdf = 'PDF'
}

export type FileInfo = {
  __typename?: 'FileInfo';
  /** file creation time */
  createdAt: Scalars['DateTime'];
  /** account that created file */
  createdBy: AccountInfo;
  /** sha256 hash of file */
  hash: Scalars['String'];
  /** file mime type */
  mimeType: Scalars['String'];
  /** alternative file sources */
  sources?: Maybe<Array<Scalars['String']>>;
  /** file last update time */
  updatedAt: Scalars['DateTime'];
  /** primary url of file */
  url?: Maybe<Scalars['String']>;
};

export enum HighlightColor {
  Blue = 'BLUE',
  Green = 'GREEN',
  Red = 'RED',
  Yellow = 'YELLOW'
}

export type Mutation = {
  __typename?: 'Mutation';
  /** removes account from document */
  removeMeFromDocument: Scalars['Boolean'];
  /** updates account */
  updateAccount: Account;
  /** uploads file and returns file information */
  uploadFile: FileInfo;
  /** creates or updates a document */
  upsertDocument: Document;
  /** creates or updates document highlight */
  upsertDocumentHighlight: DocumentHighlight;
  upsertFileInfo: FileInfo;
};


export type MutationRemoveMeFromDocumentArgs = {
  documentId: Scalars['ID'];
};


export type MutationUpdateAccountArgs = {
  account: AccountUpdateInput;
};


export type MutationUploadFileArgs = {
  file: Scalars['Upload'];
};


export type MutationUpsertDocumentArgs = {
  document: UpsertDocumentInput;
};


export type MutationUpsertDocumentHighlightArgs = {
  documentId: Scalars['ID'];
  highlight: UpsertDocumentHighlightInput;
};


export type MutationUpsertFileInfoArgs = {
  fileInfo?: InputMaybe<UpsertFileInput>;
};

export type OutlineNodeInput = {
  items?: InputMaybe<Array<OutlineNodeInput>>;
  location?: InputMaybe<Scalars['String']>;
  pageNumber?: InputMaybe<Scalars['Int']>;
  title: Scalars['String'];
  top?: InputMaybe<Scalars['Int']>;
};

export type Query = {
  __typename?: 'Query';
  account?: Maybe<Account>;
  /** returns information about current account */
  currentAccount?: Maybe<Account>;
  /** gets document by id */
  document?: Maybe<Document>;
  fileInfo?: Maybe<FileInfo>;
};


export type QueryAccountArgs = {
  id: Scalars['ID'];
};


export type QueryDocumentArgs = {
  id: Scalars['ID'];
};


export type QueryFileInfoArgs = {
  fileHash: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  /** subscribes to account document updates */
  accountDocumentUpdates: AccountDocument;
  documentChanges?: Maybe<DocumentChange>;
};


export type SubscriptionAccountDocumentUpdatesArgs = {
  accountId: Scalars['ID'];
};


export type SubscriptionDocumentChangesArgs = {
  id: Scalars['ID'];
};

export type UpsertDocumentHighlightInput = {
  /** content associated with highlight serialized as JSON */
  content?: InputMaybe<Scalars['JSON']>;
  /** whether highlight has been deleted */
  deleted?: InputMaybe<Scalars['Boolean']>;
  /** unique highlight id */
  id?: InputMaybe<Scalars['ID']>;
  /** location of a highlight serialized as JSON */
  location?: InputMaybe<Scalars['JSON']>;
};

export type UpsertDocumentInput = {
  /** whether to delete document */
  deleted?: InputMaybe<Scalars['Boolean']>;
  /** hash of file associated with document */
  fileHash?: InputMaybe<Scalars['String']>;
  /** unique document ID */
  id?: InputMaybe<Scalars['ID']>;
  /** list of document members */
  members?: InputMaybe<Array<DocumentMemberInput>>;
  /** metadata associates with document */
  meta?: InputMaybe<DocumentMetaInput>;
  /** type of the document */
  type?: InputMaybe<DocumentType>;
};

export type UpsertFileInput = {
  /** sha256 hash of file */
  hash?: InputMaybe<Scalars['String']>;
  /** file mime type */
  mimeType?: InputMaybe<Scalars['String']>;
  /** sources where file can be retrived */
  sources?: InputMaybe<Array<Scalars['String']>>;
};

export type UpsertDocumentMutationVariables = Exact<{
  document: UpsertDocumentInput;
}>;


export type UpsertDocumentMutation = { __typename?: 'Mutation', upsertDocument: { __typename?: 'Document', id: string } };

export type UpsertDocumentHighlightMutationVariables = Exact<{
  documentId: Scalars['ID'];
  highlight: UpsertDocumentHighlightInput;
}>;


export type UpsertDocumentHighlightMutation = { __typename?: 'Mutation', upsertDocumentHighlight: { __typename?: 'DocumentHighlight', id: string, content: any, location: any, deletedAt?: any | null } };

export type RemoveMeFromDocumentMutationVariables = Exact<{
  documentId: Scalars['ID'];
}>;


export type RemoveMeFromDocumentMutation = { __typename?: 'Mutation', removeMeFromDocument: boolean };

export type UploadFileMutationVariables = Exact<{
  file: Scalars['Upload'];
}>;


export type UploadFileMutation = { __typename?: 'Mutation', uploadFile: { __typename?: 'FileInfo', hash: string, mimeType: string } };

export type DocumentInfoFragmentFragment = { __typename?: 'Document', id: string, type: DocumentType, meta: { __typename?: 'DocumentMeta', title?: string | null, description?: string | null, pageCount?: number | null, author?: string | null, cover?: string | null }, file?: { __typename?: 'FileInfo', hash: string, url?: string | null } | null };

export type GetCurrentAccountDocumentsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentAccountDocumentsQuery = { __typename?: 'Query', currentAccount?: { __typename?: 'Account', documents: Array<{ __typename?: 'AccountDocument', document?: { __typename?: 'Document', id: string, type: DocumentType, meta: { __typename?: 'DocumentMeta', title?: string | null, description?: string | null, pageCount?: number | null, author?: string | null, cover?: string | null }, file?: { __typename?: 'FileInfo', hash: string, url?: string | null } | null } | null }> } | null };

export type GetDocumentInfoQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetDocumentInfoQuery = { __typename?: 'Query', document?: { __typename?: 'Document', id: string, type: DocumentType, meta: { __typename?: 'DocumentMeta', title?: string | null, description?: string | null, pageCount?: number | null, author?: string | null, cover?: string | null }, file?: { __typename?: 'FileInfo', hash: string, url?: string | null } | null } | null };

export type GetDocumentHighlightsQueryVariables = Exact<{
  documentId: Scalars['ID'];
}>;


export type GetDocumentHighlightsQuery = { __typename?: 'Query', document?: { __typename?: 'Document', id: string, highlights: Array<{ __typename?: 'DocumentHighlight', id: string, location: any, content: any, deletedAt?: any | null }> } | null };
