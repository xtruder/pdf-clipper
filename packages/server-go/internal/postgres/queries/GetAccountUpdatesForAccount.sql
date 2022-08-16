-- plpgsql-language-server:use-query-parameter

-- name: GetAccountUpdatesForAccount :many
SELECT
  id,
  created_at,
  updated_at,
  deleted_at,
  name
FROM public.accounts
WHERE
  updated_at > pggen.arg('since') AND
  id = pggen.arg('accountID');

