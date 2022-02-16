import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { suspend } from "suspend-react";
import { useRecoilState, useRecoilValue } from "recoil";

import { PDFHighlight } from "~/models";
import { StateCtx } from "~/state/state";

import { PDFReader } from "~/components/PDFReader";
import { useContextProgress } from "~/components/ProgressIndicator";
import { loadPDF } from "~/lib/pdfjs";

export interface PDFViewPageProps {}

export const PDFViewPage: React.FC<PDFViewPageProps> = ({}) => {
  const { documentInfo, documentHighlights, currentAccount } =
    useContext(StateCtx);

  const { documentId } = useParams();
  if (!documentId) return <a>Missing document ID</a>;

  const document = useRecoilValue(documentInfo(documentId));
  if (!document || !document.url) throw new Error("Missing document");

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
      pdfDocument={pdfDocument}
      highlights={highlights}
      onHighlightCreate={onHighlightCreate}
      onHighlightUpdate={onHighlightUpdate}
    />
  );
};
