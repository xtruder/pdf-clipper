-- plpgsql-language-server:disable validation
-- plpgsql-language-server:use-query-parameter

-- name: UpsertDocument :one
INSERT INTO public.documents (
  id,
  created_at,
  updated_at,
  deleted_at,
  created_by,
  owner_id,
  type,
  meta,
  file_hash
) VALUES (
  pggen.arg('ID'),
  pggen.arg('CreatedAt'),
  pggen.arg('UpdatedAt'),
  pggen.arg('DeletedAt'),
  pggen.arg('AccountID'),
  pggen.arg('AccountID'),
  pggen.arg('Type'),
  pggen.arg('Meta'),
  NULLIF(pggen.arg('FileHash'), '')
)
ON CONFLICT (id) DO
UPDATE SET
  updated_at =
    CASE WHEN documents.updated_at < EXCLUDED.updated_at
    THEN EXCLUDED.updated_at
    ELSE documents.updated_at END,
  deleted_at =
    CASE WHEN documents.updated_at < EXCLUDED.updated_at
    THEN EXCLUDED.deleted_at
    ELSE documents.deleted_at END,
  meta =
    CASE WHEN documents.updated_at < EXCLUDED.updated_at
    THEN EXCLUDED.meta
    ELSE documents.meta END,
  file_hash =
    CASE WHEN documents.updated_at < EXCLUDED.updated_at
    THEN COALESCE(EXCLUDED.file_hash, documents.file_hash)
    ELSE documents.file_hash END
RETURNING *;
