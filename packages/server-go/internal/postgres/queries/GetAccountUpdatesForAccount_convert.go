package queries

import (
	"time"

	"github.com/google/uuid"
	"github.com/xtruder/pdf-clipper/packages/server-go/graph/model"
)

func (row *GetAccountUpdatesForAccountRow) ToModel() (m model.Account) {
	m.ID = uuid.UUID(row.ID)
	m.CreatedAt = time.Time(row.CreatedAt)
	m.UpdatedAt = time.Time(row.UpdatedAt)
	m.DeletedAt = timestamptzToTimePtr(row.DeletedAt)
	m.Name = row.Name

	return
}
