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
};

export type Account = {
  __typename?: 'Account';
  createdAt: Scalars['DateTime'];
  documents?: Maybe<Array<DocumentInfo>>;
  id: Scalars['String'];
  membership?: Maybe<Array<DocumentMember>>;
  name?: Maybe<Scalars['String']>;
  updatedAt: Scalars['DateTime'];
};

export type AccountInfo = {
  __typename?: 'AccountInfo';
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
};

export type AccountInput = {
  id?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};

export type DocumentInfo = {
  __typename?: 'DocumentInfo';
  author?: Maybe<Scalars['String']>;
  cover?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  file?: Maybe<FileInfo>;
  fileId?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  members?: Maybe<Array<DocumentMember>>;
  outline?: Maybe<DocumentOutline>;
  pageCount?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
  type: DocumentType;
  updatedAt: Scalars['DateTime'];
};

export type DocumentInfoInput = {
  author?: InputMaybe<Scalars['String']>;
  cover?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  docType: DocumentType;
  fileId?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

export type DocumentMember = {
  __typename?: 'DocumentMember';
  account?: Maybe<AccountInfo>;
  accountId: Scalars['String'];
  createdAt: Scalars['DateTime'];
  document?: Maybe<DocumentInfo>;
  documentId: Scalars['String'];
  role: DocumentRole;
};

export type DocumentOutline = {
  __typename?: 'DocumentOutline';
  items: Array<OutlineNode>;
};

export enum DocumentRole {
  Contributor = 'CONTRIBUTOR',
  Owner = 'OWNER',
  Reader = 'READER'
}

export enum DocumentType {
  Pdf = 'PDF'
}

export type FileInfo = {
  __typename?: 'FileInfo';
  createdAt: Scalars['DateTime'];
  hash: Scalars['String'];
  sources?: Maybe<Array<FileSource>>;
  updatedAt: Scalars['DateTime'];
};

export type FileInfoInput = {
  hash: Scalars['String'];
  sources?: InputMaybe<Array<FileSourceInput>>;
};

export type FileSource = {
  __typename?: 'FileSource';
  type: FileSourceType;
  url: Scalars['String'];
};

export type FileSourceInput = {
  type: FileSourceType;
  url: Scalars['String'];
};

export enum FileSourceType {
  Url = 'URL'
}

export type Mutation = {
  __typename?: 'Mutation';
  setAccount: Account;
  setDocumentInfo: DocumentInfo;
  setFileInfo: FileInfo;
};


export type MutationSetAccountArgs = {
  account: AccountInput;
};


export type MutationSetDocumentInfoArgs = {
  document?: InputMaybe<DocumentInfoInput>;
};


export type MutationSetFileInfoArgs = {
  file: FileInfoInput;
};

export type OutlineNode = {
  __typename?: 'OutlineNode';
  items?: Maybe<Array<OutlineNode>>;
  position: OutlinePosition;
  title: Scalars['String'];
};

export type OutlinePosition = {
  __typename?: 'OutlinePosition';
  location?: Maybe<Scalars['String']>;
  pageInt?: Maybe<Scalars['Int']>;
  top?: Maybe<Scalars['Int']>;
};

export type Query = {
  __typename?: 'Query';
  account?: Maybe<Account>;
  document?: Maybe<DocumentInfo>;
};


export type QueryDocumentArgs = {
  id: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  account: Account;
  document: DocumentInfo;
};


export type SubscriptionDocumentArgs = {
  id: Scalars['String'];
};



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
export type ResolversTypes = {
  Account: ResolverTypeWrapper<Account>;
  AccountInfo: ResolverTypeWrapper<AccountInfo>;
  AccountInput: AccountInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  DocumentInfo: ResolverTypeWrapper<DocumentInfo>;
  DocumentInfoInput: DocumentInfoInput;
  DocumentMember: ResolverTypeWrapper<DocumentMember>;
  DocumentOutline: ResolverTypeWrapper<DocumentOutline>;
  DocumentRole: DocumentRole;
  DocumentType: DocumentType;
  FileInfo: ResolverTypeWrapper<FileInfo>;
  FileInfoInput: FileInfoInput;
  FileSource: ResolverTypeWrapper<FileSource>;
  FileSourceInput: FileSourceInput;
  FileSourceType: FileSourceType;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Mutation: ResolverTypeWrapper<{}>;
  OutlineNode: ResolverTypeWrapper<OutlineNode>;
  OutlinePosition: ResolverTypeWrapper<OutlinePosition>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Subscription: ResolverTypeWrapper<{}>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Account: Account;
  AccountInfo: AccountInfo;
  AccountInput: AccountInput;
  Boolean: Scalars['Boolean'];
  DateTime: Scalars['DateTime'];
  DocumentInfo: DocumentInfo;
  DocumentInfoInput: DocumentInfoInput;
  DocumentMember: DocumentMember;
  DocumentOutline: DocumentOutline;
  FileInfo: FileInfo;
  FileInfoInput: FileInfoInput;
  FileSource: FileSource;
  FileSourceInput: FileSourceInput;
  Int: Scalars['Int'];
  Mutation: {};
  OutlineNode: OutlineNode;
  OutlinePosition: OutlinePosition;
  Query: {};
  String: Scalars['String'];
  Subscription: {};
};

export type AccountResolvers<ContextType = any, ParentType extends ResolversParentTypes['Account'] = ResolversParentTypes['Account']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  documents?: Resolver<Maybe<Array<ResolversTypes['DocumentInfo']>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  membership?: Resolver<Maybe<Array<ResolversTypes['DocumentMember']>>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AccountInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['AccountInfo'] = ResolversParentTypes['AccountInfo']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type DocumentInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['DocumentInfo'] = ResolversParentTypes['DocumentInfo']> = {
  author?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  cover?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  file?: Resolver<Maybe<ResolversTypes['FileInfo']>, ParentType, ContextType>;
  fileId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  members?: Resolver<Maybe<Array<ResolversTypes['DocumentMember']>>, ParentType, ContextType>;
  outline?: Resolver<Maybe<ResolversTypes['DocumentOutline']>, ParentType, ContextType>;
  pageCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['DocumentType'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DocumentMemberResolvers<ContextType = any, ParentType extends ResolversParentTypes['DocumentMember'] = ResolversParentTypes['DocumentMember']> = {
  account?: Resolver<Maybe<ResolversTypes['AccountInfo']>, ParentType, ContextType>;
  accountId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  document?: Resolver<Maybe<ResolversTypes['DocumentInfo']>, ParentType, ContextType>;
  documentId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  role?: Resolver<ResolversTypes['DocumentRole'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DocumentOutlineResolvers<ContextType = any, ParentType extends ResolversParentTypes['DocumentOutline'] = ResolversParentTypes['DocumentOutline']> = {
  items?: Resolver<Array<ResolversTypes['OutlineNode']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FileInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['FileInfo'] = ResolversParentTypes['FileInfo']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  hash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sources?: Resolver<Maybe<Array<ResolversTypes['FileSource']>>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FileSourceResolvers<ContextType = any, ParentType extends ResolversParentTypes['FileSource'] = ResolversParentTypes['FileSource']> = {
  type?: Resolver<ResolversTypes['FileSourceType'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  setAccount?: Resolver<ResolversTypes['Account'], ParentType, ContextType, RequireFields<MutationSetAccountArgs, 'account'>>;
  setDocumentInfo?: Resolver<ResolversTypes['DocumentInfo'], ParentType, ContextType, Partial<MutationSetDocumentInfoArgs>>;
  setFileInfo?: Resolver<ResolversTypes['FileInfo'], ParentType, ContextType, RequireFields<MutationSetFileInfoArgs, 'file'>>;
};

export type OutlineNodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['OutlineNode'] = ResolversParentTypes['OutlineNode']> = {
  items?: Resolver<Maybe<Array<ResolversTypes['OutlineNode']>>, ParentType, ContextType>;
  position?: Resolver<ResolversTypes['OutlinePosition'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OutlinePositionResolvers<ContextType = any, ParentType extends ResolversParentTypes['OutlinePosition'] = ResolversParentTypes['OutlinePosition']> = {
  location?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  pageInt?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  top?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  account?: Resolver<Maybe<ResolversTypes['Account']>, ParentType, ContextType>;
  document?: Resolver<Maybe<ResolversTypes['DocumentInfo']>, ParentType, ContextType, RequireFields<QueryDocumentArgs, 'id'>>;
};

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  account?: SubscriptionResolver<ResolversTypes['Account'], "account", ParentType, ContextType>;
  document?: SubscriptionResolver<ResolversTypes['DocumentInfo'], "document", ParentType, ContextType, RequireFields<SubscriptionDocumentArgs, 'id'>>;
};

export type Resolvers<ContextType = any> = {
  Account?: AccountResolvers<ContextType>;
  AccountInfo?: AccountInfoResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  DocumentInfo?: DocumentInfoResolvers<ContextType>;
  DocumentMember?: DocumentMemberResolvers<ContextType>;
  DocumentOutline?: DocumentOutlineResolvers<ContextType>;
  FileInfo?: FileInfoResolvers<ContextType>;
  FileSource?: FileSourceResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  OutlineNode?: OutlineNodeResolvers<ContextType>;
  OutlinePosition?: OutlinePositionResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
};

