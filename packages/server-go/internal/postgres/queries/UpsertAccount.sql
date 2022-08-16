-- plpgsql-language-server:disable validation
-- plpgsql-language-server:use-query-parameter

-- name: UpsertAccount :one
INSERT INTO public.accounts (
  id,
  created_at,
  updated_at,
  deleted_at,
  name
) VALUES (
  pggen.arg('ID'),
  pggen.arg('CreatedAt'),
  pggen.arg('UpdatedAt'),
  pggen.arg('DeletedAt'),
  NULLIF(pggen.arg('Name'), '')
)
ON CONFLICT (id) DO
UPDATE SET
  updated_at =
    CASE WHEN accounts.updated_at < EXCLUDED.updated_at
    THEN EXCLUDED.updated_at
    ELSE accounts.updated_at END,
  deleted_at =
    CASE WHEN accounts.updated_at < EXCLUDED.updated_at
    THEN EXCLUDED.deleted_at
    ELSE accounts.deleted_at END,
  name =
    CASE WHEN accounts.updated_at < EXCLUDED.updated_at
    THEN COALESCE(EXCLUDED.name, accounts.name)
    ELSE accounts.name END
RETURNING *;
