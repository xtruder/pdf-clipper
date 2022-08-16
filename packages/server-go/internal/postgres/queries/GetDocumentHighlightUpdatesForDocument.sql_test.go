package queries

import (
	"context"
	"testing"

	"github.com/bradleyjkemp/cupaloy"
	"github.com/stretchr/testify/require"
	"github.com/xtruder/pdf-clipper/packages/server-go/internal/postgres/pgtest"
)

func TestGetDocumentHighlightUpdatesForDocument(t *testing.T) {
	conn, close := pgtest.CreateTestDB()
	defer close()

	q := NewQuerier(conn)

	docUUID := stringToUUID("ecbb7ac0-8aac-4393-baa1-0d54f1c1bafe")

	t.Run("sice zero should return document highlights", func(t *testing.T) {
		rows, err := q.GetDocumentHighlightUpdatesForDocument(context.Background(), zeroTime, docUUID)
		require.NoError(t, err)
		require.Greater(t, len(rows), 0)
		cupaloy.SnapshotT(t, rows)
	})

	t.Run("since inf should return none", func(t *testing.T) {
		rows, err := q.GetDocumentHighlightUpdatesForDocument(context.Background(), maxTime, docUUID)
		require.NoError(t, err)
		require.Len(t, rows, 0)
	})
}
