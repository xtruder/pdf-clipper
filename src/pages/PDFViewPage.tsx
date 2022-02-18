import React, { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { suspend } from "suspend-react";
import { useRecoilState, useRecoilValue } from "recoil";

import { PDFHighlight } from "~/models";
import { StateCtx } from "~/state/state";

import { PDFReader } from "~/components/PDFReader";
import { useContextProgress } from "~/components/ProgressIndicator";
import { loadPDF } from "~/lib/pdfjs";
import { ReaderLayout } from "~/layouts/ReaderLayout";

const PDFViewPage: React.FC = () => {
  const { documentInfo, documentHighlights, currentAccount } =
    useContext(StateCtx);

  const navigate = useNavigate();

  const { documentId } = useParams();
  if (!documentId) throw new Error("Missing document ID");

  const [document, setDocument] = useRecoilState(documentInfo(documentId));
  if (!document) throw new Error("Missing document");

  const { url } = document;
  if (!url) throw new Error("Document url is missing");

  const { setProgress } = useContextProgress();
  const pdfDocument = suspend(() => loadPDF(url, setProgress), [url]);

  const account = useRecoilValue(currentAccount);

  const [highlights, setHighlights] = useRecoilState(
    documentHighlights(documentId)
  );

  const onHighlightCreate = (newHighlight: PDFHighlight) => {
    newHighlight.meta = {
      owner: account.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setHighlights((highlights) => [...highlights, newHighlight]);
  };

  const onHighlightUpdate = (highlight: PDFHighlight) =>
    setHighlights((highlights) =>
      highlights.map((h) => (h.id === highlight.id ? highlight : h))
    );

  return (
    <PDFReader
      className="flex-1 absolute h-full w-full"
      pdfDocument={pdfDocument}
      highlights={highlights}
      title={document.title}
      onTitleChange={(title) =>
        setDocument((d) => {
          if (!d) return;
          return { ...d, title };
        })
      }
      onHighlightCreate={onHighlightCreate}
      onHighlightUpdate={onHighlightUpdate}
      onClose={() => navigate("/")}
    />
  );
};

export default () => (
  <ReaderLayout>
    <PDFViewPage />
  </ReaderLayout>
);
