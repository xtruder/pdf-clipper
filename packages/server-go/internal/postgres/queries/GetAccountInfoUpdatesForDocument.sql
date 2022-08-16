-- plpgsql-language-server:use-keyword-query-parameter

-- name: GetAccountInfoUpdatesForDocument :many
SELECT
  accounts.id,
  accounts.name,
  accounts.updated_at
FROM public.accounts
LEFT JOIN public.document_members
  ON document_members.account_id = accounts.id
WHERE
  accounts.updated_at > pggen.arg('since') AND
  document_members.document_id = pggen.arg('documentID');
