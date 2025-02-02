/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
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
  Blob: Blob;
  DateTime: Date;
  File: Blob;
  JSON: any;
};

export type Account = {
  __typename?: 'Account';
  /** Account creation time */
  createdAt: Scalars['DateTime'];
  /** list of documents associated with account */
  documents: Array<DocumentMember>;
  /** Account ID */
  id: Scalars['ID'];
  /** Optional account name */
  name?: Maybe<Scalars['String']>;
  /** Account last update time */
  updatedAt: Scalars['DateTime'];
};

export type AccountCreateInput = {
  /** name of the account */
  name?: InputMaybe<Scalars['String']>;
};

export type AccountInfo = {
  __typename?: 'AccountInfo';
  /** whether account has been deleted */
  deleted: Scalars['Boolean'];
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
};

export type BlobInfo = {
  __typename?: 'BlobInfo';
  /** client only field that represents the actual blob data */
  blob?: Maybe<Scalars['Blob']>;
  /** blob creation time */
  createdAt: Scalars['DateTime'];
  /** account information about blob creator */
  createdBy: AccountInfo;
  /** hash of a blob */
  hash: Scalars['String'];
  /** mime type associated with blob */
  mimeType: Scalars['String'];
  /** size of the blob in bytes */
  size?: Maybe<Scalars['Int']>;
  /** blob source URI */
  source?: Maybe<Scalars['String']>;
  /** blob last update time */
  updatedAt: Scalars['DateTime'];
  /** blob download URL */
  url?: Maybe<Scalars['String']>;
};

export type CreateDocumentHighlightInput = {
  /** color associated with highlight */
  color: HighlightColor;
  /** content associated with highlight serialized as JSON */
  content?: InputMaybe<Scalars['JSON']>;
  /** id of the document that highlight is associated with */
  documentId: Scalars['ID'];
  /** unique highlight id */
  id: Scalars['ID'];
  /** hash of the image associated with document highlight */
  imageHash?: InputMaybe<Scalars['String']>;
  /** location of a highlight serialized as JSON */
  location: Scalars['JSON'];
  /** sequential document highlight index */
  sequence: Scalars['String'];
  /** thumbnail of the image associated with highlight encoded as datauri */
  thumbnail?: InputMaybe<Scalars['String']>;
};

export type CreateDocumentInput = {
  /** hash of document cover image */
  coverHash?: InputMaybe<Scalars['String']>;
  /** hash of file associated with document */
  fileHash: Scalars['String'];
  /** metadata associates with document */
  meta?: InputMaybe<DocumentMetaInput>;
  /** type of the document */
  type: DocumentType;
  /** update document visibility */
  visibility?: InputMaybe<DocumentVisibility>;
};

export type Document = {
  __typename?: 'Document';
  /** info about document cover image */
  cover?: Maybe<BlobInfo>;
  /** document creation time */
  createdAt: Scalars['DateTime'];
  /** account that created document */
  createdBy: AccountInfo;
  /** document deletion time */
  deletedAt?: Maybe<Scalars['DateTime']>;
  /** file associated with document */
  file: BlobInfo;
  /** gets all highlights associated with document */
  highlights: Array<DocumentHighlight>;
  /** unique document ID */
  id: Scalars['ID'];
  /** list of document members associated with document */
  members: Array<DocumentMember>;
  /** metadata associated with document */
  meta: DocumentMeta;
  /** type of the document */
  type: DocumentType;
  /** document last update time */
  updatedAt: Scalars['DateTime'];
  /** document visibility defines whether document is private or public */
  visibility: DocumentVisibility;
};

export type DocumentHighlight = {
  __typename?: 'DocumentHighlight';
  /** color associated with highlight */
  color: HighlightColor;
  /** content associated with highlight */
  content?: Maybe<Scalars['JSON']>;
  /** highlight creation time */
  createdAt: Scalars['DateTime'];
  /** highlight author ID */
  createdBy: AccountInfo;
  /** document associated with highlight */
  document: Document;
  /** unique highlight id */
  id: Scalars['ID'];
  /** image associated with highlight */
  image?: Maybe<BlobInfo>;
  /** highlight location */
  location: Scalars['JSON'];
  /** sequential document highlight index */
  sequence: Scalars['String'];
  /** thumbnail of the image associated with highlight encoded as datauri */
  thumbnail?: Maybe<Scalars['String']>;
  /** highlight last udpate time */
  updatedAt: Scalars['DateTime'];
};

export type DocumentMember = {
  __typename?: 'DocumentMember';
  /** Time when account was accepted as member of document */
  acceptedAt?: Maybe<Scalars['DateTime']>;
  /** member account information */
  account: AccountInfo;
  /** document member creation time */
  createdAt: Scalars['DateTime'];
  /** account that added document member */
  createdBy: AccountInfo;
  /** membership document */
  document: Document;
  /** id of this document member relation */
  id: Scalars['String'];
  /** Role of account for document */
  role: DocumentRole;
};

export type DocumentMemberInput = {
  /** document member membership status */
  accepted?: InputMaybe<Scalars['Boolean']>;
  /** id of the member account */
  accountId: Scalars['ID'];
  /** id of the document that member belongs to */
  documentId: Scalars['ID'];
  /** document member role */
  role?: InputMaybe<DocumentRole>;
};

/** user provided document metadata */
export type DocumentMeta = {
  __typename?: 'DocumentMeta';
  /** document author */
  author?: Maybe<Scalars['String']>;
  /** document description */
  description?: Maybe<Scalars['String']>;
  /** keywords associated with document */
  keywords?: Maybe<Array<Scalars['String']>>;
  /** outline associated with document */
  outline?: Maybe<Scalars['JSON']>;
  /** number of document pages */
  pageCount?: Maybe<Scalars['Int']>;
  /** title of the document */
  title?: Maybe<Scalars['String']>;
};

export type DocumentMetaInput = {
  /** document author */
  author?: InputMaybe<Scalars['String']>;
  /** document description */
  description?: InputMaybe<Scalars['String']>;
  /** document outline */
  outline?: InputMaybe<Scalars['JSON']>;
  /** number of pages in document */
  pageCount?: InputMaybe<Scalars['Int']>;
  /** title of the document */
  title?: InputMaybe<Scalars['String']>;
};

export enum DocumentRole {
  Admin = 'ADMIN',
  Editor = 'EDITOR',
  Viewer = 'VIEWER'
}

export enum DocumentType {
  Pdf = 'PDF'
}

export enum DocumentVisibility {
  Private = 'PRIVATE',
  Public = 'PUBLIC'
}

export enum HighlightColor {
  Blue = 'BLUE',
  Green = 'GREEN',
  Red = 'RED',
  Yellow = 'YELLOW'
}

export type Mutation = {
  __typename?: 'Mutation';
  /** creates a new account */
  createAccount: Account;
  /** creates a new document */
  createDocument: Document;
  /** creates document highlight */
  createDocumentHighlight: DocumentHighlight;
  /** deletes existing document */
  deleteDocument: Document;
  /** deletes document highlight */
  deleteDocumentHighlight: DocumentHighlight;
  /** updates account */
  updateAccount: Account;
  /** updates existing document */
  updateDocument: Document;
  /** updates document highlight */
  updateDocumentHighlight: DocumentHighlight;
  /** uploads blob and returns blob information */
  uploadBlob: BlobInfo;
  /** creates or updates document member */
  upsertDocumentMember?: Maybe<DocumentMember>;
};


export type MutationCreateAccountArgs = {
  account: AccountCreateInput;
};


export type MutationCreateDocumentArgs = {
  document: CreateDocumentInput;
};


export type MutationCreateDocumentHighlightArgs = {
  highlight: CreateDocumentHighlightInput;
};


export type MutationDeleteDocumentArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteDocumentHighlightArgs = {
  id: Scalars['ID'];
};


export type MutationUpdateAccountArgs = {
  account: AccountUpdateInput;
};


export type MutationUpdateDocumentArgs = {
  document: UpdateDocumentInput;
};


export type MutationUpdateDocumentHighlightArgs = {
  highlight: UpdateDocumentHighlightInput;
};


export type MutationUploadBlobArgs = {
  blob: UploadBlobInput;
};


export type MutationUpsertDocumentMemberArgs = {
  member: DocumentMemberInput;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  /** gets account by ID */
  account: Account;
  blobInfo: BlobInfo;
  /** gets document by ID */
  document: Document;
  /** returns information about current account */
  me: Account;
};


export type QueryAccountArgs = {
  id: Scalars['ID'];
};


export type QueryBlobInfoArgs = {
  hash: Scalars['String'];
};


export type QueryDocumentArgs = {
  id: Scalars['ID'];
};

export type UpdateDocumentHighlightInput = {
  /** content associated with highlight serialized as JSON */
  content?: InputMaybe<Scalars['JSON']>;
  /** id of the highlight to update */
  id: Scalars['ID'];
  /** hash of the image associated with document highlight */
  imageHash?: InputMaybe<Scalars['String']>;
  /** location of a highlight serialized as JSON */
  location?: InputMaybe<Scalars['JSON']>;
  /** thumbnail of the image associated with highlight encoded as datauri */
  thumbnail?: InputMaybe<Scalars['String']>;
};

export type UpdateDocumentInput = {
  /** document id to update */
  id: Scalars['ID'];
  /** metadata associates with document */
  meta?: InputMaybe<DocumentMetaInput>;
  /** update document visibility */
  visibility?: InputMaybe<DocumentVisibility>;
};

export type UploadBlobInput = {
  /** blob to upload */
  blob: Scalars['File'];
  /** blob mime type */
  mimeType: Scalars['String'];
  /** source where file can be retrieved from */
  source?: InputMaybe<Scalars['String']>;
};

export type CreateDocumentMutationVariables = Exact<{
  input: CreateDocumentInput;
}>;


export type CreateDocumentMutation = { __typename?: 'Mutation', createDocument: { __typename?: 'Document', id: string } };

export type UploadBlobMutationVariables = Exact<{
  blob: UploadBlobInput;
}>;


export type UploadBlobMutation = { __typename?: 'Mutation', uploadBlob: { __typename?: 'BlobInfo', hash: string } };

export type GetDocumentInfoQueryVariables = Exact<{
  documentId: Scalars['ID'];
}>;


export type GetDocumentInfoQuery = { __typename?: 'Query', document: { __typename?: 'Document', id: string, type: DocumentType, createdAt: Date, updatedAt: Date, deletedAt?: Date | null, visibility: DocumentVisibility, meta: { __typename?: 'DocumentMeta', title?: string | null, description?: string | null, pageCount?: number | null, outline?: any | null }, cover?: { __typename?: 'BlobInfo', url?: string | null, blob?: Blob | null } | null } };

export type UpdateDocumentMutationVariables = Exact<{
  document: UpdateDocumentInput;
}>;


export type UpdateDocumentMutation = { __typename?: 'Mutation', updateDocument: { __typename?: 'Document', id: string, type: DocumentType, createdAt: Date, updatedAt: Date, deletedAt?: Date | null, visibility: DocumentVisibility, meta: { __typename?: 'DocumentMeta', title?: string | null, description?: string | null, pageCount?: number | null, outline?: any | null }, cover?: { __typename?: 'BlobInfo', url?: string | null, blob?: Blob | null } | null } };

export type DeleteDocumentMutationVariables = Exact<{
  documentId: Scalars['ID'];
}>;


export type DeleteDocumentMutation = { __typename?: 'Mutation', deleteDocument: { __typename?: 'Document', id: string } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'Account', id: string, documents: Array<{ __typename?: 'DocumentMember', id: string, document: { __typename?: 'Document', id: string } }> } };

export type GetDocumentHighlightsQueryVariables = Exact<{
  documentId: Scalars['ID'];
}>;


export type GetDocumentHighlightsQuery = { __typename?: 'Query', document: { __typename?: 'Document', id: string, highlights: Array<{ __typename?: 'DocumentHighlight', id: string, sequence: string, createdAt: Date, updatedAt: Date, color: HighlightColor, content?: any | null, location: any, createdBy: { __typename?: 'AccountInfo', id: string, name?: string | null }, image?: { __typename?: 'BlobInfo', url?: string | null, blob?: Blob | null } | null, document: { __typename?: 'Document', id: string } }> } };

export type DeleteDocumentHighlightMutationVariables = Exact<{
  highlightId: Scalars['ID'];
}>;


export type DeleteDocumentHighlightMutation = { __typename?: 'Mutation', deleteDocumentHighlight: { __typename?: 'DocumentHighlight', id: string } };

export type CreateDocumentHighlightMutationVariables = Exact<{
  highlight: CreateDocumentHighlightInput;
}>;


export type CreateDocumentHighlightMutation = { __typename?: 'Mutation', createDocumentHighlight: { __typename?: 'DocumentHighlight', id: string, sequence: string, createdAt: Date, updatedAt: Date, color: HighlightColor, content?: any | null, location: any, createdBy: { __typename?: 'AccountInfo', id: string, name?: string | null }, image?: { __typename?: 'BlobInfo', url?: string | null, blob?: Blob | null } | null, document: { __typename?: 'Document', id: string } } };

export type UpdateDocumentHighlightMutationVariables = Exact<{
  highlight: UpdateDocumentHighlightInput;
}>;


export type UpdateDocumentHighlightMutation = { __typename?: 'Mutation', updateDocumentHighlight: { __typename?: 'DocumentHighlight', id: string, sequence: string, createdAt: Date, updatedAt: Date, color: HighlightColor, content?: any | null, location: any, createdBy: { __typename?: 'AccountInfo', id: string, name?: string | null }, image?: { __typename?: 'BlobInfo', url?: string | null, blob?: Blob | null } | null, document: { __typename?: 'Document', id: string } } };

export type GetDocumentInfoWithFileQueryVariables = Exact<{
  documentId: Scalars['ID'];
}>;


export type GetDocumentInfoWithFileQuery = { __typename?: 'Query', document: { __typename?: 'Document', id: string, type: DocumentType, createdAt: Date, updatedAt: Date, deletedAt?: Date | null, visibility: DocumentVisibility, file: { __typename?: 'BlobInfo', hash: string, url?: string | null, blob?: Blob | null }, meta: { __typename?: 'DocumentMeta', title?: string | null, description?: string | null, pageCount?: number | null, outline?: any | null }, cover?: { __typename?: 'BlobInfo', url?: string | null, blob?: Blob | null } | null } };

export type DocumentInfoFragmentFragment = { __typename?: 'Document', id: string, type: DocumentType, createdAt: Date, updatedAt: Date, deletedAt?: Date | null, visibility: DocumentVisibility, meta: { __typename?: 'DocumentMeta', title?: string | null, description?: string | null, pageCount?: number | null, outline?: any | null }, cover?: { __typename?: 'BlobInfo', url?: string | null, blob?: Blob | null } | null };

export type DocumentHighlightFragmentFragment = { __typename?: 'DocumentHighlight', id: string, sequence: string, createdAt: Date, updatedAt: Date, color: HighlightColor, content?: any | null, location: any, createdBy: { __typename?: 'AccountInfo', id: string, name?: string | null }, image?: { __typename?: 'BlobInfo', url?: string | null, blob?: Blob | null } | null, document: { __typename?: 'Document', id: string } };

export const DocumentInfoFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DocumentInfoFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Document"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"pageCount"}},{"kind":"Field","name":{"kind":"Name","value":"outline"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cover"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"blob"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}}]}}]} as unknown as DocumentNode<DocumentInfoFragmentFragment, unknown>;
export const DocumentHighlightFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DocumentHighlightFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DocumentHighlight"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sequence"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"blob"}}]}},{"kind":"Field","name":{"kind":"Name","value":"document"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DocumentHighlightFragmentFragment, unknown>;
export const CreateDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createDocument"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateDocumentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createDocument"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"document"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateDocumentMutation, CreateDocumentMutationVariables>;
export const UploadBlobDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"uploadBlob"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"blob"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UploadBlobInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uploadBlob"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"blob"},"value":{"kind":"Variable","name":{"kind":"Name","value":"blob"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hash"}}]}}]}}]} as unknown as DocumentNode<UploadBlobMutation, UploadBlobMutationVariables>;
export const GetDocumentInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getDocumentInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"live"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"document"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DocumentInfoFragment"}}]}}]}},...DocumentInfoFragmentFragmentDoc.definitions]} as unknown as DocumentNode<GetDocumentInfoQuery, GetDocumentInfoQueryVariables>;
export const UpdateDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateDocument"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"document"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateDocumentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateDocument"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"document"},"value":{"kind":"Variable","name":{"kind":"Name","value":"document"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DocumentInfoFragment"}}]}}]}},...DocumentInfoFragmentFragmentDoc.definitions]} as unknown as DocumentNode<UpdateDocumentMutation, UpdateDocumentMutationVariables>;
export const DeleteDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteDocument"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteDocument"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeleteDocumentMutation, DeleteDocumentMutationVariables>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"me"},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"live"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"document"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const GetDocumentHighlightsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getDocumentHighlights"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"live"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"document"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"highlights"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DocumentHighlightFragment"}}]}}]}}]}},...DocumentHighlightFragmentFragmentDoc.definitions]} as unknown as DocumentNode<GetDocumentHighlightsQuery, GetDocumentHighlightsQueryVariables>;
export const DeleteDocumentHighlightDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteDocumentHighlight"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"highlightId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteDocumentHighlight"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"highlightId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeleteDocumentHighlightMutation, DeleteDocumentHighlightMutationVariables>;
export const CreateDocumentHighlightDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createDocumentHighlight"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"highlight"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateDocumentHighlightInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createDocumentHighlight"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"highlight"},"value":{"kind":"Variable","name":{"kind":"Name","value":"highlight"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DocumentHighlightFragment"}}]}}]}},...DocumentHighlightFragmentFragmentDoc.definitions]} as unknown as DocumentNode<CreateDocumentHighlightMutation, CreateDocumentHighlightMutationVariables>;
export const UpdateDocumentHighlightDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateDocumentHighlight"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"highlight"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateDocumentHighlightInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateDocumentHighlight"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"highlight"},"value":{"kind":"Variable","name":{"kind":"Name","value":"highlight"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DocumentHighlightFragment"}}]}}]}},...DocumentHighlightFragmentFragmentDoc.definitions]} as unknown as DocumentNode<UpdateDocumentHighlightMutation, UpdateDocumentHighlightMutationVariables>;
export const GetDocumentInfoWithFileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getDocumentInfoWithFile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"live"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"document"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DocumentInfoFragment"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hash"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"blob"}}]}}]}}]}},...DocumentInfoFragmentFragmentDoc.definitions]} as unknown as DocumentNode<GetDocumentInfoWithFileQuery, GetDocumentInfoWithFileQueryVariables>;