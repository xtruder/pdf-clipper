import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { DocumentType } from "~/models";
import { useStateCtx } from "~/state/state";

export interface DocumentViewPageProps {}

export const DocumentViewPage: React.FC<DocumentViewPageProps> = ({}) => {
  const { documentSources } = useStateCtx();

  const { documentId } = useParams();
  if (!documentId) return <a>Missing document ID</a>;

  const sources = useRecoilValue(documentSources(documentId));

  switch (sources.type) {
    case DocumentType.PDF:
      return <Navigate to={`/viewpdf/${documentId}`} replace={true} />;
    default:
      return <a>Invalid document type {sources.type}</a>;
  }
};
