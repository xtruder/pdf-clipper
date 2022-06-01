import { gql } from "@apollo/client";

export const UPSERT_DOCUMENT = gql`
  mutation upsertDocument($document: UpsertDocumentInput!) {
    upsertDocument(document: $document) {
      id
    }
  }
`;

export const UPSERT_DOCUMENT_HIGHLIGHT = gql`
  mutation upsertDocumentHighlight(
    $documentId: ID!
    $highlight: UpsertDocumentHighlightInput!
  ) {
    upsertDocumentHighlight(documentId: $documentId, highlight: $highlight) {
      id
      content
      location
      deletedAt
    }
  }
`;

export const REMOVE_ME_FROM_DOCUMENT = gql`
  mutation removeMeFromDocument($documentId: ID!) {
    removeMeFromDocument(documentId: $documentId)
  }
`;

export const UPLOAD_FILE = gql`
  mutation uploadFile($file: Upload!) {
    uploadFile(file: $file) {
      hash
      mimeType
    }
  }
`;
