-- plpgsql-language-server:disable validation

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE accounts (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,

  name TEXT
    CONSTRAINT check_name_match CHECK (name ~* '^[a-z0-9_]+$')
    CONSTRAINT check_name_length CHECK (char_length(name) <= 50)
);

CREATE TABLE sessions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,

  account_id UUID NOT NULL REFERENCES accounts (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,

  sync_documents JSONB NOT NULL DEFAULT '[]'::JSONB
);

CREATE TYPE document_type AS ENUM ('pdf');

CREATE TABLE documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  created_by UUID NOT NULL,

  owner_id UUID NOT NULL REFERENCES accounts (id),
  type document_type NOT NULL,
  meta JSONB NOT NULL DEFAULT '{}'::JSONB,
  file_hash TEXT CHECK (char_length(file_hash) <= 100)
);

CREATE TYPE document_role AS ENUM ('admin', 'viewer', 'editor');

CREATE TABLE document_members (
  account_id UUID NOT NULL REFERENCES accounts (id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES documents (id) ON DELETE CASCADE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  created_by UUID NOT NULL,

  accepted_at TIMESTAMPTZ,
  role document_role NOT NULL,

  PRIMARY KEY (account_id, document_id)
);

CREATE TABLE document_highlights (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,

  document_id UUID NOT NULL REFERENCES documents (id) ON DELETE CASCADE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  created_by UUID NOT NULL,

  location JSONB,
  content JSONB,
  sequence TEXT CHECK (char_length(sequence) <= 100),
  image_hash TEXT CHECK (char_length(image_hash) <= 100)
);

CREATE TYPE blob_type AS ENUM ('docfile', 'highlightimg');

CREATE TABLE blob_infos (
  hash TEXT PRIMARY KEY CHECK (char_length(hash) <= 100),

  type blob_type NOT NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID NOT NULL,

  mime_type TEXT NOT NULL CHECK (char_length(mime_type) <= 100),
  size integer NOT NULL CHECK (size >= 0),
  source TEXT CHECK (char_length(source) <= 2048)
)
