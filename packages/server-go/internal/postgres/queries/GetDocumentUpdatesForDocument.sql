-- plpgsql-language-server:use-query-parameter

-- name: GetDocumentUpdatesForDocument :many
SELECT
  documents.id,
  documents.created_at,
  documents.updated_at,
  documents.deleted_at,
  documents.created_by,
  documents.type,
  documents.meta,
  documents.file_hash
FROM public.documents
WHERE
  documents.updated_at > pggen.arg('since') AND
  documents.id = pggen.arg('documentID');

