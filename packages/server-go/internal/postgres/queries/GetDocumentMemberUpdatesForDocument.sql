-- plpgsql-language-server:use-query-parameter

--- name: GetDocumentMemberUpdatesForDocument :many
SELECT
  document_members.account_id,
  document_members.document_id,
  document_members.created_at,
  document_members.updated_at,
  document_members.deleted_at,
  document_members.created_by,
  document_members.accepted_at,
  document_members.role
FROM public.document_members
WHERE
  document_members.updated_at > pggen.arg('since') AND
  document_members.document_id = pggen.arg('documentID');
