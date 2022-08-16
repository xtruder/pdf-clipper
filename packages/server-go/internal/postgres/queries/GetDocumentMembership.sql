-- plpgsql-language-server:use-query-parameter

-- GetDocumentsMembership gets all documents that account is member of
-- name: GetDocumentsMembership :many
SELECT
  document_id,
  role
FROM public.document_members
WHERE
  account_id = pggen.arg('accountID') AND
  accepted_at > '0001-01-01 00:00:00+00'  AND
  deleted_at <= '0001-01-01 00:00:00+00' AND

  -- make sure document is not deleted
  EXISTS (
    SELECT 1 FROM public.documents
      WHERE id = document_id AND deleted_at <= '0001-01-01 00:00:00+00'
  );
