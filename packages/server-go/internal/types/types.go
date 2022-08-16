package types

import (
	"time"

	"github.com/google/uuid"
)

type Object = map[string]interface{}

type Account struct {
	ID uuid.UUID `json:"id" jsonschema:"format=uuid,maxLength=36"`

	CreatedAt time.Time `json:"createdAt,omitempty"`
	UpdatedAt time.Time `json:"updatedAt,omitempty"`
	DeletedAt time.Time `json:"deletedAt,omitempty"`

	Name string `json:"name,omitempty"`
}

type AccountInfo struct {
	ID uuid.UUID `json:"id" jsonschema:"format=uuid,maxLength=36"`

	UpdatedAt time.Time `json:"updatedAt"`
	Name      string    `json:"name,omitempty"`
}

type Session struct {
	ID uuid.UUID `json:"id" jsonschema:"format=uuid,maxLength=36"`

	AccountID uuid.UUID `json:"accountId" jsonschema:"format=uuid"`
	CreatedAt time.Time `json:"createdAt,omitempty"`
	UpdatedAt time.Time `json:"updatedAt,omitempty"`
	DeletedAt time.Time `json:"deletedAt,omitempty"`

	Meta Object `json:"meta,omitempty"`
}

type DocumentType = string

const (
	DocumentTypePDF DocumentType = "PDF"
)

type Document struct {
	ID string `json:"id" jsonschema:"format=uuid,maxLength=36"`

	CreatedAt time.Time `json:"createdAt,omitempty"`
	UpdatedAt time.Time `json:"updatedAt,omitempty"`
	DeletedAt time.Time `json:"deletedAt,omitempty"`
	CreatedBy string    `json:"createdBy,omitempty" jsonschema:"format=uuid"`

	Type     DocumentType `json:"type,omitempty" jsonschema:"enum=PDF"`
	Meta     Object       `json:"meta,omitempty"`
	FileHash string       `json:"fileHash,omitempty"`
	Local    bool         `json:"local,omitempty"`
}

type DocumentRole = string

const (
	DocumentRoleAdmin  DocumentRole = "admin"
	DocumentRoleViewer DocumentRole = "viewer"
	DocumentRoleEditor DocumentRole = "editor"
)

type DocumentMember struct {
	ID         string `json:"id" jsonschema:"maxLength=100"`
	DocumentID string `json:"documentId" jsonschema:"format=uuid"`
	AccountID  string `json:"accountId" jsonschema:"format=uuid"`

	CreatedAt time.Time `json:"createdAt,omitempty"`
	UpdatedAt time.Time `json:"updatedAt,omitempty"`
	DeletedAt time.Time `json:"deletedAt,omitempty"`
	CreatedBy string    `json:"createdBy,omitempty" jsonschema:"format=uuid"`

	AcceptedAt time.Time    `json:"acceptedAt,omitempty"`
	Role       DocumentRole `json:"role" jsonschema:"enum=admin,enum=viewer,enum=editor"`

	Local bool `json:"local,omitempty"`
}

type DocumentHighlight struct {
	ID         string `json:"id" jsonschema:"format=uuid,maxLength=36"`
	DocumentID string `json:"documentId" jsonschema:"format=uuid"`

	CreatedAt time.Time `json:"createdAt,omitempty"`
	UpdatedAt time.Time `json:"updatedAt,omitempty"`
	DeletedAt time.Time `json:"deletedAt,omitempty"`
	CreatedBy string    `json:"createdBy,omitempty" jsonschema:"format=uuid"`

	Location  Object `json:"location,omitempty"`
	Content   Object `json:"content,omitempty"`
	Sequence  string `json:"sequence"`
	ImageHash string `json:"imageHash,omitempty"`

	Local bool `json:"local,omitempty"`
}

type BlobType = string

const (
	BlobTypeDocFile      BlobType = "docfile"
	BlobTypeHighlightImg BlobType = "highlightimg"
)

type BlobInfo struct {
	Hash string `json:"hash" jsonschema:"maxLength=64"`

	CreatedAt time.Time `json:"createdAt,omitempty"`
	UpdatedAt time.Time `json:"updatedAt,omitempty"`
	CreatedBy string    `json:"createdBy,omitempty" jsonschema:"format=uuid"`

	Type     BlobType `json:"type" jsonschema:"enum=docfile,enum=highlightimg"`
	MimeType string   `json:"mimeType"`
	Size     int      `json:"size"`
	Source   string   `json:"source" jsonschema:"format=uri"`

	Local bool `json:"local,omitempty"`
}
