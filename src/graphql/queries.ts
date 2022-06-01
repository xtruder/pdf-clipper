import { gql } from "@apollo/client";

const DocumentInfoFragment = gql`
  fragment DocumentInfoFragment on Document {
    id
    type
    meta {
      title
      description
      pageCount
      author
      cover
    }
    file {
      url
    }
  }
`;

export const GET_CURRENT_ACCOUNT_DOCUMENTS_QUERY = gql`
  query getCurrentAccountDocuments {
    currentAccount {
      documents {
        document {
          ...DocumentInfoFragment
        }
      }
    }
  }

  ${DocumentInfoFragment}
`;

export const GET_DOCUMENT_INFO_QUERY = gql`
  query getDocumentInfo($id: ID!) {
    document(id: $id) {
      ...DocumentInfoFragment
    }
  }

  ${DocumentInfoFragment}
`;

export const GET_DOCUMENT_HIGHLIGHTS_QUERY = gql`
  query getDocumentHighlights($documentId: ID!) {
    document(id: $documentId) {
      highlights {
        id
        location
        content
        deletedAt
      }
    }
  }
`;
