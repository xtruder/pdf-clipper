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

func TestGetAccountUpdatesForAccount(t *testing.T) {
	conn, close := pgtest.CreateTestDB()
	defer close()

	q := NewQuerier(conn)

	accountUUID := zeronull.UUID(uuid.MustParse("00c0bab4-c43b-45b4-bd23-202059e67eb2"))

	t.Run("sice zero should return account", func(t *testing.T) {
		rows, err := q.GetAccountUpdatesForAccount(context.Background(), zeroTime, accountUUID)
		require.NoError(t, err)
		require.Greater(t, len(rows), 0)
		cupaloy.SnapshotT(t, rows)
	})

	t.Run("since inf should return none", func(t *testing.T) {
		since := pgtype.Timestamptz{}
		since.Set(pgtype.Infinity)

		rows, err := q.GetAccountUpdatesForAccount(context.Background(), maxTime, accountUUID)
		require.NoError(t, err)
		require.Len(t, rows, 0)
	})
}
