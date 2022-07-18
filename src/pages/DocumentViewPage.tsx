import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { useAtomValue } from "jotai";

import { documentAtom } from "~/state";

export interface DocumentViewPageProps {}

export const DocumentViewPage: React.FC<DocumentViewPageProps> = ({}) => {
  const { documentId } = useParams();
  if (!documentId) return <a>Missing document ID</a>;

  const doc = useAtomValue(documentAtom(documentId));

  const type = doc.type;

  switch (type) {
    case "PDF":
      return <Navigate to={`/viewpdf/${documentId}`} replace={true} />;
    default:
      throw new Error(`Invalid document type ${type}`);
  }
};
