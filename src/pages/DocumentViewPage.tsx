import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { gql } from "urql";

import { useMyQuery } from "~/gql/hooks";

const getDocumentInfoQuery = gql(`
  query getDocumentInfo($documentId: ID!) @live {
    document(id: $documentId) {
      ...DocumentInfoFragment
    }
  }
`);

export interface DocumentViewPageProps {}

export const DocumentViewPage: React.FC<DocumentViewPageProps> = ({}) => {
  const { source = "remote", documentId } = useParams();
  if (!documentId) return <a>Missing document ID</a>;

  const [{ data, error }] = useMyQuery({
    query: getDocumentInfoQuery,
    variables: { documentId },
    context: { suspense: true, source: source as any },
  });
  if (error || !data) throw error;

  const type = data.document.type;

  switch (type) {
    case "PDF":
      return (
        <Navigate to={`/viewpdf/${source}/${documentId}`} replace={true} />
      );
    default:
      throw new Error(`Invalid document type ${type}`);
  }
};
