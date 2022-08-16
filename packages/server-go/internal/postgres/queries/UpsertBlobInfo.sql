-- plpgsql-language-server:disable validation
-- plpgsql-language-server:use-query-parameter

-- name: UpsertBlobInfo :one
INSERT INTO public.blob_infos (
  hash,
  created_at,
  updated_at,
  created_by,
  type,
  size,
  mime_type,
  source
) VALUES (
  pggen.arg('Hash'),
  pggen.arg('CreatedAt'),
  pggen.arg('UpdatedAt'),
  pggen.arg('CreatedBy'),
  pggen.arg('Type'),
  pggen.arg('Size'),
  pggen.arg('MimeType'),
  NULLIF(pggen.arg('Source'), '')
)
ON CONFLICT (hash) DO
UPDATE SET
  updated_at =
    CASE WHEN blob_infos.updated_at < EXCLUDED.updated_at
    THEN EXCLUDED.updated_at
    ELSE blob_infos.updated_at END,
  source =
    CASE WHEN blob_infos.updated_at < EXCLUDED.updated_at
    THEN COALESCE(EXCLUDED.source, blob_infos.source)
    ELSE blob_infos.source END
RETURNING *;
