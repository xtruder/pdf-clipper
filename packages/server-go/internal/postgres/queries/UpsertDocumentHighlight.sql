-- plpgsql-language-server:disable validation
-- plpgsql-language-server:use-query-parameter

-- name: UpsertDocumentHighlight :one
INSERT INTO public.document_highlights (
  id,
  document_id,
  created_at,
  updated_at,
  deleted_at,
  created_by,
  location,
  content,
  sequence,
  image_hash
) VALUES (
  pggen.arg('ID'),
  pggen.arg('DocumentID'),
  pggen.arg('CreatedAt'),
  pggen.arg('UpdatedAt'),
  pggen.arg('DeletedAt'),
  pggen.arg('AccountID'),
  pggen.arg('Location'),
  pggen.arg('Content'),
  pggen.arg('Sequence'),
  NULLIF(pggen.arg('ImageHash'), '')
)
ON CONFLICT (id) DO
UPDATE SET
  updated_at =
    CASE WHEN document_highlights.updated_at < EXCLUDED.updated_at
    THEN EXCLUDED.updated_at
    ELSE document_highlights.updated_at END,
  deleted_at =
    CASE WHEN document_highlights.updated_at < EXCLUDED.updated_at
    THEN EXCLUDED.deleted_at
    ELSE document_highlights.deleted_at END,
  location =
    CASE WHEN document_highlights.updated_at < EXCLUDED.updated_at
    THEN EXCLUDED.location
    ELSE document_highlights.location END,
  content =
    CASE WHEN document_highlights.updated_at < EXCLUDED.updated_at
    THEN EXCLUDED.content
    ELSE document_highlights.content END,
  sequence =
    CASE WHEN document_highlights.updated_at < EXCLUDED.updated_at
    THEN EXCLUDED.sequence
    ELSE document_highlights.sequence END,
  image_hash =
    CASE WHEN document_highlights.updated_at < EXCLUDED.updated_at
    THEN COALESCE(EXCLUDED.image_hash, document_highlights.image_hash)
    ELSE document_highlights.image_hash END
RETURNING *;

