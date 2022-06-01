import React from "react";
import { useParams, Navigate } from "react-router-dom";

import { DocumentType, useQuery } from "~/gqty";

export interface DocumentViewPageProps {}

export const DocumentViewPage: React.FC<DocumentViewPageProps> = ({}) => {
  const { documentId } = useParams();
  if (!documentId) return <a>Missing document ID</a>;

  const { type } = useQuery({ suspense: true }).document({
    id: documentId,
  });

  switch (type) {
    case DocumentType.PDF:
      return <Navigate to={`/viewpdf/${documentId}`} replace={true} />;
    default:
      throw new Error(`Invalid document type ${type}`);
  }
};
