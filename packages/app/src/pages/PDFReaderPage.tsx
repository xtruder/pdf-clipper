import React, { FC, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAtomValue } from "jotai";

import { TopbarProgressIndicator } from "@pdf-clipper/components";

//import { StateCtx } from "~/state/state";
//import useDarkMode from "@utilityjs/use-dark-mode";

import { ReaderLayout } from "~/layouts/ReaderLayout";
import { PDFReader } from "~/containers/PDFReader";
import { pdfLoadProgressAtom } from "~/state";

const PDFReaderPage: FC = () => {
  const navigate = useNavigate();

  const { documentId } = useParams();
  if (!documentId) throw new Error("Missing document ID");

  const progress = useAtomValue(pdfLoadProgressAtom(documentId));

  return (
    <Suspense
      fallback={
        <TopbarProgressIndicator
          progress={
            progress.total && progress.loaded
              ? progress.loaded / progress.total
              : 0
          }
        />
      }
    >
      <PDFReader
        className="flex-1 absolute h-full w-full"
        //isDarkMode={isDarkMode}
        documentId={documentId}
        onClose={() => navigate("/")}
      />
    </Suspense>
  );
};

export default () => (
  <ReaderLayout>
    <PDFReaderPage />
  </ReaderLayout>
);
