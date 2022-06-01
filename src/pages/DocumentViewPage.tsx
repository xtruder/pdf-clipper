import React from "react";
import { useParams, Navigate } from "react-router-dom";

import { useGetDocumentInfo } from "~/graphql";
import { DocumentType } from "~/graphql/types";

export interface DocumentViewPageProps {}

export const DocumentViewPage: React.FC<DocumentViewPageProps> = ({}) => {
  const { documentId } = useParams();
  if (!documentId) return <a>Missing document ID</a>;

  const document = useGetDocumentInfo(documentId);

  const type = document.type;

  switch (type) {
    case DocumentType.Pdf:
      return <Navigate to={`/viewpdf/${documentId}`} replace={true} />;
    default:
      throw new Error(`Invalid document type ${type}`);
  }
};
