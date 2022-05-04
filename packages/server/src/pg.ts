import { Pool, Client, QueryConfig, DatabaseError, PoolClient } from "pg";
import SQL, { select } from "sql-template";
import { Maybe } from "./generated/graphql";
import {
  AccountDocumentModel,
  AccountModel,
  DocumentMemberModel,
  DocumentModel,
  FileModel,
} from "./models";

import { Persistence } from "./types";

const pool = new Pool();
const client = await pool.connect();

enum PgErrors {
  DUPLICATE_KEY_ERROR = "23505",
}

export class PgPersistence implements Persistence {
  constructor(private client: PoolClient) {}

  async getFirst<T, K = keyof T>(
    table: string,
    where: any,
    keys: K[] | "*" = "*"
  ): Promise<T | null> {
    const result = await this.client.query(
      SQL`select $keys${keys} from $id${table} $where${where}`
    );

    if (!result.rowCount) return null;

    return result.rows[0];
  }

  async insert<T>(table: string, values: T): Promise<T> {
    let result;
    try {
      const keys = Object.keys(values);
      result = await this.client.query(
        SQL`insert into $id${table} $keys${keys} $values${values} returning *`
      );
    } catch (err) {
      // UNIQUE_VIOLATION
      if (
        err instanceof DatabaseError &&
        err.code === PgErrors.DUPLICATE_KEY_ERROR
      ) {
        throw new Error("duplicate error: ", err);
      }

      throw err;
    }

    return result.rows[0];
  }

  async update<T>(table: string, value: T, where: any): Promise<T | null> {
    const result = await this.client.query(
      SQL`update $id${table} $set${value} where $where${where} returning *`
    );

    if (!result.rowCount) return null;

    return result.rows[0];
  }

  async getAccounts(
    accountIds: string | readonly string[]
  ): Promise<Maybe<AccountModel>[]> {
    accountIds = Array.isArray(accountIds) ? accountIds : [accountIds];

    const results = await this.client.query<AccountModel>(
      SQL`select * from accounts where id $in${accountIds}`
    );

    return accountIds.map(
      (id) => results.rows.find((r) => r.id === id) || null
    );
  }

  async createAccount(account: AccountModel): Promise<AccountModel> {
    return this.insert("accounts", account);
  }

  async updateAccount(account: AccountModel): Promise<AccountModel | null> {
    return this.update("accounts", account, {});
  }

  async getAccountsDocumentIds(
    accountIds: string | readonly string[]
  ): Promise<Array<string[]>> {
    accountIds = Array.isArray(accountIds) ? accountIds : [accountIds];

    const result = await this.client.query<DocumentMemberModel>(
      SQL`
        select documents.id as id, account_documents.accountId as accountId
        from documents
        left join account_documents on
          documents.id = account_documents.documentId
        where accountId $in${accountIds}
      `
    );

    return accountIds.map((id) =>
      result.rows.filter((r) => r.accountId === id).map((r) => r.documentId)
    );
  }

  async getFiles(
    fileHashes: string | readonly string[]
  ): Promise<Maybe<FileModel>[]> {
    fileHashes = Array.isArray(fileHashes) ? fileHashes : [fileHashes];

    const result = await this.client.query<FileModel>(
      SQL`select * from files where id $in${fileHashes}`
    );

    return fileHashes.map((h) => result.rows.find((d) => d.hash === h) || null);
  }

  async getDocumentsMembers(
    documentIds?: readonly string[] | string
  ): Promise<Array<DocumentMemberModel[]>> {
    documentIds = Array.isArray(documentIds) ? documentIds : [documentIds];

    const result = await this.client.query<DocumentMemberModel>(
      SQL`
        select * from document_members
        where documentId $in${documentIds}
      `
    );

    return documentIds.map((id) =>
      result.rows.filter((r) => r.documentId === id)
    );
  }

  async getAccountsDocuments(
    accountIds: string | readonly string[]
  ): Promise<Array<AccountDocumentModel[]>> {
    accountIds = Array.isArray(accountIds) ? accountIds : [accountIds];

    const result = await this.client.query<AccountDocumentModel>(
      SQL`
        select
          documents.*,
          document_members.accountId,
          document_members.role,
          document_members.approvedAt as memberSince
        from document_members
        left join documents on
          documents.id = document_members.document_id
        where
          accountId $in${accountIds} and
          document_members.approvedAt is not null
      `
    );

    return accountIds.map((id) =>
      result.rows.filter((r) => r.accountId === id)
    );
  }

  async getDocuments(documentIds: string[]): Promise<Maybe<DocumentModel>[]> {
    const result = await this.client.query<DocumentModel>(
      SQL`select * from documents where id $in${documentIds}`
    );

    return documentIds.map(
      (id) => result.rows.find((d) => d.id === id) || null
    );
  }
}
