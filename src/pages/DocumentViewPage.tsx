import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { DocumentType } from "~/models";
import { documentInfo } from "~/state";

export interface DocumentViewPageProps {}

export const DocumentViewPage: React.FC<DocumentViewPageProps> = ({}) => {
  const { documentId } = useParams();
  if (!documentId) return <a>Missing document ID</a>;

  const docInfo = useRecoilValue(documentInfo(documentId));

  switch (docInfo.type) {
    case DocumentType.PDF:
      return <Navigate to={`/viewpdf/${documentId}`} replace={true} />;
    default:
      throw new Error(`Invalid document type ${docInfo.type}`);
  }
};
