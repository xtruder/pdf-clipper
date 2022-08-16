// Code generated by pggen. DO NOT EDIT.

package queries

import (
	"context"
	"fmt"
	"github.com/jackc/pgtype/zeronull"
	"github.com/jackc/pgx/v4"
)

const getAccountUpdatesForAccountSQL = `SELECT
  id,
  created_at,
  updated_at,
  deleted_at,
  name
FROM public.accounts
WHERE
  updated_at > $1 AND
  id = $2;`

type GetAccountUpdatesForAccountRow struct {
	ID        zeronull.UUID        `json:"id"`
	CreatedAt zeronull.Timestamptz `json:"created_at"`
	UpdatedAt zeronull.Timestamptz `json:"updated_at"`
	DeletedAt zeronull.Timestamptz `json:"deleted_at"`
	Name      zeronull.Text        `json:"name"`
}

// GetAccountUpdatesForAccount implements Querier.GetAccountUpdatesForAccount.
func (q *DBQuerier) GetAccountUpdatesForAccount(ctx context.Context, since zeronull.Timestamptz, accountID zeronull.UUID) ([]GetAccountUpdatesForAccountRow, error) {
	ctx = context.WithValue(ctx, "pggen_query_name", "GetAccountUpdatesForAccount")
	rows, err := q.conn.Query(ctx, getAccountUpdatesForAccountSQL, since, accountID)
	if err != nil {
		return nil, fmt.Errorf("query GetAccountUpdatesForAccount: %w", err)
	}
	defer rows.Close()
	items := []GetAccountUpdatesForAccountRow{}
	for rows.Next() {
		var item GetAccountUpdatesForAccountRow
		if err := rows.Scan(&item.ID, &item.CreatedAt, &item.UpdatedAt, &item.DeletedAt, &item.Name); err != nil {
			return nil, fmt.Errorf("scan GetAccountUpdatesForAccount row: %w", err)
		}
		items = append(items, item)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("close GetAccountUpdatesForAccount rows: %w", err)
	}
	return items, err
}

// GetAccountUpdatesForAccountBatch implements Querier.GetAccountUpdatesForAccountBatch.
func (q *DBQuerier) GetAccountUpdatesForAccountBatch(batch genericBatch, since zeronull.Timestamptz, accountID zeronull.UUID) {
	batch.Queue(getAccountUpdatesForAccountSQL, since, accountID)
}

// GetAccountUpdatesForAccountScan implements Querier.GetAccountUpdatesForAccountScan.
func (q *DBQuerier) GetAccountUpdatesForAccountScan(results pgx.BatchResults) ([]GetAccountUpdatesForAccountRow, error) {
	rows, err := results.Query()
	if err != nil {
		return nil, fmt.Errorf("query GetAccountUpdatesForAccountBatch: %w", err)
	}
	defer rows.Close()
	items := []GetAccountUpdatesForAccountRow{}
	for rows.Next() {
		var item GetAccountUpdatesForAccountRow
		if err := rows.Scan(&item.ID, &item.CreatedAt, &item.UpdatedAt, &item.DeletedAt, &item.Name); err != nil {
			return nil, fmt.Errorf("scan GetAccountUpdatesForAccountBatch row: %w", err)
		}
		items = append(items, item)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("close GetAccountUpdatesForAccountBatch rows: %w", err)
	}
	return items, err
}
