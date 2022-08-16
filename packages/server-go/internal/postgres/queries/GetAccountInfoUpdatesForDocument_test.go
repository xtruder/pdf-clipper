package queries

import (
	"context"
	"testing"

	"github.com/bradleyjkemp/cupaloy"
	"github.com/google/uuid"
	"github.com/jackc/pgtype"
	"github.com/jackc/pgtype/zeronull"
	"github.com/stretchr/testify/require"
	"github.com/xtruder/pdf-clipper/packages/server-go/internal/postgres/pgtest"
)

func TestGetAccountInfoUpdatesForDocument(t *testing.T) {
	conn, close := pgtest.CreateTestDB()
	defer close()

	q := NewQuerier(conn)

	docUUID := zeronull.UUID(uuid.MustParse("ecbb7ac0-8aac-4393-baa1-0d54f1c1bafe"))

	t.Run("sice zero should return all", func(t *testing.T) {
		since := pgtype.Timestamptz{}
		since.Set(pgtype.NegativeInfinity)

		rows, err := q.GetAccountInfoUpdatesForDocument(context.Background(), zeroTime, docUUID)
		require.NoError(t, err)
		require.Greater(t, len(rows), 0)
		cupaloy.SnapshotT(t, rows)
	})

	t.Run("since inf should return none", func(t *testing.T) {
		since := pgtype.Timestamptz{}
		since.Set(pgtype.Infinity)

		rows, err := q.GetAccountInfoUpdatesForDocument(context.Background(), maxTime, docUUID)
		require.NoError(t, err)
		require.Len(t, rows, 0)
	})
}
