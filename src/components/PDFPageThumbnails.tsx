import React, { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

import { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";

import { getPageHeight, screenshotPage } from "~/lib/pdfjs";

const PDFPageThumbnail: React.FC<{
  page: PDFPageProxy;
  width: number;
  onClick: () => void;
}> = ({ page, width, onClick }) => {
  const [pageScreenshot, setPageScreenshot] = useState<string>();
  const [inViewTriggered, setInViewTriggered] = useState<boolean>(false);
  const height = useMemo<number>(() => getPageHeight(page, width), []);
  let { ref, inView } = useInView({ threshold: 0, delay: 20 });

  const inViewRef = useRef(inView);
  inViewRef.current = inView;

  // do not trigger immiditaely but wait 200ms, so we know thumbnail is really
  // being watched
  useEffect(() => {
    if (!inViewRef.current || inViewTriggered) return;
    setInViewTriggered(true);

    setTimeout(async () => {
      if (inViewRef.current) {
        if (pageScreenshot) return;

        const screenshot = await screenshotPage(page, width);

        if (!screenshot) return;
        setPageScreenshot(screenshot);
      } else {
        setInViewTriggered(false);
      }
    }, 100);
  }, [inView]);

  return (
    <div
      ref={ref}
      className="rounded-md border-2 mb-1 bg-white flex flex-col relative"
    >
      <div className="flex absolute w-full h-full">
        <button
          className="btn btn-xs bottom-0 right-0 absolute p-1 rounded-r-none"
          onClick={() => onClick()}
        >
          Page {page.pageNumber}
        </button>
      </div>
      <img src={pageScreenshot} width={width} height={height} />
    </div>
  );
};

export interface PDFPageThumbnailsProps {
  pdfDocument: PDFDocumentProxy;
  onPageClick: (pageNumber?: number) => void;
}

export const PDFPageThumbnails: React.FC<PDFPageThumbnailsProps> = ({
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
    <ul className="items-center grid grid-cols-2 gap-2">
      {pages ? (
        pages.map((page) => (
          <li key={page.pageNumber} className="flex justify-center relative">
            <PDFPageThumbnail
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
