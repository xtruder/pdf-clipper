package queries

import (
	"github.com/xtruder/pdf-clipper/packages/server-go/graph/model"
)

func (params *UpsertAccountParams) FromModel(m *model.Account) {
	params.ID = uuidToPgUUID(m.ID)
	params.CreatedAt = timeToTimestamptz(m.CreatedAt)
	params.UpdatedAt = timeToTimestamptz(m.UpdatedAt)
	params.DeletedAt = nullTime
	params.Name = strPtrToStr(m.Name)
}
