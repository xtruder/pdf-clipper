import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  citext: any;
  date: any;
  jsonb: any;
  timestamptz: any;
  uuid: any;
};

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Boolean']>;
  _gt?: InputMaybe<Scalars['Boolean']>;
  _gte?: InputMaybe<Scalars['Boolean']>;
  _in?: InputMaybe<Array<Scalars['Boolean']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['Boolean']>;
  _lte?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<Scalars['Boolean']>;
  _nin?: InputMaybe<Array<Scalars['Boolean']>>;
};

export type CreateFileOutput = {
  __typename?: 'CreateFileOutput';
  id: Scalars['uuid'];
  sources: Scalars['jsonb'];
  uploadUrl: Scalars['String'];
};

export type DocumentImagePostPolicyOutput = {
  __typename?: 'DocumentImagePostPolicyOutput';
  formData: Scalars['jsonb'];
  postURL: Scalars['String'];
};

export type FileDownloadUrlOutput = {
  __typename?: 'FileDownloadUrlOutput';
  id: Scalars['uuid'];
  url: Scalars['String'];
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Int']>;
  _gt?: InputMaybe<Scalars['Int']>;
  _gte?: InputMaybe<Scalars['Int']>;
  _in?: InputMaybe<Array<Scalars['Int']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['Int']>;
  _lte?: InputMaybe<Scalars['Int']>;
  _neq?: InputMaybe<Scalars['Int']>;
  _nin?: InputMaybe<Array<Scalars['Int']>>;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['String']>;
  _gt?: InputMaybe<Scalars['String']>;
  _gte?: InputMaybe<Scalars['String']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']>;
  _in?: InputMaybe<Array<Scalars['String']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['String']>;
  _lt?: InputMaybe<Scalars['String']>;
  _lte?: InputMaybe<Scalars['String']>;
  _neq?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['String']>;
  _nin?: InputMaybe<Array<Scalars['String']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['String']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['String']>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['String']>;
};

/** Valid account document roles */
export type AccountDocumentRoles = {
  __typename?: 'accountDocumentRoles';
  comment?: Maybe<Scalars['String']>;
  value: Scalars['String'];
};

/** aggregated selection of "account_document_roles" */
export type AccountDocumentRoles_Aggregate = {
  __typename?: 'accountDocumentRoles_aggregate';
  aggregate?: Maybe<AccountDocumentRoles_Aggregate_Fields>;
  nodes: Array<AccountDocumentRoles>;
};

/** aggregate fields of "account_document_roles" */
export type AccountDocumentRoles_Aggregate_Fields = {
  __typename?: 'accountDocumentRoles_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<AccountDocumentRoles_Max_Fields>;
  min?: Maybe<AccountDocumentRoles_Min_Fields>;
};


/** aggregate fields of "account_document_roles" */
export type AccountDocumentRoles_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<AccountDocumentRoles_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "account_document_roles". All fields are combined with a logical 'AND'. */
export type AccountDocumentRoles_Bool_Exp = {
  _and?: InputMaybe<Array<AccountDocumentRoles_Bool_Exp>>;
  _not?: InputMaybe<AccountDocumentRoles_Bool_Exp>;
  _or?: InputMaybe<Array<AccountDocumentRoles_Bool_Exp>>;
  comment?: InputMaybe<String_Comparison_Exp>;
  value?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "account_document_roles" */
export type AccountDocumentRoles_Constraint =
  /** unique or primary key constraint */
  | 'account_document_roles_pkey';

/** input type for inserting data into table "account_document_roles" */
export type AccountDocumentRoles_Insert_Input = {
  comment?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type AccountDocumentRoles_Max_Fields = {
  __typename?: 'accountDocumentRoles_max_fields';
  comment?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type AccountDocumentRoles_Min_Fields = {
  __typename?: 'accountDocumentRoles_min_fields';
  comment?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "account_document_roles" */
export type AccountDocumentRoles_Mutation_Response = {
  __typename?: 'accountDocumentRoles_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<AccountDocumentRoles>;
};

/** on_conflict condition type for table "account_document_roles" */
export type AccountDocumentRoles_On_Conflict = {
  constraint: AccountDocumentRoles_Constraint;
  update_columns?: Array<AccountDocumentRoles_Update_Column>;
  where?: InputMaybe<AccountDocumentRoles_Bool_Exp>;
};

/** Ordering options when selecting data from "account_document_roles". */
export type AccountDocumentRoles_Order_By = {
  comment?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: accountDocumentRoles */
export type AccountDocumentRoles_Pk_Columns_Input = {
  value: Scalars['String'];
};

/** select columns of table "account_document_roles" */
export type AccountDocumentRoles_Select_Column =
  /** column name */
  | 'comment'
  /** column name */
  | 'value';

/** input type for updating data in table "account_document_roles" */
export type AccountDocumentRoles_Set_Input = {
  comment?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
};

/** update columns of table "account_document_roles" */
export type AccountDocumentRoles_Update_Column =
  /** column name */
  | 'comment'
  /** column name */
  | 'value';

/** Table connecting accounts and documents */
export type AccountDocuments = {
  __typename?: 'accountDocuments';
  acceptedAt?: Maybe<Scalars['date']>;
  /** An object relationship */
  account?: Maybe<Accounts>;
  accountId: Scalars['uuid'];
  createdAt: Scalars['timestamptz'];
  /** An object relationship */
  document?: Maybe<Documents>;
  documentId: Scalars['uuid'];
  /** An object relationship */
  readingInfo?: Maybe<DocumentReadingInfo>;
  role: Account_Document_Roles_Enum;
};

/** aggregated selection of "accounts_documents" */
export type AccountDocuments_Aggregate = {
  __typename?: 'accountDocuments_aggregate';
  aggregate?: Maybe<AccountDocuments_Aggregate_Fields>;
  nodes: Array<AccountDocuments>;
};

/** aggregate fields of "accounts_documents" */
export type AccountDocuments_Aggregate_Fields = {
  __typename?: 'accountDocuments_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<AccountDocuments_Max_Fields>;
  min?: Maybe<AccountDocuments_Min_Fields>;
};


/** aggregate fields of "accounts_documents" */
export type AccountDocuments_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<AccountDocuments_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "accounts_documents" */
export type AccountDocuments_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<AccountDocuments_Max_Order_By>;
  min?: InputMaybe<AccountDocuments_Min_Order_By>;
};

/** input type for inserting array relation for remote table "accounts_documents" */
export type AccountDocuments_Arr_Rel_Insert_Input = {
  data: Array<AccountDocuments_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<AccountDocuments_On_Conflict>;
};

/** Boolean expression to filter rows from the table "accounts_documents". All fields are combined with a logical 'AND'. */
export type AccountDocuments_Bool_Exp = {
  _and?: InputMaybe<Array<AccountDocuments_Bool_Exp>>;
  _not?: InputMaybe<AccountDocuments_Bool_Exp>;
  _or?: InputMaybe<Array<AccountDocuments_Bool_Exp>>;
  acceptedAt?: InputMaybe<Date_Comparison_Exp>;
  account?: InputMaybe<Accounts_Bool_Exp>;
  accountId?: InputMaybe<Uuid_Comparison_Exp>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  document?: InputMaybe<Documents_Bool_Exp>;
  documentId?: InputMaybe<Uuid_Comparison_Exp>;
  readingInfo?: InputMaybe<DocumentReadingInfo_Bool_Exp>;
  role?: InputMaybe<Account_Document_Roles_Enum_Comparison_Exp>;
};

/** unique or primary key constraints on table "accounts_documents" */
export type AccountDocuments_Constraint =
  /** unique or primary key constraint */
  | 'accounts_documents_account_id_document_id_key'
  /** unique or primary key constraint */
  | 'accounts_documents_pkey';

/** input type for inserting data into table "accounts_documents" */
export type AccountDocuments_Insert_Input = {
  acceptedAt?: InputMaybe<Scalars['date']>;
  account?: InputMaybe<Accounts_Obj_Rel_Insert_Input>;
  accountId?: InputMaybe<Scalars['uuid']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  document?: InputMaybe<Documents_Obj_Rel_Insert_Input>;
  documentId?: InputMaybe<Scalars['uuid']>;
  readingInfo?: InputMaybe<DocumentReadingInfo_Obj_Rel_Insert_Input>;
  role?: InputMaybe<Account_Document_Roles_Enum>;
};

/** aggregate max on columns */
export type AccountDocuments_Max_Fields = {
  __typename?: 'accountDocuments_max_fields';
  acceptedAt?: Maybe<Scalars['date']>;
  accountId?: Maybe<Scalars['uuid']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  documentId?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "accounts_documents" */
export type AccountDocuments_Max_Order_By = {
  acceptedAt?: InputMaybe<Order_By>;
  accountId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  documentId?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type AccountDocuments_Min_Fields = {
  __typename?: 'accountDocuments_min_fields';
  acceptedAt?: Maybe<Scalars['date']>;
  accountId?: Maybe<Scalars['uuid']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  documentId?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "accounts_documents" */
export type AccountDocuments_Min_Order_By = {
  acceptedAt?: InputMaybe<Order_By>;
  accountId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  documentId?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "accounts_documents" */
export type AccountDocuments_Mutation_Response = {
  __typename?: 'accountDocuments_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<AccountDocuments>;
};

/** on_conflict condition type for table "accounts_documents" */
export type AccountDocuments_On_Conflict = {
  constraint: AccountDocuments_Constraint;
  update_columns?: Array<AccountDocuments_Update_Column>;
  where?: InputMaybe<AccountDocuments_Bool_Exp>;
};

/** Ordering options when selecting data from "accounts_documents". */
export type AccountDocuments_Order_By = {
  acceptedAt?: InputMaybe<Order_By>;
  account?: InputMaybe<Accounts_Order_By>;
  accountId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  document?: InputMaybe<Documents_Order_By>;
  documentId?: InputMaybe<Order_By>;
  readingInfo?: InputMaybe<DocumentReadingInfo_Order_By>;
  role?: InputMaybe<Order_By>;
};

/** primary key columns input for table: accountDocuments */
export type AccountDocuments_Pk_Columns_Input = {
  accountId: Scalars['uuid'];
  documentId: Scalars['uuid'];
};

/** select columns of table "accounts_documents" */
export type AccountDocuments_Select_Column =
  /** column name */
  | 'acceptedAt'
  /** column name */
  | 'accountId'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'documentId'
  /** column name */
  | 'role';

/** input type for updating data in table "accounts_documents" */
export type AccountDocuments_Set_Input = {
  acceptedAt?: InputMaybe<Scalars['date']>;
  accountId?: InputMaybe<Scalars['uuid']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  documentId?: InputMaybe<Scalars['uuid']>;
  role?: InputMaybe<Account_Document_Roles_Enum>;
};

/** update columns of table "accounts_documents" */
export type AccountDocuments_Update_Column =
  /** column name */
  | 'acceptedAt'
  /** column name */
  | 'accountId'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'documentId'
  /** column name */
  | 'role';

export type Account_Document_Roles_Enum =
  /** Admin can do any actions on document */
  | 'admin'
  /** Editor can view and edit documents */
  | 'editor'
  /** Viewer can only view documents */
  | 'viewer';

/** Boolean expression to compare columns of type "account_document_roles_enum". All fields are combined with logical 'AND'. */
export type Account_Document_Roles_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Account_Document_Roles_Enum>;
  _in?: InputMaybe<Array<Account_Document_Roles_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<Account_Document_Roles_Enum>;
  _nin?: InputMaybe<Array<Account_Document_Roles_Enum>>;
};

/** Table with app accounts */
export type Accounts = {
  __typename?: 'accounts';
  createdAt: Scalars['timestamptz'];
  /** An array relationship */
  documents: Array<AccountDocuments>;
  /** An aggregate relationship */
  documents_aggregate: AccountDocuments_Aggregate;
  id: Scalars['uuid'];
  name?: Maybe<Scalars['String']>;
  /** An array relationship */
  readingInfo: Array<DocumentReadingInfo>;
  /** An aggregate relationship */
  readingInfo_aggregate: DocumentReadingInfo_Aggregate;
  updatedAt: Scalars['timestamptz'];
};


/** Table with app accounts */
export type AccountsDocumentsArgs = {
  distinct_on?: InputMaybe<Array<AccountDocuments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AccountDocuments_Order_By>>;
  where?: InputMaybe<AccountDocuments_Bool_Exp>;
};


/** Table with app accounts */
export type AccountsDocuments_AggregateArgs = {
  distinct_on?: InputMaybe<Array<AccountDocuments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AccountDocuments_Order_By>>;
  where?: InputMaybe<AccountDocuments_Bool_Exp>;
};


/** Table with app accounts */
export type AccountsReadingInfoArgs = {
  distinct_on?: InputMaybe<Array<DocumentReadingInfo_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<DocumentReadingInfo_Order_By>>;
  where?: InputMaybe<DocumentReadingInfo_Bool_Exp>;
};


/** Table with app accounts */
export type AccountsReadingInfo_AggregateArgs = {
  distinct_on?: InputMaybe<Array<DocumentReadingInfo_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<DocumentReadingInfo_Order_By>>;
  where?: InputMaybe<DocumentReadingInfo_Bool_Exp>;
};

/** aggregated selection of "accounts" */
export type Accounts_Aggregate = {
  __typename?: 'accounts_aggregate';
  aggregate?: Maybe<Accounts_Aggregate_Fields>;
  nodes: Array<Accounts>;
};

/** aggregate fields of "accounts" */
export type Accounts_Aggregate_Fields = {
  __typename?: 'accounts_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Accounts_Max_Fields>;
  min?: Maybe<Accounts_Min_Fields>;
};


/** aggregate fields of "accounts" */
export type Accounts_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Accounts_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "accounts". All fields are combined with a logical 'AND'. */
export type Accounts_Bool_Exp = {
  _and?: InputMaybe<Array<Accounts_Bool_Exp>>;
  _not?: InputMaybe<Accounts_Bool_Exp>;
  _or?: InputMaybe<Array<Accounts_Bool_Exp>>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  documents?: InputMaybe<AccountDocuments_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  readingInfo?: InputMaybe<DocumentReadingInfo_Bool_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "accounts" */
export type Accounts_Constraint =
  /** unique or primary key constraint */
  | 'accounts_name_key'
  /** unique or primary key constraint */
  | 'accounts_pkey';

/** input type for inserting data into table "accounts" */
export type Accounts_Insert_Input = {
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  documents?: InputMaybe<AccountDocuments_Arr_Rel_Insert_Input>;
  id?: InputMaybe<Scalars['uuid']>;
  name?: InputMaybe<Scalars['String']>;
  readingInfo?: InputMaybe<DocumentReadingInfo_Arr_Rel_Insert_Input>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Accounts_Max_Fields = {
  __typename?: 'accounts_max_fields';
  createdAt?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** aggregate min on columns */
export type Accounts_Min_Fields = {
  __typename?: 'accounts_min_fields';
  createdAt?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** response of any mutation on the table "accounts" */
export type Accounts_Mutation_Response = {
  __typename?: 'accounts_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Accounts>;
};

/** input type for inserting object relation for remote table "accounts" */
export type Accounts_Obj_Rel_Insert_Input = {
  data: Accounts_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Accounts_On_Conflict>;
};

/** on_conflict condition type for table "accounts" */
export type Accounts_On_Conflict = {
  constraint: Accounts_Constraint;
  update_columns?: Array<Accounts_Update_Column>;
  where?: InputMaybe<Accounts_Bool_Exp>;
};

/** Ordering options when selecting data from "accounts". */
export type Accounts_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  documents_aggregate?: InputMaybe<AccountDocuments_Aggregate_Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  readingInfo_aggregate?: InputMaybe<DocumentReadingInfo_Aggregate_Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** primary key columns input for table: accounts */
export type Accounts_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "accounts" */
export type Accounts_Select_Column =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'id'
  /** column name */
  | 'name'
  /** column name */
  | 'updatedAt';

/** input type for updating data in table "accounts" */
export type Accounts_Set_Input = {
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  name?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "accounts" */
export type Accounts_Update_Column =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'id'
  /** column name */
  | 'name'
  /** column name */
  | 'updatedAt';

/** columns and relationships of "auth.provider_requests" */
export type AuthProviderRequests = {
  __typename?: 'authProviderRequests';
  id: Scalars['uuid'];
  options?: Maybe<Scalars['jsonb']>;
};


/** columns and relationships of "auth.provider_requests" */
export type AuthProviderRequestsOptionsArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "auth.provider_requests" */
export type AuthProviderRequests_Aggregate = {
  __typename?: 'authProviderRequests_aggregate';
  aggregate?: Maybe<AuthProviderRequests_Aggregate_Fields>;
  nodes: Array<AuthProviderRequests>;
};

/** aggregate fields of "auth.provider_requests" */
export type AuthProviderRequests_Aggregate_Fields = {
  __typename?: 'authProviderRequests_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<AuthProviderRequests_Max_Fields>;
  min?: Maybe<AuthProviderRequests_Min_Fields>;
};


/** aggregate fields of "auth.provider_requests" */
export type AuthProviderRequests_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<AuthProviderRequests_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type AuthProviderRequests_Append_Input = {
  options?: InputMaybe<Scalars['jsonb']>;
};

/** Boolean expression to filter rows from the table "auth.provider_requests". All fields are combined with a logical 'AND'. */
export type AuthProviderRequests_Bool_Exp = {
  _and?: InputMaybe<Array<AuthProviderRequests_Bool_Exp>>;
  _not?: InputMaybe<AuthProviderRequests_Bool_Exp>;
  _or?: InputMaybe<Array<AuthProviderRequests_Bool_Exp>>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  options?: InputMaybe<Jsonb_Comparison_Exp>;
};

/** unique or primary key constraints on table "auth.provider_requests" */
export type AuthProviderRequests_Constraint =
  /** unique or primary key constraint */
  | 'provider_requests_pkey';

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type AuthProviderRequests_Delete_At_Path_Input = {
  options?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type AuthProviderRequests_Delete_Elem_Input = {
  options?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type AuthProviderRequests_Delete_Key_Input = {
  options?: InputMaybe<Scalars['String']>;
};

/** input type for inserting data into table "auth.provider_requests" */
export type AuthProviderRequests_Insert_Input = {
  id?: InputMaybe<Scalars['uuid']>;
  options?: InputMaybe<Scalars['jsonb']>;
};

/** aggregate max on columns */
export type AuthProviderRequests_Max_Fields = {
  __typename?: 'authProviderRequests_max_fields';
  id?: Maybe<Scalars['uuid']>;
};

/** aggregate min on columns */
export type AuthProviderRequests_Min_Fields = {
  __typename?: 'authProviderRequests_min_fields';
  id?: Maybe<Scalars['uuid']>;
};

/** response of any mutation on the table "auth.provider_requests" */
export type AuthProviderRequests_Mutation_Response = {
  __typename?: 'authProviderRequests_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<AuthProviderRequests>;
};

/** on_conflict condition type for table "auth.provider_requests" */
export type AuthProviderRequests_On_Conflict = {
  constraint: AuthProviderRequests_Constraint;
  update_columns?: Array<AuthProviderRequests_Update_Column>;
  where?: InputMaybe<AuthProviderRequests_Bool_Exp>;
};

/** Ordering options when selecting data from "auth.provider_requests". */
export type AuthProviderRequests_Order_By = {
  id?: InputMaybe<Order_By>;
  options?: InputMaybe<Order_By>;
};

/** primary key columns input for table: authProviderRequests */
export type AuthProviderRequests_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type AuthProviderRequests_Prepend_Input = {
  options?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "auth.provider_requests" */
export type AuthProviderRequests_Select_Column =
  /** column name */
  | 'id'
  /** column name */
  | 'options';

/** input type for updating data in table "auth.provider_requests" */
export type AuthProviderRequests_Set_Input = {
  id?: InputMaybe<Scalars['uuid']>;
  options?: InputMaybe<Scalars['jsonb']>;
};

/** update columns of table "auth.provider_requests" */
export type AuthProviderRequests_Update_Column =
  /** column name */
  | 'id'
  /** column name */
  | 'options';

/** columns and relationships of "auth.providers" */
export type AuthProviders = {
  __typename?: 'authProviders';
  id: Scalars['String'];
  /** An array relationship */
  userProviders: Array<AuthUserProviders>;
  /** An aggregate relationship */
  userProviders_aggregate: AuthUserProviders_Aggregate;
};


/** columns and relationships of "auth.providers" */
export type AuthProvidersUserProvidersArgs = {
  distinct_on?: InputMaybe<Array<AuthUserProviders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthUserProviders_Order_By>>;
  where?: InputMaybe<AuthUserProviders_Bool_Exp>;
};


/** columns and relationships of "auth.providers" */
export type AuthProvidersUserProviders_AggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthUserProviders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthUserProviders_Order_By>>;
  where?: InputMaybe<AuthUserProviders_Bool_Exp>;
};

/** aggregated selection of "auth.providers" */
export type AuthProviders_Aggregate = {
  __typename?: 'authProviders_aggregate';
  aggregate?: Maybe<AuthProviders_Aggregate_Fields>;
  nodes: Array<AuthProviders>;
};

/** aggregate fields of "auth.providers" */
export type AuthProviders_Aggregate_Fields = {
  __typename?: 'authProviders_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<AuthProviders_Max_Fields>;
  min?: Maybe<AuthProviders_Min_Fields>;
};


/** aggregate fields of "auth.providers" */
export type AuthProviders_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<AuthProviders_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "auth.providers". All fields are combined with a logical 'AND'. */
export type AuthProviders_Bool_Exp = {
  _and?: InputMaybe<Array<AuthProviders_Bool_Exp>>;
  _not?: InputMaybe<AuthProviders_Bool_Exp>;
  _or?: InputMaybe<Array<AuthProviders_Bool_Exp>>;
  id?: InputMaybe<String_Comparison_Exp>;
  userProviders?: InputMaybe<AuthUserProviders_Bool_Exp>;
};

/** unique or primary key constraints on table "auth.providers" */
export type AuthProviders_Constraint =
  /** unique or primary key constraint */
  | 'providers_pkey';

/** input type for inserting data into table "auth.providers" */
export type AuthProviders_Insert_Input = {
  id?: InputMaybe<Scalars['String']>;
  userProviders?: InputMaybe<AuthUserProviders_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type AuthProviders_Max_Fields = {
  __typename?: 'authProviders_max_fields';
  id?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type AuthProviders_Min_Fields = {
  __typename?: 'authProviders_min_fields';
  id?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "auth.providers" */
export type AuthProviders_Mutation_Response = {
  __typename?: 'authProviders_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<AuthProviders>;
};

/** input type for inserting object relation for remote table "auth.providers" */
export type AuthProviders_Obj_Rel_Insert_Input = {
  data: AuthProviders_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<AuthProviders_On_Conflict>;
};

/** on_conflict condition type for table "auth.providers" */
export type AuthProviders_On_Conflict = {
  constraint: AuthProviders_Constraint;
  update_columns?: Array<AuthProviders_Update_Column>;
  where?: InputMaybe<AuthProviders_Bool_Exp>;
};

/** Ordering options when selecting data from "auth.providers". */
export type AuthProviders_Order_By = {
  id?: InputMaybe<Order_By>;
  userProviders_aggregate?: InputMaybe<AuthUserProviders_Aggregate_Order_By>;
};

/** primary key columns input for table: authProviders */
export type AuthProviders_Pk_Columns_Input = {
  id: Scalars['String'];
};

/** select columns of table "auth.providers" */
export type AuthProviders_Select_Column =
  /** column name */
  | 'id';

/** input type for updating data in table "auth.providers" */
export type AuthProviders_Set_Input = {
  id?: InputMaybe<Scalars['String']>;
};

/** update columns of table "auth.providers" */
export type AuthProviders_Update_Column =
  /** column name */
  | 'id';

/** columns and relationships of "auth.refresh_tokens" */
export type AuthRefreshTokens = {
  __typename?: 'authRefreshTokens';
  createdAt: Scalars['timestamptz'];
  expiresAt: Scalars['timestamptz'];
  refreshToken: Scalars['uuid'];
  /** An object relationship */
  user: Users;
  userId: Scalars['uuid'];
};

/** aggregated selection of "auth.refresh_tokens" */
export type AuthRefreshTokens_Aggregate = {
  __typename?: 'authRefreshTokens_aggregate';
  aggregate?: Maybe<AuthRefreshTokens_Aggregate_Fields>;
  nodes: Array<AuthRefreshTokens>;
};

/** aggregate fields of "auth.refresh_tokens" */
export type AuthRefreshTokens_Aggregate_Fields = {
  __typename?: 'authRefreshTokens_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<AuthRefreshTokens_Max_Fields>;
  min?: Maybe<AuthRefreshTokens_Min_Fields>;
};


/** aggregate fields of "auth.refresh_tokens" */
export type AuthRefreshTokens_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<AuthRefreshTokens_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "auth.refresh_tokens" */
export type AuthRefreshTokens_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<AuthRefreshTokens_Max_Order_By>;
  min?: InputMaybe<AuthRefreshTokens_Min_Order_By>;
};

/** input type for inserting array relation for remote table "auth.refresh_tokens" */
export type AuthRefreshTokens_Arr_Rel_Insert_Input = {
  data: Array<AuthRefreshTokens_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<AuthRefreshTokens_On_Conflict>;
};

/** Boolean expression to filter rows from the table "auth.refresh_tokens". All fields are combined with a logical 'AND'. */
export type AuthRefreshTokens_Bool_Exp = {
  _and?: InputMaybe<Array<AuthRefreshTokens_Bool_Exp>>;
  _not?: InputMaybe<AuthRefreshTokens_Bool_Exp>;
  _or?: InputMaybe<Array<AuthRefreshTokens_Bool_Exp>>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  expiresAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  refreshToken?: InputMaybe<Uuid_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  userId?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "auth.refresh_tokens" */
export type AuthRefreshTokens_Constraint =
  /** unique or primary key constraint */
  | 'refresh_tokens_pkey';

/** input type for inserting data into table "auth.refresh_tokens" */
export type AuthRefreshTokens_Insert_Input = {
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  expiresAt?: InputMaybe<Scalars['timestamptz']>;
  refreshToken?: InputMaybe<Scalars['uuid']>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  userId?: InputMaybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type AuthRefreshTokens_Max_Fields = {
  __typename?: 'authRefreshTokens_max_fields';
  createdAt?: Maybe<Scalars['timestamptz']>;
  expiresAt?: Maybe<Scalars['timestamptz']>;
  refreshToken?: Maybe<Scalars['uuid']>;
  userId?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "auth.refresh_tokens" */
export type AuthRefreshTokens_Max_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  expiresAt?: InputMaybe<Order_By>;
  refreshToken?: InputMaybe<Order_By>;
  userId?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type AuthRefreshTokens_Min_Fields = {
  __typename?: 'authRefreshTokens_min_fields';
  createdAt?: Maybe<Scalars['timestamptz']>;
  expiresAt?: Maybe<Scalars['timestamptz']>;
  refreshToken?: Maybe<Scalars['uuid']>;
  userId?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "auth.refresh_tokens" */
export type AuthRefreshTokens_Min_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  expiresAt?: InputMaybe<Order_By>;
  refreshToken?: InputMaybe<Order_By>;
  userId?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "auth.refresh_tokens" */
export type AuthRefreshTokens_Mutation_Response = {
  __typename?: 'authRefreshTokens_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<AuthRefreshTokens>;
};

/** on_conflict condition type for table "auth.refresh_tokens" */
export type AuthRefreshTokens_On_Conflict = {
  constraint: AuthRefreshTokens_Constraint;
  update_columns?: Array<AuthRefreshTokens_Update_Column>;
  where?: InputMaybe<AuthRefreshTokens_Bool_Exp>;
};

/** Ordering options when selecting data from "auth.refresh_tokens". */
export type AuthRefreshTokens_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  expiresAt?: InputMaybe<Order_By>;
  refreshToken?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  userId?: InputMaybe<Order_By>;
};

/** primary key columns input for table: authRefreshTokens */
export type AuthRefreshTokens_Pk_Columns_Input = {
  refreshToken: Scalars['uuid'];
};

/** select columns of table "auth.refresh_tokens" */
export type AuthRefreshTokens_Select_Column =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'expiresAt'
  /** column name */
  | 'refreshToken'
  /** column name */
  | 'userId';

/** input type for updating data in table "auth.refresh_tokens" */
export type AuthRefreshTokens_Set_Input = {
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  expiresAt?: InputMaybe<Scalars['timestamptz']>;
  refreshToken?: InputMaybe<Scalars['uuid']>;
  userId?: InputMaybe<Scalars['uuid']>;
};

/** update columns of table "auth.refresh_tokens" */
export type AuthRefreshTokens_Update_Column =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'expiresAt'
  /** column name */
  | 'refreshToken'
  /** column name */
  | 'userId';

/** columns and relationships of "auth.roles" */
export type AuthRoles = {
  __typename?: 'authRoles';
  role: Scalars['String'];
  /** An array relationship */
  userRoles: Array<AuthUserRoles>;
  /** An aggregate relationship */
  userRoles_aggregate: AuthUserRoles_Aggregate;
  /** An array relationship */
  usersByDefaultRole: Array<Users>;
  /** An aggregate relationship */
  usersByDefaultRole_aggregate: Users_Aggregate;
};


/** columns and relationships of "auth.roles" */
export type AuthRolesUserRolesArgs = {
  distinct_on?: InputMaybe<Array<AuthUserRoles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthUserRoles_Order_By>>;
  where?: InputMaybe<AuthUserRoles_Bool_Exp>;
};


/** columns and relationships of "auth.roles" */
export type AuthRolesUserRoles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthUserRoles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthUserRoles_Order_By>>;
  where?: InputMaybe<AuthUserRoles_Bool_Exp>;
};


/** columns and relationships of "auth.roles" */
export type AuthRolesUsersByDefaultRoleArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};


/** columns and relationships of "auth.roles" */
export type AuthRolesUsersByDefaultRole_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};

/** aggregated selection of "auth.roles" */
export type AuthRoles_Aggregate = {
  __typename?: 'authRoles_aggregate';
  aggregate?: Maybe<AuthRoles_Aggregate_Fields>;
  nodes: Array<AuthRoles>;
};

/** aggregate fields of "auth.roles" */
export type AuthRoles_Aggregate_Fields = {
  __typename?: 'authRoles_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<AuthRoles_Max_Fields>;
  min?: Maybe<AuthRoles_Min_Fields>;
};


/** aggregate fields of "auth.roles" */
export type AuthRoles_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<AuthRoles_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "auth.roles". All fields are combined with a logical 'AND'. */
export type AuthRoles_Bool_Exp = {
  _and?: InputMaybe<Array<AuthRoles_Bool_Exp>>;
  _not?: InputMaybe<AuthRoles_Bool_Exp>;
  _or?: InputMaybe<Array<AuthRoles_Bool_Exp>>;
  role?: InputMaybe<String_Comparison_Exp>;
  userRoles?: InputMaybe<AuthUserRoles_Bool_Exp>;
  usersByDefaultRole?: InputMaybe<Users_Bool_Exp>;
};

/** unique or primary key constraints on table "auth.roles" */
export type AuthRoles_Constraint =
  /** unique or primary key constraint */
  | 'roles_pkey';

/** input type for inserting data into table "auth.roles" */
export type AuthRoles_Insert_Input = {
  role?: InputMaybe<Scalars['String']>;
  userRoles?: InputMaybe<AuthUserRoles_Arr_Rel_Insert_Input>;
  usersByDefaultRole?: InputMaybe<Users_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type AuthRoles_Max_Fields = {
  __typename?: 'authRoles_max_fields';
  role?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type AuthRoles_Min_Fields = {
  __typename?: 'authRoles_min_fields';
  role?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "auth.roles" */
export type AuthRoles_Mutation_Response = {
  __typename?: 'authRoles_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<AuthRoles>;
};

/** input type for inserting object relation for remote table "auth.roles" */
export type AuthRoles_Obj_Rel_Insert_Input = {
  data: AuthRoles_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<AuthRoles_On_Conflict>;
};

/** on_conflict condition type for table "auth.roles" */
export type AuthRoles_On_Conflict = {
  constraint: AuthRoles_Constraint;
  update_columns?: Array<AuthRoles_Update_Column>;
  where?: InputMaybe<AuthRoles_Bool_Exp>;
};

/** Ordering options when selecting data from "auth.roles". */
export type AuthRoles_Order_By = {
  role?: InputMaybe<Order_By>;
  userRoles_aggregate?: InputMaybe<AuthUserRoles_Aggregate_Order_By>;
  usersByDefaultRole_aggregate?: InputMaybe<Users_Aggregate_Order_By>;
};

/** primary key columns input for table: authRoles */
export type AuthRoles_Pk_Columns_Input = {
  role: Scalars['String'];
};

/** select columns of table "auth.roles" */
export type AuthRoles_Select_Column =
  /** column name */
  | 'role';

/** input type for updating data in table "auth.roles" */
export type AuthRoles_Set_Input = {
  role?: InputMaybe<Scalars['String']>;
};

/** update columns of table "auth.roles" */
export type AuthRoles_Update_Column =
  /** column name */
  | 'role';

/** columns and relationships of "auth.user_providers" */
export type AuthUserProviders = {
  __typename?: 'authUserProviders';
  accessToken: Scalars['String'];
  createdAt: Scalars['timestamptz'];
  id: Scalars['uuid'];
  /** An object relationship */
  provider: AuthProviders;
  providerId: Scalars['String'];
  providerUserId: Scalars['String'];
  refreshToken?: Maybe<Scalars['String']>;
  updatedAt: Scalars['timestamptz'];
  /** An object relationship */
  user: Users;
  userId: Scalars['uuid'];
};

/** aggregated selection of "auth.user_providers" */
export type AuthUserProviders_Aggregate = {
  __typename?: 'authUserProviders_aggregate';
  aggregate?: Maybe<AuthUserProviders_Aggregate_Fields>;
  nodes: Array<AuthUserProviders>;
};

/** aggregate fields of "auth.user_providers" */
export type AuthUserProviders_Aggregate_Fields = {
  __typename?: 'authUserProviders_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<AuthUserProviders_Max_Fields>;
  min?: Maybe<AuthUserProviders_Min_Fields>;
};


/** aggregate fields of "auth.user_providers" */
export type AuthUserProviders_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<AuthUserProviders_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "auth.user_providers" */
export type AuthUserProviders_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<AuthUserProviders_Max_Order_By>;
  min?: InputMaybe<AuthUserProviders_Min_Order_By>;
};

/** input type for inserting array relation for remote table "auth.user_providers" */
export type AuthUserProviders_Arr_Rel_Insert_Input = {
  data: Array<AuthUserProviders_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<AuthUserProviders_On_Conflict>;
};

/** Boolean expression to filter rows from the table "auth.user_providers". All fields are combined with a logical 'AND'. */
export type AuthUserProviders_Bool_Exp = {
  _and?: InputMaybe<Array<AuthUserProviders_Bool_Exp>>;
  _not?: InputMaybe<AuthUserProviders_Bool_Exp>;
  _or?: InputMaybe<Array<AuthUserProviders_Bool_Exp>>;
  accessToken?: InputMaybe<String_Comparison_Exp>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  provider?: InputMaybe<AuthProviders_Bool_Exp>;
  providerId?: InputMaybe<String_Comparison_Exp>;
  providerUserId?: InputMaybe<String_Comparison_Exp>;
  refreshToken?: InputMaybe<String_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  userId?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "auth.user_providers" */
export type AuthUserProviders_Constraint =
  /** unique or primary key constraint */
  | 'user_providers_pkey'
  /** unique or primary key constraint */
  | 'user_providers_provider_id_provider_user_id_key'
  /** unique or primary key constraint */
  | 'user_providers_user_id_provider_id_key';

/** input type for inserting data into table "auth.user_providers" */
export type AuthUserProviders_Insert_Input = {
  accessToken?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  provider?: InputMaybe<AuthProviders_Obj_Rel_Insert_Input>;
  providerId?: InputMaybe<Scalars['String']>;
  providerUserId?: InputMaybe<Scalars['String']>;
  refreshToken?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  userId?: InputMaybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type AuthUserProviders_Max_Fields = {
  __typename?: 'authUserProviders_max_fields';
  accessToken?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  providerId?: Maybe<Scalars['String']>;
  providerUserId?: Maybe<Scalars['String']>;
  refreshToken?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
  userId?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "auth.user_providers" */
export type AuthUserProviders_Max_Order_By = {
  accessToken?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  providerId?: InputMaybe<Order_By>;
  providerUserId?: InputMaybe<Order_By>;
  refreshToken?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
  userId?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type AuthUserProviders_Min_Fields = {
  __typename?: 'authUserProviders_min_fields';
  accessToken?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  providerId?: Maybe<Scalars['String']>;
  providerUserId?: Maybe<Scalars['String']>;
  refreshToken?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
  userId?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "auth.user_providers" */
export type AuthUserProviders_Min_Order_By = {
  accessToken?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  providerId?: InputMaybe<Order_By>;
  providerUserId?: InputMaybe<Order_By>;
  refreshToken?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
  userId?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "auth.user_providers" */
export type AuthUserProviders_Mutation_Response = {
  __typename?: 'authUserProviders_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<AuthUserProviders>;
};

/** on_conflict condition type for table "auth.user_providers" */
export type AuthUserProviders_On_Conflict = {
  constraint: AuthUserProviders_Constraint;
  update_columns?: Array<AuthUserProviders_Update_Column>;
  where?: InputMaybe<AuthUserProviders_Bool_Exp>;
};

/** Ordering options when selecting data from "auth.user_providers". */
export type AuthUserProviders_Order_By = {
  accessToken?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  provider?: InputMaybe<AuthProviders_Order_By>;
  providerId?: InputMaybe<Order_By>;
  providerUserId?: InputMaybe<Order_By>;
  refreshToken?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  userId?: InputMaybe<Order_By>;
};

/** primary key columns input for table: authUserProviders */
export type AuthUserProviders_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "auth.user_providers" */
export type AuthUserProviders_Select_Column =
  /** column name */
  | 'accessToken'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'id'
  /** column name */
  | 'providerId'
  /** column name */
  | 'providerUserId'
  /** column name */
  | 'refreshToken'
  /** column name */
  | 'updatedAt'
  /** column name */
  | 'userId';

/** input type for updating data in table "auth.user_providers" */
export type AuthUserProviders_Set_Input = {
  accessToken?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  providerId?: InputMaybe<Scalars['String']>;
  providerUserId?: InputMaybe<Scalars['String']>;
  refreshToken?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
  userId?: InputMaybe<Scalars['uuid']>;
};

/** update columns of table "auth.user_providers" */
export type AuthUserProviders_Update_Column =
  /** column name */
  | 'accessToken'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'id'
  /** column name */
  | 'providerId'
  /** column name */
  | 'providerUserId'
  /** column name */
  | 'refreshToken'
  /** column name */
  | 'updatedAt'
  /** column name */
  | 'userId';

/** columns and relationships of "auth.user_roles" */
export type AuthUserRoles = {
  __typename?: 'authUserRoles';
  createdAt: Scalars['timestamptz'];
  id: Scalars['uuid'];
  role: Scalars['String'];
  /** An object relationship */
  roleByRole: AuthRoles;
  /** An object relationship */
  user: Users;
  userId: Scalars['uuid'];
};

/** aggregated selection of "auth.user_roles" */
export type AuthUserRoles_Aggregate = {
  __typename?: 'authUserRoles_aggregate';
  aggregate?: Maybe<AuthUserRoles_Aggregate_Fields>;
  nodes: Array<AuthUserRoles>;
};

/** aggregate fields of "auth.user_roles" */
export type AuthUserRoles_Aggregate_Fields = {
  __typename?: 'authUserRoles_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<AuthUserRoles_Max_Fields>;
  min?: Maybe<AuthUserRoles_Min_Fields>;
};


/** aggregate fields of "auth.user_roles" */
export type AuthUserRoles_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<AuthUserRoles_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "auth.user_roles" */
export type AuthUserRoles_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<AuthUserRoles_Max_Order_By>;
  min?: InputMaybe<AuthUserRoles_Min_Order_By>;
};

/** input type for inserting array relation for remote table "auth.user_roles" */
export type AuthUserRoles_Arr_Rel_Insert_Input = {
  data: Array<AuthUserRoles_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<AuthUserRoles_On_Conflict>;
};

/** Boolean expression to filter rows from the table "auth.user_roles". All fields are combined with a logical 'AND'. */
export type AuthUserRoles_Bool_Exp = {
  _and?: InputMaybe<Array<AuthUserRoles_Bool_Exp>>;
  _not?: InputMaybe<AuthUserRoles_Bool_Exp>;
  _or?: InputMaybe<Array<AuthUserRoles_Bool_Exp>>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  role?: InputMaybe<String_Comparison_Exp>;
  roleByRole?: InputMaybe<AuthRoles_Bool_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  userId?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "auth.user_roles" */
export type AuthUserRoles_Constraint =
  /** unique or primary key constraint */
  | 'user_roles_pkey'
  /** unique or primary key constraint */
  | 'user_roles_user_id_role_key';

/** input type for inserting data into table "auth.user_roles" */
export type AuthUserRoles_Insert_Input = {
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  role?: InputMaybe<Scalars['String']>;
  roleByRole?: InputMaybe<AuthRoles_Obj_Rel_Insert_Input>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  userId?: InputMaybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type AuthUserRoles_Max_Fields = {
  __typename?: 'authUserRoles_max_fields';
  createdAt?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  role?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "auth.user_roles" */
export type AuthUserRoles_Max_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  role?: InputMaybe<Order_By>;
  userId?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type AuthUserRoles_Min_Fields = {
  __typename?: 'authUserRoles_min_fields';
  createdAt?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  role?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "auth.user_roles" */
export type AuthUserRoles_Min_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  role?: InputMaybe<Order_By>;
  userId?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "auth.user_roles" */
export type AuthUserRoles_Mutation_Response = {
  __typename?: 'authUserRoles_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<AuthUserRoles>;
};

/** on_conflict condition type for table "auth.user_roles" */
export type AuthUserRoles_On_Conflict = {
  constraint: AuthUserRoles_Constraint;
  update_columns?: Array<AuthUserRoles_Update_Column>;
  where?: InputMaybe<AuthUserRoles_Bool_Exp>;
};

/** Ordering options when selecting data from "auth.user_roles". */
export type AuthUserRoles_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  role?: InputMaybe<Order_By>;
  roleByRole?: InputMaybe<AuthRoles_Order_By>;
  user?: InputMaybe<Users_Order_By>;
  userId?: InputMaybe<Order_By>;
};

/** primary key columns input for table: authUserRoles */
export type AuthUserRoles_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "auth.user_roles" */
export type AuthUserRoles_Select_Column =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'id'
  /** column name */
  | 'role'
  /** column name */
  | 'userId';

/** input type for updating data in table "auth.user_roles" */
export type AuthUserRoles_Set_Input = {
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  role?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['uuid']>;
};

/** update columns of table "auth.user_roles" */
export type AuthUserRoles_Update_Column =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'id'
  /** column name */
  | 'role'
  /** column name */
  | 'userId';

/** Boolean expression to compare columns of type "citext". All fields are combined with logical 'AND'. */
export type Citext_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['citext']>;
  _gt?: InputMaybe<Scalars['citext']>;
  _gte?: InputMaybe<Scalars['citext']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['citext']>;
  _in?: InputMaybe<Array<Scalars['citext']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['citext']>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['citext']>;
  _lt?: InputMaybe<Scalars['citext']>;
  _lte?: InputMaybe<Scalars['citext']>;
  _neq?: InputMaybe<Scalars['citext']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['citext']>;
  _nin?: InputMaybe<Array<Scalars['citext']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['citext']>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['citext']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['citext']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['citext']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['citext']>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['citext']>;
};

/** Boolean expression to compare columns of type "date". All fields are combined with logical 'AND'. */
export type Date_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['date']>;
  _gt?: InputMaybe<Scalars['date']>;
  _gte?: InputMaybe<Scalars['date']>;
  _in?: InputMaybe<Array<Scalars['date']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['date']>;
  _lte?: InputMaybe<Scalars['date']>;
  _neq?: InputMaybe<Scalars['date']>;
  _nin?: InputMaybe<Array<Scalars['date']>>;
};

/** Highlights associated with documents */
export type DocumentHighlights = {
  __typename?: 'documentHighlights';
  content?: Maybe<Scalars['jsonb']>;
  createdAt: Scalars['timestamptz'];
  createdBy: Scalars['uuid'];
  /** An object relationship */
  creator: Accounts;
  /** An object relationship */
  document: Documents;
  documentId: Scalars['uuid'];
  /** An object relationship */
  file?: Maybe<Files>;
  fileId?: Maybe<Scalars['uuid']>;
  id: Scalars['uuid'];
  location: Scalars['jsonb'];
  /** base64 encoded thumbnail image */
  thumbnailImage?: Maybe<Scalars['String']>;
  updatedAt: Scalars['timestamptz'];
};


/** Highlights associated with documents */
export type DocumentHighlightsContentArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** Highlights associated with documents */
export type DocumentHighlightsLocationArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "document_highlights" */
export type DocumentHighlights_Aggregate = {
  __typename?: 'documentHighlights_aggregate';
  aggregate?: Maybe<DocumentHighlights_Aggregate_Fields>;
  nodes: Array<DocumentHighlights>;
};

/** aggregate fields of "document_highlights" */
export type DocumentHighlights_Aggregate_Fields = {
  __typename?: 'documentHighlights_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<DocumentHighlights_Max_Fields>;
  min?: Maybe<DocumentHighlights_Min_Fields>;
};


/** aggregate fields of "document_highlights" */
export type DocumentHighlights_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<DocumentHighlights_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "document_highlights" */
export type DocumentHighlights_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<DocumentHighlights_Max_Order_By>;
  min?: InputMaybe<DocumentHighlights_Min_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type DocumentHighlights_Append_Input = {
  content?: InputMaybe<Scalars['jsonb']>;
  location?: InputMaybe<Scalars['jsonb']>;
};

/** input type for inserting array relation for remote table "document_highlights" */
export type DocumentHighlights_Arr_Rel_Insert_Input = {
  data: Array<DocumentHighlights_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<DocumentHighlights_On_Conflict>;
};

/** Boolean expression to filter rows from the table "document_highlights". All fields are combined with a logical 'AND'. */
export type DocumentHighlights_Bool_Exp = {
  _and?: InputMaybe<Array<DocumentHighlights_Bool_Exp>>;
  _not?: InputMaybe<DocumentHighlights_Bool_Exp>;
  _or?: InputMaybe<Array<DocumentHighlights_Bool_Exp>>;
  content?: InputMaybe<Jsonb_Comparison_Exp>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  createdBy?: InputMaybe<Uuid_Comparison_Exp>;
  creator?: InputMaybe<Accounts_Bool_Exp>;
  document?: InputMaybe<Documents_Bool_Exp>;
  documentId?: InputMaybe<Uuid_Comparison_Exp>;
  file?: InputMaybe<Files_Bool_Exp>;
  fileId?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  location?: InputMaybe<Jsonb_Comparison_Exp>;
  thumbnailImage?: InputMaybe<String_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "document_highlights" */
export type DocumentHighlights_Constraint =
  /** unique or primary key constraint */
  | 'document_highlights_pkey';

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type DocumentHighlights_Delete_At_Path_Input = {
  content?: InputMaybe<Array<Scalars['String']>>;
  location?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type DocumentHighlights_Delete_Elem_Input = {
  content?: InputMaybe<Scalars['Int']>;
  location?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type DocumentHighlights_Delete_Key_Input = {
  content?: InputMaybe<Scalars['String']>;
  location?: InputMaybe<Scalars['String']>;
};

/** input type for inserting data into table "document_highlights" */
export type DocumentHighlights_Insert_Input = {
  content?: InputMaybe<Scalars['jsonb']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  createdBy?: InputMaybe<Scalars['uuid']>;
  creator?: InputMaybe<Accounts_Obj_Rel_Insert_Input>;
  document?: InputMaybe<Documents_Obj_Rel_Insert_Input>;
  documentId?: InputMaybe<Scalars['uuid']>;
  file?: InputMaybe<Files_Obj_Rel_Insert_Input>;
  fileId?: InputMaybe<Scalars['uuid']>;
  id?: InputMaybe<Scalars['uuid']>;
  location?: InputMaybe<Scalars['jsonb']>;
  /** base64 encoded thumbnail image */
  thumbnailImage?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type DocumentHighlights_Max_Fields = {
  __typename?: 'documentHighlights_max_fields';
  createdAt?: Maybe<Scalars['timestamptz']>;
  createdBy?: Maybe<Scalars['uuid']>;
  documentId?: Maybe<Scalars['uuid']>;
  fileId?: Maybe<Scalars['uuid']>;
  id?: Maybe<Scalars['uuid']>;
  /** base64 encoded thumbnail image */
  thumbnailImage?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "document_highlights" */
export type DocumentHighlights_Max_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  createdBy?: InputMaybe<Order_By>;
  documentId?: InputMaybe<Order_By>;
  fileId?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** base64 encoded thumbnail image */
  thumbnailImage?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type DocumentHighlights_Min_Fields = {
  __typename?: 'documentHighlights_min_fields';
  createdAt?: Maybe<Scalars['timestamptz']>;
  createdBy?: Maybe<Scalars['uuid']>;
  documentId?: Maybe<Scalars['uuid']>;
  fileId?: Maybe<Scalars['uuid']>;
  id?: Maybe<Scalars['uuid']>;
  /** base64 encoded thumbnail image */
  thumbnailImage?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "document_highlights" */
export type DocumentHighlights_Min_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  createdBy?: InputMaybe<Order_By>;
  documentId?: InputMaybe<Order_By>;
  fileId?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** base64 encoded thumbnail image */
  thumbnailImage?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "document_highlights" */
export type DocumentHighlights_Mutation_Response = {
  __typename?: 'documentHighlights_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<DocumentHighlights>;
};

/** on_conflict condition type for table "document_highlights" */
export type DocumentHighlights_On_Conflict = {
  constraint: DocumentHighlights_Constraint;
  update_columns?: Array<DocumentHighlights_Update_Column>;
  where?: InputMaybe<DocumentHighlights_Bool_Exp>;
};

/** Ordering options when selecting data from "document_highlights". */
export type DocumentHighlights_Order_By = {
  content?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  createdBy?: InputMaybe<Order_By>;
  creator?: InputMaybe<Accounts_Order_By>;
  document?: InputMaybe<Documents_Order_By>;
  documentId?: InputMaybe<Order_By>;
  file?: InputMaybe<Files_Order_By>;
  fileId?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  location?: InputMaybe<Order_By>;
  thumbnailImage?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** primary key columns input for table: documentHighlights */
export type DocumentHighlights_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type DocumentHighlights_Prepend_Input = {
  content?: InputMaybe<Scalars['jsonb']>;
  location?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "document_highlights" */
export type DocumentHighlights_Select_Column =
  /** column name */
  | 'content'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'createdBy'
  /** column name */
  | 'documentId'
  /** column name */
  | 'fileId'
  /** column name */
  | 'id'
  /** column name */
  | 'location'
  /** column name */
  | 'thumbnailImage'
  /** column name */
  | 'updatedAt';

/** input type for updating data in table "document_highlights" */
export type DocumentHighlights_Set_Input = {
  content?: InputMaybe<Scalars['jsonb']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  createdBy?: InputMaybe<Scalars['uuid']>;
  documentId?: InputMaybe<Scalars['uuid']>;
  fileId?: InputMaybe<Scalars['uuid']>;
  id?: InputMaybe<Scalars['uuid']>;
  location?: InputMaybe<Scalars['jsonb']>;
  /** base64 encoded thumbnail image */
  thumbnailImage?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "document_highlights" */
export type DocumentHighlights_Update_Column =
  /** column name */
  | 'content'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'createdBy'
  /** column name */
  | 'documentId'
  /** column name */
  | 'fileId'
  /** column name */
  | 'id'
  /** column name */
  | 'location'
  /** column name */
  | 'thumbnailImage'
  /** column name */
  | 'updatedAt';

/** Reading info about document */
export type DocumentReadingInfo = {
  __typename?: 'documentReadingInfo';
  accountId: Scalars['uuid'];
  createdAt: Scalars['timestamptz'];
  documentId: Scalars['uuid'];
  lastPage?: Maybe<Scalars['Int']>;
  location?: Maybe<Scalars['jsonb']>;
  updatedAt: Scalars['timestamptz'];
};


/** Reading info about document */
export type DocumentReadingInfoLocationArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "document_reading_info" */
export type DocumentReadingInfo_Aggregate = {
  __typename?: 'documentReadingInfo_aggregate';
  aggregate?: Maybe<DocumentReadingInfo_Aggregate_Fields>;
  nodes: Array<DocumentReadingInfo>;
};

/** aggregate fields of "document_reading_info" */
export type DocumentReadingInfo_Aggregate_Fields = {
  __typename?: 'documentReadingInfo_aggregate_fields';
  avg?: Maybe<DocumentReadingInfo_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<DocumentReadingInfo_Max_Fields>;
  min?: Maybe<DocumentReadingInfo_Min_Fields>;
  stddev?: Maybe<DocumentReadingInfo_Stddev_Fields>;
  stddev_pop?: Maybe<DocumentReadingInfo_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<DocumentReadingInfo_Stddev_Samp_Fields>;
  sum?: Maybe<DocumentReadingInfo_Sum_Fields>;
  var_pop?: Maybe<DocumentReadingInfo_Var_Pop_Fields>;
  var_samp?: Maybe<DocumentReadingInfo_Var_Samp_Fields>;
  variance?: Maybe<DocumentReadingInfo_Variance_Fields>;
};


/** aggregate fields of "document_reading_info" */
export type DocumentReadingInfo_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<DocumentReadingInfo_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "document_reading_info" */
export type DocumentReadingInfo_Aggregate_Order_By = {
  avg?: InputMaybe<DocumentReadingInfo_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<DocumentReadingInfo_Max_Order_By>;
  min?: InputMaybe<DocumentReadingInfo_Min_Order_By>;
  stddev?: InputMaybe<DocumentReadingInfo_Stddev_Order_By>;
  stddev_pop?: InputMaybe<DocumentReadingInfo_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<DocumentReadingInfo_Stddev_Samp_Order_By>;
  sum?: InputMaybe<DocumentReadingInfo_Sum_Order_By>;
  var_pop?: InputMaybe<DocumentReadingInfo_Var_Pop_Order_By>;
  var_samp?: InputMaybe<DocumentReadingInfo_Var_Samp_Order_By>;
  variance?: InputMaybe<DocumentReadingInfo_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type DocumentReadingInfo_Append_Input = {
  location?: InputMaybe<Scalars['jsonb']>;
};

/** input type for inserting array relation for remote table "document_reading_info" */
export type DocumentReadingInfo_Arr_Rel_Insert_Input = {
  data: Array<DocumentReadingInfo_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<DocumentReadingInfo_On_Conflict>;
};

/** aggregate avg on columns */
export type DocumentReadingInfo_Avg_Fields = {
  __typename?: 'documentReadingInfo_avg_fields';
  lastPage?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "document_reading_info" */
export type DocumentReadingInfo_Avg_Order_By = {
  lastPage?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "document_reading_info". All fields are combined with a logical 'AND'. */
export type DocumentReadingInfo_Bool_Exp = {
  _and?: InputMaybe<Array<DocumentReadingInfo_Bool_Exp>>;
  _not?: InputMaybe<DocumentReadingInfo_Bool_Exp>;
  _or?: InputMaybe<Array<DocumentReadingInfo_Bool_Exp>>;
  accountId?: InputMaybe<Uuid_Comparison_Exp>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  documentId?: InputMaybe<Uuid_Comparison_Exp>;
  lastPage?: InputMaybe<Int_Comparison_Exp>;
  location?: InputMaybe<Jsonb_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "document_reading_info" */
export type DocumentReadingInfo_Constraint =
  /** unique or primary key constraint */
  | 'document_reading_info_pkey';

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type DocumentReadingInfo_Delete_At_Path_Input = {
  location?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type DocumentReadingInfo_Delete_Elem_Input = {
  location?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type DocumentReadingInfo_Delete_Key_Input = {
  location?: InputMaybe<Scalars['String']>;
};

/** input type for incrementing numeric columns in table "document_reading_info" */
export type DocumentReadingInfo_Inc_Input = {
  lastPage?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "document_reading_info" */
export type DocumentReadingInfo_Insert_Input = {
  accountId?: InputMaybe<Scalars['uuid']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  documentId?: InputMaybe<Scalars['uuid']>;
  lastPage?: InputMaybe<Scalars['Int']>;
  location?: InputMaybe<Scalars['jsonb']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type DocumentReadingInfo_Max_Fields = {
  __typename?: 'documentReadingInfo_max_fields';
  accountId?: Maybe<Scalars['uuid']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  documentId?: Maybe<Scalars['uuid']>;
  lastPage?: Maybe<Scalars['Int']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "document_reading_info" */
export type DocumentReadingInfo_Max_Order_By = {
  accountId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  documentId?: InputMaybe<Order_By>;
  lastPage?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type DocumentReadingInfo_Min_Fields = {
  __typename?: 'documentReadingInfo_min_fields';
  accountId?: Maybe<Scalars['uuid']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  documentId?: Maybe<Scalars['uuid']>;
  lastPage?: Maybe<Scalars['Int']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "document_reading_info" */
export type DocumentReadingInfo_Min_Order_By = {
  accountId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  documentId?: InputMaybe<Order_By>;
  lastPage?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "document_reading_info" */
export type DocumentReadingInfo_Mutation_Response = {
  __typename?: 'documentReadingInfo_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<DocumentReadingInfo>;
};

/** input type for inserting object relation for remote table "document_reading_info" */
export type DocumentReadingInfo_Obj_Rel_Insert_Input = {
  data: DocumentReadingInfo_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<DocumentReadingInfo_On_Conflict>;
};

/** on_conflict condition type for table "document_reading_info" */
export type DocumentReadingInfo_On_Conflict = {
  constraint: DocumentReadingInfo_Constraint;
  update_columns?: Array<DocumentReadingInfo_Update_Column>;
  where?: InputMaybe<DocumentReadingInfo_Bool_Exp>;
};

/** Ordering options when selecting data from "document_reading_info". */
export type DocumentReadingInfo_Order_By = {
  accountId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  documentId?: InputMaybe<Order_By>;
  lastPage?: InputMaybe<Order_By>;
  location?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** primary key columns input for table: documentReadingInfo */
export type DocumentReadingInfo_Pk_Columns_Input = {
  accountId: Scalars['uuid'];
  documentId: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type DocumentReadingInfo_Prepend_Input = {
  location?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "document_reading_info" */
export type DocumentReadingInfo_Select_Column =
  /** column name */
  | 'accountId'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'documentId'
  /** column name */
  | 'lastPage'
  /** column name */
  | 'location'
  /** column name */
  | 'updatedAt';

/** input type for updating data in table "document_reading_info" */
export type DocumentReadingInfo_Set_Input = {
  accountId?: InputMaybe<Scalars['uuid']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  documentId?: InputMaybe<Scalars['uuid']>;
  lastPage?: InputMaybe<Scalars['Int']>;
  location?: InputMaybe<Scalars['jsonb']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate stddev on columns */
export type DocumentReadingInfo_Stddev_Fields = {
  __typename?: 'documentReadingInfo_stddev_fields';
  lastPage?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "document_reading_info" */
export type DocumentReadingInfo_Stddev_Order_By = {
  lastPage?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type DocumentReadingInfo_Stddev_Pop_Fields = {
  __typename?: 'documentReadingInfo_stddev_pop_fields';
  lastPage?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "document_reading_info" */
export type DocumentReadingInfo_Stddev_Pop_Order_By = {
  lastPage?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type DocumentReadingInfo_Stddev_Samp_Fields = {
  __typename?: 'documentReadingInfo_stddev_samp_fields';
  lastPage?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "document_reading_info" */
export type DocumentReadingInfo_Stddev_Samp_Order_By = {
  lastPage?: InputMaybe<Order_By>;
};

/** aggregate sum on columns */
export type DocumentReadingInfo_Sum_Fields = {
  __typename?: 'documentReadingInfo_sum_fields';
  lastPage?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "document_reading_info" */
export type DocumentReadingInfo_Sum_Order_By = {
  lastPage?: InputMaybe<Order_By>;
};

/** update columns of table "document_reading_info" */
export type DocumentReadingInfo_Update_Column =
  /** column name */
  | 'accountId'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'documentId'
  /** column name */
  | 'lastPage'
  /** column name */
  | 'location'
  /** column name */
  | 'updatedAt';

/** aggregate var_pop on columns */
export type DocumentReadingInfo_Var_Pop_Fields = {
  __typename?: 'documentReadingInfo_var_pop_fields';
  lastPage?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "document_reading_info" */
export type DocumentReadingInfo_Var_Pop_Order_By = {
  lastPage?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type DocumentReadingInfo_Var_Samp_Fields = {
  __typename?: 'documentReadingInfo_var_samp_fields';
  lastPage?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "document_reading_info" */
export type DocumentReadingInfo_Var_Samp_Order_By = {
  lastPage?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type DocumentReadingInfo_Variance_Fields = {
  __typename?: 'documentReadingInfo_variance_fields';
  lastPage?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "document_reading_info" */
export type DocumentReadingInfo_Variance_Order_By = {
  lastPage?: InputMaybe<Order_By>;
};

/** columns and relationships of "document_type" */
export type DocumentType = {
  __typename?: 'documentType';
  comment?: Maybe<Scalars['String']>;
  value: Scalars['String'];
};

/** aggregated selection of "document_type" */
export type DocumentType_Aggregate = {
  __typename?: 'documentType_aggregate';
  aggregate?: Maybe<DocumentType_Aggregate_Fields>;
  nodes: Array<DocumentType>;
};

/** aggregate fields of "document_type" */
export type DocumentType_Aggregate_Fields = {
  __typename?: 'documentType_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<DocumentType_Max_Fields>;
  min?: Maybe<DocumentType_Min_Fields>;
};


/** aggregate fields of "document_type" */
export type DocumentType_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<DocumentType_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "document_type". All fields are combined with a logical 'AND'. */
export type DocumentType_Bool_Exp = {
  _and?: InputMaybe<Array<DocumentType_Bool_Exp>>;
  _not?: InputMaybe<DocumentType_Bool_Exp>;
  _or?: InputMaybe<Array<DocumentType_Bool_Exp>>;
  comment?: InputMaybe<String_Comparison_Exp>;
  value?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "document_type" */
export type DocumentType_Constraint =
  /** unique or primary key constraint */
  | 'document_type_pkey';

/** input type for inserting data into table "document_type" */
export type DocumentType_Insert_Input = {
  comment?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type DocumentType_Max_Fields = {
  __typename?: 'documentType_max_fields';
  comment?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type DocumentType_Min_Fields = {
  __typename?: 'documentType_min_fields';
  comment?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "document_type" */
export type DocumentType_Mutation_Response = {
  __typename?: 'documentType_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<DocumentType>;
};

/** on_conflict condition type for table "document_type" */
export type DocumentType_On_Conflict = {
  constraint: DocumentType_Constraint;
  update_columns?: Array<DocumentType_Update_Column>;
  where?: InputMaybe<DocumentType_Bool_Exp>;
};

/** Ordering options when selecting data from "document_type". */
export type DocumentType_Order_By = {
  comment?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: documentType */
export type DocumentType_Pk_Columns_Input = {
  value: Scalars['String'];
};

/** select columns of table "document_type" */
export type DocumentType_Select_Column =
  /** column name */
  | 'comment'
  /** column name */
  | 'value';

/** input type for updating data in table "document_type" */
export type DocumentType_Set_Input = {
  comment?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
};

/** update columns of table "document_type" */
export type DocumentType_Update_Column =
  /** column name */
  | 'comment'
  /** column name */
  | 'value';

export type Document_Type_Enum =
  /** pdf document type */
  | 'pdf';

/** Boolean expression to compare columns of type "document_type_enum". All fields are combined with logical 'AND'. */
export type Document_Type_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Document_Type_Enum>;
  _in?: InputMaybe<Array<Document_Type_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<Document_Type_Enum>;
  _nin?: InputMaybe<Array<Document_Type_Enum>>;
};

/** Table with documents */
export type Documents = {
  __typename?: 'documents';
  createdAt: Scalars['timestamptz'];
  createdBy: Scalars['uuid'];
  /** An object relationship */
  creator?: Maybe<Accounts>;
  deletedAt?: Maybe<Scalars['timestamptz']>;
  /** An object relationship */
  file?: Maybe<Files>;
  fileId?: Maybe<Scalars['uuid']>;
  /** An array relationship */
  highlights: Array<DocumentHighlights>;
  /** An aggregate relationship */
  highlights_aggregate: DocumentHighlights_Aggregate;
  id: Scalars['uuid'];
  /** An array relationship */
  members: Array<AccountDocuments>;
  /** An aggregate relationship */
  members_aggregate: AccountDocuments_Aggregate;
  /** metadata associated with document */
  meta?: Maybe<Scalars['jsonb']>;
  type: Document_Type_Enum;
  /** Document last update time */
  updatedAt: Scalars['timestamptz'];
};


/** Table with documents */
export type DocumentsHighlightsArgs = {
  distinct_on?: InputMaybe<Array<DocumentHighlights_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<DocumentHighlights_Order_By>>;
  where?: InputMaybe<DocumentHighlights_Bool_Exp>;
};


/** Table with documents */
export type DocumentsHighlights_AggregateArgs = {
  distinct_on?: InputMaybe<Array<DocumentHighlights_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<DocumentHighlights_Order_By>>;
  where?: InputMaybe<DocumentHighlights_Bool_Exp>;
};


/** Table with documents */
export type DocumentsMembersArgs = {
  distinct_on?: InputMaybe<Array<AccountDocuments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AccountDocuments_Order_By>>;
  where?: InputMaybe<AccountDocuments_Bool_Exp>;
};


/** Table with documents */
export type DocumentsMembers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<AccountDocuments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AccountDocuments_Order_By>>;
  where?: InputMaybe<AccountDocuments_Bool_Exp>;
};


/** Table with documents */
export type DocumentsMetaArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** columns and relationships of "documents_admin" */
export type Documents_Admin = {
  __typename?: 'documents_admin';
  author_id?: Maybe<Scalars['uuid']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  deleted_at?: Maybe<Scalars['timestamptz']>;
  fileId?: Maybe<Scalars['uuid']>;
  id?: Maybe<Scalars['uuid']>;
  /** An array relationship */
  members: Array<AccountDocuments>;
  /** An aggregate relationship */
  members_aggregate: AccountDocuments_Aggregate;
  type?: Maybe<Scalars['String']>;
};


/** columns and relationships of "documents_admin" */
export type Documents_AdminMembersArgs = {
  distinct_on?: InputMaybe<Array<AccountDocuments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AccountDocuments_Order_By>>;
  where?: InputMaybe<AccountDocuments_Bool_Exp>;
};


/** columns and relationships of "documents_admin" */
export type Documents_AdminMembers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<AccountDocuments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AccountDocuments_Order_By>>;
  where?: InputMaybe<AccountDocuments_Bool_Exp>;
};

/** aggregated selection of "documents_admin" */
export type Documents_Admin_Aggregate = {
  __typename?: 'documents_admin_aggregate';
  aggregate?: Maybe<Documents_Admin_Aggregate_Fields>;
  nodes: Array<Documents_Admin>;
};

/** aggregate fields of "documents_admin" */
export type Documents_Admin_Aggregate_Fields = {
  __typename?: 'documents_admin_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Documents_Admin_Max_Fields>;
  min?: Maybe<Documents_Admin_Min_Fields>;
};


/** aggregate fields of "documents_admin" */
export type Documents_Admin_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Documents_Admin_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "documents_admin". All fields are combined with a logical 'AND'. */
export type Documents_Admin_Bool_Exp = {
  _and?: InputMaybe<Array<Documents_Admin_Bool_Exp>>;
  _not?: InputMaybe<Documents_Admin_Bool_Exp>;
  _or?: InputMaybe<Array<Documents_Admin_Bool_Exp>>;
  author_id?: InputMaybe<Uuid_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  deleted_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  fileId?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  members?: InputMaybe<AccountDocuments_Bool_Exp>;
  type?: InputMaybe<String_Comparison_Exp>;
};

/** input type for inserting data into table "documents_admin" */
export type Documents_Admin_Insert_Input = {
  author_id?: InputMaybe<Scalars['uuid']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']>;
  fileId?: InputMaybe<Scalars['uuid']>;
  id?: InputMaybe<Scalars['uuid']>;
  members?: InputMaybe<AccountDocuments_Arr_Rel_Insert_Input>;
  type?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Documents_Admin_Max_Fields = {
  __typename?: 'documents_admin_max_fields';
  author_id?: Maybe<Scalars['uuid']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  deleted_at?: Maybe<Scalars['timestamptz']>;
  fileId?: Maybe<Scalars['uuid']>;
  id?: Maybe<Scalars['uuid']>;
  type?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Documents_Admin_Min_Fields = {
  __typename?: 'documents_admin_min_fields';
  author_id?: Maybe<Scalars['uuid']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  deleted_at?: Maybe<Scalars['timestamptz']>;
  fileId?: Maybe<Scalars['uuid']>;
  id?: Maybe<Scalars['uuid']>;
  type?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "documents_admin" */
export type Documents_Admin_Mutation_Response = {
  __typename?: 'documents_admin_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Documents_Admin>;
};

/** Ordering options when selecting data from "documents_admin". */
export type Documents_Admin_Order_By = {
  author_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  fileId?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  members_aggregate?: InputMaybe<AccountDocuments_Aggregate_Order_By>;
  type?: InputMaybe<Order_By>;
};

/** select columns of table "documents_admin" */
export type Documents_Admin_Select_Column =
  /** column name */
  | 'author_id'
  /** column name */
  | 'created_at'
  /** column name */
  | 'deleted_at'
  /** column name */
  | 'fileId'
  /** column name */
  | 'id'
  /** column name */
  | 'type';

/** input type for updating data in table "documents_admin" */
export type Documents_Admin_Set_Input = {
  author_id?: InputMaybe<Scalars['uuid']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']>;
  fileId?: InputMaybe<Scalars['uuid']>;
  id?: InputMaybe<Scalars['uuid']>;
  type?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "documents" */
export type Documents_Aggregate = {
  __typename?: 'documents_aggregate';
  aggregate?: Maybe<Documents_Aggregate_Fields>;
  nodes: Array<Documents>;
};

/** aggregate fields of "documents" */
export type Documents_Aggregate_Fields = {
  __typename?: 'documents_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Documents_Max_Fields>;
  min?: Maybe<Documents_Min_Fields>;
};


/** aggregate fields of "documents" */
export type Documents_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Documents_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Documents_Append_Input = {
  /** metadata associated with document */
  meta?: InputMaybe<Scalars['jsonb']>;
};

/** Boolean expression to filter rows from the table "documents". All fields are combined with a logical 'AND'. */
export type Documents_Bool_Exp = {
  _and?: InputMaybe<Array<Documents_Bool_Exp>>;
  _not?: InputMaybe<Documents_Bool_Exp>;
  _or?: InputMaybe<Array<Documents_Bool_Exp>>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  createdBy?: InputMaybe<Uuid_Comparison_Exp>;
  creator?: InputMaybe<Accounts_Bool_Exp>;
  deletedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  file?: InputMaybe<Files_Bool_Exp>;
  fileId?: InputMaybe<Uuid_Comparison_Exp>;
  highlights?: InputMaybe<DocumentHighlights_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  members?: InputMaybe<AccountDocuments_Bool_Exp>;
  meta?: InputMaybe<Jsonb_Comparison_Exp>;
  type?: InputMaybe<Document_Type_Enum_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "documents" */
export type Documents_Constraint =
  /** unique or primary key constraint */
  | 'documents_pkey';

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Documents_Delete_At_Path_Input = {
  /** metadata associated with document */
  meta?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Documents_Delete_Elem_Input = {
  /** metadata associated with document */
  meta?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Documents_Delete_Key_Input = {
  /** metadata associated with document */
  meta?: InputMaybe<Scalars['String']>;
};

/** input type for inserting data into table "documents" */
export type Documents_Insert_Input = {
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  createdBy?: InputMaybe<Scalars['uuid']>;
  creator?: InputMaybe<Accounts_Obj_Rel_Insert_Input>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  file?: InputMaybe<Files_Obj_Rel_Insert_Input>;
  fileId?: InputMaybe<Scalars['uuid']>;
  highlights?: InputMaybe<DocumentHighlights_Arr_Rel_Insert_Input>;
  id?: InputMaybe<Scalars['uuid']>;
  members?: InputMaybe<AccountDocuments_Arr_Rel_Insert_Input>;
  /** metadata associated with document */
  meta?: InputMaybe<Scalars['jsonb']>;
  type?: InputMaybe<Document_Type_Enum>;
  /** Document last update time */
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Documents_Max_Fields = {
  __typename?: 'documents_max_fields';
  createdAt?: Maybe<Scalars['timestamptz']>;
  createdBy?: Maybe<Scalars['uuid']>;
  deletedAt?: Maybe<Scalars['timestamptz']>;
  fileId?: Maybe<Scalars['uuid']>;
  id?: Maybe<Scalars['uuid']>;
  /** Document last update time */
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** aggregate min on columns */
export type Documents_Min_Fields = {
  __typename?: 'documents_min_fields';
  createdAt?: Maybe<Scalars['timestamptz']>;
  createdBy?: Maybe<Scalars['uuid']>;
  deletedAt?: Maybe<Scalars['timestamptz']>;
  fileId?: Maybe<Scalars['uuid']>;
  id?: Maybe<Scalars['uuid']>;
  /** Document last update time */
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** response of any mutation on the table "documents" */
export type Documents_Mutation_Response = {
  __typename?: 'documents_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Documents>;
};

/** input type for inserting object relation for remote table "documents" */
export type Documents_Obj_Rel_Insert_Input = {
  data: Documents_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Documents_On_Conflict>;
};

/** on_conflict condition type for table "documents" */
export type Documents_On_Conflict = {
  constraint: Documents_Constraint;
  update_columns?: Array<Documents_Update_Column>;
  where?: InputMaybe<Documents_Bool_Exp>;
};

/** Ordering options when selecting data from "documents". */
export type Documents_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  createdBy?: InputMaybe<Order_By>;
  creator?: InputMaybe<Accounts_Order_By>;
  deletedAt?: InputMaybe<Order_By>;
  file?: InputMaybe<Files_Order_By>;
  fileId?: InputMaybe<Order_By>;
  highlights_aggregate?: InputMaybe<DocumentHighlights_Aggregate_Order_By>;
  id?: InputMaybe<Order_By>;
  members_aggregate?: InputMaybe<AccountDocuments_Aggregate_Order_By>;
  meta?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** primary key columns input for table: documents */
export type Documents_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Documents_Prepend_Input = {
  /** metadata associated with document */
  meta?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "documents" */
export type Documents_Select_Column =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'createdBy'
  /** column name */
  | 'deletedAt'
  /** column name */
  | 'fileId'
  /** column name */
  | 'id'
  /** column name */
  | 'meta'
  /** column name */
  | 'type'
  /** column name */
  | 'updatedAt';

/** input type for updating data in table "documents" */
export type Documents_Set_Input = {
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  createdBy?: InputMaybe<Scalars['uuid']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']>;
  fileId?: InputMaybe<Scalars['uuid']>;
  id?: InputMaybe<Scalars['uuid']>;
  /** metadata associated with document */
  meta?: InputMaybe<Scalars['jsonb']>;
  type?: InputMaybe<Document_Type_Enum>;
  /** Document last update time */
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "documents" */
export type Documents_Update_Column =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'createdBy'
  /** column name */
  | 'deletedAt'
  /** column name */
  | 'fileId'
  /** column name */
  | 'id'
  /** column name */
  | 'meta'
  /** column name */
  | 'type'
  /** column name */
  | 'updatedAt';

/** Table containing file metadata */
export type Files = {
  __typename?: 'files';
  createdAt: Scalars['timestamptz'];
  createdBy: Scalars['uuid'];
  hash?: Maybe<Scalars['String']>;
  id: Scalars['uuid'];
  size?: Maybe<Scalars['Int']>;
  sources: Scalars['jsonb'];
  updatedAt: Scalars['timestamptz'];
};


/** Table containing file metadata */
export type FilesSourcesArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "files" */
export type Files_Aggregate = {
  __typename?: 'files_aggregate';
  aggregate?: Maybe<Files_Aggregate_Fields>;
  nodes: Array<Files>;
};

/** aggregate fields of "files" */
export type Files_Aggregate_Fields = {
  __typename?: 'files_aggregate_fields';
  avg?: Maybe<Files_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Files_Max_Fields>;
  min?: Maybe<Files_Min_Fields>;
  stddev?: Maybe<Files_Stddev_Fields>;
  stddev_pop?: Maybe<Files_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Files_Stddev_Samp_Fields>;
  sum?: Maybe<Files_Sum_Fields>;
  var_pop?: Maybe<Files_Var_Pop_Fields>;
  var_samp?: Maybe<Files_Var_Samp_Fields>;
  variance?: Maybe<Files_Variance_Fields>;
};


/** aggregate fields of "files" */
export type Files_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Files_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Files_Append_Input = {
  sources?: InputMaybe<Scalars['jsonb']>;
};

/** aggregate avg on columns */
export type Files_Avg_Fields = {
  __typename?: 'files_avg_fields';
  size?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "files". All fields are combined with a logical 'AND'. */
export type Files_Bool_Exp = {
  _and?: InputMaybe<Array<Files_Bool_Exp>>;
  _not?: InputMaybe<Files_Bool_Exp>;
  _or?: InputMaybe<Array<Files_Bool_Exp>>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  createdBy?: InputMaybe<Uuid_Comparison_Exp>;
  hash?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  size?: InputMaybe<Int_Comparison_Exp>;
  sources?: InputMaybe<Jsonb_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "files" */
export type Files_Constraint =
  /** unique or primary key constraint */
  | 'files_pkey';

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Files_Delete_At_Path_Input = {
  sources?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Files_Delete_Elem_Input = {
  sources?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Files_Delete_Key_Input = {
  sources?: InputMaybe<Scalars['String']>;
};

/** input type for incrementing numeric columns in table "files" */
export type Files_Inc_Input = {
  size?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "files" */
export type Files_Insert_Input = {
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  createdBy?: InputMaybe<Scalars['uuid']>;
  hash?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  size?: InputMaybe<Scalars['Int']>;
  sources?: InputMaybe<Scalars['jsonb']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Files_Max_Fields = {
  __typename?: 'files_max_fields';
  createdAt?: Maybe<Scalars['timestamptz']>;
  createdBy?: Maybe<Scalars['uuid']>;
  hash?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  size?: Maybe<Scalars['Int']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** aggregate min on columns */
export type Files_Min_Fields = {
  __typename?: 'files_min_fields';
  createdAt?: Maybe<Scalars['timestamptz']>;
  createdBy?: Maybe<Scalars['uuid']>;
  hash?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  size?: Maybe<Scalars['Int']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** response of any mutation on the table "files" */
export type Files_Mutation_Response = {
  __typename?: 'files_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Files>;
};

/** input type for inserting object relation for remote table "files" */
export type Files_Obj_Rel_Insert_Input = {
  data: Files_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Files_On_Conflict>;
};

/** on_conflict condition type for table "files" */
export type Files_On_Conflict = {
  constraint: Files_Constraint;
  update_columns?: Array<Files_Update_Column>;
  where?: InputMaybe<Files_Bool_Exp>;
};

/** Ordering options when selecting data from "files". */
export type Files_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  createdBy?: InputMaybe<Order_By>;
  hash?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  size?: InputMaybe<Order_By>;
  sources?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** primary key columns input for table: files */
export type Files_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Files_Prepend_Input = {
  sources?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "files" */
export type Files_Select_Column =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'createdBy'
  /** column name */
  | 'hash'
  /** column name */
  | 'id'
  /** column name */
  | 'size'
  /** column name */
  | 'sources'
  /** column name */
  | 'updatedAt';

/** input type for updating data in table "files" */
export type Files_Set_Input = {
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  createdBy?: InputMaybe<Scalars['uuid']>;
  hash?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  size?: InputMaybe<Scalars['Int']>;
  sources?: InputMaybe<Scalars['jsonb']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate stddev on columns */
export type Files_Stddev_Fields = {
  __typename?: 'files_stddev_fields';
  size?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type Files_Stddev_Pop_Fields = {
  __typename?: 'files_stddev_pop_fields';
  size?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type Files_Stddev_Samp_Fields = {
  __typename?: 'files_stddev_samp_fields';
  size?: Maybe<Scalars['Float']>;
};

/** aggregate sum on columns */
export type Files_Sum_Fields = {
  __typename?: 'files_sum_fields';
  size?: Maybe<Scalars['Int']>;
};

/** update columns of table "files" */
export type Files_Update_Column =
  /** column name */
  | 'createdAt'
  /** column name */
  | 'createdBy'
  /** column name */
  | 'hash'
  /** column name */
  | 'id'
  /** column name */
  | 'size'
  /** column name */
  | 'sources'
  /** column name */
  | 'updatedAt';

/** aggregate var_pop on columns */
export type Files_Var_Pop_Fields = {
  __typename?: 'files_var_pop_fields';
  size?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type Files_Var_Samp_Fields = {
  __typename?: 'files_var_samp_fields';
  size?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type Files_Variance_Fields = {
  __typename?: 'files_variance_fields';
  size?: Maybe<Scalars['Float']>;
};

export type Jsonb_Cast_Exp = {
  String?: InputMaybe<String_Comparison_Exp>;
};

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export type Jsonb_Comparison_Exp = {
  _cast?: InputMaybe<Jsonb_Cast_Exp>;
  /** is the column contained in the given json value */
  _contained_in?: InputMaybe<Scalars['jsonb']>;
  /** does the column contain the given json value at the top level */
  _contains?: InputMaybe<Scalars['jsonb']>;
  _eq?: InputMaybe<Scalars['jsonb']>;
  _gt?: InputMaybe<Scalars['jsonb']>;
  _gte?: InputMaybe<Scalars['jsonb']>;
  /** does the string exist as a top-level key in the column */
  _has_key?: InputMaybe<Scalars['String']>;
  /** do all of these strings exist as top-level keys in the column */
  _has_keys_all?: InputMaybe<Array<Scalars['String']>>;
  /** do any of these strings exist as top-level keys in the column */
  _has_keys_any?: InputMaybe<Array<Scalars['String']>>;
  _in?: InputMaybe<Array<Scalars['jsonb']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['jsonb']>;
  _lte?: InputMaybe<Scalars['jsonb']>;
  _neq?: InputMaybe<Scalars['jsonb']>;
  _nin?: InputMaybe<Array<Scalars['jsonb']>>;
};

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  /** Creates post policy for uploading document images */
  createDocumentImagePostPolicy: DocumentImagePostPolicyOutput;
  /** Create file method to generate minio presigned url for upload */
  createFile?: Maybe<CreateFileOutput>;
  /** Creates file download url */
  createFileDownloadUrl?: Maybe<FileDownloadUrlOutput>;
  /** delete single row from the table: "accounts" */
  deleteAccount?: Maybe<Accounts>;
  /** delete single row from the table: "accounts_documents" */
  deleteAccountDocument?: Maybe<AccountDocuments>;
  /** delete single row from the table: "account_document_roles" */
  deleteAccountDocumentRole?: Maybe<AccountDocumentRoles>;
  /** delete data from the table: "account_document_roles" */
  deleteAccountDocumentRoles?: Maybe<AccountDocumentRoles_Mutation_Response>;
  /** delete data from the table: "accounts_documents" */
  deleteAccountDocuments?: Maybe<AccountDocuments_Mutation_Response>;
  /** delete data from the table: "accounts" */
  deleteAccounts?: Maybe<Accounts_Mutation_Response>;
  /** delete single row from the table: "auth.providers" */
  deleteAuthProvider?: Maybe<AuthProviders>;
  /** delete single row from the table: "auth.provider_requests" */
  deleteAuthProviderRequest?: Maybe<AuthProviderRequests>;
  /** delete data from the table: "auth.provider_requests" */
  deleteAuthProviderRequests?: Maybe<AuthProviderRequests_Mutation_Response>;
  /** delete data from the table: "auth.providers" */
  deleteAuthProviders?: Maybe<AuthProviders_Mutation_Response>;
  /** delete single row from the table: "auth.refresh_tokens" */
  deleteAuthRefreshToken?: Maybe<AuthRefreshTokens>;
  /** delete data from the table: "auth.refresh_tokens" */
  deleteAuthRefreshTokens?: Maybe<AuthRefreshTokens_Mutation_Response>;
  /** delete single row from the table: "auth.roles" */
  deleteAuthRole?: Maybe<AuthRoles>;
  /** delete data from the table: "auth.roles" */
  deleteAuthRoles?: Maybe<AuthRoles_Mutation_Response>;
  /** delete single row from the table: "auth.user_providers" */
  deleteAuthUserProvider?: Maybe<AuthUserProviders>;
  /** delete data from the table: "auth.user_providers" */
  deleteAuthUserProviders?: Maybe<AuthUserProviders_Mutation_Response>;
  /** delete single row from the table: "auth.user_roles" */
  deleteAuthUserRole?: Maybe<AuthUserRoles>;
  /** delete data from the table: "auth.user_roles" */
  deleteAuthUserRoles?: Maybe<AuthUserRoles_Mutation_Response>;
  /** delete single row from the table: "documents" */
  deleteDocument?: Maybe<Documents>;
  /** delete single row from the table: "document_highlights" */
  deleteDocumentHighlight?: Maybe<DocumentHighlights>;
  /** delete data from the table: "document_highlights" */
  deleteDocumentHighlights?: Maybe<DocumentHighlights_Mutation_Response>;
  /** delete single row from the table: "document_reading_info" */
  deleteDocumentReadingInfo?: Maybe<DocumentReadingInfo>;
  /** delete data from the table: "document_reading_info" */
  deleteDocumentReadingInfos?: Maybe<DocumentReadingInfo_Mutation_Response>;
  /** delete single row from the table: "document_type" */
  deleteDocumentType?: Maybe<DocumentType>;
  /** delete data from the table: "document_type" */
  deleteDocumentTypes?: Maybe<DocumentType_Mutation_Response>;
  /** delete data from the table: "documents" */
  deleteDocuments?: Maybe<Documents_Mutation_Response>;
  /** delete single row from the table: "files" */
  deleteFile?: Maybe<Files>;
  /** delete data from the table: "files" */
  deleteFiles?: Maybe<Files_Mutation_Response>;
  /** delete single row from the table: "auth.users" */
  deleteUser?: Maybe<Users>;
  /** delete data from the table: "auth.users" */
  deleteUsers?: Maybe<Users_Mutation_Response>;
  /** delete data from the table: "documents_admin" */
  delete_documents_admin?: Maybe<Documents_Admin_Mutation_Response>;
  /** insert data into the table: "accounts" */
  inserAccounts?: Maybe<Accounts_Mutation_Response>;
  /** insert a single row into the table: "accounts" */
  insertAccount?: Maybe<Accounts>;
  /** insert a single row into the table: "accounts_documents" */
  insertAccountDocument?: Maybe<AccountDocuments>;
  /** insert a single row into the table: "account_document_roles" */
  insertAccountDocumentRole?: Maybe<AccountDocumentRoles>;
  /** insert data into the table: "account_document_roles" */
  insertAccountDocumentRoles?: Maybe<AccountDocumentRoles_Mutation_Response>;
  /** insert data into the table: "accounts_documents" */
  insertAccountDocuments?: Maybe<AccountDocuments_Mutation_Response>;
  /** insert a single row into the table: "auth.providers" */
  insertAuthProvider?: Maybe<AuthProviders>;
  /** insert a single row into the table: "auth.provider_requests" */
  insertAuthProviderRequest?: Maybe<AuthProviderRequests>;
  /** insert data into the table: "auth.provider_requests" */
  insertAuthProviderRequests?: Maybe<AuthProviderRequests_Mutation_Response>;
  /** insert data into the table: "auth.providers" */
  insertAuthProviders?: Maybe<AuthProviders_Mutation_Response>;
  /** insert a single row into the table: "auth.refresh_tokens" */
  insertAuthRefreshToken?: Maybe<AuthRefreshTokens>;
  /** insert data into the table: "auth.refresh_tokens" */
  insertAuthRefreshTokens?: Maybe<AuthRefreshTokens_Mutation_Response>;
  /** insert a single row into the table: "auth.roles" */
  insertAuthRole?: Maybe<AuthRoles>;
  /** insert data into the table: "auth.roles" */
  insertAuthRoles?: Maybe<AuthRoles_Mutation_Response>;
  /** insert a single row into the table: "auth.user_providers" */
  insertAuthUserProvider?: Maybe<AuthUserProviders>;
  /** insert data into the table: "auth.user_providers" */
  insertAuthUserProviders?: Maybe<AuthUserProviders_Mutation_Response>;
  /** insert a single row into the table: "auth.user_roles" */
  insertAuthUserRole?: Maybe<AuthUserRoles>;
  /** insert data into the table: "auth.user_roles" */
  insertAuthUserRoles?: Maybe<AuthUserRoles_Mutation_Response>;
  /** insert a single row into the table: "documents" */
  insertDocument?: Maybe<Documents>;
  /** insert a single row into the table: "document_highlights" */
  insertDocumentHighlight?: Maybe<DocumentHighlights>;
  /** insert data into the table: "document_highlights" */
  insertDocumentHighlights?: Maybe<DocumentHighlights_Mutation_Response>;
  /** insert a single row into the table: "document_reading_info" */
  insertDocumentReadingInfo?: Maybe<DocumentReadingInfo>;
  /** insert data into the table: "document_reading_info" */
  insertDocumentReadingInfos?: Maybe<DocumentReadingInfo_Mutation_Response>;
  /** insert a single row into the table: "document_type" */
  insertDocumentType?: Maybe<DocumentType>;
  /** insert data into the table: "document_type" */
  insertDocumentTypes?: Maybe<DocumentType_Mutation_Response>;
  /** insert data into the table: "documents" */
  insertDocuments?: Maybe<Documents_Mutation_Response>;
  /** insert a single row into the table: "files" */
  insertFile?: Maybe<Files>;
  /** insert data into the table: "files" */
  insertFiles?: Maybe<Files_Mutation_Response>;
  /** insert a single row into the table: "auth.users" */
  insertUser?: Maybe<Users>;
  /** insert data into the table: "auth.users" */
  insertUsers?: Maybe<Users_Mutation_Response>;
  /** insert data into the table: "documents_admin" */
  insert_documents_admin?: Maybe<Documents_Admin_Mutation_Response>;
  /** insert a single row into the table: "documents_admin" */
  insert_documents_admin_one?: Maybe<Documents_Admin>;
  /** update single row of the table: "accounts" */
  updateAccount?: Maybe<Accounts>;
  /** update single row of the table: "accounts_documents" */
  updateAccountDocument?: Maybe<AccountDocuments>;
  /** update single row of the table: "account_document_roles" */
  updateAccountDocumentRole?: Maybe<AccountDocumentRoles>;
  /** update data of the table: "account_document_roles" */
  updateAccountDocumentRoles?: Maybe<AccountDocumentRoles_Mutation_Response>;
  /** update data of the table: "accounts_documents" */
  updateAccountDocuments?: Maybe<AccountDocuments_Mutation_Response>;
  /** update data of the table: "accounts" */
  updateAccounts?: Maybe<Accounts_Mutation_Response>;
  /** update single row of the table: "auth.providers" */
  updateAuthProvider?: Maybe<AuthProviders>;
  /** update single row of the table: "auth.provider_requests" */
  updateAuthProviderRequest?: Maybe<AuthProviderRequests>;
  /** update data of the table: "auth.provider_requests" */
  updateAuthProviderRequests?: Maybe<AuthProviderRequests_Mutation_Response>;
  /** update data of the table: "auth.providers" */
  updateAuthProviders?: Maybe<AuthProviders_Mutation_Response>;
  /** update single row of the table: "auth.refresh_tokens" */
  updateAuthRefreshToken?: Maybe<AuthRefreshTokens>;
  /** update data of the table: "auth.refresh_tokens" */
  updateAuthRefreshTokens?: Maybe<AuthRefreshTokens_Mutation_Response>;
  /** update single row of the table: "auth.roles" */
  updateAuthRole?: Maybe<AuthRoles>;
  /** update data of the table: "auth.roles" */
  updateAuthRoles?: Maybe<AuthRoles_Mutation_Response>;
  /** update single row of the table: "auth.user_providers" */
  updateAuthUserProvider?: Maybe<AuthUserProviders>;
  /** update data of the table: "auth.user_providers" */
  updateAuthUserProviders?: Maybe<AuthUserProviders_Mutation_Response>;
  /** update single row of the table: "auth.user_roles" */
  updateAuthUserRole?: Maybe<AuthUserRoles>;
  /** update data of the table: "auth.user_roles" */
  updateAuthUserRoles?: Maybe<AuthUserRoles_Mutation_Response>;
  /** update single row of the table: "documents" */
  updateDocument?: Maybe<Documents>;
  /** update single row of the table: "document_highlights" */
  updateDocumentHighlight?: Maybe<DocumentHighlights>;
  /** update data of the table: "document_highlights" */
  updateDocumentHighlights?: Maybe<DocumentHighlights_Mutation_Response>;
  /** update single row of the table: "document_reading_info" */
  updateDocumentReadingInfo?: Maybe<DocumentReadingInfo>;
  /** update data of the table: "document_reading_info" */
  updateDocumentReadingInfos?: Maybe<DocumentReadingInfo_Mutation_Response>;
  /** update single row of the table: "document_type" */
  updateDocumentType?: Maybe<DocumentType>;
  /** update data of the table: "document_type" */
  updateDocumentTypes?: Maybe<DocumentType_Mutation_Response>;
  /** update data of the table: "documents" */
  updateDocuments?: Maybe<Documents_Mutation_Response>;
  /** update single row of the table: "files" */
  updateFile?: Maybe<Files>;
  /** update data of the table: "files" */
  updateFiles?: Maybe<Files_Mutation_Response>;
  /** update single row of the table: "auth.users" */
  updateUser?: Maybe<Users>;
  /** update data of the table: "auth.users" */
  updateUsers?: Maybe<Users_Mutation_Response>;
  /** update data of the table: "documents_admin" */
  update_documents_admin?: Maybe<Documents_Admin_Mutation_Response>;
};


/** mutation root */
export type Mutation_RootCreateDocumentImagePostPolicyArgs = {
  documentId: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootCreateFileArgs = {
  sources?: InputMaybe<Scalars['jsonb']>;
};


/** mutation root */
export type Mutation_RootCreateFileDownloadUrlArgs = {
  fileId: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDeleteAccountArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDeleteAccountDocumentArgs = {
  accountId: Scalars['uuid'];
  documentId: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDeleteAccountDocumentRoleArgs = {
  value: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDeleteAccountDocumentRolesArgs = {
  where: AccountDocumentRoles_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDeleteAccountDocumentsArgs = {
  where: AccountDocuments_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDeleteAccountsArgs = {
  where: Accounts_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDeleteAuthProviderArgs = {
  id: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDeleteAuthProviderRequestArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDeleteAuthProviderRequestsArgs = {
  where: AuthProviderRequests_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDeleteAuthProvidersArgs = {
  where: AuthProviders_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDeleteAuthRefreshTokenArgs = {
  refreshToken: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDeleteAuthRefreshTokensArgs = {
  where: AuthRefreshTokens_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDeleteAuthRoleArgs = {
  role: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDeleteAuthRolesArgs = {
  where: AuthRoles_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDeleteAuthUserProviderArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDeleteAuthUserProvidersArgs = {
  where: AuthUserProviders_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDeleteAuthUserRoleArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDeleteAuthUserRolesArgs = {
  where: AuthUserRoles_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDeleteDocumentArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDeleteDocumentHighlightArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDeleteDocumentHighlightsArgs = {
  where: DocumentHighlights_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDeleteDocumentReadingInfoArgs = {
  accountId: Scalars['uuid'];
  documentId: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDeleteDocumentReadingInfosArgs = {
  where: DocumentReadingInfo_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDeleteDocumentTypeArgs = {
  value: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDeleteDocumentTypesArgs = {
  where: DocumentType_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDeleteDocumentsArgs = {
  where: Documents_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDeleteFileArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDeleteFilesArgs = {
  where: Files_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDeleteUserArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDeleteUsersArgs = {
  where: Users_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Documents_AdminArgs = {
  where: Documents_Admin_Bool_Exp;
};


/** mutation root */
export type Mutation_RootInserAccountsArgs = {
  objects: Array<Accounts_Insert_Input>;
  on_conflict?: InputMaybe<Accounts_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertAccountArgs = {
  object: Accounts_Insert_Input;
  on_conflict?: InputMaybe<Accounts_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertAccountDocumentArgs = {
  object: AccountDocuments_Insert_Input;
  on_conflict?: InputMaybe<AccountDocuments_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertAccountDocumentRoleArgs = {
  object: AccountDocumentRoles_Insert_Input;
  on_conflict?: InputMaybe<AccountDocumentRoles_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertAccountDocumentRolesArgs = {
  objects: Array<AccountDocumentRoles_Insert_Input>;
  on_conflict?: InputMaybe<AccountDocumentRoles_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertAccountDocumentsArgs = {
  objects: Array<AccountDocuments_Insert_Input>;
  on_conflict?: InputMaybe<AccountDocuments_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertAuthProviderArgs = {
  object: AuthProviders_Insert_Input;
  on_conflict?: InputMaybe<AuthProviders_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertAuthProviderRequestArgs = {
  object: AuthProviderRequests_Insert_Input;
  on_conflict?: InputMaybe<AuthProviderRequests_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertAuthProviderRequestsArgs = {
  objects: Array<AuthProviderRequests_Insert_Input>;
  on_conflict?: InputMaybe<AuthProviderRequests_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertAuthProvidersArgs = {
  objects: Array<AuthProviders_Insert_Input>;
  on_conflict?: InputMaybe<AuthProviders_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertAuthRefreshTokenArgs = {
  object: AuthRefreshTokens_Insert_Input;
  on_conflict?: InputMaybe<AuthRefreshTokens_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertAuthRefreshTokensArgs = {
  objects: Array<AuthRefreshTokens_Insert_Input>;
  on_conflict?: InputMaybe<AuthRefreshTokens_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertAuthRoleArgs = {
  object: AuthRoles_Insert_Input;
  on_conflict?: InputMaybe<AuthRoles_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertAuthRolesArgs = {
  objects: Array<AuthRoles_Insert_Input>;
  on_conflict?: InputMaybe<AuthRoles_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertAuthUserProviderArgs = {
  object: AuthUserProviders_Insert_Input;
  on_conflict?: InputMaybe<AuthUserProviders_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertAuthUserProvidersArgs = {
  objects: Array<AuthUserProviders_Insert_Input>;
  on_conflict?: InputMaybe<AuthUserProviders_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertAuthUserRoleArgs = {
  object: AuthUserRoles_Insert_Input;
  on_conflict?: InputMaybe<AuthUserRoles_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertAuthUserRolesArgs = {
  objects: Array<AuthUserRoles_Insert_Input>;
  on_conflict?: InputMaybe<AuthUserRoles_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertDocumentArgs = {
  object: Documents_Insert_Input;
  on_conflict?: InputMaybe<Documents_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertDocumentHighlightArgs = {
  object: DocumentHighlights_Insert_Input;
  on_conflict?: InputMaybe<DocumentHighlights_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertDocumentHighlightsArgs = {
  objects: Array<DocumentHighlights_Insert_Input>;
  on_conflict?: InputMaybe<DocumentHighlights_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertDocumentReadingInfoArgs = {
  object: DocumentReadingInfo_Insert_Input;
  on_conflict?: InputMaybe<DocumentReadingInfo_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertDocumentReadingInfosArgs = {
  objects: Array<DocumentReadingInfo_Insert_Input>;
  on_conflict?: InputMaybe<DocumentReadingInfo_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertDocumentTypeArgs = {
  object: DocumentType_Insert_Input;
  on_conflict?: InputMaybe<DocumentType_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertDocumentTypesArgs = {
  objects: Array<DocumentType_Insert_Input>;
  on_conflict?: InputMaybe<DocumentType_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertDocumentsArgs = {
  objects: Array<Documents_Insert_Input>;
  on_conflict?: InputMaybe<Documents_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertFileArgs = {
  object: Files_Insert_Input;
  on_conflict?: InputMaybe<Files_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertFilesArgs = {
  objects: Array<Files_Insert_Input>;
  on_conflict?: InputMaybe<Files_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertUserArgs = {
  object: Users_Insert_Input;
  on_conflict?: InputMaybe<Users_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertUsersArgs = {
  objects: Array<Users_Insert_Input>;
  on_conflict?: InputMaybe<Users_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Documents_AdminArgs = {
  objects: Array<Documents_Admin_Insert_Input>;
};


/** mutation root */
export type Mutation_RootInsert_Documents_Admin_OneArgs = {
  object: Documents_Admin_Insert_Input;
};


/** mutation root */
export type Mutation_RootUpdateAccountArgs = {
  _set?: InputMaybe<Accounts_Set_Input>;
  pk_columns: Accounts_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdateAccountDocumentArgs = {
  _set?: InputMaybe<AccountDocuments_Set_Input>;
  pk_columns: AccountDocuments_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdateAccountDocumentRoleArgs = {
  _set?: InputMaybe<AccountDocumentRoles_Set_Input>;
  pk_columns: AccountDocumentRoles_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdateAccountDocumentRolesArgs = {
  _set?: InputMaybe<AccountDocumentRoles_Set_Input>;
  where: AccountDocumentRoles_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdateAccountDocumentsArgs = {
  _set?: InputMaybe<AccountDocuments_Set_Input>;
  where: AccountDocuments_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdateAccountsArgs = {
  _set?: InputMaybe<Accounts_Set_Input>;
  where: Accounts_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdateAuthProviderArgs = {
  _set?: InputMaybe<AuthProviders_Set_Input>;
  pk_columns: AuthProviders_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdateAuthProviderRequestArgs = {
  _append?: InputMaybe<AuthProviderRequests_Append_Input>;
  _delete_at_path?: InputMaybe<AuthProviderRequests_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<AuthProviderRequests_Delete_Elem_Input>;
  _delete_key?: InputMaybe<AuthProviderRequests_Delete_Key_Input>;
  _prepend?: InputMaybe<AuthProviderRequests_Prepend_Input>;
  _set?: InputMaybe<AuthProviderRequests_Set_Input>;
  pk_columns: AuthProviderRequests_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdateAuthProviderRequestsArgs = {
  _append?: InputMaybe<AuthProviderRequests_Append_Input>;
  _delete_at_path?: InputMaybe<AuthProviderRequests_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<AuthProviderRequests_Delete_Elem_Input>;
  _delete_key?: InputMaybe<AuthProviderRequests_Delete_Key_Input>;
  _prepend?: InputMaybe<AuthProviderRequests_Prepend_Input>;
  _set?: InputMaybe<AuthProviderRequests_Set_Input>;
  where: AuthProviderRequests_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdateAuthProvidersArgs = {
  _set?: InputMaybe<AuthProviders_Set_Input>;
  where: AuthProviders_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdateAuthRefreshTokenArgs = {
  _set?: InputMaybe<AuthRefreshTokens_Set_Input>;
  pk_columns: AuthRefreshTokens_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdateAuthRefreshTokensArgs = {
  _set?: InputMaybe<AuthRefreshTokens_Set_Input>;
  where: AuthRefreshTokens_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdateAuthRoleArgs = {
  _set?: InputMaybe<AuthRoles_Set_Input>;
  pk_columns: AuthRoles_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdateAuthRolesArgs = {
  _set?: InputMaybe<AuthRoles_Set_Input>;
  where: AuthRoles_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdateAuthUserProviderArgs = {
  _set?: InputMaybe<AuthUserProviders_Set_Input>;
  pk_columns: AuthUserProviders_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdateAuthUserProvidersArgs = {
  _set?: InputMaybe<AuthUserProviders_Set_Input>;
  where: AuthUserProviders_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdateAuthUserRoleArgs = {
  _set?: InputMaybe<AuthUserRoles_Set_Input>;
  pk_columns: AuthUserRoles_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdateAuthUserRolesArgs = {
  _set?: InputMaybe<AuthUserRoles_Set_Input>;
  where: AuthUserRoles_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdateDocumentArgs = {
  _append?: InputMaybe<Documents_Append_Input>;
  _delete_at_path?: InputMaybe<Documents_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Documents_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Documents_Delete_Key_Input>;
  _prepend?: InputMaybe<Documents_Prepend_Input>;
  _set?: InputMaybe<Documents_Set_Input>;
  pk_columns: Documents_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdateDocumentHighlightArgs = {
  _append?: InputMaybe<DocumentHighlights_Append_Input>;
  _delete_at_path?: InputMaybe<DocumentHighlights_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<DocumentHighlights_Delete_Elem_Input>;
  _delete_key?: InputMaybe<DocumentHighlights_Delete_Key_Input>;
  _prepend?: InputMaybe<DocumentHighlights_Prepend_Input>;
  _set?: InputMaybe<DocumentHighlights_Set_Input>;
  pk_columns: DocumentHighlights_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdateDocumentHighlightsArgs = {
  _append?: InputMaybe<DocumentHighlights_Append_Input>;
  _delete_at_path?: InputMaybe<DocumentHighlights_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<DocumentHighlights_Delete_Elem_Input>;
  _delete_key?: InputMaybe<DocumentHighlights_Delete_Key_Input>;
  _prepend?: InputMaybe<DocumentHighlights_Prepend_Input>;
  _set?: InputMaybe<DocumentHighlights_Set_Input>;
  where: DocumentHighlights_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdateDocumentReadingInfoArgs = {
  _append?: InputMaybe<DocumentReadingInfo_Append_Input>;
  _delete_at_path?: InputMaybe<DocumentReadingInfo_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<DocumentReadingInfo_Delete_Elem_Input>;
  _delete_key?: InputMaybe<DocumentReadingInfo_Delete_Key_Input>;
  _inc?: InputMaybe<DocumentReadingInfo_Inc_Input>;
  _prepend?: InputMaybe<DocumentReadingInfo_Prepend_Input>;
  _set?: InputMaybe<DocumentReadingInfo_Set_Input>;
  pk_columns: DocumentReadingInfo_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdateDocumentReadingInfosArgs = {
  _append?: InputMaybe<DocumentReadingInfo_Append_Input>;
  _delete_at_path?: InputMaybe<DocumentReadingInfo_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<DocumentReadingInfo_Delete_Elem_Input>;
  _delete_key?: InputMaybe<DocumentReadingInfo_Delete_Key_Input>;
  _inc?: InputMaybe<DocumentReadingInfo_Inc_Input>;
  _prepend?: InputMaybe<DocumentReadingInfo_Prepend_Input>;
  _set?: InputMaybe<DocumentReadingInfo_Set_Input>;
  where: DocumentReadingInfo_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdateDocumentTypeArgs = {
  _set?: InputMaybe<DocumentType_Set_Input>;
  pk_columns: DocumentType_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdateDocumentTypesArgs = {
  _set?: InputMaybe<DocumentType_Set_Input>;
  where: DocumentType_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdateDocumentsArgs = {
  _append?: InputMaybe<Documents_Append_Input>;
  _delete_at_path?: InputMaybe<Documents_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Documents_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Documents_Delete_Key_Input>;
  _prepend?: InputMaybe<Documents_Prepend_Input>;
  _set?: InputMaybe<Documents_Set_Input>;
  where: Documents_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdateFileArgs = {
  _append?: InputMaybe<Files_Append_Input>;
  _delete_at_path?: InputMaybe<Files_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Files_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Files_Delete_Key_Input>;
  _inc?: InputMaybe<Files_Inc_Input>;
  _prepend?: InputMaybe<Files_Prepend_Input>;
  _set?: InputMaybe<Files_Set_Input>;
  pk_columns: Files_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdateFilesArgs = {
  _append?: InputMaybe<Files_Append_Input>;
  _delete_at_path?: InputMaybe<Files_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Files_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Files_Delete_Key_Input>;
  _inc?: InputMaybe<Files_Inc_Input>;
  _prepend?: InputMaybe<Files_Prepend_Input>;
  _set?: InputMaybe<Files_Set_Input>;
  where: Files_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdateUserArgs = {
  _append?: InputMaybe<Users_Append_Input>;
  _delete_at_path?: InputMaybe<Users_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Users_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Users_Delete_Key_Input>;
  _prepend?: InputMaybe<Users_Prepend_Input>;
  _set?: InputMaybe<Users_Set_Input>;
  pk_columns: Users_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdateUsersArgs = {
  _append?: InputMaybe<Users_Append_Input>;
  _delete_at_path?: InputMaybe<Users_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Users_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Users_Delete_Key_Input>;
  _prepend?: InputMaybe<Users_Prepend_Input>;
  _set?: InputMaybe<Users_Set_Input>;
  where: Users_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Documents_AdminArgs = {
  _set?: InputMaybe<Documents_Admin_Set_Input>;
  where: Documents_Admin_Bool_Exp;
};

/** column ordering options */
export type Order_By =
  /** in ascending order, nulls last */
  | 'asc'
  /** in ascending order, nulls first */
  | 'asc_nulls_first'
  /** in ascending order, nulls last */
  | 'asc_nulls_last'
  /** in descending order, nulls first */
  | 'desc'
  /** in descending order, nulls first */
  | 'desc_nulls_first'
  /** in descending order, nulls last */
  | 'desc_nulls_last';

export type Query_Root = {
  __typename?: 'query_root';
  /** fetch data from the table: "accounts" using primary key columns */
  account?: Maybe<Accounts>;
  /** fetch data from the table: "accounts_documents" using primary key columns */
  accountDocument?: Maybe<AccountDocuments>;
  /** fetch data from the table: "account_document_roles" using primary key columns */
  accountDocumentRole?: Maybe<AccountDocumentRoles>;
  /** fetch data from the table: "account_document_roles" */
  accountDocumentRoles: Array<AccountDocumentRoles>;
  /** fetch aggregated fields from the table: "account_document_roles" */
  accountDocumentRolesAggregate: AccountDocumentRoles_Aggregate;
  /** fetch data from the table: "accounts_documents" */
  accountDocuments: Array<AccountDocuments>;
  /** fetch aggregated fields from the table: "accounts_documents" */
  accountDocumentsAggregate: AccountDocuments_Aggregate;
  /** fetch data from the table: "accounts" */
  accounts: Array<Accounts>;
  /** fetch aggregated fields from the table: "accounts" */
  accountsAggregate: Accounts_Aggregate;
  /** fetch data from the table: "auth.providers" using primary key columns */
  authProvider?: Maybe<AuthProviders>;
  /** fetch data from the table: "auth.provider_requests" using primary key columns */
  authProviderRequest?: Maybe<AuthProviderRequests>;
  /** fetch data from the table: "auth.provider_requests" */
  authProviderRequests: Array<AuthProviderRequests>;
  /** fetch aggregated fields from the table: "auth.provider_requests" */
  authProviderRequestsAggregate: AuthProviderRequests_Aggregate;
  /** fetch data from the table: "auth.providers" */
  authProviders: Array<AuthProviders>;
  /** fetch aggregated fields from the table: "auth.providers" */
  authProvidersAggregate: AuthProviders_Aggregate;
  /** fetch data from the table: "auth.refresh_tokens" using primary key columns */
  authRefreshToken?: Maybe<AuthRefreshTokens>;
  /** fetch data from the table: "auth.refresh_tokens" */
  authRefreshTokens: Array<AuthRefreshTokens>;
  /** fetch aggregated fields from the table: "auth.refresh_tokens" */
  authRefreshTokensAggregate: AuthRefreshTokens_Aggregate;
  /** fetch data from the table: "auth.roles" using primary key columns */
  authRole?: Maybe<AuthRoles>;
  /** fetch data from the table: "auth.roles" */
  authRoles: Array<AuthRoles>;
  /** fetch aggregated fields from the table: "auth.roles" */
  authRolesAggregate: AuthRoles_Aggregate;
  /** fetch data from the table: "auth.user_providers" using primary key columns */
  authUserProvider?: Maybe<AuthUserProviders>;
  /** fetch data from the table: "auth.user_providers" */
  authUserProviders: Array<AuthUserProviders>;
  /** fetch aggregated fields from the table: "auth.user_providers" */
  authUserProvidersAggregate: AuthUserProviders_Aggregate;
  /** fetch data from the table: "auth.user_roles" using primary key columns */
  authUserRole?: Maybe<AuthUserRoles>;
  /** fetch data from the table: "auth.user_roles" */
  authUserRoles: Array<AuthUserRoles>;
  /** fetch aggregated fields from the table: "auth.user_roles" */
  authUserRolesAggregate: AuthUserRoles_Aggregate;
  /** fetch data from the table: "documents" using primary key columns */
  document?: Maybe<Documents>;
  /** fetch data from the table: "document_highlights" using primary key columns */
  documentHighlight?: Maybe<DocumentHighlights>;
  /** fetch data from the table: "document_highlights" */
  documentHighlights: Array<DocumentHighlights>;
  /** fetch aggregated fields from the table: "document_highlights" */
  documentHighlightsAggregate: DocumentHighlights_Aggregate;
  /** fetch data from the table: "document_reading_info" using primary key columns */
  documentReadingInfo?: Maybe<DocumentReadingInfo>;
  /** fetch aggregated fields from the table: "document_reading_info" */
  documentReadingInfoAggregate: DocumentReadingInfo_Aggregate;
  /** fetch data from the table: "document_reading_info" */
  documentReadingInfos: Array<DocumentReadingInfo>;
  /** fetch data from the table: "document_type" using primary key columns */
  documentType?: Maybe<DocumentType>;
  documentType_aggregate: DocumentType_Aggregate;
  /** fetch data from the table: "document_type" */
  documentTypes: Array<DocumentType>;
  /** fetch data from the table: "documents" */
  documents: Array<Documents>;
  /** fetch aggregated fields from the table: "documents" */
  documentsAggregate: Documents_Aggregate;
  /** fetch data from the table: "documents_admin" */
  documents_admin: Array<Documents_Admin>;
  /** fetch aggregated fields from the table: "documents_admin" */
  documents_admin_aggregate: Documents_Admin_Aggregate;
  /** fetch data from the table: "files" using primary key columns */
  file?: Maybe<Files>;
  /** fetch data from the table: "files" */
  files: Array<Files>;
  /** fetch aggregated fields from the table: "files" */
  filesAggregate: Files_Aggregate;
  /** fetch data from the table: "auth.users" using primary key columns */
  user?: Maybe<Users>;
  /** fetch data from the table: "auth.users" */
  users: Array<Users>;
  /** fetch aggregated fields from the table: "auth.users" */
  usersAggregate: Users_Aggregate;
};


export type Query_RootAccountArgs = {
  id: Scalars['uuid'];
};


export type Query_RootAccountDocumentArgs = {
  accountId: Scalars['uuid'];
  documentId: Scalars['uuid'];
};


export type Query_RootAccountDocumentRoleArgs = {
  value: Scalars['String'];
};


export type Query_RootAccountDocumentRolesArgs = {
  distinct_on?: InputMaybe<Array<AccountDocumentRoles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AccountDocumentRoles_Order_By>>;
  where?: InputMaybe<AccountDocumentRoles_Bool_Exp>;
};


export type Query_RootAccountDocumentRolesAggregateArgs = {
  distinct_on?: InputMaybe<Array<AccountDocumentRoles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AccountDocumentRoles_Order_By>>;
  where?: InputMaybe<AccountDocumentRoles_Bool_Exp>;
};


export type Query_RootAccountDocumentsArgs = {
  distinct_on?: InputMaybe<Array<AccountDocuments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AccountDocuments_Order_By>>;
  where?: InputMaybe<AccountDocuments_Bool_Exp>;
};


export type Query_RootAccountDocumentsAggregateArgs = {
  distinct_on?: InputMaybe<Array<AccountDocuments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AccountDocuments_Order_By>>;
  where?: InputMaybe<AccountDocuments_Bool_Exp>;
};


export type Query_RootAccountsArgs = {
  distinct_on?: InputMaybe<Array<Accounts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Accounts_Order_By>>;
  where?: InputMaybe<Accounts_Bool_Exp>;
};


export type Query_RootAccountsAggregateArgs = {
  distinct_on?: InputMaybe<Array<Accounts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Accounts_Order_By>>;
  where?: InputMaybe<Accounts_Bool_Exp>;
};


export type Query_RootAuthProviderArgs = {
  id: Scalars['String'];
};


export type Query_RootAuthProviderRequestArgs = {
  id: Scalars['uuid'];
};


export type Query_RootAuthProviderRequestsArgs = {
  distinct_on?: InputMaybe<Array<AuthProviderRequests_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthProviderRequests_Order_By>>;
  where?: InputMaybe<AuthProviderRequests_Bool_Exp>;
};


export type Query_RootAuthProviderRequestsAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthProviderRequests_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthProviderRequests_Order_By>>;
  where?: InputMaybe<AuthProviderRequests_Bool_Exp>;
};


export type Query_RootAuthProvidersArgs = {
  distinct_on?: InputMaybe<Array<AuthProviders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthProviders_Order_By>>;
  where?: InputMaybe<AuthProviders_Bool_Exp>;
};


export type Query_RootAuthProvidersAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthProviders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthProviders_Order_By>>;
  where?: InputMaybe<AuthProviders_Bool_Exp>;
};


export type Query_RootAuthRefreshTokenArgs = {
  refreshToken: Scalars['uuid'];
};


export type Query_RootAuthRefreshTokensArgs = {
  distinct_on?: InputMaybe<Array<AuthRefreshTokens_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthRefreshTokens_Order_By>>;
  where?: InputMaybe<AuthRefreshTokens_Bool_Exp>;
};


export type Query_RootAuthRefreshTokensAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthRefreshTokens_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthRefreshTokens_Order_By>>;
  where?: InputMaybe<AuthRefreshTokens_Bool_Exp>;
};


export type Query_RootAuthRoleArgs = {
  role: Scalars['String'];
};


export type Query_RootAuthRolesArgs = {
  distinct_on?: InputMaybe<Array<AuthRoles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthRoles_Order_By>>;
  where?: InputMaybe<AuthRoles_Bool_Exp>;
};


export type Query_RootAuthRolesAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthRoles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthRoles_Order_By>>;
  where?: InputMaybe<AuthRoles_Bool_Exp>;
};


export type Query_RootAuthUserProviderArgs = {
  id: Scalars['uuid'];
};


export type Query_RootAuthUserProvidersArgs = {
  distinct_on?: InputMaybe<Array<AuthUserProviders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthUserProviders_Order_By>>;
  where?: InputMaybe<AuthUserProviders_Bool_Exp>;
};


export type Query_RootAuthUserProvidersAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthUserProviders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthUserProviders_Order_By>>;
  where?: InputMaybe<AuthUserProviders_Bool_Exp>;
};


export type Query_RootAuthUserRoleArgs = {
  id: Scalars['uuid'];
};


export type Query_RootAuthUserRolesArgs = {
  distinct_on?: InputMaybe<Array<AuthUserRoles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthUserRoles_Order_By>>;
  where?: InputMaybe<AuthUserRoles_Bool_Exp>;
};


export type Query_RootAuthUserRolesAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthUserRoles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthUserRoles_Order_By>>;
  where?: InputMaybe<AuthUserRoles_Bool_Exp>;
};


export type Query_RootDocumentArgs = {
  id: Scalars['uuid'];
};


export type Query_RootDocumentHighlightArgs = {
  id: Scalars['uuid'];
};


export type Query_RootDocumentHighlightsArgs = {
  distinct_on?: InputMaybe<Array<DocumentHighlights_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<DocumentHighlights_Order_By>>;
  where?: InputMaybe<DocumentHighlights_Bool_Exp>;
};


export type Query_RootDocumentHighlightsAggregateArgs = {
  distinct_on?: InputMaybe<Array<DocumentHighlights_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<DocumentHighlights_Order_By>>;
  where?: InputMaybe<DocumentHighlights_Bool_Exp>;
};


export type Query_RootDocumentReadingInfoArgs = {
  accountId: Scalars['uuid'];
  documentId: Scalars['uuid'];
};


export type Query_RootDocumentReadingInfoAggregateArgs = {
  distinct_on?: InputMaybe<Array<DocumentReadingInfo_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<DocumentReadingInfo_Order_By>>;
  where?: InputMaybe<DocumentReadingInfo_Bool_Exp>;
};


export type Query_RootDocumentReadingInfosArgs = {
  distinct_on?: InputMaybe<Array<DocumentReadingInfo_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<DocumentReadingInfo_Order_By>>;
  where?: InputMaybe<DocumentReadingInfo_Bool_Exp>;
};


export type Query_RootDocumentTypeArgs = {
  value: Scalars['String'];
};


export type Query_RootDocumentType_AggregateArgs = {
  distinct_on?: InputMaybe<Array<DocumentType_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<DocumentType_Order_By>>;
  where?: InputMaybe<DocumentType_Bool_Exp>;
};


export type Query_RootDocumentTypesArgs = {
  distinct_on?: InputMaybe<Array<DocumentType_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<DocumentType_Order_By>>;
  where?: InputMaybe<DocumentType_Bool_Exp>;
};


export type Query_RootDocumentsArgs = {
  distinct_on?: InputMaybe<Array<Documents_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Documents_Order_By>>;
  where?: InputMaybe<Documents_Bool_Exp>;
};


export type Query_RootDocumentsAggregateArgs = {
  distinct_on?: InputMaybe<Array<Documents_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Documents_Order_By>>;
  where?: InputMaybe<Documents_Bool_Exp>;
};


export type Query_RootDocuments_AdminArgs = {
  distinct_on?: InputMaybe<Array<Documents_Admin_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Documents_Admin_Order_By>>;
  where?: InputMaybe<Documents_Admin_Bool_Exp>;
};


export type Query_RootDocuments_Admin_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Documents_Admin_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Documents_Admin_Order_By>>;
  where?: InputMaybe<Documents_Admin_Bool_Exp>;
};


export type Query_RootFileArgs = {
  id: Scalars['uuid'];
};


export type Query_RootFilesArgs = {
  distinct_on?: InputMaybe<Array<Files_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Files_Order_By>>;
  where?: InputMaybe<Files_Bool_Exp>;
};


export type Query_RootFilesAggregateArgs = {
  distinct_on?: InputMaybe<Array<Files_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Files_Order_By>>;
  where?: InputMaybe<Files_Bool_Exp>;
};


export type Query_RootUserArgs = {
  id: Scalars['uuid'];
};


export type Query_RootUsersArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};


export type Query_RootUsersAggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** fetch data from the table: "accounts" using primary key columns */
  account?: Maybe<Accounts>;
  /** fetch data from the table: "accounts_documents" using primary key columns */
  accountDocument?: Maybe<AccountDocuments>;
  /** fetch data from the table: "account_document_roles" using primary key columns */
  accountDocumentRole?: Maybe<AccountDocumentRoles>;
  /** fetch data from the table: "account_document_roles" */
  accountDocumentRoles: Array<AccountDocumentRoles>;
  /** fetch aggregated fields from the table: "account_document_roles" */
  accountDocumentRolesAggregate: AccountDocumentRoles_Aggregate;
  /** fetch data from the table: "accounts_documents" */
  accountDocuments: Array<AccountDocuments>;
  /** fetch aggregated fields from the table: "accounts_documents" */
  accountDocumentsAggregate: AccountDocuments_Aggregate;
  /** fetch data from the table: "accounts" */
  accounts: Array<Accounts>;
  /** fetch aggregated fields from the table: "accounts" */
  accountsAggregate: Accounts_Aggregate;
  /** fetch data from the table: "auth.providers" using primary key columns */
  authProvider?: Maybe<AuthProviders>;
  /** fetch data from the table: "auth.provider_requests" using primary key columns */
  authProviderRequest?: Maybe<AuthProviderRequests>;
  /** fetch data from the table: "auth.provider_requests" */
  authProviderRequests: Array<AuthProviderRequests>;
  /** fetch aggregated fields from the table: "auth.provider_requests" */
  authProviderRequestsAggregate: AuthProviderRequests_Aggregate;
  /** fetch data from the table: "auth.providers" */
  authProviders: Array<AuthProviders>;
  /** fetch aggregated fields from the table: "auth.providers" */
  authProvidersAggregate: AuthProviders_Aggregate;
  /** fetch data from the table: "auth.refresh_tokens" using primary key columns */
  authRefreshToken?: Maybe<AuthRefreshTokens>;
  /** fetch data from the table: "auth.refresh_tokens" */
  authRefreshTokens: Array<AuthRefreshTokens>;
  /** fetch aggregated fields from the table: "auth.refresh_tokens" */
  authRefreshTokensAggregate: AuthRefreshTokens_Aggregate;
  /** fetch data from the table: "auth.roles" using primary key columns */
  authRole?: Maybe<AuthRoles>;
  /** fetch data from the table: "auth.roles" */
  authRoles: Array<AuthRoles>;
  /** fetch aggregated fields from the table: "auth.roles" */
  authRolesAggregate: AuthRoles_Aggregate;
  /** fetch data from the table: "auth.user_providers" using primary key columns */
  authUserProvider?: Maybe<AuthUserProviders>;
  /** fetch data from the table: "auth.user_providers" */
  authUserProviders: Array<AuthUserProviders>;
  /** fetch aggregated fields from the table: "auth.user_providers" */
  authUserProvidersAggregate: AuthUserProviders_Aggregate;
  /** fetch data from the table: "auth.user_roles" using primary key columns */
  authUserRole?: Maybe<AuthUserRoles>;
  /** fetch data from the table: "auth.user_roles" */
  authUserRoles: Array<AuthUserRoles>;
  /** fetch aggregated fields from the table: "auth.user_roles" */
  authUserRolesAggregate: AuthUserRoles_Aggregate;
  /** fetch data from the table: "documents" using primary key columns */
  document?: Maybe<Documents>;
  /** fetch data from the table: "document_highlights" using primary key columns */
  documentHighlight?: Maybe<DocumentHighlights>;
  /** fetch data from the table: "document_highlights" */
  documentHighlights: Array<DocumentHighlights>;
  /** fetch aggregated fields from the table: "document_highlights" */
  documentHighlightsAggregate: DocumentHighlights_Aggregate;
  /** fetch data from the table: "document_reading_info" using primary key columns */
  documentReadingInfo?: Maybe<DocumentReadingInfo>;
  /** fetch aggregated fields from the table: "document_reading_info" */
  documentReadingInfoAggregate: DocumentReadingInfo_Aggregate;
  /** fetch data from the table: "document_reading_info" */
  documentReadingInfos: Array<DocumentReadingInfo>;
  /** fetch data from the table: "document_type" using primary key columns */
  documentType?: Maybe<DocumentType>;
  documentType_aggregate: DocumentType_Aggregate;
  /** fetch data from the table: "document_type" */
  documentTypes: Array<DocumentType>;
  /** fetch data from the table: "documents" */
  documents: Array<Documents>;
  /** fetch aggregated fields from the table: "documents" */
  documentsAggregate: Documents_Aggregate;
  /** fetch data from the table: "documents_admin" */
  documents_admin: Array<Documents_Admin>;
  /** fetch aggregated fields from the table: "documents_admin" */
  documents_admin_aggregate: Documents_Admin_Aggregate;
  /** fetch data from the table: "files" using primary key columns */
  file?: Maybe<Files>;
  /** fetch data from the table: "files" */
  files: Array<Files>;
  /** fetch aggregated fields from the table: "files" */
  filesAggregate: Files_Aggregate;
  /** fetch data from the table: "auth.users" using primary key columns */
  user?: Maybe<Users>;
  /** fetch data from the table: "auth.users" */
  users: Array<Users>;
  /** fetch aggregated fields from the table: "auth.users" */
  usersAggregate: Users_Aggregate;
};


export type Subscription_RootAccountArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootAccountDocumentArgs = {
  accountId: Scalars['uuid'];
  documentId: Scalars['uuid'];
};


export type Subscription_RootAccountDocumentRoleArgs = {
  value: Scalars['String'];
};


export type Subscription_RootAccountDocumentRolesArgs = {
  distinct_on?: InputMaybe<Array<AccountDocumentRoles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AccountDocumentRoles_Order_By>>;
  where?: InputMaybe<AccountDocumentRoles_Bool_Exp>;
};


export type Subscription_RootAccountDocumentRolesAggregateArgs = {
  distinct_on?: InputMaybe<Array<AccountDocumentRoles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AccountDocumentRoles_Order_By>>;
  where?: InputMaybe<AccountDocumentRoles_Bool_Exp>;
};


export type Subscription_RootAccountDocumentsArgs = {
  distinct_on?: InputMaybe<Array<AccountDocuments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AccountDocuments_Order_By>>;
  where?: InputMaybe<AccountDocuments_Bool_Exp>;
};


export type Subscription_RootAccountDocumentsAggregateArgs = {
  distinct_on?: InputMaybe<Array<AccountDocuments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AccountDocuments_Order_By>>;
  where?: InputMaybe<AccountDocuments_Bool_Exp>;
};


export type Subscription_RootAccountsArgs = {
  distinct_on?: InputMaybe<Array<Accounts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Accounts_Order_By>>;
  where?: InputMaybe<Accounts_Bool_Exp>;
};


export type Subscription_RootAccountsAggregateArgs = {
  distinct_on?: InputMaybe<Array<Accounts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Accounts_Order_By>>;
  where?: InputMaybe<Accounts_Bool_Exp>;
};


export type Subscription_RootAuthProviderArgs = {
  id: Scalars['String'];
};


export type Subscription_RootAuthProviderRequestArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootAuthProviderRequestsArgs = {
  distinct_on?: InputMaybe<Array<AuthProviderRequests_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthProviderRequests_Order_By>>;
  where?: InputMaybe<AuthProviderRequests_Bool_Exp>;
};


export type Subscription_RootAuthProviderRequestsAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthProviderRequests_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthProviderRequests_Order_By>>;
  where?: InputMaybe<AuthProviderRequests_Bool_Exp>;
};


export type Subscription_RootAuthProvidersArgs = {
  distinct_on?: InputMaybe<Array<AuthProviders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthProviders_Order_By>>;
  where?: InputMaybe<AuthProviders_Bool_Exp>;
};


export type Subscription_RootAuthProvidersAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthProviders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthProviders_Order_By>>;
  where?: InputMaybe<AuthProviders_Bool_Exp>;
};


export type Subscription_RootAuthRefreshTokenArgs = {
  refreshToken: Scalars['uuid'];
};


export type Subscription_RootAuthRefreshTokensArgs = {
  distinct_on?: InputMaybe<Array<AuthRefreshTokens_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthRefreshTokens_Order_By>>;
  where?: InputMaybe<AuthRefreshTokens_Bool_Exp>;
};


export type Subscription_RootAuthRefreshTokensAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthRefreshTokens_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthRefreshTokens_Order_By>>;
  where?: InputMaybe<AuthRefreshTokens_Bool_Exp>;
};


export type Subscription_RootAuthRoleArgs = {
  role: Scalars['String'];
};


export type Subscription_RootAuthRolesArgs = {
  distinct_on?: InputMaybe<Array<AuthRoles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthRoles_Order_By>>;
  where?: InputMaybe<AuthRoles_Bool_Exp>;
};


export type Subscription_RootAuthRolesAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthRoles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthRoles_Order_By>>;
  where?: InputMaybe<AuthRoles_Bool_Exp>;
};


export type Subscription_RootAuthUserProviderArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootAuthUserProvidersArgs = {
  distinct_on?: InputMaybe<Array<AuthUserProviders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthUserProviders_Order_By>>;
  where?: InputMaybe<AuthUserProviders_Bool_Exp>;
};


export type Subscription_RootAuthUserProvidersAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthUserProviders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthUserProviders_Order_By>>;
  where?: InputMaybe<AuthUserProviders_Bool_Exp>;
};


export type Subscription_RootAuthUserRoleArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootAuthUserRolesArgs = {
  distinct_on?: InputMaybe<Array<AuthUserRoles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthUserRoles_Order_By>>;
  where?: InputMaybe<AuthUserRoles_Bool_Exp>;
};


export type Subscription_RootAuthUserRolesAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthUserRoles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthUserRoles_Order_By>>;
  where?: InputMaybe<AuthUserRoles_Bool_Exp>;
};


export type Subscription_RootDocumentArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootDocumentHighlightArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootDocumentHighlightsArgs = {
  distinct_on?: InputMaybe<Array<DocumentHighlights_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<DocumentHighlights_Order_By>>;
  where?: InputMaybe<DocumentHighlights_Bool_Exp>;
};


export type Subscription_RootDocumentHighlightsAggregateArgs = {
  distinct_on?: InputMaybe<Array<DocumentHighlights_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<DocumentHighlights_Order_By>>;
  where?: InputMaybe<DocumentHighlights_Bool_Exp>;
};


export type Subscription_RootDocumentReadingInfoArgs = {
  accountId: Scalars['uuid'];
  documentId: Scalars['uuid'];
};


export type Subscription_RootDocumentReadingInfoAggregateArgs = {
  distinct_on?: InputMaybe<Array<DocumentReadingInfo_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<DocumentReadingInfo_Order_By>>;
  where?: InputMaybe<DocumentReadingInfo_Bool_Exp>;
};


export type Subscription_RootDocumentReadingInfosArgs = {
  distinct_on?: InputMaybe<Array<DocumentReadingInfo_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<DocumentReadingInfo_Order_By>>;
  where?: InputMaybe<DocumentReadingInfo_Bool_Exp>;
};


export type Subscription_RootDocumentTypeArgs = {
  value: Scalars['String'];
};


export type Subscription_RootDocumentType_AggregateArgs = {
  distinct_on?: InputMaybe<Array<DocumentType_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<DocumentType_Order_By>>;
  where?: InputMaybe<DocumentType_Bool_Exp>;
};


export type Subscription_RootDocumentTypesArgs = {
  distinct_on?: InputMaybe<Array<DocumentType_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<DocumentType_Order_By>>;
  where?: InputMaybe<DocumentType_Bool_Exp>;
};


export type Subscription_RootDocumentsArgs = {
  distinct_on?: InputMaybe<Array<Documents_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Documents_Order_By>>;
  where?: InputMaybe<Documents_Bool_Exp>;
};


export type Subscription_RootDocumentsAggregateArgs = {
  distinct_on?: InputMaybe<Array<Documents_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Documents_Order_By>>;
  where?: InputMaybe<Documents_Bool_Exp>;
};


export type Subscription_RootDocuments_AdminArgs = {
  distinct_on?: InputMaybe<Array<Documents_Admin_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Documents_Admin_Order_By>>;
  where?: InputMaybe<Documents_Admin_Bool_Exp>;
};


export type Subscription_RootDocuments_Admin_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Documents_Admin_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Documents_Admin_Order_By>>;
  where?: InputMaybe<Documents_Admin_Bool_Exp>;
};


export type Subscription_RootFileArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootFilesArgs = {
  distinct_on?: InputMaybe<Array<Files_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Files_Order_By>>;
  where?: InputMaybe<Files_Bool_Exp>;
};


export type Subscription_RootFilesAggregateArgs = {
  distinct_on?: InputMaybe<Array<Files_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Files_Order_By>>;
  where?: InputMaybe<Files_Bool_Exp>;
};


export type Subscription_RootUserArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootUsersArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};


export type Subscription_RootUsersAggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamptz']>;
  _gt?: InputMaybe<Scalars['timestamptz']>;
  _gte?: InputMaybe<Scalars['timestamptz']>;
  _in?: InputMaybe<Array<Scalars['timestamptz']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['timestamptz']>;
  _lte?: InputMaybe<Scalars['timestamptz']>;
  _neq?: InputMaybe<Scalars['timestamptz']>;
  _nin?: InputMaybe<Array<Scalars['timestamptz']>>;
};

/** columns and relationships of "auth.users" */
export type Users = {
  __typename?: 'users';
  activeMfaType?: Maybe<Scalars['String']>;
  avatarUrl: Scalars['String'];
  createdAt: Scalars['timestamptz'];
  defaultRole: Scalars['String'];
  /** An object relationship */
  defaultRoleByRole: AuthRoles;
  disabled: Scalars['Boolean'];
  displayName: Scalars['String'];
  email?: Maybe<Scalars['citext']>;
  emailVerified: Scalars['Boolean'];
  id: Scalars['uuid'];
  isAnonymous: Scalars['Boolean'];
  lastSeen?: Maybe<Scalars['timestamptz']>;
  locale: Scalars['String'];
  metadata?: Maybe<Scalars['jsonb']>;
  newEmail?: Maybe<Scalars['citext']>;
  otpHash?: Maybe<Scalars['String']>;
  otpHashExpiresAt: Scalars['timestamptz'];
  otpMethodLastUsed?: Maybe<Scalars['String']>;
  passwordHash?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
  phoneNumberVerified: Scalars['Boolean'];
  /** An array relationship */
  refreshTokens: Array<AuthRefreshTokens>;
  /** An aggregate relationship */
  refreshTokens_aggregate: AuthRefreshTokens_Aggregate;
  /** An array relationship */
  roles: Array<AuthUserRoles>;
  /** An aggregate relationship */
  roles_aggregate: AuthUserRoles_Aggregate;
  ticket?: Maybe<Scalars['String']>;
  ticketExpiresAt: Scalars['timestamptz'];
  totpSecret?: Maybe<Scalars['String']>;
  updatedAt: Scalars['timestamptz'];
  /** An array relationship */
  userProviders: Array<AuthUserProviders>;
  /** An aggregate relationship */
  userProviders_aggregate: AuthUserProviders_Aggregate;
};


/** columns and relationships of "auth.users" */
export type UsersMetadataArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "auth.users" */
export type UsersRefreshTokensArgs = {
  distinct_on?: InputMaybe<Array<AuthRefreshTokens_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthRefreshTokens_Order_By>>;
  where?: InputMaybe<AuthRefreshTokens_Bool_Exp>;
};


/** columns and relationships of "auth.users" */
export type UsersRefreshTokens_AggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthRefreshTokens_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthRefreshTokens_Order_By>>;
  where?: InputMaybe<AuthRefreshTokens_Bool_Exp>;
};


/** columns and relationships of "auth.users" */
export type UsersRolesArgs = {
  distinct_on?: InputMaybe<Array<AuthUserRoles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthUserRoles_Order_By>>;
  where?: InputMaybe<AuthUserRoles_Bool_Exp>;
};


/** columns and relationships of "auth.users" */
export type UsersRoles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthUserRoles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthUserRoles_Order_By>>;
  where?: InputMaybe<AuthUserRoles_Bool_Exp>;
};


/** columns and relationships of "auth.users" */
export type UsersUserProvidersArgs = {
  distinct_on?: InputMaybe<Array<AuthUserProviders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthUserProviders_Order_By>>;
  where?: InputMaybe<AuthUserProviders_Bool_Exp>;
};


/** columns and relationships of "auth.users" */
export type UsersUserProviders_AggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthUserProviders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthUserProviders_Order_By>>;
  where?: InputMaybe<AuthUserProviders_Bool_Exp>;
};

/** aggregated selection of "auth.users" */
export type Users_Aggregate = {
  __typename?: 'users_aggregate';
  aggregate?: Maybe<Users_Aggregate_Fields>;
  nodes: Array<Users>;
};

/** aggregate fields of "auth.users" */
export type Users_Aggregate_Fields = {
  __typename?: 'users_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Users_Max_Fields>;
  min?: Maybe<Users_Min_Fields>;
};


/** aggregate fields of "auth.users" */
export type Users_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Users_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "auth.users" */
export type Users_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Users_Max_Order_By>;
  min?: InputMaybe<Users_Min_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Users_Append_Input = {
  metadata?: InputMaybe<Scalars['jsonb']>;
};

/** input type for inserting array relation for remote table "auth.users" */
export type Users_Arr_Rel_Insert_Input = {
  data: Array<Users_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Users_On_Conflict>;
};

/** Boolean expression to filter rows from the table "auth.users". All fields are combined with a logical 'AND'. */
export type Users_Bool_Exp = {
  _and?: InputMaybe<Array<Users_Bool_Exp>>;
  _not?: InputMaybe<Users_Bool_Exp>;
  _or?: InputMaybe<Array<Users_Bool_Exp>>;
  activeMfaType?: InputMaybe<String_Comparison_Exp>;
  avatarUrl?: InputMaybe<String_Comparison_Exp>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  defaultRole?: InputMaybe<String_Comparison_Exp>;
  defaultRoleByRole?: InputMaybe<AuthRoles_Bool_Exp>;
  disabled?: InputMaybe<Boolean_Comparison_Exp>;
  displayName?: InputMaybe<String_Comparison_Exp>;
  email?: InputMaybe<Citext_Comparison_Exp>;
  emailVerified?: InputMaybe<Boolean_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  isAnonymous?: InputMaybe<Boolean_Comparison_Exp>;
  lastSeen?: InputMaybe<Timestamptz_Comparison_Exp>;
  locale?: InputMaybe<String_Comparison_Exp>;
  metadata?: InputMaybe<Jsonb_Comparison_Exp>;
  newEmail?: InputMaybe<Citext_Comparison_Exp>;
  otpHash?: InputMaybe<String_Comparison_Exp>;
  otpHashExpiresAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  otpMethodLastUsed?: InputMaybe<String_Comparison_Exp>;
  passwordHash?: InputMaybe<String_Comparison_Exp>;
  phoneNumber?: InputMaybe<String_Comparison_Exp>;
  phoneNumberVerified?: InputMaybe<Boolean_Comparison_Exp>;
  refreshTokens?: InputMaybe<AuthRefreshTokens_Bool_Exp>;
  roles?: InputMaybe<AuthUserRoles_Bool_Exp>;
  ticket?: InputMaybe<String_Comparison_Exp>;
  ticketExpiresAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  totpSecret?: InputMaybe<String_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  userProviders?: InputMaybe<AuthUserProviders_Bool_Exp>;
};

/** unique or primary key constraints on table "auth.users" */
export type Users_Constraint =
  /** unique or primary key constraint */
  | 'users_email_key'
  /** unique or primary key constraint */
  | 'users_phone_number_key'
  /** unique or primary key constraint */
  | 'users_pkey';

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Users_Delete_At_Path_Input = {
  metadata?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Users_Delete_Elem_Input = {
  metadata?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Users_Delete_Key_Input = {
  metadata?: InputMaybe<Scalars['String']>;
};

/** input type for inserting data into table "auth.users" */
export type Users_Insert_Input = {
  activeMfaType?: InputMaybe<Scalars['String']>;
  avatarUrl?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  defaultRole?: InputMaybe<Scalars['String']>;
  defaultRoleByRole?: InputMaybe<AuthRoles_Obj_Rel_Insert_Input>;
  disabled?: InputMaybe<Scalars['Boolean']>;
  displayName?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['citext']>;
  emailVerified?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['uuid']>;
  isAnonymous?: InputMaybe<Scalars['Boolean']>;
  lastSeen?: InputMaybe<Scalars['timestamptz']>;
  locale?: InputMaybe<Scalars['String']>;
  metadata?: InputMaybe<Scalars['jsonb']>;
  newEmail?: InputMaybe<Scalars['citext']>;
  otpHash?: InputMaybe<Scalars['String']>;
  otpHashExpiresAt?: InputMaybe<Scalars['timestamptz']>;
  otpMethodLastUsed?: InputMaybe<Scalars['String']>;
  passwordHash?: InputMaybe<Scalars['String']>;
  phoneNumber?: InputMaybe<Scalars['String']>;
  phoneNumberVerified?: InputMaybe<Scalars['Boolean']>;
  refreshTokens?: InputMaybe<AuthRefreshTokens_Arr_Rel_Insert_Input>;
  roles?: InputMaybe<AuthUserRoles_Arr_Rel_Insert_Input>;
  ticket?: InputMaybe<Scalars['String']>;
  ticketExpiresAt?: InputMaybe<Scalars['timestamptz']>;
  totpSecret?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
  userProviders?: InputMaybe<AuthUserProviders_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Users_Max_Fields = {
  __typename?: 'users_max_fields';
  activeMfaType?: Maybe<Scalars['String']>;
  avatarUrl?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  defaultRole?: Maybe<Scalars['String']>;
  displayName?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['citext']>;
  id?: Maybe<Scalars['uuid']>;
  lastSeen?: Maybe<Scalars['timestamptz']>;
  locale?: Maybe<Scalars['String']>;
  newEmail?: Maybe<Scalars['citext']>;
  otpHash?: Maybe<Scalars['String']>;
  otpHashExpiresAt?: Maybe<Scalars['timestamptz']>;
  otpMethodLastUsed?: Maybe<Scalars['String']>;
  passwordHash?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
  ticket?: Maybe<Scalars['String']>;
  ticketExpiresAt?: Maybe<Scalars['timestamptz']>;
  totpSecret?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "auth.users" */
export type Users_Max_Order_By = {
  activeMfaType?: InputMaybe<Order_By>;
  avatarUrl?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  defaultRole?: InputMaybe<Order_By>;
  displayName?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  lastSeen?: InputMaybe<Order_By>;
  locale?: InputMaybe<Order_By>;
  newEmail?: InputMaybe<Order_By>;
  otpHash?: InputMaybe<Order_By>;
  otpHashExpiresAt?: InputMaybe<Order_By>;
  otpMethodLastUsed?: InputMaybe<Order_By>;
  passwordHash?: InputMaybe<Order_By>;
  phoneNumber?: InputMaybe<Order_By>;
  ticket?: InputMaybe<Order_By>;
  ticketExpiresAt?: InputMaybe<Order_By>;
  totpSecret?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Users_Min_Fields = {
  __typename?: 'users_min_fields';
  activeMfaType?: Maybe<Scalars['String']>;
  avatarUrl?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  defaultRole?: Maybe<Scalars['String']>;
  displayName?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['citext']>;
  id?: Maybe<Scalars['uuid']>;
  lastSeen?: Maybe<Scalars['timestamptz']>;
  locale?: Maybe<Scalars['String']>;
  newEmail?: Maybe<Scalars['citext']>;
  otpHash?: Maybe<Scalars['String']>;
  otpHashExpiresAt?: Maybe<Scalars['timestamptz']>;
  otpMethodLastUsed?: Maybe<Scalars['String']>;
  passwordHash?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
  ticket?: Maybe<Scalars['String']>;
  ticketExpiresAt?: Maybe<Scalars['timestamptz']>;
  totpSecret?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "auth.users" */
export type Users_Min_Order_By = {
  activeMfaType?: InputMaybe<Order_By>;
  avatarUrl?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  defaultRole?: InputMaybe<Order_By>;
  displayName?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  lastSeen?: InputMaybe<Order_By>;
  locale?: InputMaybe<Order_By>;
  newEmail?: InputMaybe<Order_By>;
  otpHash?: InputMaybe<Order_By>;
  otpHashExpiresAt?: InputMaybe<Order_By>;
  otpMethodLastUsed?: InputMaybe<Order_By>;
  passwordHash?: InputMaybe<Order_By>;
  phoneNumber?: InputMaybe<Order_By>;
  ticket?: InputMaybe<Order_By>;
  ticketExpiresAt?: InputMaybe<Order_By>;
  totpSecret?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "auth.users" */
export type Users_Mutation_Response = {
  __typename?: 'users_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Users>;
};

/** input type for inserting object relation for remote table "auth.users" */
export type Users_Obj_Rel_Insert_Input = {
  data: Users_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Users_On_Conflict>;
};

/** on_conflict condition type for table "auth.users" */
export type Users_On_Conflict = {
  constraint: Users_Constraint;
  update_columns?: Array<Users_Update_Column>;
  where?: InputMaybe<Users_Bool_Exp>;
};

/** Ordering options when selecting data from "auth.users". */
export type Users_Order_By = {
  activeMfaType?: InputMaybe<Order_By>;
  avatarUrl?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  defaultRole?: InputMaybe<Order_By>;
  defaultRoleByRole?: InputMaybe<AuthRoles_Order_By>;
  disabled?: InputMaybe<Order_By>;
  displayName?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  emailVerified?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  isAnonymous?: InputMaybe<Order_By>;
  lastSeen?: InputMaybe<Order_By>;
  locale?: InputMaybe<Order_By>;
  metadata?: InputMaybe<Order_By>;
  newEmail?: InputMaybe<Order_By>;
  otpHash?: InputMaybe<Order_By>;
  otpHashExpiresAt?: InputMaybe<Order_By>;
  otpMethodLastUsed?: InputMaybe<Order_By>;
  passwordHash?: InputMaybe<Order_By>;
  phoneNumber?: InputMaybe<Order_By>;
  phoneNumberVerified?: InputMaybe<Order_By>;
  refreshTokens_aggregate?: InputMaybe<AuthRefreshTokens_Aggregate_Order_By>;
  roles_aggregate?: InputMaybe<AuthUserRoles_Aggregate_Order_By>;
  ticket?: InputMaybe<Order_By>;
  ticketExpiresAt?: InputMaybe<Order_By>;
  totpSecret?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
  userProviders_aggregate?: InputMaybe<AuthUserProviders_Aggregate_Order_By>;
};

/** primary key columns input for table: users */
export type Users_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Users_Prepend_Input = {
  metadata?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "auth.users" */
export type Users_Select_Column =
  /** column name */
  | 'activeMfaType'
  /** column name */
  | 'avatarUrl'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'defaultRole'
  /** column name */
  | 'disabled'
  /** column name */
  | 'displayName'
  /** column name */
  | 'email'
  /** column name */
  | 'emailVerified'
  /** column name */
  | 'id'
  /** column name */
  | 'isAnonymous'
  /** column name */
  | 'lastSeen'
  /** column name */
  | 'locale'
  /** column name */
  | 'metadata'
  /** column name */
  | 'newEmail'
  /** column name */
  | 'otpHash'
  /** column name */
  | 'otpHashExpiresAt'
  /** column name */
  | 'otpMethodLastUsed'
  /** column name */
  | 'passwordHash'
  /** column name */
  | 'phoneNumber'
  /** column name */
  | 'phoneNumberVerified'
  /** column name */
  | 'ticket'
  /** column name */
  | 'ticketExpiresAt'
  /** column name */
  | 'totpSecret'
  /** column name */
  | 'updatedAt';

/** input type for updating data in table "auth.users" */
export type Users_Set_Input = {
  activeMfaType?: InputMaybe<Scalars['String']>;
  avatarUrl?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  defaultRole?: InputMaybe<Scalars['String']>;
  disabled?: InputMaybe<Scalars['Boolean']>;
  displayName?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['citext']>;
  emailVerified?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['uuid']>;
  isAnonymous?: InputMaybe<Scalars['Boolean']>;
  lastSeen?: InputMaybe<Scalars['timestamptz']>;
  locale?: InputMaybe<Scalars['String']>;
  metadata?: InputMaybe<Scalars['jsonb']>;
  newEmail?: InputMaybe<Scalars['citext']>;
  otpHash?: InputMaybe<Scalars['String']>;
  otpHashExpiresAt?: InputMaybe<Scalars['timestamptz']>;
  otpMethodLastUsed?: InputMaybe<Scalars['String']>;
  passwordHash?: InputMaybe<Scalars['String']>;
  phoneNumber?: InputMaybe<Scalars['String']>;
  phoneNumberVerified?: InputMaybe<Scalars['Boolean']>;
  ticket?: InputMaybe<Scalars['String']>;
  ticketExpiresAt?: InputMaybe<Scalars['timestamptz']>;
  totpSecret?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "auth.users" */
export type Users_Update_Column =
  /** column name */
  | 'activeMfaType'
  /** column name */
  | 'avatarUrl'
  /** column name */
  | 'createdAt'
  /** column name */
  | 'defaultRole'
  /** column name */
  | 'disabled'
  /** column name */
  | 'displayName'
  /** column name */
  | 'email'
  /** column name */
  | 'emailVerified'
  /** column name */
  | 'id'
  /** column name */
  | 'isAnonymous'
  /** column name */
  | 'lastSeen'
  /** column name */
  | 'locale'
  /** column name */
  | 'metadata'
  /** column name */
  | 'newEmail'
  /** column name */
  | 'otpHash'
  /** column name */
  | 'otpHashExpiresAt'
  /** column name */
  | 'otpMethodLastUsed'
  /** column name */
  | 'passwordHash'
  /** column name */
  | 'phoneNumber'
  /** column name */
  | 'phoneNumberVerified'
  /** column name */
  | 'ticket'
  /** column name */
  | 'ticketExpiresAt'
  /** column name */
  | 'totpSecret'
  /** column name */
  | 'updatedAt';

/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type Uuid_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['uuid']>;
  _gt?: InputMaybe<Scalars['uuid']>;
  _gte?: InputMaybe<Scalars['uuid']>;
  _in?: InputMaybe<Array<Scalars['uuid']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['uuid']>;
  _lte?: InputMaybe<Scalars['uuid']>;
  _neq?: InputMaybe<Scalars['uuid']>;
  _nin?: InputMaybe<Array<Scalars['uuid']>>;
};

export type CreateDocumentImagePostPolicyMutationVariables = Exact<{
  documentId: Scalars['uuid'];
}>;


export type CreateDocumentImagePostPolicyMutation = { __typename?: 'mutation_root', createDocumentImagePostPolicy: { __typename?: 'DocumentImagePostPolicyOutput', formData: any, postURL: string } };

export type GetAccountQueryVariables = Exact<{
  accountId: Scalars['uuid'];
}>;


export type GetAccountQuery = { __typename?: 'query_root', account?: { __typename?: 'accounts', id: any, name?: string | null, createdAt: any, updatedAt: any, documents: Array<{ __typename?: 'accountDocuments', documentId: any, role: Account_Document_Roles_Enum, createdAt: any, acceptedAt?: any | null }> } | null };

export type GetAccountDataQueryVariables = Exact<{
  accountId: Scalars['uuid'];
}>;


export type GetAccountDataQuery = { __typename?: 'query_root', account?: { __typename?: 'accounts', id: any, name?: string | null, createdAt: any, updatedAt: any, documents: Array<{ __typename?: 'accountDocuments', documentId: any, role: Account_Document_Roles_Enum, createdAt: any, acceptedAt?: any | null, readingInfo?: { __typename?: 'documentReadingInfo', createdAt: any, updatedAt: any, lastPage?: number | null, location?: any | null } | null, document?: { __typename?: 'documents', id: any, createdAt: any, updatedAt: any, fileId?: any | null, type: Document_Type_Enum, meta?: any | null, creator?: { __typename?: 'accounts', id: any, name?: string | null } | null, members: Array<{ __typename?: 'accountDocuments', accountId: any, role: Account_Document_Roles_Enum, createdAt: any, acceptedAt?: any | null }> } | null }> } | null };

export type GetAccountInfoQueryVariables = Exact<{
  accountId: Scalars['uuid'];
}>;


export type GetAccountInfoQuery = { __typename?: 'query_root', account?: { __typename?: 'accounts', id: any, name?: string | null } | null };

export type GetDocumentQueryVariables = Exact<{
  documentId: Scalars['uuid'];
}>;


export type GetDocumentQuery = { __typename?: 'query_root', document?: { __typename?: 'documents', id: any, createdAt: any, updatedAt: any, fileId?: any | null, type: Document_Type_Enum, meta?: any | null, creator?: { __typename?: 'accounts', id: any, name?: string | null } | null, members: Array<{ __typename?: 'accountDocuments', accountId: any, role: Account_Document_Roles_Enum, createdAt: any, acceptedAt?: any | null, account?: { __typename?: 'accounts', id: any, name?: string | null } | null }> } | null };

export type GetDocumentHighlightQueryVariables = Exact<{
  highlightId: Scalars['uuid'];
}>;


export type GetDocumentHighlightQuery = { __typename?: 'query_root', documentHighlight?: { __typename?: 'documentHighlights', id: any, documentId: any, createdAt: any, updatedAt: any, createdBy: any, location: any, content?: any | null, thumbnailImage?: string | null, creator: { __typename?: 'accounts', id: any, name?: string | null } } | null };

export type GetDocumentHighlightsQueryVariables = Exact<{
  documentId: Scalars['uuid'];
}>;


export type GetDocumentHighlightsQuery = { __typename?: 'query_root', documentHighlights: Array<{ __typename?: 'documentHighlights', id: any, documentId: any, createdAt: any, updatedAt: any, createdBy: any, location: any, content?: any | null, thumbnailImage?: string | null, creator: { __typename?: 'accounts', id: any, name?: string | null } }> };

export type SubscribeDocumentHighlightsSubscriptionVariables = Exact<{
  documentId: Scalars['uuid'];
}>;


export type SubscribeDocumentHighlightsSubscription = { __typename?: 'subscription_root', documentHighlights: Array<{ __typename?: 'documentHighlights', id: any, updatedAt: any, documentId: any }> };

export type UpsertAccountDocumentsMutationVariables = Exact<{
  objects?: InputMaybe<Array<AccountDocuments_Insert_Input> | AccountDocuments_Insert_Input>;
}>;


export type UpsertAccountDocumentsMutation = { __typename?: 'mutation_root', insertAccountDocuments?: { __typename?: 'accountDocuments_mutation_response', affected_rows: number, returning: Array<{ __typename?: 'accountDocuments', accountId: any, documentId: any, role: Account_Document_Roles_Enum, acceptedAt?: any | null, createdAt: any }> } | null };

export type UpsertDocumentMutationVariables = Exact<{
  object: Documents_Insert_Input;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
}>;


export type UpsertDocumentMutation = { __typename?: 'mutation_root', insertDocument?: { __typename?: 'documents', id: any, createdAt: any, updatedAt: any, fileId?: any | null, type: Document_Type_Enum, meta?: any | null } | null };

export type UpsertDocumentHighlightMutationVariables = Exact<{
  highlight: DocumentHighlights_Insert_Input;
  updatedAt?: Scalars['timestamptz'];
}>;


export type UpsertDocumentHighlightMutation = { __typename?: 'mutation_root', insertDocumentHighlight?: { __typename?: 'documentHighlights', id: any, documentId: any, createdAt: any, updatedAt: any, content?: any | null, location: any, thumbnailImage?: string | null, createdBy: any, creator: { __typename?: 'accounts', id: any, name?: string | null } } | null };


export const CreateDocumentImagePostPolicyDocument = gql`
    mutation createDocumentImagePostPolicy($documentId: uuid!) {
  createDocumentImagePostPolicy(documentId: $documentId) {
    formData
    postURL
  }
}
    `;
export type CreateDocumentImagePostPolicyMutationFn = Apollo.MutationFunction<CreateDocumentImagePostPolicyMutation, CreateDocumentImagePostPolicyMutationVariables>;

/**
 * __useCreateDocumentImagePostPolicyMutation__
 *
 * To run a mutation, you first call `useCreateDocumentImagePostPolicyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateDocumentImagePostPolicyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createDocumentImagePostPolicyMutation, { data, loading, error }] = useCreateDocumentImagePostPolicyMutation({
 *   variables: {
 *      documentId: // value for 'documentId'
 *   },
 * });
 */
export function useCreateDocumentImagePostPolicyMutation(baseOptions?: Apollo.MutationHookOptions<CreateDocumentImagePostPolicyMutation, CreateDocumentImagePostPolicyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateDocumentImagePostPolicyMutation, CreateDocumentImagePostPolicyMutationVariables>(CreateDocumentImagePostPolicyDocument, options);
      }
export type CreateDocumentImagePostPolicyMutationHookResult = ReturnType<typeof useCreateDocumentImagePostPolicyMutation>;
export type CreateDocumentImagePostPolicyMutationResult = Apollo.MutationResult<CreateDocumentImagePostPolicyMutation>;
export type CreateDocumentImagePostPolicyMutationOptions = Apollo.BaseMutationOptions<CreateDocumentImagePostPolicyMutation, CreateDocumentImagePostPolicyMutationVariables>;
export const GetAccountDocument = gql`
    query getAccount($accountId: uuid!) {
  account(id: $accountId) {
    id
    name
    createdAt
    updatedAt
    documents {
      documentId
      role
      createdAt
      acceptedAt
    }
  }
}
    `;

/**
 * __useGetAccountQuery__
 *
 * To run a query within a React component, call `useGetAccountQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAccountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAccountQuery({
 *   variables: {
 *      accountId: // value for 'accountId'
 *   },
 * });
 */
export function useGetAccountQuery(baseOptions: Apollo.QueryHookOptions<GetAccountQuery, GetAccountQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAccountQuery, GetAccountQueryVariables>(GetAccountDocument, options);
      }
export function useGetAccountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAccountQuery, GetAccountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAccountQuery, GetAccountQueryVariables>(GetAccountDocument, options);
        }
export type GetAccountQueryHookResult = ReturnType<typeof useGetAccountQuery>;
export type GetAccountLazyQueryHookResult = ReturnType<typeof useGetAccountLazyQuery>;
export type GetAccountQueryResult = Apollo.QueryResult<GetAccountQuery, GetAccountQueryVariables>;
export const GetAccountDataDocument = gql`
    query getAccountData($accountId: uuid!) {
  account(id: $accountId) {
    id
    name
    createdAt
    updatedAt
    documents {
      documentId
      role
      createdAt
      acceptedAt
      readingInfo {
        createdAt
        updatedAt
        lastPage
        location
      }
      document {
        id
        createdAt
        updatedAt
        fileId
        type
        creator {
          id
          name
        }
        members {
          accountId
          role
          createdAt
          acceptedAt
        }
        meta
      }
    }
  }
}
    `;

/**
 * __useGetAccountDataQuery__
 *
 * To run a query within a React component, call `useGetAccountDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAccountDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAccountDataQuery({
 *   variables: {
 *      accountId: // value for 'accountId'
 *   },
 * });
 */
export function useGetAccountDataQuery(baseOptions: Apollo.QueryHookOptions<GetAccountDataQuery, GetAccountDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAccountDataQuery, GetAccountDataQueryVariables>(GetAccountDataDocument, options);
      }
export function useGetAccountDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAccountDataQuery, GetAccountDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAccountDataQuery, GetAccountDataQueryVariables>(GetAccountDataDocument, options);
        }
export type GetAccountDataQueryHookResult = ReturnType<typeof useGetAccountDataQuery>;
export type GetAccountDataLazyQueryHookResult = ReturnType<typeof useGetAccountDataLazyQuery>;
export type GetAccountDataQueryResult = Apollo.QueryResult<GetAccountDataQuery, GetAccountDataQueryVariables>;
export const GetAccountInfoDocument = gql`
    query getAccountInfo($accountId: uuid!) {
  account(id: $accountId) {
    id
    name
  }
}
    `;

/**
 * __useGetAccountInfoQuery__
 *
 * To run a query within a React component, call `useGetAccountInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAccountInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAccountInfoQuery({
 *   variables: {
 *      accountId: // value for 'accountId'
 *   },
 * });
 */
export function useGetAccountInfoQuery(baseOptions: Apollo.QueryHookOptions<GetAccountInfoQuery, GetAccountInfoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAccountInfoQuery, GetAccountInfoQueryVariables>(GetAccountInfoDocument, options);
      }
export function useGetAccountInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAccountInfoQuery, GetAccountInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAccountInfoQuery, GetAccountInfoQueryVariables>(GetAccountInfoDocument, options);
        }
export type GetAccountInfoQueryHookResult = ReturnType<typeof useGetAccountInfoQuery>;
export type GetAccountInfoLazyQueryHookResult = ReturnType<typeof useGetAccountInfoLazyQuery>;
export type GetAccountInfoQueryResult = Apollo.QueryResult<GetAccountInfoQuery, GetAccountInfoQueryVariables>;
export const GetDocumentDocument = gql`
    query getDocument($documentId: uuid!) {
  document(id: $documentId) {
    id
    createdAt
    updatedAt
    fileId
    type
    creator {
      id
      name
    }
    members {
      accountId
      role
      createdAt
      acceptedAt
      account {
        id
        name
      }
    }
    meta
  }
}
    `;

/**
 * __useGetDocumentQuery__
 *
 * To run a query within a React component, call `useGetDocumentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDocumentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDocumentQuery({
 *   variables: {
 *      documentId: // value for 'documentId'
 *   },
 * });
 */
export function useGetDocumentQuery(baseOptions: Apollo.QueryHookOptions<GetDocumentQuery, GetDocumentQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDocumentQuery, GetDocumentQueryVariables>(GetDocumentDocument, options);
      }
export function useGetDocumentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDocumentQuery, GetDocumentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDocumentQuery, GetDocumentQueryVariables>(GetDocumentDocument, options);
        }
export type GetDocumentQueryHookResult = ReturnType<typeof useGetDocumentQuery>;
export type GetDocumentLazyQueryHookResult = ReturnType<typeof useGetDocumentLazyQuery>;
export type GetDocumentQueryResult = Apollo.QueryResult<GetDocumentQuery, GetDocumentQueryVariables>;
export const GetDocumentHighlightDocument = gql`
    query getDocumentHighlight($highlightId: uuid!) {
  documentHighlight(id: $highlightId) {
    id
    documentId
    createdAt
    updatedAt
    createdBy
    creator {
      id
      name
    }
    location
    content
    thumbnailImage
  }
}
    `;

/**
 * __useGetDocumentHighlightQuery__
 *
 * To run a query within a React component, call `useGetDocumentHighlightQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDocumentHighlightQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDocumentHighlightQuery({
 *   variables: {
 *      highlightId: // value for 'highlightId'
 *   },
 * });
 */
export function useGetDocumentHighlightQuery(baseOptions: Apollo.QueryHookOptions<GetDocumentHighlightQuery, GetDocumentHighlightQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDocumentHighlightQuery, GetDocumentHighlightQueryVariables>(GetDocumentHighlightDocument, options);
      }
export function useGetDocumentHighlightLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDocumentHighlightQuery, GetDocumentHighlightQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDocumentHighlightQuery, GetDocumentHighlightQueryVariables>(GetDocumentHighlightDocument, options);
        }
export type GetDocumentHighlightQueryHookResult = ReturnType<typeof useGetDocumentHighlightQuery>;
export type GetDocumentHighlightLazyQueryHookResult = ReturnType<typeof useGetDocumentHighlightLazyQuery>;
export type GetDocumentHighlightQueryResult = Apollo.QueryResult<GetDocumentHighlightQuery, GetDocumentHighlightQueryVariables>;
export const GetDocumentHighlightsDocument = gql`
    query getDocumentHighlights($documentId: uuid!) {
  documentHighlights(
    where: {documentId: {_eq: $documentId}}
    order_by: {updatedAt: desc}
  ) {
    id
    documentId
    createdAt
    updatedAt
    createdBy
    creator {
      id
      name
    }
    location
    content
    thumbnailImage
  }
}
    `;

/**
 * __useGetDocumentHighlightsQuery__
 *
 * To run a query within a React component, call `useGetDocumentHighlightsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDocumentHighlightsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDocumentHighlightsQuery({
 *   variables: {
 *      documentId: // value for 'documentId'
 *   },
 * });
 */
export function useGetDocumentHighlightsQuery(baseOptions: Apollo.QueryHookOptions<GetDocumentHighlightsQuery, GetDocumentHighlightsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDocumentHighlightsQuery, GetDocumentHighlightsQueryVariables>(GetDocumentHighlightsDocument, options);
      }
export function useGetDocumentHighlightsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDocumentHighlightsQuery, GetDocumentHighlightsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDocumentHighlightsQuery, GetDocumentHighlightsQueryVariables>(GetDocumentHighlightsDocument, options);
        }
export type GetDocumentHighlightsQueryHookResult = ReturnType<typeof useGetDocumentHighlightsQuery>;
export type GetDocumentHighlightsLazyQueryHookResult = ReturnType<typeof useGetDocumentHighlightsLazyQuery>;
export type GetDocumentHighlightsQueryResult = Apollo.QueryResult<GetDocumentHighlightsQuery, GetDocumentHighlightsQueryVariables>;
export const SubscribeDocumentHighlightsDocument = gql`
    subscription subscribeDocumentHighlights($documentId: uuid!) {
  documentHighlights(where: {documentId: {_eq: $documentId}}) {
    id
    updatedAt
    documentId
  }
}
    `;

/**
 * __useSubscribeDocumentHighlightsSubscription__
 *
 * To run a query within a React component, call `useSubscribeDocumentHighlightsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useSubscribeDocumentHighlightsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubscribeDocumentHighlightsSubscription({
 *   variables: {
 *      documentId: // value for 'documentId'
 *   },
 * });
 */
export function useSubscribeDocumentHighlightsSubscription(baseOptions: Apollo.SubscriptionHookOptions<SubscribeDocumentHighlightsSubscription, SubscribeDocumentHighlightsSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<SubscribeDocumentHighlightsSubscription, SubscribeDocumentHighlightsSubscriptionVariables>(SubscribeDocumentHighlightsDocument, options);
      }
export type SubscribeDocumentHighlightsSubscriptionHookResult = ReturnType<typeof useSubscribeDocumentHighlightsSubscription>;
export type SubscribeDocumentHighlightsSubscriptionResult = Apollo.SubscriptionResult<SubscribeDocumentHighlightsSubscription>;
export const UpsertAccountDocumentsDocument = gql`
    mutation upsertAccountDocuments($objects: [accountDocuments_insert_input!] = []) {
  insertAccountDocuments(objects: $objects) {
    affected_rows
    returning {
      accountId
      documentId
      role
      acceptedAt
      createdAt
    }
  }
}
    `;
export type UpsertAccountDocumentsMutationFn = Apollo.MutationFunction<UpsertAccountDocumentsMutation, UpsertAccountDocumentsMutationVariables>;

/**
 * __useUpsertAccountDocumentsMutation__
 *
 * To run a mutation, you first call `useUpsertAccountDocumentsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpsertAccountDocumentsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [upsertAccountDocumentsMutation, { data, loading, error }] = useUpsertAccountDocumentsMutation({
 *   variables: {
 *      objects: // value for 'objects'
 *   },
 * });
 */
export function useUpsertAccountDocumentsMutation(baseOptions?: Apollo.MutationHookOptions<UpsertAccountDocumentsMutation, UpsertAccountDocumentsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpsertAccountDocumentsMutation, UpsertAccountDocumentsMutationVariables>(UpsertAccountDocumentsDocument, options);
      }
export type UpsertAccountDocumentsMutationHookResult = ReturnType<typeof useUpsertAccountDocumentsMutation>;
export type UpsertAccountDocumentsMutationResult = Apollo.MutationResult<UpsertAccountDocumentsMutation>;
export type UpsertAccountDocumentsMutationOptions = Apollo.BaseMutationOptions<UpsertAccountDocumentsMutation, UpsertAccountDocumentsMutationVariables>;
export const UpsertDocumentDocument = gql`
    mutation upsertDocument($object: documents_insert_input!, $updatedAt: timestamptz = "1970-01-01 00:00:00+00") {
  insertDocument(
    object: $object
    on_conflict: {constraint: documents_pkey, update_columns: [fileId, type, meta], where: {updatedAt: {_gt: $updatedAt}}}
  ) {
    id
    createdAt
    updatedAt
    fileId
    type
    meta
  }
}
    `;
export type UpsertDocumentMutationFn = Apollo.MutationFunction<UpsertDocumentMutation, UpsertDocumentMutationVariables>;

/**
 * __useUpsertDocumentMutation__
 *
 * To run a mutation, you first call `useUpsertDocumentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpsertDocumentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [upsertDocumentMutation, { data, loading, error }] = useUpsertDocumentMutation({
 *   variables: {
 *      object: // value for 'object'
 *      updatedAt: // value for 'updatedAt'
 *   },
 * });
 */
export function useUpsertDocumentMutation(baseOptions?: Apollo.MutationHookOptions<UpsertDocumentMutation, UpsertDocumentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpsertDocumentMutation, UpsertDocumentMutationVariables>(UpsertDocumentDocument, options);
      }
export type UpsertDocumentMutationHookResult = ReturnType<typeof useUpsertDocumentMutation>;
export type UpsertDocumentMutationResult = Apollo.MutationResult<UpsertDocumentMutation>;
export type UpsertDocumentMutationOptions = Apollo.BaseMutationOptions<UpsertDocumentMutation, UpsertDocumentMutationVariables>;
export const UpsertDocumentHighlightDocument = gql`
    mutation upsertDocumentHighlight($highlight: documentHighlights_insert_input!, $updatedAt: timestamptz! = "1970-01-01 00:00:00+00") {
  insertDocumentHighlight(
    object: $highlight
    on_conflict: {constraint: document_highlights_pkey, update_columns: [location, content, thumbnailImage], where: {updatedAt: {_gt: $updatedAt}}}
  ) {
    id
    documentId
    createdAt
    updatedAt
    content
    location
    thumbnailImage
    createdBy
    creator {
      id
      name
    }
  }
}
    `;
export type UpsertDocumentHighlightMutationFn = Apollo.MutationFunction<UpsertDocumentHighlightMutation, UpsertDocumentHighlightMutationVariables>;

/**
 * __useUpsertDocumentHighlightMutation__
 *
 * To run a mutation, you first call `useUpsertDocumentHighlightMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpsertDocumentHighlightMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [upsertDocumentHighlightMutation, { data, loading, error }] = useUpsertDocumentHighlightMutation({
 *   variables: {
 *      highlight: // value for 'highlight'
 *      updatedAt: // value for 'updatedAt'
 *   },
 * });
 */
export function useUpsertDocumentHighlightMutation(baseOptions?: Apollo.MutationHookOptions<UpsertDocumentHighlightMutation, UpsertDocumentHighlightMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpsertDocumentHighlightMutation, UpsertDocumentHighlightMutationVariables>(UpsertDocumentHighlightDocument, options);
      }
export type UpsertDocumentHighlightMutationHookResult = ReturnType<typeof useUpsertDocumentHighlightMutation>;
export type UpsertDocumentHighlightMutationResult = Apollo.MutationResult<UpsertDocumentHighlightMutation>;
export type UpsertDocumentHighlightMutationOptions = Apollo.BaseMutationOptions<UpsertDocumentHighlightMutation, UpsertDocumentHighlightMutationVariables>;