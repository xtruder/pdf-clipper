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
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);
COMMENT ON TABLE public.accounts IS 'Table with app accounts';
CREATE TABLE public.accounts_documents (
    account_id uuid NOT NULL,
    document_id uuid NOT NULL,
    id integer NOT NULL,
    role text NOT NULL,
    accepted_at date,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);
COMMENT ON TABLE public.accounts_documents IS 'Table connecting accounts and documents';
CREATE SEQUENCE public.accounts_documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.accounts_documents_id_seq OWNED BY public.accounts_documents.id;
CREATE TABLE public.document_highlights (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    document_id uuid NOT NULL,
    location jsonb,
    content jsonb,
    created_by uuid NOT NULL,
    thumbnail_image character varying
);
COMMENT ON TABLE public.document_highlights IS 'Highlights associated with documents';
COMMENT ON COLUMN public.document_highlights.thumbnail_image IS 'base64 encoded thumbnail image';
CREATE TABLE public.document_info (
    document_id uuid NOT NULL,
    title text,
    description text,
    page_count integer,
    outline jsonb,
    cover text,
    author text
);
COMMENT ON TABLE public.document_info IS 'Information about documents';
CREATE TABLE public.documents (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    file_id uuid,
    type character varying NOT NULL,
    author_id uuid NOT NULL,
    deleted_at timestamp with time zone
);
COMMENT ON TABLE public.documents IS 'Table with documents';
CREATE VIEW public.documents_admin AS
 SELECT documents.id,
    documents.created_at,
    documents.file_id AS "fileId",
    documents.type,
    documents.author_id,
    documents.deleted_at
   FROM public.documents;
CREATE TABLE public.files (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    sources jsonb DEFAULT '[]'::jsonb NOT NULL,
    created_by uuid NOT NULL,
    hash character varying,
    size integer
);
COMMENT ON TABLE public.files IS 'Table containing file metadata';
ALTER TABLE ONLY public.accounts_documents ALTER COLUMN id SET DEFAULT nextval('public.accounts_documents_id_seq'::regclass);
ALTER TABLE ONLY public.account_document_roles
    ADD CONSTRAINT account_document_roles_pkey PRIMARY KEY (value);
ALTER TABLE ONLY public.accounts_documents
    ADD CONSTRAINT accounts_documents_account_id_document_id_key UNIQUE (account_id, document_id);
ALTER TABLE ONLY public.accounts_documents
    ADD CONSTRAINT accounts_documents_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_name_key UNIQUE (name);
ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.document_highlights
    ADD CONSTRAINT document_highlights_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.document_info
    ADD CONSTRAINT document_info_pkey PRIMARY KEY (document_id);
ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_pkey PRIMARY KEY (id);
CREATE TRIGGER set_public_accounts_updated_at BEFORE UPDATE ON public.accounts FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_accounts_updated_at ON public.accounts IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_document_highlights_updated_at BEFORE UPDATE ON public.document_highlights FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_document_highlights_updated_at ON public.document_highlights IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_files_updated_at BEFORE UPDATE ON public.files FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_files_updated_at ON public.files IS 'trigger to set value of column "updated_at" to current timestamp on row update';
ALTER TABLE ONLY public.accounts_documents
    ADD CONSTRAINT accounts_documents_role_fkey FOREIGN KEY (role) REFERENCES public.account_document_roles(value) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.document_highlights
    ADD CONSTRAINT document_highlights_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.accounts(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.document_highlights
    ADD CONSTRAINT document_highlights_document_id_fkey FOREIGN KEY (document_id) REFERENCES public.documents(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.document_info
    ADD CONSTRAINT document_info_document_id_fkey FOREIGN KEY (document_id) REFERENCES public.documents(id) ON UPDATE RESTRICT ON DELETE CASCADE;
ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_file_id_fkey FOREIGN KEY (file_id) REFERENCES public.files(id) ON UPDATE RESTRICT;
