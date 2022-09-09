import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
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
  DateTime: Date;
  JSON: any;
  Upload: any;
};

export type Account = {
  __typename?: 'Account';
  /** Account creation time */
  createdAt: Scalars['DateTime'];
  /** Account deletion time */
  deletedAt?: Maybe<Scalars['DateTime']>;
  /** list of documents associated with account */
  documents: Array<DocumentMember>;
  /** Account ID */
  id: Scalars['ID'];
  /** Optional account name */
  name?: Maybe<Scalars['String']>;
  /** Account last update time */
  updatedAt: Scalars['DateTime'];
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

export type Document = {
  __typename?: 'Document';
  /** document creation time */
  createdAt: Scalars['DateTime'];
  /** account that created document */
  createdBy: AccountInfo;
  /** document deletion time */
  deletedAt?: Maybe<Scalars['DateTime']>;
  /** file associated with document */
  file?: Maybe<BlobInfo>;
  /** list of highlights associated with document */
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


export type DocumentHighlightsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
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

export type DocumentHighlightInput = {
  /** content associated with highlight serialized as JSON */
  content?: InputMaybe<Scalars['JSON']>;
  /** whether highlight has been deleted */
  deleted?: InputMaybe<Scalars['Boolean']>;
  /** id of the document that highlight is associated with */
  documentID: Scalars['ID'];
  /** unique highlight id */
  id: Scalars['ID'];
  /** location of a highlight serialized as JSON */
  location?: InputMaybe<Scalars['JSON']>;
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
  /** url of document cover image */
  cover?: Maybe<Scalars['String']>;
  /** document description */
  description?: Maybe<Scalars['String']>;
  /** keywords associated with document */
  keywords?: Maybe<Array<Scalars['String']>>;
  /** outline associated with document */
  outline?: Maybe<DocumentOutline>;
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

/** outline of the document */
export type DocumentOutline = {
  __typename?: 'DocumentOutline';
  items: Array<OutlineNode>;
};

export type DocumentOutlineInput = {
  items: Array<OutlineNodeInput>;
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
  /** updates account */
  updateAccount: Account;
  /** uploads blob and returns blob information */
  uploadBlob: BlobInfo;
  /** creates or updates a document */
  upsertDocument: Document;
  /** creates or updates document highlight */
  upsertDocumentHighlight: DocumentHighlight;
  /** creates or updates document member */
  upsertDocumentMember: DocumentHighlight;
};


export type MutationUpdateAccountArgs = {
  account: AccountUpdateInput;
};


export type MutationUploadBlobArgs = {
  blob: UploadBlobInput;
};


export type MutationUpsertDocumentArgs = {
  document: UpsertDocumentInput;
};


export type MutationUpsertDocumentHighlightArgs = {
  highlight: DocumentHighlightInput;
};


export type MutationUpsertDocumentMemberArgs = {
  member: DocumentMemberInput;
};

export type OutlineNode = {
  __typename?: 'OutlineNode';
  /** list of children outline nodes */
  children?: Maybe<Array<OutlineNode>>;
  /** sequential index of the outline node */
  index: Scalars['Int'];
  /** location of the outline based on document type */
  location: Scalars['JSON'];
  /** outline node title */
  title: Scalars['String'];
};

export type OutlineNodeInput = {
  /** list of children outline nodes */
  children?: InputMaybe<Array<OutlineNodeInput>>;
  /** sequential index of the outline node */
  index: Scalars['Int'];
  /** location of the outline based on document type */
  location: Scalars['JSON'];
  /** outline node title */
  title: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  /** gets account by ID */
  account: Account;
  blobInfo: BlobInfo;
  /** returns information about current account */
  currentAccount: Account;
  /** gets document by ID */
  document: Document;
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

export type UploadBlobInput = {
  /** blob to upload */
  blob?: InputMaybe<Scalars['Upload']>;
  /** blob mime type */
  mimeType?: InputMaybe<Scalars['String']>;
  /** source where file can be retrieved from */
  source?: InputMaybe<Scalars['String']>;
};

export type UpsertDocumentInput = {
  /** hash of file associated with document */
  fileHash?: InputMaybe<Scalars['String']>;
  /** unique document ID */
  id: Scalars['ID'];
  /** metadata associates with document */
  meta?: InputMaybe<DocumentMetaInput>;
  /** type of the document */
  type?: InputMaybe<DocumentType>;
  /** update document visibility */
  visibility?: InputMaybe<DocumentVisibility>;
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
  AccountInfo: ResolverTypeWrapper<AccountInfo>;
  AccountUpdateInput: AccountUpdateInput;
  BlobInfo: ResolverTypeWrapper<BlobInfo>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  Document: ResolverTypeWrapper<Document>;
  DocumentHighlight: ResolverTypeWrapper<DocumentHighlight>;
  DocumentHighlightInput: DocumentHighlightInput;
  DocumentMember: ResolverTypeWrapper<DocumentMember>;
  DocumentMemberInput: DocumentMemberInput;
  DocumentMeta: ResolverTypeWrapper<DocumentMeta>;
  DocumentMetaInput: DocumentMetaInput;
  DocumentOutline: ResolverTypeWrapper<DocumentOutline>;
  DocumentOutlineInput: DocumentOutlineInput;
  DocumentRole: DocumentRole;
  DocumentType: DocumentType;
  DocumentVisibility: DocumentVisibility;
  HighlightColor: HighlightColor;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']>;
  Mutation: ResolverTypeWrapper<{}>;
  OutlineNode: ResolverTypeWrapper<OutlineNode>;
  OutlineNodeInput: OutlineNodeInput;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Upload: ResolverTypeWrapper<Scalars['Upload']>;
  UploadBlobInput: UploadBlobInput;
  UpsertDocumentInput: UpsertDocumentInput;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Account: Account;
  AccountInfo: AccountInfo;
  AccountUpdateInput: AccountUpdateInput;
  BlobInfo: BlobInfo;
  Boolean: Scalars['Boolean'];
  DateTime: Scalars['DateTime'];
  Document: Document;
  DocumentHighlight: DocumentHighlight;
  DocumentHighlightInput: DocumentHighlightInput;
  DocumentMember: DocumentMember;
  DocumentMemberInput: DocumentMemberInput;
  DocumentMeta: DocumentMeta;
  DocumentMetaInput: DocumentMetaInput;
  DocumentOutline: DocumentOutline;
  DocumentOutlineInput: DocumentOutlineInput;
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  JSON: Scalars['JSON'];
  Mutation: {};
  OutlineNode: OutlineNode;
  OutlineNodeInput: OutlineNodeInput;
  Query: {};
  String: Scalars['String'];
  Upload: Scalars['Upload'];
  UploadBlobInput: UploadBlobInput;
  UpsertDocumentInput: UpsertDocumentInput;
}>;

export type LiveDirectiveArgs = {
  if?: Maybe<Scalars['Boolean']>;
  throttle?: Maybe<Scalars['Int']>;
};

export type LiveDirectiveResolver<Result, Parent, ContextType = any, Args = LiveDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AccountResolvers<ContextType = any, ParentType extends ResolversParentTypes['Account'] = ResolversParentTypes['Account']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  deletedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
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

export type BlobInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['BlobInfo'] = ResolversParentTypes['BlobInfo']> = ResolversObject<{
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
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  createdBy?: Resolver<ResolversTypes['AccountInfo'], ParentType, ContextType>;
  deletedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  file?: Resolver<Maybe<ResolversTypes['BlobInfo']>, ParentType, ContextType>;
  highlights?: Resolver<Array<ResolversTypes['DocumentHighlight']>, ParentType, ContextType, Partial<DocumentHighlightsArgs>>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  members?: Resolver<Array<ResolversTypes['DocumentMember']>, ParentType, ContextType>;
  meta?: Resolver<ResolversTypes['DocumentMeta'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['DocumentType'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  visibility?: Resolver<ResolversTypes['DocumentVisibility'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DocumentHighlightResolvers<ContextType = any, ParentType extends ResolversParentTypes['DocumentHighlight'] = ResolversParentTypes['DocumentHighlight']> = ResolversObject<{
  content?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  createdBy?: Resolver<ResolversTypes['AccountInfo'], ParentType, ContextType>;
  deletedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  location?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DocumentMemberResolvers<ContextType = any, ParentType extends ResolversParentTypes['DocumentMember'] = ResolversParentTypes['DocumentMember']> = ResolversObject<{
  acceptedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  account?: Resolver<ResolversTypes['AccountInfo'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  createdBy?: Resolver<ResolversTypes['AccountInfo'], ParentType, ContextType>;
  document?: Resolver<ResolversTypes['Document'], ParentType, ContextType>;
  role?: Resolver<ResolversTypes['DocumentRole'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DocumentMetaResolvers<ContextType = any, ParentType extends ResolversParentTypes['DocumentMeta'] = ResolversParentTypes['DocumentMeta']> = ResolversObject<{
  author?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  cover?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  keywords?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  outline?: Resolver<Maybe<ResolversTypes['DocumentOutline']>, ParentType, ContextType>;
  pageCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DocumentOutlineResolvers<ContextType = any, ParentType extends ResolversParentTypes['DocumentOutline'] = ResolversParentTypes['DocumentOutline']> = ResolversObject<{
  items?: Resolver<Array<ResolversTypes['OutlineNode']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  updateAccount?: Resolver<ResolversTypes['Account'], ParentType, ContextType, RequireFields<MutationUpdateAccountArgs, 'account'>>;
  uploadBlob?: Resolver<ResolversTypes['BlobInfo'], ParentType, ContextType, RequireFields<MutationUploadBlobArgs, 'blob'>>;
  upsertDocument?: Resolver<ResolversTypes['Document'], ParentType, ContextType, RequireFields<MutationUpsertDocumentArgs, 'document'>>;
  upsertDocumentHighlight?: Resolver<ResolversTypes['DocumentHighlight'], ParentType, ContextType, RequireFields<MutationUpsertDocumentHighlightArgs, 'highlight'>>;
  upsertDocumentMember?: Resolver<ResolversTypes['DocumentHighlight'], ParentType, ContextType, RequireFields<MutationUpsertDocumentMemberArgs, 'member'>>;
}>;

export type OutlineNodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['OutlineNode'] = ResolversParentTypes['OutlineNode']> = ResolversObject<{
  children?: Resolver<Maybe<Array<ResolversTypes['OutlineNode']>>, ParentType, ContextType>;
  index?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  location?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  account?: Resolver<ResolversTypes['Account'], ParentType, ContextType, RequireFields<QueryAccountArgs, 'id'>>;
  blobInfo?: Resolver<ResolversTypes['BlobInfo'], ParentType, ContextType, RequireFields<QueryBlobInfoArgs, 'hash'>>;
  currentAccount?: Resolver<ResolversTypes['Account'], ParentType, ContextType>;
  document?: Resolver<ResolversTypes['Document'], ParentType, ContextType, RequireFields<QueryDocumentArgs, 'id'>>;
}>;

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload';
}

export type Resolvers<ContextType = any> = ResolversObject<{
  Account?: AccountResolvers<ContextType>;
  AccountInfo?: AccountInfoResolvers<ContextType>;
  BlobInfo?: BlobInfoResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Document?: DocumentResolvers<ContextType>;
  DocumentHighlight?: DocumentHighlightResolvers<ContextType>;
  DocumentMember?: DocumentMemberResolvers<ContextType>;
  DocumentMeta?: DocumentMetaResolvers<ContextType>;
  DocumentOutline?: DocumentOutlineResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  OutlineNode?: OutlineNodeResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Upload?: GraphQLScalarType;
}>;

export type DirectiveResolvers<ContextType = any> = ResolversObject<{
  live?: LiveDirectiveResolver<any, any, ContextType>;
}>;
