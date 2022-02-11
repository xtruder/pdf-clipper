import React, { useContext } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { DocumentType } from "~/models";
import { StateCtx } from "~/state/state";

export interface DocumentViewPageProps {}

export const DocumentViewPage: React.FC<DocumentViewPageProps> = ({}) => {
  const { documentInfo } = useContext(StateCtx);

  const { documentId } = useParams();
  if (!documentId) return <a>Missing document ID</a>;

  const document = useRecoilValue(documentInfo(documentId));
  if (!document) return <a>Missing document</a>;

  switch (document.type) {
    case DocumentType.PDF:
      return <Navigate to={`/viewpdf/${documentId}`} />;
    default:
      return <a>Invalid document type {document.type}</a>;
  }
};
