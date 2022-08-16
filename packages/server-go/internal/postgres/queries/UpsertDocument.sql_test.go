package queries

import (
	"context"
	"testing"
	"time"

	"github.com/bradleyjkemp/cupaloy"
	"github.com/stretchr/testify/require"
	"github.com/xtruder/pdf-clipper/packages/server-go/internal/postgres/pgtest"
)

func TestUpsertDocument(t *testing.T) {
	conn, close := pgtest.CreateTestDB()
	defer close()

	q := NewQuerier(conn)

	document := UpsertDocumentParams{
		ID:        stringToUUID("6c16b511-88bb-48a8-8bd9-b7abf377f708"),
		CreatedAt: fixedTime,
		UpdatedAt: fixedTime,
		DeletedAt: nullTime,
		AccountID: stringToUUID("00c0bab4-c43b-45b4-bd23-202059e67eb2"),
		Type:      DocumentTypePdf,
		Meta:      valToJSONB("{}"),
	}

	t.Run("should create new document", func(t *testing.T) {
		row, err := q.UpsertDocument(context.Background(), document)
		require.NoError(t, err)
		cupaloy.SnapshotT(t, row)
	})

	t.Run("should update if after updated time", func(t *testing.T) {
		_document := document
		_document.UpdatedAt.Time = _document.UpdatedAt.Time.Add(time.Minute)
		_document.FileHash = "f2ca1bb6c7e907d06dafe4687e579fce76b37e4e93b7605022da52e6ccc26fd2"
		_document.Meta = valToJSONB(map[string]interface{}{
			"title": "doc title",
		})

		row, err := q.UpsertDocument(context.Background(), _document)
		require.NoError(t, err)
		cupaloy.SnapshotT(t, row)
	})

	t.Run("should not update if before updated time", func(t *testing.T) {
		_document := document
		_document.FileHash = "f2ca1bb6c7e907d06dafe4687e579fce76b37e4e93b7605022da52e6ccc26fd3"

		row, err := q.UpsertDocument(context.Background(), _document)
		require.NoError(t, err)
		cupaloy.SnapshotT(t, row)
	})
}
