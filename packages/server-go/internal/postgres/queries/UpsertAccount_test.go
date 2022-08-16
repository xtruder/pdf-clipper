package queries

import (
	"context"
	"testing"
	"time"

	"github.com/bradleyjkemp/cupaloy"
	"github.com/stretchr/testify/require"
	"github.com/xtruder/pdf-clipper/packages/server-go/internal/postgres/pgtest"
)

func TestUpsertAccount(t *testing.T) {
	conn, close := pgtest.CreateTestDB()
	defer close()

	q := NewQuerier(conn)

	acc := UpsertAccountParams{
		ID:        stringToUUID("23560f28-1f04-42f8-9664-63b844fdfe99"),
		Name:      "user1",
		CreatedAt: fixedTime,
		UpdatedAt: fixedTime,
		DeletedAt: nullTime,
	}

	t.Run("should create new account", func(t *testing.T) {
		row, err := q.UpsertAccount(context.Background(), acc)
		require.NoError(t, err)
		cupaloy.SnapshotT(t, row)
	})

	t.Run("should update account if after updated time", func(t *testing.T) {
		_acc := acc
		_acc.Name = "user2"
		_acc.UpdatedAt.Time = _acc.UpdatedAt.Time.Add(time.Minute)

		row, err := q.UpsertAccount(context.Background(), _acc)
		require.NoError(t, err)
		cupaloy.SnapshotT(t, row)
	})

	t.Run("should not update if before updated time", func(t *testing.T) {
		_acc := acc
		_acc.Name = "user3"

		row, err := q.UpsertAccount(context.Background(), _acc)
		require.NoError(t, err)
		cupaloy.SnapshotT(t, row)
	})
}
