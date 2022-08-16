package queries

import (
	"context"
	"testing"
	"time"

	"github.com/bradleyjkemp/cupaloy"
	"github.com/google/uuid"
	"github.com/jackc/pgtype/zeronull"
	"github.com/stretchr/testify/require"
	"github.com/xtruder/pdf-clipper/packages/server-go/internal/postgres/pgtest"
)

func TestUpsertBlobInfo(t *testing.T) {
	conn, close := pgtest.CreateTestDB()
	defer close()

	q := NewQuerier(conn)

	blobInfo := UpsertBlobInfoParams{
		Hash:      "6efe272539583bb210c8a94e1490ac246b39e303083ed57d56c7c275f42381e4",
		CreatedAt: fixedTime,
		UpdatedAt: fixedTime,
		CreatedBy: zeronull.UUID(uuid.MustParse("23560f28-1f04-42f8-9664-63b844fdfe99")),
		Type:      BlobTypeDocfile,
		Size:      100,
		MimeType:  "image/png",
	}

	t.Run("should create new blob info", func(t *testing.T) {
		row, err := q.UpsertBlobInfo(context.Background(), blobInfo)
		require.NoError(t, err)
		cupaloy.SnapshotT(t, row)
	})

	t.Run("should update if after updated time", func(t *testing.T) {
		_blobInfo := blobInfo
		_blobInfo.Source = "file://source"
		_blobInfo.UpdatedAt = _blobInfo.UpdatedAt.Add(time.Minute)

		row, err := q.UpsertBlobInfo(context.Background(), _blobInfo)
		require.NoError(t, err)
		cupaloy.SnapshotT(t, row)
	})

	t.Run("should not update if before updated time", func(t *testing.T) {
		_blobInfo := blobInfo
		_blobInfo.Source = "file://source2"

		row, err := q.UpsertBlobInfo(context.Background(), _blobInfo)
		require.NoError(t, err)
		cupaloy.SnapshotT(t, row)
	})
}
