import { GraphQLResolveInfo } from 'graphql';
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
};

export type AccountInfo = {
  __typename?: 'AccountInfo';
  createdAt?: Maybe<Scalars['Float']>;
  deleted: Scalars['Boolean'];
  documentIds?: Maybe<Array<Maybe<Scalars['String']>>>;
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['Float']>;
};

export type AccountInfoInput = {
  createdAt?: InputMaybe<Scalars['Float']>;
  deleted: Scalars['Boolean'];
  documentIds?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  id: Scalars['String'];
  name?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['Float']>;
};

export type DocumentHighlight = {
  __typename?: 'DocumentHighlight';
  author?: Maybe<Scalars['String']>;
  content?: Maybe<DocumentHighlightT0ContentT0>;
  createdAt?: Maybe<Scalars['Float']>;
  deleted: Scalars['Boolean'];
  docId: Scalars['String'];
  id: Scalars['String'];
  location?: Maybe<DocumentHighlightT0LocationT0>;
  updatedAt?: Maybe<Scalars['Float']>;
};

export type DocumentHighlightInput = {
  author?: InputMaybe<Scalars['String']>;
  content?: InputMaybe<DocumentHighlightInputT0ContentT0>;
  createdAt?: InputMaybe<Scalars['Float']>;
  deleted: Scalars['Boolean'];
  docId: Scalars['String'];
  id: Scalars['String'];
  location?: InputMaybe<DocumentHighlightInputT0LocationT0>;
  updatedAt?: InputMaybe<Scalars['Float']>;
};

export type DocumentHighlightInputT0ContentT0 = {
  color?: InputMaybe<Scalars['String']>;
  text?: InputMaybe<Scalars['String']>;
  thumbnail?: InputMaybe<Scalars['String']>;
};

export type DocumentHighlightInputT0LocationT0 = {
  boundingRect?: InputMaybe<DocumentHighlightInputT0LocationT0BoundingRectT0>;
  pageNumber?: InputMaybe<Scalars['Float']>;
  rects?: InputMaybe<Array<InputMaybe<DocumentHighlightInputT0LocationT0RectsT0T0>>>;
};

export type DocumentHighlightInputT0LocationT0BoundingRectT0 = {
  height?: InputMaybe<Scalars['Float']>;
  left?: InputMaybe<Scalars['Float']>;
  pageNumber?: InputMaybe<Scalars['Float']>;
  scaleX?: InputMaybe<Scalars['Float']>;
  scaleY?: InputMaybe<Scalars['Float']>;
  top?: InputMaybe<Scalars['Float']>;
  width?: InputMaybe<Scalars['Float']>;
};

export type DocumentHighlightInputT0LocationT0RectsT0T0 = {
  height?: InputMaybe<Scalars['Float']>;
  left?: InputMaybe<Scalars['Float']>;
  pageNumber?: InputMaybe<Scalars['Float']>;
  scaleX?: InputMaybe<Scalars['Float']>;
  scaleY?: InputMaybe<Scalars['Float']>;
  top?: InputMaybe<Scalars['Float']>;
  width?: InputMaybe<Scalars['Float']>;
};

export type DocumentHighlightT0ContentT0 = {
  __typename?: 'DocumentHighlightT0ContentT0';
  color?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
  thumbnail?: Maybe<Scalars['String']>;
};

export type DocumentHighlightT0LocationT0 = {
  __typename?: 'DocumentHighlightT0LocationT0';
  boundingRect?: Maybe<DocumentHighlightT0LocationT0BoundingRectT0>;
  pageNumber?: Maybe<Scalars['Float']>;
  rects?: Maybe<Array<Maybe<DocumentHighlightT0LocationT0RectsT0T0>>>;
};

export type DocumentHighlightT0LocationT0BoundingRectT0 = {
  __typename?: 'DocumentHighlightT0LocationT0BoundingRectT0';
  height?: Maybe<Scalars['Float']>;
  left?: Maybe<Scalars['Float']>;
  pageNumber?: Maybe<Scalars['Float']>;
  scaleX?: Maybe<Scalars['Float']>;
  scaleY?: Maybe<Scalars['Float']>;
  top?: Maybe<Scalars['Float']>;
  width?: Maybe<Scalars['Float']>;
};

export type DocumentHighlightT0LocationT0RectsT0T0 = {
  __typename?: 'DocumentHighlightT0LocationT0RectsT0T0';
  height?: Maybe<Scalars['Float']>;
  left?: Maybe<Scalars['Float']>;
  pageNumber?: Maybe<Scalars['Float']>;
  scaleX?: Maybe<Scalars['Float']>;
  scaleY?: Maybe<Scalars['Float']>;
  top?: Maybe<Scalars['Float']>;
  width?: Maybe<Scalars['Float']>;
};

export type DocumentInfo = {
  __typename?: 'DocumentInfo';
  author?: Maybe<Scalars['String']>;
  cover?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['Float']>;
  creator?: Maybe<Scalars['String']>;
  deleted: Scalars['Boolean'];
  description?: Maybe<Scalars['String']>;
  fileId?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  outline?: Maybe<Scalars['String']>;
  pageCount?: Maybe<Scalars['Float']>;
  title?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['Float']>;
};

export type DocumentInfoInput = {
  author?: InputMaybe<Scalars['String']>;
  cover?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['Float']>;
  creator?: InputMaybe<Scalars['String']>;
  deleted: Scalars['Boolean'];
  description?: InputMaybe<Scalars['String']>;
  fileId?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  outline?: InputMaybe<Scalars['String']>;
  pageCount?: InputMaybe<Scalars['Float']>;
  title?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['Float']>;
};

export type DocumentReadingInfo = {
  __typename?: 'DocumentReadingInfo';
  accountId: Scalars['String'];
  createdAt?: Maybe<Scalars['Float']>;
  deleted: Scalars['Boolean'];
  docId: Scalars['String'];
  id: Scalars['String'];
  lastPage?: Maybe<Scalars['Float']>;
  location?: Maybe<Scalars['String']>;
  screenshot?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['Float']>;
};

export type DocumentReadingInfoInput = {
  accountId: Scalars['String'];
  createdAt?: InputMaybe<Scalars['Float']>;
  deleted: Scalars['Boolean'];
  docId: Scalars['String'];
  id: Scalars['String'];
  lastPage?: InputMaybe<Scalars['Float']>;
  location?: InputMaybe<Scalars['String']>;
  screenshot?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['Float']>;
};

export type FileInfo = {
  __typename?: 'FileInfo';
  createdAt?: Maybe<Scalars['Float']>;
  deleted: Scalars['Boolean'];
  id: Scalars['String'];
  mimeType?: Maybe<Scalars['String']>;
  sources?: Maybe<Array<Maybe<Scalars['String']>>>;
  updatedAt?: Maybe<Scalars['Float']>;
};

export type FileInfoInput = {
  createdAt?: InputMaybe<Scalars['Float']>;
  deleted: Scalars['Boolean'];
  id: Scalars['String'];
  mimeType?: InputMaybe<Scalars['String']>;
  sources?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  updatedAt?: InputMaybe<Scalars['Float']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  setAccountInfo?: Maybe<AccountInfo>;
  setDocumentHighlight?: Maybe<DocumentHighlight>;
  setDocumentInfo?: Maybe<DocumentInfo>;
  setDocumentReadingInfo?: Maybe<DocumentReadingInfo>;
  setFileInfo?: Maybe<FileInfo>;
};


export type MutationSetAccountInfoArgs = {
  accountInfo?: InputMaybe<AccountInfoInput>;
};


export type MutationSetDocumentHighlightArgs = {
  documentHighlight?: InputMaybe<DocumentHighlightInput>;
};


export type MutationSetDocumentInfoArgs = {
  documentInfo?: InputMaybe<DocumentInfoInput>;
};


export type MutationSetDocumentReadingInfoArgs = {
  documentReadingInfo?: InputMaybe<DocumentReadingInfoInput>;
};


export type MutationSetFileInfoArgs = {
  fileInfo?: InputMaybe<FileInfoInput>;
};

export type Query = {
  __typename?: 'Query';
  feedAccountInfo: Array<AccountInfo>;
  feedDocumentHighlight: Array<DocumentHighlight>;
  feedDocumentInfo: Array<DocumentInfo>;
  feedDocumentReadingInfo: Array<DocumentReadingInfo>;
  feedFileInfo: Array<FileInfo>;
};


export type QueryFeedAccountInfoArgs = {
  id?: InputMaybe<Scalars['String']>;
  limit: Scalars['Int'];
  updatedAt?: InputMaybe<Scalars['Float']>;
};


export type QueryFeedDocumentHighlightArgs = {
  id?: InputMaybe<Scalars['String']>;
  limit: Scalars['Int'];
  updatedAt?: InputMaybe<Scalars['Float']>;
};


export type QueryFeedDocumentInfoArgs = {
  id?: InputMaybe<Scalars['String']>;
  limit: Scalars['Int'];
  updatedAt?: InputMaybe<Scalars['Float']>;
};


export type QueryFeedDocumentReadingInfoArgs = {
  id?: InputMaybe<Scalars['String']>;
  limit: Scalars['Int'];
  updatedAt?: InputMaybe<Scalars['Float']>;
};


export type QueryFeedFileInfoArgs = {
  id?: InputMaybe<Scalars['String']>;
  limit: Scalars['Int'];
  updatedAt?: InputMaybe<Scalars['Float']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  changedAccountInfo?: Maybe<AccountInfo>;
  changedDocumentHighlight?: Maybe<DocumentHighlight>;
  changedDocumentInfo?: Maybe<DocumentInfo>;
  changedDocumentReadingInfo?: Maybe<DocumentReadingInfo>;
  changedFileInfo?: Maybe<FileInfo>;
};


export type SubscriptionChangedAccountInfoArgs = {
  token: Scalars['String'];
};


export type SubscriptionChangedDocumentHighlightArgs = {
  token: Scalars['String'];
};


export type SubscriptionChangedDocumentInfoArgs = {
  token: Scalars['String'];
};


export type SubscriptionChangedDocumentReadingInfoArgs = {
  token: Scalars['String'];
};


export type SubscriptionChangedFileInfoArgs = {
  token: Scalars['String'];
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
  AccountInfo: ResolverTypeWrapper<AccountInfo>;
  AccountInfoInput: AccountInfoInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  DocumentHighlight: ResolverTypeWrapper<DocumentHighlight>;
  DocumentHighlightInput: DocumentHighlightInput;
  DocumentHighlightInputT0ContentT0: DocumentHighlightInputT0ContentT0;
  DocumentHighlightInputT0LocationT0: DocumentHighlightInputT0LocationT0;
  DocumentHighlightInputT0LocationT0BoundingRectT0: DocumentHighlightInputT0LocationT0BoundingRectT0;
  DocumentHighlightInputT0LocationT0RectsT0T0: DocumentHighlightInputT0LocationT0RectsT0T0;
  DocumentHighlightT0ContentT0: ResolverTypeWrapper<DocumentHighlightT0ContentT0>;
  DocumentHighlightT0LocationT0: ResolverTypeWrapper<DocumentHighlightT0LocationT0>;
  DocumentHighlightT0LocationT0BoundingRectT0: ResolverTypeWrapper<DocumentHighlightT0LocationT0BoundingRectT0>;
  DocumentHighlightT0LocationT0RectsT0T0: ResolverTypeWrapper<DocumentHighlightT0LocationT0RectsT0T0>;
  DocumentInfo: ResolverTypeWrapper<DocumentInfo>;
  DocumentInfoInput: DocumentInfoInput;
  DocumentReadingInfo: ResolverTypeWrapper<DocumentReadingInfo>;
  DocumentReadingInfoInput: DocumentReadingInfoInput;
  FileInfo: ResolverTypeWrapper<FileInfo>;
  FileInfoInput: FileInfoInput;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Subscription: ResolverTypeWrapper<{}>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AccountInfo: AccountInfo;
  AccountInfoInput: AccountInfoInput;
  Boolean: Scalars['Boolean'];
  DocumentHighlight: DocumentHighlight;
  DocumentHighlightInput: DocumentHighlightInput;
  DocumentHighlightInputT0ContentT0: DocumentHighlightInputT0ContentT0;
  DocumentHighlightInputT0LocationT0: DocumentHighlightInputT0LocationT0;
  DocumentHighlightInputT0LocationT0BoundingRectT0: DocumentHighlightInputT0LocationT0BoundingRectT0;
  DocumentHighlightInputT0LocationT0RectsT0T0: DocumentHighlightInputT0LocationT0RectsT0T0;
  DocumentHighlightT0ContentT0: DocumentHighlightT0ContentT0;
  DocumentHighlightT0LocationT0: DocumentHighlightT0LocationT0;
  DocumentHighlightT0LocationT0BoundingRectT0: DocumentHighlightT0LocationT0BoundingRectT0;
  DocumentHighlightT0LocationT0RectsT0T0: DocumentHighlightT0LocationT0RectsT0T0;
  DocumentInfo: DocumentInfo;
  DocumentInfoInput: DocumentInfoInput;
  DocumentReadingInfo: DocumentReadingInfo;
  DocumentReadingInfoInput: DocumentReadingInfoInput;
  FileInfo: FileInfo;
  FileInfoInput: FileInfoInput;
  Float: Scalars['Float'];
  Int: Scalars['Int'];
  Mutation: {};
  Query: {};
  String: Scalars['String'];
  Subscription: {};
};

export type AccountInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['AccountInfo'] = ResolversParentTypes['AccountInfo']> = {
  createdAt?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  deleted?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  documentIds?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DocumentHighlightResolvers<ContextType = any, ParentType extends ResolversParentTypes['DocumentHighlight'] = ResolversParentTypes['DocumentHighlight']> = {
  author?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  content?: Resolver<Maybe<ResolversTypes['DocumentHighlightT0ContentT0']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  deleted?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  docId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes['DocumentHighlightT0LocationT0']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DocumentHighlightT0ContentT0Resolvers<ContextType = any, ParentType extends ResolversParentTypes['DocumentHighlightT0ContentT0'] = ResolversParentTypes['DocumentHighlightT0ContentT0']> = {
  color?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  text?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  thumbnail?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DocumentHighlightT0LocationT0Resolvers<ContextType = any, ParentType extends ResolversParentTypes['DocumentHighlightT0LocationT0'] = ResolversParentTypes['DocumentHighlightT0LocationT0']> = {
  boundingRect?: Resolver<Maybe<ResolversTypes['DocumentHighlightT0LocationT0BoundingRectT0']>, ParentType, ContextType>;
  pageNumber?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  rects?: Resolver<Maybe<Array<Maybe<ResolversTypes['DocumentHighlightT0LocationT0RectsT0T0']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DocumentHighlightT0LocationT0BoundingRectT0Resolvers<ContextType = any, ParentType extends ResolversParentTypes['DocumentHighlightT0LocationT0BoundingRectT0'] = ResolversParentTypes['DocumentHighlightT0LocationT0BoundingRectT0']> = {
  height?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  left?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  pageNumber?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  scaleX?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  scaleY?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  top?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  width?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DocumentHighlightT0LocationT0RectsT0T0Resolvers<ContextType = any, ParentType extends ResolversParentTypes['DocumentHighlightT0LocationT0RectsT0T0'] = ResolversParentTypes['DocumentHighlightT0LocationT0RectsT0T0']> = {
  height?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  left?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  pageNumber?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  scaleX?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  scaleY?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  top?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  width?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DocumentInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['DocumentInfo'] = ResolversParentTypes['DocumentInfo']> = {
  author?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  cover?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  creator?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  deleted?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  fileId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  outline?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  pageCount?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DocumentReadingInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['DocumentReadingInfo'] = ResolversParentTypes['DocumentReadingInfo']> = {
  accountId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  deleted?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  docId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lastPage?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  screenshot?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FileInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['FileInfo'] = ResolversParentTypes['FileInfo']> = {
  createdAt?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  deleted?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  mimeType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sources?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  setAccountInfo?: Resolver<Maybe<ResolversTypes['AccountInfo']>, ParentType, ContextType, Partial<MutationSetAccountInfoArgs>>;
  setDocumentHighlight?: Resolver<Maybe<ResolversTypes['DocumentHighlight']>, ParentType, ContextType, Partial<MutationSetDocumentHighlightArgs>>;
  setDocumentInfo?: Resolver<Maybe<ResolversTypes['DocumentInfo']>, ParentType, ContextType, Partial<MutationSetDocumentInfoArgs>>;
  setDocumentReadingInfo?: Resolver<Maybe<ResolversTypes['DocumentReadingInfo']>, ParentType, ContextType, Partial<MutationSetDocumentReadingInfoArgs>>;
  setFileInfo?: Resolver<Maybe<ResolversTypes['FileInfo']>, ParentType, ContextType, Partial<MutationSetFileInfoArgs>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  feedAccountInfo?: Resolver<Array<ResolversTypes['AccountInfo']>, ParentType, ContextType, RequireFields<QueryFeedAccountInfoArgs, 'limit'>>;
  feedDocumentHighlight?: Resolver<Array<ResolversTypes['DocumentHighlight']>, ParentType, ContextType, RequireFields<QueryFeedDocumentHighlightArgs, 'limit'>>;
  feedDocumentInfo?: Resolver<Array<ResolversTypes['DocumentInfo']>, ParentType, ContextType, RequireFields<QueryFeedDocumentInfoArgs, 'limit'>>;
  feedDocumentReadingInfo?: Resolver<Array<ResolversTypes['DocumentReadingInfo']>, ParentType, ContextType, RequireFields<QueryFeedDocumentReadingInfoArgs, 'limit'>>;
  feedFileInfo?: Resolver<Array<ResolversTypes['FileInfo']>, ParentType, ContextType, RequireFields<QueryFeedFileInfoArgs, 'limit'>>;
};

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  changedAccountInfo?: SubscriptionResolver<Maybe<ResolversTypes['AccountInfo']>, "changedAccountInfo", ParentType, ContextType, RequireFields<SubscriptionChangedAccountInfoArgs, 'token'>>;
  changedDocumentHighlight?: SubscriptionResolver<Maybe<ResolversTypes['DocumentHighlight']>, "changedDocumentHighlight", ParentType, ContextType, RequireFields<SubscriptionChangedDocumentHighlightArgs, 'token'>>;
  changedDocumentInfo?: SubscriptionResolver<Maybe<ResolversTypes['DocumentInfo']>, "changedDocumentInfo", ParentType, ContextType, RequireFields<SubscriptionChangedDocumentInfoArgs, 'token'>>;
  changedDocumentReadingInfo?: SubscriptionResolver<Maybe<ResolversTypes['DocumentReadingInfo']>, "changedDocumentReadingInfo", ParentType, ContextType, RequireFields<SubscriptionChangedDocumentReadingInfoArgs, 'token'>>;
  changedFileInfo?: SubscriptionResolver<Maybe<ResolversTypes['FileInfo']>, "changedFileInfo", ParentType, ContextType, RequireFields<SubscriptionChangedFileInfoArgs, 'token'>>;
};

export type Resolvers<ContextType = any> = {
  AccountInfo?: AccountInfoResolvers<ContextType>;
  DocumentHighlight?: DocumentHighlightResolvers<ContextType>;
  DocumentHighlightT0ContentT0?: DocumentHighlightT0ContentT0Resolvers<ContextType>;
  DocumentHighlightT0LocationT0?: DocumentHighlightT0LocationT0Resolvers<ContextType>;
  DocumentHighlightT0LocationT0BoundingRectT0?: DocumentHighlightT0LocationT0BoundingRectT0Resolvers<ContextType>;
  DocumentHighlightT0LocationT0RectsT0T0?: DocumentHighlightT0LocationT0RectsT0T0Resolvers<ContextType>;
  DocumentInfo?: DocumentInfoResolvers<ContextType>;
  DocumentReadingInfo?: DocumentReadingInfoResolvers<ContextType>;
  FileInfo?: FileInfoResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
};

