import React, { FC } from "react";
import { useParams, useNavigate } from "react-router-dom";

//import { StateCtx } from "~/state/state";
//import useDarkMode from "@utilityjs/use-dark-mode";

import { ReaderLayout } from "~/layouts/ReaderLayout";
import { PDFReader } from "~/containers/PDFReader";

const PDFReaderPage: FC = () => {
  const navigate = useNavigate();

  const { documentId } = useParams();
  if (!documentId) throw new Error("Missing document ID");

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
