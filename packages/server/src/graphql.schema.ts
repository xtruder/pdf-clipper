import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { DeepPartial } from './types';
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
  /** URL of image associated with highlight */
  image?: Maybe<Scalars['String']>;
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
  outline?: InputMaybe<Scalars['JSON']>;
  /** number of pages in document */
  pageCount?: InputMaybe<Scalars['Int']>;
  /** title of the document */
  title?: InputMaybe<Scalars['String']>;
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
  /** image assocaited with highlight */
  image?: InputMaybe<Scalars['Upload']>;
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
  Account: ResolverTypeWrapper<DeepPartial<Account>>;
  AccountDocument: ResolverTypeWrapper<DeepPartial<AccountDocument>>;
  AccountInfo: ResolverTypeWrapper<DeepPartial<AccountInfo>>;
  AccountUpdateInput: ResolverTypeWrapper<DeepPartial<AccountUpdateInput>>;
  Boolean: ResolverTypeWrapper<DeepPartial<Scalars['Boolean']>>;
  DateTime: ResolverTypeWrapper<DeepPartial<Scalars['DateTime']>>;
  Document: ResolverTypeWrapper<DeepPartial<Document>>;
  DocumentChange: ResolverTypeWrapper<DeepPartial<DocumentChange>>;
  DocumentHighlight: ResolverTypeWrapper<DeepPartial<DocumentHighlight>>;
  DocumentHighlightChange: ResolverTypeWrapper<DeepPartial<DocumentHighlightChange>>;
  DocumentMember: ResolverTypeWrapper<DeepPartial<DocumentMember>>;
  DocumentMemberChange: ResolverTypeWrapper<DeepPartial<DocumentMemberChange>>;
  DocumentMemberInput: ResolverTypeWrapper<DeepPartial<DocumentMemberInput>>;
  DocumentMeta: ResolverTypeWrapper<DeepPartial<DocumentMeta>>;
  DocumentMetaInput: ResolverTypeWrapper<DeepPartial<DocumentMetaInput>>;
  DocumentReadingInfo: ResolverTypeWrapper<DeepPartial<DocumentReadingInfo>>;
  DocumentRole: ResolverTypeWrapper<DeepPartial<DocumentRole>>;
  DocumentType: ResolverTypeWrapper<DeepPartial<DocumentType>>;
  FileInfo: ResolverTypeWrapper<DeepPartial<FileInfo>>;
  Float: ResolverTypeWrapper<DeepPartial<Scalars['Float']>>;
  HighlightColor: ResolverTypeWrapper<DeepPartial<HighlightColor>>;
  ID: ResolverTypeWrapper<DeepPartial<Scalars['ID']>>;
  Int: ResolverTypeWrapper<DeepPartial<Scalars['Int']>>;
  JSON: ResolverTypeWrapper<DeepPartial<Scalars['JSON']>>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<DeepPartial<Scalars['String']>>;
  Subscription: ResolverTypeWrapper<{}>;
  Upload: ResolverTypeWrapper<DeepPartial<Scalars['Upload']>>;
  UpsertDocumentHighlightInput: ResolverTypeWrapper<DeepPartial<UpsertDocumentHighlightInput>>;
  UpsertDocumentInput: ResolverTypeWrapper<DeepPartial<UpsertDocumentInput>>;
  UpsertFileInput: ResolverTypeWrapper<DeepPartial<UpsertFileInput>>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Account: DeepPartial<Account>;
  AccountDocument: DeepPartial<AccountDocument>;
  AccountInfo: DeepPartial<AccountInfo>;
  AccountUpdateInput: DeepPartial<AccountUpdateInput>;
  Boolean: DeepPartial<Scalars['Boolean']>;
  DateTime: DeepPartial<Scalars['DateTime']>;
  Document: DeepPartial<Document>;
  DocumentChange: DeepPartial<DocumentChange>;
  DocumentHighlight: DeepPartial<DocumentHighlight>;
  DocumentHighlightChange: DeepPartial<DocumentHighlightChange>;
  DocumentMember: DeepPartial<DocumentMember>;
  DocumentMemberChange: DeepPartial<DocumentMemberChange>;
  DocumentMemberInput: DeepPartial<DocumentMemberInput>;
  DocumentMeta: DeepPartial<DocumentMeta>;
  DocumentMetaInput: DeepPartial<DocumentMetaInput>;
  DocumentReadingInfo: DeepPartial<DocumentReadingInfo>;
  FileInfo: DeepPartial<FileInfo>;
  Float: DeepPartial<Scalars['Float']>;
  ID: DeepPartial<Scalars['ID']>;
  Int: DeepPartial<Scalars['Int']>;
  JSON: DeepPartial<Scalars['JSON']>;
  Mutation: {};
  Query: {};
  String: DeepPartial<Scalars['String']>;
  Subscription: {};
  Upload: DeepPartial<Scalars['Upload']>;
  UpsertDocumentHighlightInput: DeepPartial<UpsertDocumentHighlightInput>;
  UpsertDocumentInput: DeepPartial<UpsertDocumentInput>;
  UpsertFileInput: DeepPartial<UpsertFileInput>;
}>;

export type ConstraintDirectiveArgs = {
  contains?: Maybe<Scalars['String']>;
  endsWith?: Maybe<Scalars['String']>;
  exclusiveMax?: Maybe<Scalars['Float']>;
  exclusiveMin?: Maybe<Scalars['Float']>;
  format?: Maybe<Scalars['String']>;
  max?: Maybe<Scalars['Float']>;
  maxLength?: Maybe<Scalars['Int']>;
  min?: Maybe<Scalars['Float']>;
  minLength?: Maybe<Scalars['Int']>;
  multipleOf?: Maybe<Scalars['Float']>;
  notContains?: Maybe<Scalars['String']>;
  pattern?: Maybe<Scalars['String']>;
  startsWith?: Maybe<Scalars['String']>;
  uniqueTypeName?: Maybe<Scalars['String']>;
};

export type ConstraintDirectiveResolver<Result, Parent, ContextType = any, Args = ConstraintDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AccountResolvers<ContextType = any, ParentType extends ResolversParentTypes['Account'] = ResolversParentTypes['Account']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  deletedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  documents?: Resolver<Array<ResolversTypes['AccountDocument']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AccountDocumentResolvers<ContextType = any, ParentType extends ResolversParentTypes['AccountDocument'] = ResolversParentTypes['AccountDocument']> = ResolversObject<{
  acceptedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  createdBy?: Resolver<ResolversTypes['AccountInfo'], ParentType, ContextType>;
  document?: Resolver<Maybe<ResolversTypes['Document']>, ParentType, ContextType>;
  role?: Resolver<ResolversTypes['DocumentRole'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AccountInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['AccountInfo'] = ResolversParentTypes['AccountInfo']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type DocumentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Document'] = ResolversParentTypes['Document']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  createdBy?: Resolver<ResolversTypes['AccountInfo'], ParentType, ContextType>;
  deletedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  file?: Resolver<Maybe<ResolversTypes['FileInfo']>, ParentType, ContextType>;
  highlights?: Resolver<Array<ResolversTypes['DocumentHighlight']>, ParentType, ContextType, Partial<DocumentHighlightsArgs>>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  members?: Resolver<Array<ResolversTypes['DocumentMember']>, ParentType, ContextType>;
  meta?: Resolver<ResolversTypes['DocumentMeta'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['DocumentType'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DocumentChangeResolvers<ContextType = any, ParentType extends ResolversParentTypes['DocumentChange'] = ResolversParentTypes['DocumentChange']> = ResolversObject<{
  deleted?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  highlights?: Resolver<Maybe<Array<ResolversTypes['DocumentHighlightChange']>>, ParentType, ContextType>;
  members?: Resolver<Maybe<Array<ResolversTypes['DocumentMemberChange']>>, ParentType, ContextType>;
  meta?: Resolver<Maybe<ResolversTypes['DocumentMeta']>, ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DocumentHighlightResolvers<ContextType = any, ParentType extends ResolversParentTypes['DocumentHighlight'] = ResolversParentTypes['DocumentHighlight']> = ResolversObject<{
  content?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  createdBy?: Resolver<ResolversTypes['AccountInfo'], ParentType, ContextType>;
  deletedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  location?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DocumentHighlightChangeResolvers<ContextType = any, ParentType extends ResolversParentTypes['DocumentHighlightChange'] = ResolversParentTypes['DocumentHighlightChange']> = ResolversObject<{
  content?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  createdBy?: Resolver<ResolversTypes['AccountInfo'], ParentType, ContextType>;
  deleted?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  location?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DocumentMemberResolvers<ContextType = any, ParentType extends ResolversParentTypes['DocumentMember'] = ResolversParentTypes['DocumentMember']> = ResolversObject<{
  acceptedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  account?: Resolver<ResolversTypes['AccountInfo'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  createdBy?: Resolver<ResolversTypes['AccountInfo'], ParentType, ContextType>;
  role?: Resolver<ResolversTypes['DocumentRole'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DocumentMemberChangeResolvers<ContextType = any, ParentType extends ResolversParentTypes['DocumentMemberChange'] = ResolversParentTypes['DocumentMemberChange']> = ResolversObject<{
  accepted?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  accountId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  createdBy?: Resolver<ResolversTypes['AccountInfo'], ParentType, ContextType>;
  deleted?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  role?: Resolver<Maybe<ResolversTypes['DocumentRole']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DocumentMetaResolvers<ContextType = any, ParentType extends ResolversParentTypes['DocumentMeta'] = ResolversParentTypes['DocumentMeta']> = ResolversObject<{
  author?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  cover?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  keywords?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  pageCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DocumentReadingInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['DocumentReadingInfo'] = ResolversParentTypes['DocumentReadingInfo']> = ResolversObject<{
  account?: Resolver<ResolversTypes['AccountInfo'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  deletedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  lastPage?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  screenshot?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FileInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['FileInfo'] = ResolversParentTypes['FileInfo']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  createdBy?: Resolver<ResolversTypes['AccountInfo'], ParentType, ContextType>;
  hash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  mimeType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sources?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  removeMeFromDocument?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationRemoveMeFromDocumentArgs, 'documentId'>>;
  updateAccount?: Resolver<ResolversTypes['Account'], ParentType, ContextType, RequireFields<MutationUpdateAccountArgs, 'account'>>;
  uploadFile?: Resolver<ResolversTypes['FileInfo'], ParentType, ContextType, RequireFields<MutationUploadFileArgs, 'file'>>;
  upsertDocument?: Resolver<ResolversTypes['Document'], ParentType, ContextType, RequireFields<MutationUpsertDocumentArgs, 'document'>>;
  upsertDocumentHighlight?: Resolver<ResolversTypes['DocumentHighlight'], ParentType, ContextType, RequireFields<MutationUpsertDocumentHighlightArgs, 'documentId' | 'highlight'>>;
  upsertFileInfo?: Resolver<ResolversTypes['FileInfo'], ParentType, ContextType, Partial<MutationUpsertFileInfoArgs>>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  account?: Resolver<Maybe<ResolversTypes['Account']>, ParentType, ContextType, RequireFields<QueryAccountArgs, 'id'>>;
  currentAccount?: Resolver<Maybe<ResolversTypes['Account']>, ParentType, ContextType>;
  document?: Resolver<Maybe<ResolversTypes['Document']>, ParentType, ContextType, RequireFields<QueryDocumentArgs, 'id'>>;
  fileInfo?: Resolver<Maybe<ResolversTypes['FileInfo']>, ParentType, ContextType, RequireFields<QueryFileInfoArgs, 'fileHash'>>;
}>;

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  accountDocumentUpdates?: SubscriptionResolver<ResolversTypes['AccountDocument'], "accountDocumentUpdates", ParentType, ContextType, RequireFields<SubscriptionAccountDocumentUpdatesArgs, 'accountId'>>;
  documentChanges?: SubscriptionResolver<Maybe<ResolversTypes['DocumentChange']>, "documentChanges", ParentType, ContextType, RequireFields<SubscriptionDocumentChangesArgs, 'id'>>;
}>;

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload';
}

export type Resolvers<ContextType = any> = ResolversObject<{
  Account?: AccountResolvers<ContextType>;
  AccountDocument?: AccountDocumentResolvers<ContextType>;
  AccountInfo?: AccountInfoResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Document?: DocumentResolvers<ContextType>;
  DocumentChange?: DocumentChangeResolvers<ContextType>;
  DocumentHighlight?: DocumentHighlightResolvers<ContextType>;
  DocumentHighlightChange?: DocumentHighlightChangeResolvers<ContextType>;
  DocumentMember?: DocumentMemberResolvers<ContextType>;
  DocumentMemberChange?: DocumentMemberChangeResolvers<ContextType>;
  DocumentMeta?: DocumentMetaResolvers<ContextType>;
  DocumentReadingInfo?: DocumentReadingInfoResolvers<ContextType>;
  FileInfo?: FileInfoResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  Upload?: GraphQLScalarType;
}>;

export type DirectiveResolvers<ContextType = any> = ResolversObject<{
  constraint?: ConstraintDirectiveResolver<any, any, ContextType>;
}>;
