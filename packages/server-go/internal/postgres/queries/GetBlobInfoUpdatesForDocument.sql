-- plpgsql-language-server:use-query-parameter

--- name: GetBlobInfoUpdatesForDocument :many
SELECT
  blob_infos.hash,
  blob_infos.type,
  blob_infos.created_at,
  blob_infos.updated_at,
  blob_infos.created_by,
  blob_infos.mime_type,
  blob_infos.size,
  blob_infos.source
FROM public.blob_infos
WHERE
  blob_infos.updated_at > pggen.arg('since') AND
  (
    blob_infos.hash IN (SELECT documents.file_hash FROM public.documents WHERE id = pggen.arg('documentID')) OR
    blob_infos.hash IN (SELECT document_highlights.image_hash FROM public.document_highlights WHERE document_id = pggen.arg('documentID'))
  );
