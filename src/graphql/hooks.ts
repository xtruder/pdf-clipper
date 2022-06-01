import { useMutation } from "@apollo/client";
import { useSuspendedQuery } from "~/lib/apollo";

import {
  GET_CURRENT_ACCOUNT_DOCUMENTS_QUERY,
  GET_DOCUMENT_HIGHLIGHTS_QUERY,
  GET_DOCUMENT_INFO_QUERY,
} from "./queries";
import {
  REMOVE_ME_FROM_DOCUMENT,
  UPLOAD_FILE,
  UPSERT_DOCUMENT,
  UPSERT_DOCUMENT_HIGHLIGHT,
} from "./mutations";

import {
  GetCurrentAccountDocumentsQuery,
  GetDocumentHighlightsQuery,
  GetDocumentHighlightsQueryVariables,
  GetDocumentInfoQuery,
  GetDocumentInfoQueryVariables,
  RemoveMeFromDocumentMutation,
  RemoveMeFromDocumentMutationVariables,
  UploadFileMutation,
  UploadFileMutationVariables,
  UpsertDocumentHighlightMutation,
  UpsertDocumentHighlightMutationVariables,
  UpsertDocumentMutation,
  UpsertDocumentMutationVariables,
} from "./types";

export const useGetCurrentAccountDocuments = () =>
  useSuspendedQuery<GetCurrentAccountDocumentsQuery>(
    GET_CURRENT_ACCOUNT_DOCUMENTS_QUERY
  );

export const useGetDocumentInfo = (documentId: string) => {
  const result = useSuspendedQuery<
    GetDocumentInfoQuery,
    GetDocumentInfoQueryVariables
  >(GET_DOCUMENT_INFO_QUERY, { variables: { id: documentId } });

  if (!result.data.document) throw new Error("missing result document");

  return result.data.document;
};

export const useGetDocumentHighlights = (documentId: string) => {
  const result = useSuspendedQuery<
    GetDocumentHighlightsQuery,
    GetDocumentHighlightsQueryVariables
  >(GET_DOCUMENT_HIGHLIGHTS_QUERY, {
    variables: {
      documentId,
    },
  });

  if (!result.data.document) throw new Error("missing result document");

  return result.data.document.highlights;
};

export const useUpsertDocument = () =>
  useMutation<UpsertDocumentMutation, UpsertDocumentMutationVariables>(
    UPSERT_DOCUMENT,
    {
      refetchQueries: ({ data }) => [
        GET_CURRENT_ACCOUNT_DOCUMENTS_QUERY,
        {
          query: GET_DOCUMENT_INFO_QUERY,
          variables: { id: data?.upsertDocument.id },
        },
      ],
    }
  );

export const useRemoveMeFromDocument = (documentId: string) =>
  useMutation<
    RemoveMeFromDocumentMutation,
    RemoveMeFromDocumentMutationVariables
  >(REMOVE_ME_FROM_DOCUMENT, {
    variables: {
      documentId,
    },
    refetchQueries: () => [
      GET_CURRENT_ACCOUNT_DOCUMENTS_QUERY,
      {
        query: GET_DOCUMENT_INFO_QUERY,
        variables: { id: documentId },
      },
    ],
  });

export const useUploadFile = () =>
  useMutation<UploadFileMutation, UploadFileMutationVariables>(UPLOAD_FILE);

export const useUpsertDocumentHighlight = (documentId: string) =>
  useMutation<
    UpsertDocumentHighlightMutation,
    UpsertDocumentHighlightMutationVariables
  >(UPSERT_DOCUMENT_HIGHLIGHT, {
    variables: {
      documentId,
      highlight: {},
    },
    update(cache, { data }) {
      if (!data) return;

      const highlight = data.upsertDocumentHighlight;

      // read existing highlights for a document
      let highlights =
        cache.readQuery<
          GetDocumentHighlightsQuery,
          GetDocumentHighlightsQueryVariables
        >({
          query: GET_DOCUMENT_HIGHLIGHTS_QUERY,
          variables: {
            documentId,
          },
        })?.document?.highlights ?? [];

      // update existing highlights
      const idx = highlights.findIndex((h) => h);
      if (highlight.deletedAt) {
        delete highlights[idx];
      } else if (idx >= 0) {
        highlights[idx] = highlight;
      } else {
        highlights.push(highlight);
      }

      // write updated highlights with a new inserted highlight
      cache.writeQuery<
        GetDocumentHighlightsQuery,
        GetDocumentHighlightsQueryVariables
      >({
        query: GET_DOCUMENT_HIGHLIGHTS_QUERY,
        variables: {
          documentId,
        },
        data: {
          document: {
            highlights,
          },
        },
      });
    },
  });
