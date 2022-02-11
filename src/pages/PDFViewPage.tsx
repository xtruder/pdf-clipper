import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";

import { PDFHighlight } from "~/models";
import { StateCtx } from "~/state/state";

import { PDFLoader } from "~/components/PDFLoader";
import { PDFReader } from "~/components/PDFReader";

export interface PDFViewPageProps {}

export const PDFViewPage: React.FC<PDFViewPageProps> = ({}) => {
  const { documentInfo, documentHighlights } = useContext(StateCtx);

  const { documentId } = useParams();
  if (!documentId) return <a>Missing document ID</a>;

  const document = useRecoilValue(documentInfo(documentId));
  if (!document) return <a>Missing document</a>;

  const [highlights, setHighlights] = useRecoilState(
    documentHighlights(documentId)
  );

  const onHighlightCreate = (newHighlight: PDFHighlight) => {
    setHighlights((highlights) => [...highlights, newHighlight]);
    //setSelectedHighlightId(highlight.id);
  };

  const onHighlightUpdate = (highlight: PDFHighlight) =>
    setHighlights((highlights) =>
      highlights.map((h) => (h.id === highlight.id ? highlight : h))
    );

  return (
    <PDFLoader
      url={document.url!}
      showDocument={(pdfDocument) => (
        <PDFReader
          pdfDocument={pdfDocument}
          highlights={highlights}
          onHighlightCreate={onHighlightCreate}
          onHighlightUpdate={onHighlightUpdate}
        />
      )}
    ></PDFLoader>
  );
};
