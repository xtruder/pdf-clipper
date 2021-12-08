import React, { useEffect, useState, useRef } from "react";

import { PDFDocumentProxy, getDocument, GlobalWorkerOptions } from "pdfjs-dist";

// import worker src to set for pdfjs global worker options
import workerSrc from "pdfjs-dist/build/pdf.worker.min.js?url";

GlobalWorkerOptions.workerSrc = workerSrc;

export type PDFLoaderArgs = {
  url: string;
  showDocument: (pdfDocument: PDFDocumentProxy) => JSX.Element;
  showError?: (err: Error) => JSX.Element;
  showLoader?: () => JSX.Element;
  onError?: (error: Error) => void;
};

export const PDFLoader: React.FC<PDFLoaderArgs> = ({
  url,
  showDocument,
  showLoader = () => <a>Loading...</a>,
  showError = (err: Error) => <p>Error loading PDF: {err.message}</p>,
  onError = (err: Error) => console.log("Pdf loader error", err),
}) => {
  const documentRef = useRef<HTMLElement>(null);

  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [pdfDocument, setPDFDocument] = useState<PDFDocumentProxy | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const load = async () => {
    const { ownerDocument = document } = documentRef.current || {};

    setError(null);
    setCurrentUrl(url);

    try {
      if (pdfDocument) {
        await pdfDocument.destroy();
        setPDFDocument(null);
      }

      if (!url) {
        return;
      }

      const loadingTask = getDocument({
        url,
        ownerDocument,
      });

      const loadedPDFDocument = await loadingTask.promise;
      setPDFDocument(loadedPDFDocument);
    } catch (err) {
      setError(err as Error);
    }
  };

  useEffect(() => {
    if (url !== currentUrl) load();
  }, [url]);

  useEffect(() => {
    if (error) onError(error);
  }, [error]);

  let content: JSX.Element | undefined;
  if (error) {
    content = showError(error);
  } else if (!pdfDocument) {
    content = showLoader();
  } else {
    content = showDocument(pdfDocument);
  }

  return (
    <>
      <span ref={documentRef}></span>
      {content}
    </>
  );
};
