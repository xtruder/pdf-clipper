// Code generated by pggen. DO NOT EDIT.

package queries

import (
	"context"
	"fmt"
	"github.com/jackc/pgconn"
	"github.com/jackc/pgtype"
	"github.com/jackc/pgtype/zeronull"
	"github.com/jackc/pgx/v4"
)

// Querier is a typesafe Go interface backed by SQL queries.
//
// Methods ending with Batch enqueue a query to run later in a pgx.Batch. After
// calling SendBatch on pgx.Conn, pgxpool.Pool, or pgx.Tx, use the Scan methods
// to parse the results.
type Querier interface {
	GetAccountInfoUpdatesForDocument(ctx context.Context, since zeronull.Timestamptz, documentID zeronull.UUID) ([]GetAccountInfoUpdatesForDocumentRow, error)
	// GetAccountInfoUpdatesForDocumentBatch enqueues a GetAccountInfoUpdatesForDocument query into batch to be executed
	// later by the batch.
	GetAccountInfoUpdatesForDocumentBatch(batch genericBatch, since zeronull.Timestamptz, documentID zeronull.UUID)
	// GetAccountInfoUpdatesForDocumentScan scans the result of an executed GetAccountInfoUpdatesForDocumentBatch query.
	GetAccountInfoUpdatesForDocumentScan(results pgx.BatchResults) ([]GetAccountInfoUpdatesForDocumentRow, error)

	GetAccountUpdatesForAccount(ctx context.Context, since zeronull.Timestamptz, accountID zeronull.UUID) ([]GetAccountUpdatesForAccountRow, error)
	// GetAccountUpdatesForAccountBatch enqueues a GetAccountUpdatesForAccount query into batch to be executed
	// later by the batch.
	GetAccountUpdatesForAccountBatch(batch genericBatch, since zeronull.Timestamptz, accountID zeronull.UUID)
	// GetAccountUpdatesForAccountScan scans the result of an executed GetAccountUpdatesForAccountBatch query.
	GetAccountUpdatesForAccountScan(results pgx.BatchResults) ([]GetAccountUpdatesForAccountRow, error)

	GetBlobInfoUpdatesForDocument(ctx context.Context, since zeronull.Timestamptz, documentID zeronull.UUID) ([]GetBlobInfoUpdatesForDocumentRow, error)
	// GetBlobInfoUpdatesForDocumentBatch enqueues a GetBlobInfoUpdatesForDocument query into batch to be executed
	// later by the batch.
	GetBlobInfoUpdatesForDocumentBatch(batch genericBatch, since zeronull.Timestamptz, documentID zeronull.UUID)
	// GetBlobInfoUpdatesForDocumentScan scans the result of an executed GetBlobInfoUpdatesForDocumentBatch query.
	GetBlobInfoUpdatesForDocumentScan(results pgx.BatchResults) ([]GetBlobInfoUpdatesForDocumentRow, error)

	GetDocumentHighlightUpdatesForDocument(ctx context.Context, since zeronull.Timestamptz, documentID zeronull.UUID) ([]GetDocumentHighlightUpdatesForDocumentRow, error)
	// GetDocumentHighlightUpdatesForDocumentBatch enqueues a GetDocumentHighlightUpdatesForDocument query into batch to be executed
	// later by the batch.
	GetDocumentHighlightUpdatesForDocumentBatch(batch genericBatch, since zeronull.Timestamptz, documentID zeronull.UUID)
	// GetDocumentHighlightUpdatesForDocumentScan scans the result of an executed GetDocumentHighlightUpdatesForDocumentBatch query.
	GetDocumentHighlightUpdatesForDocumentScan(results pgx.BatchResults) ([]GetDocumentHighlightUpdatesForDocumentRow, error)

	GetDocumentMemberUpdatesForDocument(ctx context.Context, since zeronull.Timestamptz, documentID zeronull.UUID) ([]GetDocumentMemberUpdatesForDocumentRow, error)
	// GetDocumentMemberUpdatesForDocumentBatch enqueues a GetDocumentMemberUpdatesForDocument query into batch to be executed
	// later by the batch.
	GetDocumentMemberUpdatesForDocumentBatch(batch genericBatch, since zeronull.Timestamptz, documentID zeronull.UUID)
	// GetDocumentMemberUpdatesForDocumentScan scans the result of an executed GetDocumentMemberUpdatesForDocumentBatch query.
	GetDocumentMemberUpdatesForDocumentScan(results pgx.BatchResults) ([]GetDocumentMemberUpdatesForDocumentRow, error)

	// GetDocumentsMembership gets all documents that account is member of
	GetDocumentsMembership(ctx context.Context, accountID zeronull.UUID) ([]GetDocumentsMembershipRow, error)
	// GetDocumentsMembershipBatch enqueues a GetDocumentsMembership query into batch to be executed
	// later by the batch.
	GetDocumentsMembershipBatch(batch genericBatch, accountID zeronull.UUID)
	// GetDocumentsMembershipScan scans the result of an executed GetDocumentsMembershipBatch query.
	GetDocumentsMembershipScan(results pgx.BatchResults) ([]GetDocumentsMembershipRow, error)

	GetDocumentUpdatesForDocument(ctx context.Context, since zeronull.Timestamptz, documentID zeronull.UUID) ([]GetDocumentUpdatesForDocumentRow, error)
	// GetDocumentUpdatesForDocumentBatch enqueues a GetDocumentUpdatesForDocument query into batch to be executed
	// later by the batch.
	GetDocumentUpdatesForDocumentBatch(batch genericBatch, since zeronull.Timestamptz, documentID zeronull.UUID)
	// GetDocumentUpdatesForDocumentScan scans the result of an executed GetDocumentUpdatesForDocumentBatch query.
	GetDocumentUpdatesForDocumentScan(results pgx.BatchResults) ([]GetDocumentUpdatesForDocumentRow, error)

	UpsertAccount(ctx context.Context, params UpsertAccountParams) (UpsertAccountRow, error)
	// UpsertAccountBatch enqueues a UpsertAccount query into batch to be executed
	// later by the batch.
	UpsertAccountBatch(batch genericBatch, params UpsertAccountParams)
	// UpsertAccountScan scans the result of an executed UpsertAccountBatch query.
	UpsertAccountScan(results pgx.BatchResults) (UpsertAccountRow, error)

	UpsertBlobInfo(ctx context.Context, params UpsertBlobInfoParams) (UpsertBlobInfoRow, error)
	// UpsertBlobInfoBatch enqueues a UpsertBlobInfo query into batch to be executed
	// later by the batch.
	UpsertBlobInfoBatch(batch genericBatch, params UpsertBlobInfoParams)
	// UpsertBlobInfoScan scans the result of an executed UpsertBlobInfoBatch query.
	UpsertBlobInfoScan(results pgx.BatchResults) (UpsertBlobInfoRow, error)

	UpsertDocument(ctx context.Context, params UpsertDocumentParams) (UpsertDocumentRow, error)
	// UpsertDocumentBatch enqueues a UpsertDocument query into batch to be executed
	// later by the batch.
	UpsertDocumentBatch(batch genericBatch, params UpsertDocumentParams)
	// UpsertDocumentScan scans the result of an executed UpsertDocumentBatch query.
	UpsertDocumentScan(results pgx.BatchResults) (UpsertDocumentRow, error)

	UpsertDocumentHighlight(ctx context.Context, params UpsertDocumentHighlightParams) (UpsertDocumentHighlightRow, error)
	// UpsertDocumentHighlightBatch enqueues a UpsertDocumentHighlight query into batch to be executed
	// later by the batch.
	UpsertDocumentHighlightBatch(batch genericBatch, params UpsertDocumentHighlightParams)
	// UpsertDocumentHighlightScan scans the result of an executed UpsertDocumentHighlightBatch query.
	UpsertDocumentHighlightScan(results pgx.BatchResults) (UpsertDocumentHighlightRow, error)
}

type DBQuerier struct {
	conn  genericConn   // underlying Postgres transport to use
	types *typeResolver // resolve types by name
}

var _ Querier = &DBQuerier{}

// genericConn is a connection to a Postgres database. This is usually backed by
// *pgx.Conn, pgx.Tx, or *pgxpool.Pool.
type genericConn interface {
	// Query executes sql with args. If there is an error the returned Rows will
	// be returned in an error state. So it is allowed to ignore the error
	// returned from Query and handle it in Rows.
	Query(ctx context.Context, sql string, args ...interface{}) (pgx.Rows, error)

	// QueryRow is a convenience wrapper over Query. Any error that occurs while
	// querying is deferred until calling Scan on the returned Row. That Row will
	// error with pgx.ErrNoRows if no rows are returned.
	QueryRow(ctx context.Context, sql string, args ...interface{}) pgx.Row

	// Exec executes sql. sql can be either a prepared statement name or an SQL
	// string. arguments should be referenced positionally from the sql string
	// as $1, $2, etc.
	Exec(ctx context.Context, sql string, arguments ...interface{}) (pgconn.CommandTag, error)
}

// genericBatch batches queries to send in a single network request to a
// Postgres server. This is usually backed by *pgx.Batch.
type genericBatch interface {
	// Queue queues a query to batch b. query can be an SQL query or the name of a
	// prepared statement. See Queue on *pgx.Batch.
	Queue(query string, arguments ...interface{})
}

// NewQuerier creates a DBQuerier that implements Querier. conn is typically
// *pgx.Conn, pgx.Tx, or *pgxpool.Pool.
func NewQuerier(conn genericConn) *DBQuerier {
	return NewQuerierConfig(conn, QuerierConfig{})
}

type QuerierConfig struct {
	// DataTypes contains pgtype.Value to use for encoding and decoding instead
	// of pggen-generated pgtype.ValueTranscoder.
	//
	// If OIDs are available for an input parameter type and all of its
	// transitive dependencies, pggen will use the binary encoding format for
	// the input parameter.
	DataTypes []pgtype.DataType
}

// NewQuerierConfig creates a DBQuerier that implements Querier with the given
// config. conn is typically *pgx.Conn, pgx.Tx, or *pgxpool.Pool.
func NewQuerierConfig(conn genericConn, cfg QuerierConfig) *DBQuerier {
	return &DBQuerier{conn: conn, types: newTypeResolver(cfg.DataTypes)}
}

// WithTx creates a new DBQuerier that uses the transaction to run all queries.
func (q *DBQuerier) WithTx(tx pgx.Tx) (*DBQuerier, error) {
	return &DBQuerier{conn: tx}, nil
}

// preparer is any Postgres connection transport that provides a way to prepare
// a statement, most commonly *pgx.Conn.
type preparer interface {
	Prepare(ctx context.Context, name, sql string) (sd *pgconn.StatementDescription, err error)
}

// PrepareAllQueries executes a PREPARE statement for all pggen generated SQL
// queries in querier files. Typical usage is as the AfterConnect callback
// for pgxpool.Config
//
// pgx will use the prepared statement if available. Calling PrepareAllQueries
// is an optional optimization to avoid a network round-trip the first time pgx
// runs a query if pgx statement caching is enabled.
func PrepareAllQueries(ctx context.Context, p preparer) error {
	if _, err := p.Prepare(ctx, getAccountInfoUpdatesForDocumentSQL, getAccountInfoUpdatesForDocumentSQL); err != nil {
		return fmt.Errorf("prepare query 'GetAccountInfoUpdatesForDocument': %w", err)
	}
	if _, err := p.Prepare(ctx, getAccountUpdatesForAccountSQL, getAccountUpdatesForAccountSQL); err != nil {
		return fmt.Errorf("prepare query 'GetAccountUpdatesForAccount': %w", err)
	}
	if _, err := p.Prepare(ctx, getBlobInfoUpdatesForDocumentSQL, getBlobInfoUpdatesForDocumentSQL); err != nil {
		return fmt.Errorf("prepare query 'GetBlobInfoUpdatesForDocument': %w", err)
	}
	if _, err := p.Prepare(ctx, getDocumentHighlightUpdatesForDocumentSQL, getDocumentHighlightUpdatesForDocumentSQL); err != nil {
		return fmt.Errorf("prepare query 'GetDocumentHighlightUpdatesForDocument': %w", err)
	}
	if _, err := p.Prepare(ctx, getDocumentMemberUpdatesForDocumentSQL, getDocumentMemberUpdatesForDocumentSQL); err != nil {
		return fmt.Errorf("prepare query 'GetDocumentMemberUpdatesForDocument': %w", err)
	}
	if _, err := p.Prepare(ctx, getDocumentsMembershipSQL, getDocumentsMembershipSQL); err != nil {
		return fmt.Errorf("prepare query 'GetDocumentsMembership': %w", err)
	}
	if _, err := p.Prepare(ctx, getDocumentUpdatesForDocumentSQL, getDocumentUpdatesForDocumentSQL); err != nil {
		return fmt.Errorf("prepare query 'GetDocumentUpdatesForDocument': %w", err)
	}
	if _, err := p.Prepare(ctx, upsertAccountSQL, upsertAccountSQL); err != nil {
		return fmt.Errorf("prepare query 'UpsertAccount': %w", err)
	}
	if _, err := p.Prepare(ctx, upsertBlobInfoSQL, upsertBlobInfoSQL); err != nil {
		return fmt.Errorf("prepare query 'UpsertBlobInfo': %w", err)
	}
	if _, err := p.Prepare(ctx, upsertDocumentSQL, upsertDocumentSQL); err != nil {
		return fmt.Errorf("prepare query 'UpsertDocument': %w", err)
	}
	if _, err := p.Prepare(ctx, upsertDocumentHighlightSQL, upsertDocumentHighlightSQL); err != nil {
		return fmt.Errorf("prepare query 'UpsertDocumentHighlight': %w", err)
	}
	return nil
}

// BlobType represents the Postgres enum "blob_type".
type BlobType string

const (
	BlobTypeDocfile      BlobType = "docfile"
	BlobTypeHighlightimg BlobType = "highlightimg"
)

func (b BlobType) String() string { return string(b) }

// DocumentRole represents the Postgres enum "document_role".
type DocumentRole string

const (
	DocumentRoleAdmin  DocumentRole = "admin"
	DocumentRoleViewer DocumentRole = "viewer"
	DocumentRoleEditor DocumentRole = "editor"
)

func (d DocumentRole) String() string { return string(d) }

// DocumentType represents the Postgres enum "document_type".
type DocumentType string

const (
	DocumentTypePdf DocumentType = "pdf"
)

func (d DocumentType) String() string { return string(d) }

// typeResolver looks up the pgtype.ValueTranscoder by Postgres type name.
type typeResolver struct {
	connInfo *pgtype.ConnInfo // types by Postgres type name
}

func newTypeResolver(types []pgtype.DataType) *typeResolver {
	ci := pgtype.NewConnInfo()
	for _, typ := range types {
		if txt, ok := typ.Value.(textPreferrer); ok && typ.OID != unknownOID {
			typ.Value = txt.ValueTranscoder
		}
		ci.RegisterDataType(typ)
	}
	return &typeResolver{connInfo: ci}
}

// findValue find the OID, and pgtype.ValueTranscoder for a Postgres type name.
func (tr *typeResolver) findValue(name string) (uint32, pgtype.ValueTranscoder, bool) {
	typ, ok := tr.connInfo.DataTypeForName(name)
	if !ok {
		return 0, nil, false
	}
	v := pgtype.NewValue(typ.Value)
	return typ.OID, v.(pgtype.ValueTranscoder), true
}

// setValue sets the value of a ValueTranscoder to a value that should always
// work and panics if it fails.
func (tr *typeResolver) setValue(vt pgtype.ValueTranscoder, val interface{}) pgtype.ValueTranscoder {
	if err := vt.Set(val); err != nil {
		panic(fmt.Sprintf("set ValueTranscoder %T to %+v: %s", vt, val, err))
	}
	return vt
}

const getAccountInfoUpdatesForDocumentSQL = `SELECT
  accounts.id,
  accounts.name,
  accounts.updated_at
FROM public.accounts
LEFT JOIN public.document_members
  ON document_members.account_id = accounts.id
WHERE
  accounts.updated_at > $1 AND
  document_members.document_id = $2;`

type GetAccountInfoUpdatesForDocumentRow struct {
	ID        zeronull.UUID        `json:"id"`
	Name      zeronull.Text        `json:"name"`
	UpdatedAt zeronull.Timestamptz `json:"updated_at"`
}

// GetAccountInfoUpdatesForDocument implements Querier.GetAccountInfoUpdatesForDocument.
func (q *DBQuerier) GetAccountInfoUpdatesForDocument(ctx context.Context, since zeronull.Timestamptz, documentID zeronull.UUID) ([]GetAccountInfoUpdatesForDocumentRow, error) {
	ctx = context.WithValue(ctx, "pggen_query_name", "GetAccountInfoUpdatesForDocument")
	rows, err := q.conn.Query(ctx, getAccountInfoUpdatesForDocumentSQL, since, documentID)
	if err != nil {
		return nil, fmt.Errorf("query GetAccountInfoUpdatesForDocument: %w", err)
	}
	defer rows.Close()
	items := []GetAccountInfoUpdatesForDocumentRow{}
	for rows.Next() {
		var item GetAccountInfoUpdatesForDocumentRow
		if err := rows.Scan(&item.ID, &item.Name, &item.UpdatedAt); err != nil {
			return nil, fmt.Errorf("scan GetAccountInfoUpdatesForDocument row: %w", err)
		}
		items = append(items, item)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("close GetAccountInfoUpdatesForDocument rows: %w", err)
	}
	return items, err
}

// GetAccountInfoUpdatesForDocumentBatch implements Querier.GetAccountInfoUpdatesForDocumentBatch.
func (q *DBQuerier) GetAccountInfoUpdatesForDocumentBatch(batch genericBatch, since zeronull.Timestamptz, documentID zeronull.UUID) {
	batch.Queue(getAccountInfoUpdatesForDocumentSQL, since, documentID)
}

// GetAccountInfoUpdatesForDocumentScan implements Querier.GetAccountInfoUpdatesForDocumentScan.
func (q *DBQuerier) GetAccountInfoUpdatesForDocumentScan(results pgx.BatchResults) ([]GetAccountInfoUpdatesForDocumentRow, error) {
	rows, err := results.Query()
	if err != nil {
		return nil, fmt.Errorf("query GetAccountInfoUpdatesForDocumentBatch: %w", err)
	}
	defer rows.Close()
	items := []GetAccountInfoUpdatesForDocumentRow{}
	for rows.Next() {
		var item GetAccountInfoUpdatesForDocumentRow
		if err := rows.Scan(&item.ID, &item.Name, &item.UpdatedAt); err != nil {
			return nil, fmt.Errorf("scan GetAccountInfoUpdatesForDocumentBatch row: %w", err)
		}
		items = append(items, item)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("close GetAccountInfoUpdatesForDocumentBatch rows: %w", err)
	}
	return items, err
}

// textPreferrer wraps a pgtype.ValueTranscoder and sets the preferred encoding
// format to text instead binary (the default). pggen uses the text format
// when the OID is unknownOID because the binary format requires the OID.
// Typically occurs if the results from QueryAllDataTypes aren't passed to
// NewQuerierConfig.
type textPreferrer struct {
	pgtype.ValueTranscoder
	typeName string
}

// PreferredParamFormat implements pgtype.ParamFormatPreferrer.
func (t textPreferrer) PreferredParamFormat() int16 { return pgtype.TextFormatCode }

func (t textPreferrer) NewTypeValue() pgtype.Value {
	return textPreferrer{pgtype.NewValue(t.ValueTranscoder).(pgtype.ValueTranscoder), t.typeName}
}

func (t textPreferrer) TypeName() string {
	return t.typeName
}

// unknownOID means we don't know the OID for a type. This is okay for decoding
// because pgx call DecodeText or DecodeBinary without requiring the OID. For
// encoding parameters, pggen uses textPreferrer if the OID is unknown.
const unknownOID = 0
