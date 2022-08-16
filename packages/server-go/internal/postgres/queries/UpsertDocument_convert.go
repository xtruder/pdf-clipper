package queries

import "github.com/xtruder/pdf-clipper/packages/server-go/graph/model"

func (params *UpsertDocumentParams) FromModel(m *model.Document) {
	params.ID = uuidToPgUUID(m.ID)
	params.CreatedAt = timeToTimestamptz(m.CreatedAt)
	params.UpdatedAt = timeToTimestamptz(m.UpdatedAt)
	params.DeletedAt = timeToTimestamptz(m.DeletedAt)
	params.AccountID = uuidToPgUUID(m.CreatedBy)
	params.Type = DocumentType(m.Type)
	params.Meta = valToJSONB(m.Meta)
	params.FileHash = strPtrToStr(m.FileHash)
}
