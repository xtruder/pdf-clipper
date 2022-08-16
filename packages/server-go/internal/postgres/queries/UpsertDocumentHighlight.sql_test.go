package queries

import (
	"context"
	"testing"
	"time"

	"github.com/bradleyjkemp/cupaloy"
	"github.com/stretchr/testify/require"
	"github.com/xtruder/pdf-clipper/packages/server-go/internal/postgres/pgtest"
)

func TestUpsertDocumentHighlight(t *testing.T) {
	conn, close := pgtest.CreateTestDB()
	defer close()

	q := NewQuerier(conn)

	highlight := UpsertDocumentHighlightParams{
		ID:         stringToUUID("0a7c5eea-9596-4c0f-942b-be796d11ba25"),
		DocumentID: stringToUUID("ecbb7ac0-8aac-4393-baa1-0d54f1c1bafe"),
		AccountID:  stringToUUID("23560f28-1f04-42f8-9664-63b844fdfe99"),
		CreatedAt:  fixedTime,
		UpdatedAt:  fixedTime,
		DeletedAt:  nullTime,
		Sequence:   "1",
		Location:   valToJSONB("{}"),
		Content:    valToJSONB("{}"),
		ImageHash:  "",
	}

	t.Run("should create new document highlight", func(t *testing.T) {
		row, err := q.UpsertDocumentHighlight(context.Background(), highlight)
		require.NoError(t, err)
		cupaloy.SnapshotT(t, row)
	})

	t.Run("should update if after updated time", func(t *testing.T) {
		_highlight := highlight
		_highlight.UpdatedAt.Time = _highlight.UpdatedAt.Time.Add(time.Minute)
		_highlight.ImageHash = "5204352f39e4a55d23d26ba664dd47ba3ad1db39d0506be95edf7e58469c01c0"
		_highlight.Sequence = "2"
		_highlight.Location = valToJSONB(map[string]interface{}{
			"pageNumber": 2,
		})
		_highlight.Content = valToJSONB(map[string]interface{}{
			"text": "this is some text",
		})

		row, err := q.UpsertDocumentHighlight(context.Background(), _highlight)
		require.NoError(t, err)
		cupaloy.SnapshotT(t, row)
	})

	t.Run("should not update if before updated time", func(t *testing.T) {
		_highlight := highlight
		_highlight.Sequence = "3"

		row, err := q.UpsertDocumentHighlight(context.Background(), _highlight)
		require.NoError(t, err)
		cupaloy.SnapshotT(t, row)
	})
}
