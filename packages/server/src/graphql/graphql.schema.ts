import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Blob: any;
  DateTime: Date;
  File: File;
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
  id?: InputMaybe<Scalars['ID']>;
  /** hash of the image associated with document highlight */
  imageHash?: InputMaybe<Scalars['String']>;
  /** location of a highlight serialized as JSON */
  location: Scalars['JSON'];
  /** sequential document highlight index */
  sequence: Scalars['String'];
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

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Account: ResolverTypeWrapper<Account>;
  AccountCreateInput: AccountCreateInput;
  AccountInfo: ResolverTypeWrapper<AccountInfo>;
  AccountUpdateInput: AccountUpdateInput;
  Blob: ResolverTypeWrapper<Scalars['Blob']>;
  BlobInfo: ResolverTypeWrapper<BlobInfo>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  CreateDocumentHighlightInput: CreateDocumentHighlightInput;
  CreateDocumentInput: CreateDocumentInput;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  Document: ResolverTypeWrapper<Document>;
  DocumentHighlight: ResolverTypeWrapper<DocumentHighlight>;
  DocumentMember: ResolverTypeWrapper<DocumentMember>;
  DocumentMemberInput: DocumentMemberInput;
  DocumentMeta: ResolverTypeWrapper<DocumentMeta>;
  DocumentMetaInput: DocumentMetaInput;
  DocumentRole: DocumentRole;
  DocumentType: DocumentType;
  DocumentVisibility: DocumentVisibility;
  File: ResolverTypeWrapper<Scalars['File']>;
  HighlightColor: HighlightColor;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']>;
  Mutation: ResolverTypeWrapper<{}>;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  UpdateDocumentHighlightInput: UpdateDocumentHighlightInput;
  UpdateDocumentInput: UpdateDocumentInput;
  UploadBlobInput: UploadBlobInput;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Account: Account;
  AccountCreateInput: AccountCreateInput;
  AccountInfo: AccountInfo;
  AccountUpdateInput: AccountUpdateInput;
  Blob: Scalars['Blob'];
  BlobInfo: BlobInfo;
  Boolean: Scalars['Boolean'];
  CreateDocumentHighlightInput: CreateDocumentHighlightInput;
  CreateDocumentInput: CreateDocumentInput;
  DateTime: Scalars['DateTime'];
  Document: Document;
  DocumentHighlight: DocumentHighlight;
  DocumentMember: DocumentMember;
  DocumentMemberInput: DocumentMemberInput;
  DocumentMeta: DocumentMeta;
  DocumentMetaInput: DocumentMetaInput;
  File: Scalars['File'];
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  JSON: Scalars['JSON'];
  Mutation: {};
  PageInfo: PageInfo;
  Query: {};
  String: Scalars['String'];
  UpdateDocumentHighlightInput: UpdateDocumentHighlightInput;
  UpdateDocumentInput: UpdateDocumentInput;
  UploadBlobInput: UploadBlobInput;
}>;

export type LiveDirectiveArgs = {
  if?: Maybe<Scalars['Boolean']>;
  throttle?: Maybe<Scalars['Int']>;
};

export type LiveDirectiveResolver<Result, Parent, ContextType = any, Args = LiveDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AccountResolvers<ContextType = any, ParentType extends ResolversParentTypes['Account'] = ResolversParentTypes['Account']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  documents?: Resolver<Array<ResolversTypes['DocumentMember']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AccountInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['AccountInfo'] = ResolversParentTypes['AccountInfo']> = ResolversObject<{
  deleted?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface BlobScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Blob'], any> {
  name: 'Blob';
}

export type BlobInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['BlobInfo'] = ResolversParentTypes['BlobInfo']> = ResolversObject<{
  blob?: Resolver<Maybe<ResolversTypes['Blob']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  createdBy?: Resolver<ResolversTypes['AccountInfo'], ParentType, ContextType>;
  hash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  mimeType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  size?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  source?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type DocumentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Document'] = ResolversParentTypes['Document']> = ResolversObject<{
  cover?: Resolver<Maybe<ResolversTypes['BlobInfo']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  createdBy?: Resolver<ResolversTypes['AccountInfo'], ParentType, ContextType>;
  deletedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  file?: Resolver<ResolversTypes['BlobInfo'], ParentType, ContextType>;
  highlights?: Resolver<Array<ResolversTypes['DocumentHighlight']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  members?: Resolver<Array<ResolversTypes['DocumentMember']>, ParentType, ContextType>;
  meta?: Resolver<ResolversTypes['DocumentMeta'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['DocumentType'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  visibility?: Resolver<ResolversTypes['DocumentVisibility'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DocumentHighlightResolvers<ContextType = any, ParentType extends ResolversParentTypes['DocumentHighlight'] = ResolversParentTypes['DocumentHighlight']> = ResolversObject<{
  color?: Resolver<ResolversTypes['HighlightColor'], ParentType, ContextType>;
  content?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  createdBy?: Resolver<ResolversTypes['AccountInfo'], ParentType, ContextType>;
  document?: Resolver<ResolversTypes['Document'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['BlobInfo']>, ParentType, ContextType>;
  location?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  sequence?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  thumbnail?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DocumentMemberResolvers<ContextType = any, ParentType extends ResolversParentTypes['DocumentMember'] = ResolversParentTypes['DocumentMember']> = ResolversObject<{
  acceptedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  account?: Resolver<ResolversTypes['AccountInfo'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  createdBy?: Resolver<ResolversTypes['AccountInfo'], ParentType, ContextType>;
  document?: Resolver<ResolversTypes['Document'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  role?: Resolver<ResolversTypes['DocumentRole'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DocumentMetaResolvers<ContextType = any, ParentType extends ResolversParentTypes['DocumentMeta'] = ResolversParentTypes['DocumentMeta']> = ResolversObject<{
  author?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  keywords?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  outline?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  pageCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface FileScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['File'], any> {
  name: 'File';
}

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createAccount?: Resolver<ResolversTypes['Account'], ParentType, ContextType, RequireFields<MutationCreateAccountArgs, 'account'>>;
  createDocument?: Resolver<ResolversTypes['Document'], ParentType, ContextType, RequireFields<MutationCreateDocumentArgs, 'document'>>;
  createDocumentHighlight?: Resolver<ResolversTypes['DocumentHighlight'], ParentType, ContextType, RequireFields<MutationCreateDocumentHighlightArgs, 'highlight'>>;
  deleteDocument?: Resolver<ResolversTypes['Document'], ParentType, ContextType, RequireFields<MutationDeleteDocumentArgs, 'id'>>;
  deleteDocumentHighlight?: Resolver<ResolversTypes['DocumentHighlight'], ParentType, ContextType, RequireFields<MutationDeleteDocumentHighlightArgs, 'id'>>;
  updateAccount?: Resolver<ResolversTypes['Account'], ParentType, ContextType, RequireFields<MutationUpdateAccountArgs, 'account'>>;
  updateDocument?: Resolver<ResolversTypes['Document'], ParentType, ContextType, RequireFields<MutationUpdateDocumentArgs, 'document'>>;
  updateDocumentHighlight?: Resolver<ResolversTypes['DocumentHighlight'], ParentType, ContextType, RequireFields<MutationUpdateDocumentHighlightArgs, 'highlight'>>;
  uploadBlob?: Resolver<ResolversTypes['BlobInfo'], ParentType, ContextType, RequireFields<MutationUploadBlobArgs, 'blob'>>;
  upsertDocumentMember?: Resolver<Maybe<ResolversTypes['DocumentMember']>, ParentType, ContextType, RequireFields<MutationUpsertDocumentMemberArgs, 'member'>>;
}>;

export type PageInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = ResolversObject<{
  endCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  startCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  account?: Resolver<ResolversTypes['Account'], ParentType, ContextType, RequireFields<QueryAccountArgs, 'id'>>;
  blobInfo?: Resolver<ResolversTypes['BlobInfo'], ParentType, ContextType, RequireFields<QueryBlobInfoArgs, 'hash'>>;
  document?: Resolver<ResolversTypes['Document'], ParentType, ContextType, RequireFields<QueryDocumentArgs, 'id'>>;
  me?: Resolver<ResolversTypes['Account'], ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Account?: AccountResolvers<ContextType>;
  AccountInfo?: AccountInfoResolvers<ContextType>;
  Blob?: GraphQLScalarType;
  BlobInfo?: BlobInfoResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Document?: DocumentResolvers<ContextType>;
  DocumentHighlight?: DocumentHighlightResolvers<ContextType>;
  DocumentMember?: DocumentMemberResolvers<ContextType>;
  DocumentMeta?: DocumentMetaResolvers<ContextType>;
  File?: GraphQLScalarType;
  JSON?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
}>;

export type DirectiveResolvers<ContextType = any> = ResolversObject<{
  live?: LiveDirectiveResolver<any, any, ContextType>;
}>;
