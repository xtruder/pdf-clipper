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
  UUID: string;
};

/** schema for account */
export type Account = {
  __typename?: 'Account';
  createdAt?: Maybe<Scalars['DateTime']>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['UUID'];
  name?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

/** schema for account */
export type AccountInfo = {
  __typename?: 'AccountInfo';
  id: Scalars['UUID'];
  name?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

/** schema for account */
export type AccountInfoInput = {
  id: Scalars['UUID'];
  name?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['DateTime']>;
};

export type AccountInfoUpdateResult = {
  __typename?: 'AccountInfoUpdateResult';
  /** List of errors associated with rejected documents */
  errors?: Maybe<Array<UpdateError>>;
  /** list of rejected documents, with current returned state */
  rejected: Array<AccountInfo>;
  /** list of updated documents that have been successfully processed */
  updated: Array<AccountInfo>;
};

/** schema for account */
export type AccountInput = {
  createdAt?: InputMaybe<Scalars['DateTime']>;
  deletedAt?: InputMaybe<Scalars['DateTime']>;
  id: Scalars['UUID'];
  name?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['DateTime']>;
};

export type AccountUpdateResult = {
  __typename?: 'AccountUpdateResult';
  /** List of errors associated with rejected documents */
  errors?: Maybe<Array<UpdateError>>;
  /** list of rejected documents, with current returned state */
  rejected: Array<Account>;
  /** list of updated documents that have been successfully processed */
  updated: Array<Account>;
};

/** schema for blobinfos collection */
export type BlobInfo = {
  __typename?: 'BlobInfo';
  createdAt?: Maybe<Scalars['DateTime']>;
  createdBy?: Maybe<Scalars['UUID']>;
  hash: Scalars['String'];
  local?: Maybe<Scalars['Boolean']>;
  mimeType: Scalars['String'];
  size: Scalars['Int'];
  source?: Maybe<Scalars['String']>;
  type: Scalars['String'];
  updatedAt?: Maybe<Scalars['DateTime']>;
};

/** schema for blobinfos collection */
export type BlobInfoInput = {
  createdAt?: InputMaybe<Scalars['DateTime']>;
  createdBy?: InputMaybe<Scalars['UUID']>;
  hash: Scalars['String'];
  local?: InputMaybe<Scalars['Boolean']>;
  mimeType: Scalars['String'];
  size: Scalars['Int'];
  source?: InputMaybe<Scalars['String']>;
  type: Scalars['String'];
  updatedAt?: InputMaybe<Scalars['DateTime']>;
};

export type BlobInfoUpdateResult = {
  __typename?: 'BlobInfoUpdateResult';
  /** List of errors associated with rejected documents */
  errors?: Maybe<Array<UpdateError>>;
  /** list of rejected documents, with current returned state */
  rejected: Array<BlobInfo>;
  /** list of updated documents that have been successfully processed */
  updated: Array<BlobInfo>;
};

/** schema holding documents */
export type Document = {
  __typename?: 'Document';
  createdAt?: Maybe<Scalars['DateTime']>;
  createdBy: Scalars['UUID'];
  deletedAt?: Maybe<Scalars['DateTime']>;
  fileHash?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  local?: Maybe<Scalars['Boolean']>;
  meta?: Maybe<Scalars['JSON']>;
  type: Scalars['String'];
  updatedAt?: Maybe<Scalars['DateTime']>;
};

/** schema for document highlights */
export type DocumentHighlight = {
  __typename?: 'DocumentHighlight';
  content?: Maybe<Scalars['JSON']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  createdBy?: Maybe<Scalars['UUID']>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  documentId: Scalars['UUID'];
  documentType?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  imageHash?: Maybe<Scalars['String']>;
  local?: Maybe<Scalars['Boolean']>;
  location?: Maybe<Scalars['JSON']>;
  sequence?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

/** schema for document highlights */
export type DocumentHighlightInput = {
  content?: InputMaybe<Scalars['JSON']>;
  createdAt?: InputMaybe<Scalars['DateTime']>;
  createdBy?: InputMaybe<Scalars['UUID']>;
  deletedAt?: InputMaybe<Scalars['DateTime']>;
  documentId: Scalars['UUID'];
  documentType?: InputMaybe<Scalars['String']>;
  id: Scalars['UUID'];
  imageHash?: InputMaybe<Scalars['String']>;
  local?: InputMaybe<Scalars['Boolean']>;
  location?: InputMaybe<Scalars['JSON']>;
  sequence?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['DateTime']>;
};

export type DocumentHighlightUpdateResult = {
  __typename?: 'DocumentHighlightUpdateResult';
  /** List of errors associated with rejected documents */
  errors?: Maybe<Array<UpdateError>>;
  /** list of rejected documents, with current returned state */
  rejected: Array<DocumentHighlight>;
  /** list of updated documents that have been successfully processed */
  updated: Array<DocumentHighlight>;
};

/** schema holding documents */
export type DocumentInput = {
  createdAt?: InputMaybe<Scalars['DateTime']>;
  createdBy: Scalars['UUID'];
  deletedAt?: InputMaybe<Scalars['DateTime']>;
  fileHash?: InputMaybe<Scalars['String']>;
  id: Scalars['UUID'];
  local?: InputMaybe<Scalars['Boolean']>;
  meta?: InputMaybe<Scalars['JSON']>;
  type: Scalars['String'];
  updatedAt?: InputMaybe<Scalars['DateTime']>;
};

/** schema holding account documents */
export type DocumentMember = {
  __typename?: 'DocumentMember';
  acceptedAt?: Maybe<Scalars['DateTime']>;
  accountId: Scalars['UUID'];
  createdAt?: Maybe<Scalars['DateTime']>;
  createdBy?: Maybe<Scalars['UUID']>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  documentId: Scalars['UUID'];
  id?: Maybe<Scalars['String']>;
  local?: Maybe<Scalars['Boolean']>;
  role?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

/** schema holding account documents */
export type DocumentMemberInput = {
  acceptedAt?: InputMaybe<Scalars['DateTime']>;
  accountId: Scalars['UUID'];
  createdAt?: InputMaybe<Scalars['DateTime']>;
  createdBy?: InputMaybe<Scalars['UUID']>;
  deletedAt?: InputMaybe<Scalars['DateTime']>;
  documentId: Scalars['UUID'];
  id?: InputMaybe<Scalars['String']>;
  local?: InputMaybe<Scalars['Boolean']>;
  role?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['DateTime']>;
};

export type DocumentMemberUpdateResult = {
  __typename?: 'DocumentMemberUpdateResult';
  /** List of errors associated with rejected documents */
  errors?: Maybe<Array<UpdateError>>;
  /** list of rejected documents, with current returned state */
  rejected: Array<DocumentMember>;
  /** list of updated documents that have been successfully processed */
  updated: Array<DocumentMember>;
};

export type DocumentUpdateResult = {
  __typename?: 'DocumentUpdateResult';
  /** List of errors associated with rejected documents */
  errors?: Maybe<Array<UpdateError>>;
  /** list of rejected documents, with current returned state */
  rejected: Array<Document>;
  /** list of updated documents that have been successfully processed */
  updated: Array<Document>;
};

export type Mutation = {
  __typename?: 'Mutation';
  pushAccountChanges: AccountUpdateResult;
  pushAccountInfoChanges: AccountInfoUpdateResult;
  pushBlobInfoChanges: BlobInfoUpdateResult;
  pushDocumentChanges: DocumentUpdateResult;
  pushDocumentHighlightChanges: DocumentHighlightUpdateResult;
  pushDocumentMemberChanges: DocumentMemberUpdateResult;
  pushSessionChanges: SessionUpdateResult;
};


export type MutationPushAccountChangesArgs = {
  input: Array<AccountInput>;
};


export type MutationPushAccountInfoChangesArgs = {
  input: Array<AccountInfoInput>;
};


export type MutationPushBlobInfoChangesArgs = {
  input: Array<BlobInfoInput>;
};


export type MutationPushDocumentChangesArgs = {
  input: Array<DocumentInput>;
};


export type MutationPushDocumentHighlightChangesArgs = {
  input: Array<DocumentHighlightInput>;
};


export type MutationPushDocumentMemberChangesArgs = {
  input: Array<DocumentMemberInput>;
};


export type MutationPushSessionChangesArgs = {
  input: Array<SessionInput>;
};

export type Query = {
  __typename?: 'Query';
  getAccountChanges: Array<Account>;
  getAccountInfoChanges: Array<AccountInfo>;
  getBlobInfoChanges: Array<BlobInfo>;
  getDocumentChanges: Array<Document>;
  getDocumentHighlightChanges: Array<DocumentHighlight>;
  getDocumentMemberChanges: Array<DocumentMember>;
  getSessionChanges: Array<Session>;
};


export type QueryGetAccountChangesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  since: Scalars['DateTime'];
};


export type QueryGetAccountInfoChangesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  since: Scalars['DateTime'];
};


export type QueryGetBlobInfoChangesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  since: Scalars['DateTime'];
};


export type QueryGetDocumentChangesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  since: Scalars['DateTime'];
};


export type QueryGetDocumentHighlightChangesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  since: Scalars['DateTime'];
};


export type QueryGetDocumentMemberChangesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  since: Scalars['DateTime'];
};


export type QueryGetSessionChangesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  since: Scalars['DateTime'];
};

/** schema for session */
export type Session = {
  __typename?: 'Session';
  accountId: Scalars['UUID'];
  createdAt?: Maybe<Scalars['DateTime']>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['UUID'];
  syncDocuments?: Maybe<Array<Maybe<Scalars['String']>>>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

/** schema for session */
export type SessionInput = {
  accountId: Scalars['UUID'];
  createdAt?: InputMaybe<Scalars['DateTime']>;
  deletedAt?: InputMaybe<Scalars['DateTime']>;
  id: Scalars['UUID'];
  syncDocuments?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  updatedAt?: InputMaybe<Scalars['DateTime']>;
};

export type SessionUpdateResult = {
  __typename?: 'SessionUpdateResult';
  /** List of errors associated with rejected documents */
  errors?: Maybe<Array<UpdateError>>;
  /** list of rejected documents, with current returned state */
  rejected: Array<Session>;
  /** list of updated documents that have been successfully processed */
  updated: Array<Session>;
};

export type Subscription = {
  __typename?: 'Subscription';
  syncAccountInfoUpdates: Array<AccountInfo>;
  syncAccountUpdates: Array<Account>;
  syncBlobInfoUpdates: Array<BlobInfo>;
  syncDocumentHighlightUpdates: Array<DocumentHighlight>;
  syncDocumentMemberUpdates: Array<DocumentMember>;
  syncDocumentUpdates: Array<Document>;
  syncSessionUpdates: Array<Session>;
};

export type UpdateError = {
  __typename?: 'UpdateError';
  /** Error string associated with upd */
  error?: Maybe<Scalars['String']>;
  /** Id of the resource that failed update */
  id: Scalars['String'];
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
  AccountInfoInput: AccountInfoInput;
  AccountInfoUpdateResult: ResolverTypeWrapper<AccountInfoUpdateResult>;
  AccountInput: AccountInput;
  AccountUpdateResult: ResolverTypeWrapper<AccountUpdateResult>;
  BlobInfo: ResolverTypeWrapper<BlobInfo>;
  BlobInfoInput: BlobInfoInput;
  BlobInfoUpdateResult: ResolverTypeWrapper<BlobInfoUpdateResult>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  Document: ResolverTypeWrapper<Document>;
  DocumentHighlight: ResolverTypeWrapper<DocumentHighlight>;
  DocumentHighlightInput: DocumentHighlightInput;
  DocumentHighlightUpdateResult: ResolverTypeWrapper<DocumentHighlightUpdateResult>;
  DocumentInput: DocumentInput;
  DocumentMember: ResolverTypeWrapper<DocumentMember>;
  DocumentMemberInput: DocumentMemberInput;
  DocumentMemberUpdateResult: ResolverTypeWrapper<DocumentMemberUpdateResult>;
  DocumentUpdateResult: ResolverTypeWrapper<DocumentUpdateResult>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  Session: ResolverTypeWrapper<Session>;
  SessionInput: SessionInput;
  SessionUpdateResult: ResolverTypeWrapper<SessionUpdateResult>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Subscription: ResolverTypeWrapper<{}>;
  UUID: ResolverTypeWrapper<Scalars['UUID']>;
  UpdateError: ResolverTypeWrapper<UpdateError>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Account: Account;
  AccountInfo: AccountInfo;
  AccountInfoInput: AccountInfoInput;
  AccountInfoUpdateResult: AccountInfoUpdateResult;
  AccountInput: AccountInput;
  AccountUpdateResult: AccountUpdateResult;
  BlobInfo: BlobInfo;
  BlobInfoInput: BlobInfoInput;
  BlobInfoUpdateResult: BlobInfoUpdateResult;
  Boolean: Scalars['Boolean'];
  DateTime: Scalars['DateTime'];
  Document: Document;
  DocumentHighlight: DocumentHighlight;
  DocumentHighlightInput: DocumentHighlightInput;
  DocumentHighlightUpdateResult: DocumentHighlightUpdateResult;
  DocumentInput: DocumentInput;
  DocumentMember: DocumentMember;
  DocumentMemberInput: DocumentMemberInput;
  DocumentMemberUpdateResult: DocumentMemberUpdateResult;
  DocumentUpdateResult: DocumentUpdateResult;
  Int: Scalars['Int'];
  JSON: Scalars['JSON'];
  Mutation: {};
  Query: {};
  Session: Session;
  SessionInput: SessionInput;
  SessionUpdateResult: SessionUpdateResult;
  String: Scalars['String'];
  Subscription: {};
  UUID: Scalars['UUID'];
  UpdateError: UpdateError;
}>;

export type AccountResolvers<ContextType = any, ParentType extends ResolversParentTypes['Account'] = ResolversParentTypes['Account']> = ResolversObject<{
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  deletedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AccountInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['AccountInfo'] = ResolversParentTypes['AccountInfo']> = ResolversObject<{
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AccountInfoUpdateResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['AccountInfoUpdateResult'] = ResolversParentTypes['AccountInfoUpdateResult']> = ResolversObject<{
  errors?: Resolver<Maybe<Array<ResolversTypes['UpdateError']>>, ParentType, ContextType>;
  rejected?: Resolver<Array<ResolversTypes['AccountInfo']>, ParentType, ContextType>;
  updated?: Resolver<Array<ResolversTypes['AccountInfo']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AccountUpdateResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['AccountUpdateResult'] = ResolversParentTypes['AccountUpdateResult']> = ResolversObject<{
  errors?: Resolver<Maybe<Array<ResolversTypes['UpdateError']>>, ParentType, ContextType>;
  rejected?: Resolver<Array<ResolversTypes['Account']>, ParentType, ContextType>;
  updated?: Resolver<Array<ResolversTypes['Account']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BlobInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['BlobInfo'] = ResolversParentTypes['BlobInfo']> = ResolversObject<{
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  createdBy?: Resolver<Maybe<ResolversTypes['UUID']>, ParentType, ContextType>;
  hash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  local?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  mimeType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  size?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  source?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BlobInfoUpdateResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['BlobInfoUpdateResult'] = ResolversParentTypes['BlobInfoUpdateResult']> = ResolversObject<{
  errors?: Resolver<Maybe<Array<ResolversTypes['UpdateError']>>, ParentType, ContextType>;
  rejected?: Resolver<Array<ResolversTypes['BlobInfo']>, ParentType, ContextType>;
  updated?: Resolver<Array<ResolversTypes['BlobInfo']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type DocumentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Document'] = ResolversParentTypes['Document']> = ResolversObject<{
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  createdBy?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  deletedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  fileHash?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  local?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  meta?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DocumentHighlightResolvers<ContextType = any, ParentType extends ResolversParentTypes['DocumentHighlight'] = ResolversParentTypes['DocumentHighlight']> = ResolversObject<{
  content?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  createdBy?: Resolver<Maybe<ResolversTypes['UUID']>, ParentType, ContextType>;
  deletedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  documentId?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  documentType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  imageHash?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  local?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  sequence?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DocumentHighlightUpdateResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['DocumentHighlightUpdateResult'] = ResolversParentTypes['DocumentHighlightUpdateResult']> = ResolversObject<{
  errors?: Resolver<Maybe<Array<ResolversTypes['UpdateError']>>, ParentType, ContextType>;
  rejected?: Resolver<Array<ResolversTypes['DocumentHighlight']>, ParentType, ContextType>;
  updated?: Resolver<Array<ResolversTypes['DocumentHighlight']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DocumentMemberResolvers<ContextType = any, ParentType extends ResolversParentTypes['DocumentMember'] = ResolversParentTypes['DocumentMember']> = ResolversObject<{
  acceptedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  accountId?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  createdBy?: Resolver<Maybe<ResolversTypes['UUID']>, ParentType, ContextType>;
  deletedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  documentId?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  local?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  role?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DocumentMemberUpdateResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['DocumentMemberUpdateResult'] = ResolversParentTypes['DocumentMemberUpdateResult']> = ResolversObject<{
  errors?: Resolver<Maybe<Array<ResolversTypes['UpdateError']>>, ParentType, ContextType>;
  rejected?: Resolver<Array<ResolversTypes['DocumentMember']>, ParentType, ContextType>;
  updated?: Resolver<Array<ResolversTypes['DocumentMember']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DocumentUpdateResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['DocumentUpdateResult'] = ResolversParentTypes['DocumentUpdateResult']> = ResolversObject<{
  errors?: Resolver<Maybe<Array<ResolversTypes['UpdateError']>>, ParentType, ContextType>;
  rejected?: Resolver<Array<ResolversTypes['Document']>, ParentType, ContextType>;
  updated?: Resolver<Array<ResolversTypes['Document']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  pushAccountChanges?: Resolver<ResolversTypes['AccountUpdateResult'], ParentType, ContextType, RequireFields<MutationPushAccountChangesArgs, 'input'>>;
  pushAccountInfoChanges?: Resolver<ResolversTypes['AccountInfoUpdateResult'], ParentType, ContextType, RequireFields<MutationPushAccountInfoChangesArgs, 'input'>>;
  pushBlobInfoChanges?: Resolver<ResolversTypes['BlobInfoUpdateResult'], ParentType, ContextType, RequireFields<MutationPushBlobInfoChangesArgs, 'input'>>;
  pushDocumentChanges?: Resolver<ResolversTypes['DocumentUpdateResult'], ParentType, ContextType, RequireFields<MutationPushDocumentChangesArgs, 'input'>>;
  pushDocumentHighlightChanges?: Resolver<ResolversTypes['DocumentHighlightUpdateResult'], ParentType, ContextType, RequireFields<MutationPushDocumentHighlightChangesArgs, 'input'>>;
  pushDocumentMemberChanges?: Resolver<ResolversTypes['DocumentMemberUpdateResult'], ParentType, ContextType, RequireFields<MutationPushDocumentMemberChangesArgs, 'input'>>;
  pushSessionChanges?: Resolver<ResolversTypes['SessionUpdateResult'], ParentType, ContextType, RequireFields<MutationPushSessionChangesArgs, 'input'>>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  getAccountChanges?: Resolver<Array<ResolversTypes['Account']>, ParentType, ContextType, RequireFields<QueryGetAccountChangesArgs, 'limit' | 'since'>>;
  getAccountInfoChanges?: Resolver<Array<ResolversTypes['AccountInfo']>, ParentType, ContextType, RequireFields<QueryGetAccountInfoChangesArgs, 'limit' | 'since'>>;
  getBlobInfoChanges?: Resolver<Array<ResolversTypes['BlobInfo']>, ParentType, ContextType, RequireFields<QueryGetBlobInfoChangesArgs, 'limit' | 'since'>>;
  getDocumentChanges?: Resolver<Array<ResolversTypes['Document']>, ParentType, ContextType, RequireFields<QueryGetDocumentChangesArgs, 'limit' | 'since'>>;
  getDocumentHighlightChanges?: Resolver<Array<ResolversTypes['DocumentHighlight']>, ParentType, ContextType, RequireFields<QueryGetDocumentHighlightChangesArgs, 'limit' | 'since'>>;
  getDocumentMemberChanges?: Resolver<Array<ResolversTypes['DocumentMember']>, ParentType, ContextType, RequireFields<QueryGetDocumentMemberChangesArgs, 'limit' | 'since'>>;
  getSessionChanges?: Resolver<Array<ResolversTypes['Session']>, ParentType, ContextType, RequireFields<QueryGetSessionChangesArgs, 'limit' | 'since'>>;
}>;

export type SessionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Session'] = ResolversParentTypes['Session']> = ResolversObject<{
  accountId?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  deletedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  syncDocuments?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SessionUpdateResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['SessionUpdateResult'] = ResolversParentTypes['SessionUpdateResult']> = ResolversObject<{
  errors?: Resolver<Maybe<Array<ResolversTypes['UpdateError']>>, ParentType, ContextType>;
  rejected?: Resolver<Array<ResolversTypes['Session']>, ParentType, ContextType>;
  updated?: Resolver<Array<ResolversTypes['Session']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  syncAccountInfoUpdates?: SubscriptionResolver<Array<ResolversTypes['AccountInfo']>, "syncAccountInfoUpdates", ParentType, ContextType>;
  syncAccountUpdates?: SubscriptionResolver<Array<ResolversTypes['Account']>, "syncAccountUpdates", ParentType, ContextType>;
  syncBlobInfoUpdates?: SubscriptionResolver<Array<ResolversTypes['BlobInfo']>, "syncBlobInfoUpdates", ParentType, ContextType>;
  syncDocumentHighlightUpdates?: SubscriptionResolver<Array<ResolversTypes['DocumentHighlight']>, "syncDocumentHighlightUpdates", ParentType, ContextType>;
  syncDocumentMemberUpdates?: SubscriptionResolver<Array<ResolversTypes['DocumentMember']>, "syncDocumentMemberUpdates", ParentType, ContextType>;
  syncDocumentUpdates?: SubscriptionResolver<Array<ResolversTypes['Document']>, "syncDocumentUpdates", ParentType, ContextType>;
  syncSessionUpdates?: SubscriptionResolver<Array<ResolversTypes['Session']>, "syncSessionUpdates", ParentType, ContextType>;
}>;

export interface UuidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['UUID'], any> {
  name: 'UUID';
}

export type UpdateErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateError'] = ResolversParentTypes['UpdateError']> = ResolversObject<{
  error?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Account?: AccountResolvers<ContextType>;
  AccountInfo?: AccountInfoResolvers<ContextType>;
  AccountInfoUpdateResult?: AccountInfoUpdateResultResolvers<ContextType>;
  AccountUpdateResult?: AccountUpdateResultResolvers<ContextType>;
  BlobInfo?: BlobInfoResolvers<ContextType>;
  BlobInfoUpdateResult?: BlobInfoUpdateResultResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Document?: DocumentResolvers<ContextType>;
  DocumentHighlight?: DocumentHighlightResolvers<ContextType>;
  DocumentHighlightUpdateResult?: DocumentHighlightUpdateResultResolvers<ContextType>;
  DocumentMember?: DocumentMemberResolvers<ContextType>;
  DocumentMemberUpdateResult?: DocumentMemberUpdateResultResolvers<ContextType>;
  DocumentUpdateResult?: DocumentUpdateResultResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Session?: SessionResolvers<ContextType>;
  SessionUpdateResult?: SessionUpdateResultResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  UUID?: GraphQLScalarType;
  UpdateError?: UpdateErrorResolvers<ContextType>;
}>;

