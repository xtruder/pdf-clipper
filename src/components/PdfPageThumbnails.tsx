import React, { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";

import { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";

import { getPageHeight, screenshotPage } from "~/lib/pdfjs-utils";

const PdfPageThumbnail: React.FC<{
  page: PDFPageProxy;
  width: number;
  onClick: () => void;
}> = ({ page, width, onClick }) => {
  const [pageScreenshot, setPageScreenshot] = useState<string>();
  const height = useMemo<number>(() => getPageHeight(page, width), []);
  const { ref, inView } = useInView({ threshold: 0 });

  useEffect(
    (async () => {
      if (pageScreenshot || !inView) return;

      const screenshot = await screenshotPage(page, width);

      if (!screenshot) return;
      setPageScreenshot(screenshot);
    }) as any,
    [pageScreenshot, inView]
  );

  return (
    <div
      ref={ref}
      className="rounded-md border-2 mb-1 bg-white flex flex-col relative"
    >
      <div className="flex absolute w-full h-full">
        <button
          className="btn btn-xs bottom-0 right-0 absolute"
          onClick={() => onClick()}
        >
          Page {page.pageNumber}
        </button>
      </div>
      <img src={pageScreenshot} width={width} height={height} />
    </div>
  );
};

export interface PdfPageThumbnailsProps {
  pdfDocument: PDFDocumentProxy;
  onPageClick: (pageNumber?: number) => void;
}

export const PdfPageThumbnails: React.FC<PdfPageThumbnailsProps> = ({
  pdfDocument,
  onPageClick = () => null,
}) => {
  const [pages, setPages] = useState<PDFPageProxy[]>();

  useEffect(
    (async () => {
      const pages = await Promise.all(
        Array.from({ length: pdfDocument.numPages }, (_, pageNumber) => {
          return pdfDocument.getPage(pageNumber + 1);
        })
      );

      setPages(pages);
    }) as any,
    []
  );

  return (
    <ul className="items-center">
      {pages ? (
        pages.map((page) => (
          <li key={page.pageNumber} className="flex justify-center relative">
            <PdfPageThumbnail
              page={page}
              width={300}
              onClick={() => onPageClick(page.pageNumber)}
            />
          </li>
        ))
      ) : (
        <></>
      )}
    </ul>
  );
};
