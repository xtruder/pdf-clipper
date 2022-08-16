package queries

import (
	"context"
	"testing"

	"github.com/bradleyjkemp/cupaloy"
	"github.com/stretchr/testify/require"
	"github.com/xtruder/pdf-clipper/packages/server-go/internal/postgres/pgtest"
)

func TestGetDocumentMembership(t *testing.T) {
	conn, close := pgtest.CreateTestDB()
	defer close()

	q := NewQuerier(conn)

	docUUID := stringToUUID("06ccbe53-b764-4b59-bac3-ce1f7d5e09c6")

	rows, err := q.GetDocumentsMembership(context.Background(), docUUID)
	require.NoError(t, err)
	require.Greater(t, len(rows), 0)
	cupaloy.SnapshotT(t, rows)
}
