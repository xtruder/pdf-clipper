--
-- PostgreSQL database dump
--

-- Dumped from database version 12.10 (Debian 12.10-1.pgdg110+1)
-- Dumped by pg_dump version 13.7

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.accounts VALUES ('00c0bab4-c43b-45b4-bd23-202059e67eb2', '2022-08-12 12:28:12.235739+00', '2022-08-12 12:28:12.235739+00', '0001-01-01 00:00:00+00', 'admin1');
INSERT INTO public.accounts VALUES ('06ccbe53-b764-4b59-bac3-ce1f7d5e09c6', '2022-08-12 17:01:18.673326+00', '2022-08-12 17:01:18.673326+00', '0001-01-01 00:00:00+00', 'viewer1');
INSERT INTO public.accounts VALUES ('d99f8db9-3108-42ef-bf44-f7cb1fab45e6', '2022-08-12 17:04:39.92767+00', '2022-08-12 17:04:39.92767+00', '0001-01-01 00:00:00+00', 'editor1');
INSERT INTO public.accounts VALUES ('6a5b74bb-57af-4c90-9d10-f6f4965656ac', '2022-08-13 12:47:28.694092+00', '2022-08-13 12:47:28.694092+00', '2022-08-13 12:47:28.694092+00', 'deleted1');


--
-- Data for Name: blob_infos; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.blob_infos VALUES ('f2ca1bb6c7e907d06dafe4687e579fce76b37e4e93b7605022da52e6ccc26fd2', 'docfile', '2022-08-13 11:13:57.32373+00', '2022-08-13 11:13:57.32373+00', '00c0bab4-c43b-45b4-bd23-202059e67eb2', 'application/pdf', 10000000, 'file://file');
INSERT INTO public.blob_infos VALUES ('5204352f39e4a55d23d26ba664dd47ba3ad1db39d0506be95edf7e58469c01c0', 'highlightimg', '2022-08-13 12:07:00.120442+00', '2022-08-13 12:07:00.120442+00', 'd99f8db9-3108-42ef-bf44-f7cb1fab45e6', 'image/png', 5000000, 'file://myimage.png');


--
-- Data for Name: documents; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.documents VALUES ('ecbb7ac0-8aac-4393-baa1-0d54f1c1bafe', '2022-08-12 14:43:37.774403+00', '2022-08-12 14:43:37.774403+00', '0001-01-01 00:00:00+00', '00c0bab4-c43b-45b4-bd23-202059e67eb2', '00c0bab4-c43b-45b4-bd23-202059e67eb2', 'pdf', '{}', 'f2ca1bb6c7e907d06dafe4687e579fce76b37e4e93b7605022da52e6ccc26fd2');


--
-- Data for Name: document_highlights; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.document_highlights VALUES ('8be4eebf-68ba-460a-90ee-f22a94e20465', 'ecbb7ac0-8aac-4393-baa1-0d54f1c1bafe', '2022-08-13 12:16:13.800785+00', '2022-08-13 12:16:13.800785+00', '0001-01-01 00:00:00+00', 'd99f8db9-3108-42ef-bf44-f7cb1fab45e6', '{}', '{}', '1', '5204352f39e4a55d23d26ba664dd47ba3ad1db39d0506be95edf7e58469c01c0');


--
-- Data for Name: document_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.document_members VALUES ('00c0bab4-c43b-45b4-bd23-202059e67eb2', 'ecbb7ac0-8aac-4393-baa1-0d54f1c1bafe', '2022-08-12 14:45:58.899894+00', '2022-08-12 14:45:58.899894+00', '0001-01-01 00:00:00+00', '00c0bab4-c43b-45b4-bd23-202059e67eb2', '2022-08-12 15:04:51.47698+00', 'admin');
INSERT INTO public.document_members VALUES ('06ccbe53-b764-4b59-bac3-ce1f7d5e09c6', 'ecbb7ac0-8aac-4393-baa1-0d54f1c1bafe', '2022-08-12 17:02:14.57335+00', '2022-08-12 17:02:14.57335+00', '0001-01-01 00:00:00+00', '06ccbe53-b764-4b59-bac3-ce1f7d5e09c6', '2022-08-12 17:02:14.57335+00', 'viewer');
INSERT INTO public.document_members VALUES ('d99f8db9-3108-42ef-bf44-f7cb1fab45e6', 'ecbb7ac0-8aac-4393-baa1-0d54f1c1bafe', '2022-08-12 17:06:22.390697+00', '2022-08-12 17:06:22.390697+00', '0001-01-01 00:00:00+00', 'd99f8db9-3108-42ef-bf44-f7cb1fab45e6', '2022-08-12 17:06:30.7656+00', 'editor');
INSERT INTO public.document_members VALUES ('6a5b74bb-57af-4c90-9d10-f6f4965656ac', 'ecbb7ac0-8aac-4393-baa1-0d54f1c1bafe', '2022-08-13 12:48:54.073053+00', '2022-08-13 12:48:54.073053+00', '0001-01-01 00:00:00+00', '6a5b74bb-57af-4c90-9d10-f6f4965656ac', '2022-08-13 12:48:54.073053+00', 'viewer');


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- PostgreSQL database dump complete
--

