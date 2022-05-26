SET check_function_bodies = false;
CREATE FUNCTION public.set_current_timestamp_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$;
CREATE TABLE public.account_document_roles (
    value text NOT NULL,
    comment text
);
COMMENT ON TABLE public.account_document_roles IS 'Valid account document roles';
CREATE TABLE public.accounts (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name character varying,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted boolean DEFAULT false NOT NULL
);
COMMENT ON TABLE public.accounts IS 'Table with app accounts';
CREATE TABLE public.accounts_documents (
    account_id uuid NOT NULL,
    document_id uuid NOT NULL,
    role text NOT NULL,
    accepted_at date,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);
COMMENT ON TABLE public.accounts_documents IS 'Table connecting accounts and documents';
CREATE TABLE public.document_highlights (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    document_id uuid NOT NULL,
    location jsonb NOT NULL,
    content jsonb,
    created_by uuid NOT NULL,
    thumbnail_image character varying,
    file_id uuid
);
COMMENT ON TABLE public.document_highlights IS 'Highlights associated with documents';
COMMENT ON COLUMN public.document_highlights.thumbnail_image IS 'base64 encoded thumbnail image';
CREATE TABLE public.document_reading_info (
    account_id uuid NOT NULL,
    document_id uuid NOT NULL,
    location jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    last_page integer
);
COMMENT ON TABLE public.document_reading_info IS 'Reading info about document';
CREATE TABLE public.document_type (
    value text NOT NULL,
    comment text
);
CREATE TABLE public.documents (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    file_hash text,
    type character varying NOT NULL,
    created_by uuid NOT NULL,
    meta jsonb,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted boolean DEFAULT false NOT NULL
);
COMMENT ON TABLE public.documents IS 'Table with documents';
COMMENT ON COLUMN public.documents.meta IS 'metadata associated with document';
COMMENT ON COLUMN public.documents.updated_at IS 'Document last update time';
CREATE TABLE public.files (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    sources jsonb DEFAULT '[]'::jsonb NOT NULL,
    created_by uuid NOT NULL,
    hash character varying NOT NULL,
    size integer,
    deleted boolean DEFAULT false NOT NULL
);
COMMENT ON TABLE public.files IS 'Table containing file metadata';
ALTER TABLE ONLY public.account_document_roles
    ADD CONSTRAINT account_document_roles_pkey PRIMARY KEY (value);
ALTER TABLE ONLY public.accounts_documents
    ADD CONSTRAINT accounts_documents_account_id_document_id_key UNIQUE (account_id, document_id);
ALTER TABLE ONLY public.accounts_documents
    ADD CONSTRAINT accounts_documents_pkey PRIMARY KEY (account_id, document_id);
ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_name_key UNIQUE (name);
ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.document_highlights
    ADD CONSTRAINT document_highlights_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.document_reading_info
    ADD CONSTRAINT document_reading_info_pkey PRIMARY KEY (account_id, document_id);
ALTER TABLE ONLY public.document_type
    ADD CONSTRAINT document_type_pkey PRIMARY KEY (value);
ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_pkey PRIMARY KEY (hash);
CREATE TRIGGER set_public_accounts_documents_updated_at BEFORE UPDATE ON public.accounts_documents FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_accounts_documents_updated_at ON public.accounts_documents IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_accounts_updated_at BEFORE UPDATE ON public.accounts FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_accounts_updated_at ON public.accounts IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_document_highlights_updated_at BEFORE UPDATE ON public.document_highlights FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_document_highlights_updated_at ON public.document_highlights IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_document_reading_info_updated_at BEFORE UPDATE ON public.document_reading_info FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_document_reading_info_updated_at ON public.document_reading_info IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_documents_updated_at BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_documents_updated_at ON public.documents IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_files_updated_at BEFORE UPDATE ON public.files FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_files_updated_at ON public.files IS 'trigger to set value of column "updated_at" to current timestamp on row update';
ALTER TABLE ONLY public.accounts_documents
    ADD CONSTRAINT accounts_documents_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.accounts_documents
    ADD CONSTRAINT accounts_documents_document_id_fkey FOREIGN KEY (document_id) REFERENCES public.documents(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.accounts_documents
    ADD CONSTRAINT accounts_documents_role_fkey FOREIGN KEY (role) REFERENCES public.account_document_roles(value) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.document_highlights
    ADD CONSTRAINT document_highlights_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.accounts(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.document_highlights
    ADD CONSTRAINT document_highlights_document_id_fkey FOREIGN KEY (document_id) REFERENCES public.documents(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.document_reading_info
    ADD CONSTRAINT document_reading_info_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.document_reading_info
    ADD CONSTRAINT document_reading_info_document_id_fkey FOREIGN KEY (document_id) REFERENCES public.documents(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_author_id_fkey FOREIGN KEY (created_by) REFERENCES public.accounts(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_file_hash_fkey FOREIGN KEY (file_hash) REFERENCES public.files(hash) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_type_fkey FOREIGN KEY (type) REFERENCES public.document_type(value) ON UPDATE RESTRICT ON DELETE RESTRICT;
