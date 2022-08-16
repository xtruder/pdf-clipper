-- plpgsql-language-server:use-query-parameter

--- name: GetDocumentHighlightUpdatesForDocument :many
SELECT
  document_highlights.id,
  document_highlights.document_id,
  document_highlights.created_at,
  document_highlights.updated_at,
  document_highlights.deleted_at,
  document_highlights.created_by,
  document_highlights.location,
  document_highlights.content,
  document_highlights.sequence,
  document_highlights.image_hash
FROM public.document_highlights
WHERE
  document_highlights.updated_at > pggen.arg('since') AND
  document_highlights.document_id = pggen.arg('documentID');
