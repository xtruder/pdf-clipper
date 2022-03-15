import React, { useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { useContextProgress } from "~/components/ProgressIndicator";

import { PDFReader } from "~/containers/PDFReader";
import { ReaderLayout } from "~/layouts/ReaderLayout";
import { StateCtx } from "~/state/state";
//import useDarkMode from "@utilityjs/use-dark-mode";

const PDFReaderPage: React.FC = () => {
  const navigate = useNavigate();
  const { documentLoadProgress: pdfDocumentLoadProgress } =
    useContext(StateCtx);

  const { documentId } = useParams();
  if (!documentId) throw new Error("Missing document ID");

  const progress = useRecoilValue(pdfDocumentLoadProgress(documentId));

  const { setProgress } = useContextProgress();

  useEffect(() => setProgress(progress), [progress]);

  return (
    <PDFReader
      className="flex-1 absolute h-full w-full"
      //isDarkMode={isDarkMode}
      documentId={documentId}
      onClose={() => navigate("/")}
    />
  );
};

export default () => (
  <ReaderLayout>
    <PDFReaderPage />
  </ReaderLayout>
);
