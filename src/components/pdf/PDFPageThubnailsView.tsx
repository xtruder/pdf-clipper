import React, { useState } from "react";

import { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";

import {
  PageThumbnailsList,
  PageThumbnailView,
} from "../document/PageThumbnailView";
import { getPageHeight, screenshotPageArea } from "~/lib/pdfjs";
import { suspend } from "suspend-react";

export interface PDFPageThumbnailProps {
  page: PDFPageProxy;
  width: number;

  onClick: () => void;
}

export const PDFPageThumbnail: React.FC<PDFPageThumbnailProps> = ({
  page,
  width,
  onClick,
}) => {
  const heigth = getPageHeight(page, width);
  const [image, setImage] = useState<string>();

  const onInView = async () =>
    setImage(await screenshotPageArea(page, { width }));

  return (
    <PageThumbnailView
      pageNumber={page.pageNumber}
      width={width}
      height={heigth}
      image={image}
      onInView={onInView}
      onClick={onClick}
    />
  );
};

export interface PDFPageThumbnailsProps {
  pdfDocument: PDFDocumentProxy;
  thumbWidth: number;

  onPageClick: (pageNumber?: number) => void;
}

export const PDFPageThumbnails: React.FC<PDFPageThumbnailsProps> = ({
  pdfDocument,
  thumbWidth,
  onPageClick,
}) => {
  // load all pages using suspense
  const pages = suspend(
    () =>
      Promise.all(
        [...Array(pdfDocument.numPages).keys()].map((i) =>
          pdfDocument.getPage(i + 1)
        )
      ),
    pdfDocument.fingerprints
  );

  return (
    <PageThumbnailsList>
      {pages.map((page) => (
        <PDFPageThumbnail
          page={page}
          width={thumbWidth}
          onClick={() => onPageClick(page.pageNumber)}
        />
      ))}
    </PageThumbnailsList>
  );
};
