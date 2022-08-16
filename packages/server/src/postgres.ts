import { Pool } from "pg";
import { format } from "node-pg-format";

import { logger } from "./logging";
import * as config from "./config";
import { Account, AccountInfo } from "./graphql.schema";

const log = logger.child({ component: "postgres" });

export const pool = new Pool(config.postgres);

pool.on("error", (err) => {
  log.error("unexpected error on pool", err);
});

export async function getAccountChanges(accountId: string, updatedAt: Date) {
  const sql = format(
    `
    SELECT id, createdAt, updatedAt, deletedAt, name
    FROM accounts
    WHERE id = %L and updatedAt > %L
  `,
    accountId,
    updatedAt
  );

  const results = await pool.query<Account>(sql);

  return results.rows;
}

export async function getAccountInfoChangesForDocs(
  accountId: string,
  docIdsOffsets: Record<string, Date>
) {
  const sql = format(
    `
    SELECT id, name, updatedAt
    FROM accounts
    LEFT JOIN document_members
      ON accounts.id = document_members.accountId
    LEFT JOIN (SELECT (VALUES %L) AS doc_ids (documentId, updatedAt))
      ON document_members.documentId = documentId
    WHERE
      document_members.accountId = %L AND
      document_members.acceptedAt IS NOT NULL AND
      accounts.updatedAt > doc_ids.updatedAt
  `,
    docIdsOffsets,
    accountId
  );

  const results = await pool.query<AccountInfo>(sql);

  return results.rows;
}
