import React, { useState } from "react";
import { useRecoilCallback, useRecoilValue } from "recoil";

import { useStateCtx } from "~/state/state";
import { getPageHeight } from "~/lib/pdfjs";

import {
  PageThumbnailView,
  PageThumbnailsList,
} from "~/components/PageThumbnailView";

const PageThumbnailViewContainer: React.FC<{
  documentId: string;
  pageNumber: number;
  width: number;
  height: number;
  onClick: () => void;
}> = ({ documentId, pageNumber, width, height, onClick }) => {
  const { pdfPageThumbnail } = useStateCtx();

  const [image, setImage] = useState<string>();

  const loadThumbnail = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        if (image) return;

        const release = snapshot.retain();
        try {
          setImage(
            await snapshot.getPromise(
              pdfPageThumbnail([documentId, pageNumber])
            )
          );
        } finally {
          release();
        }
      },
    []
  );

  const onInView = () => loadThumbnail();

  return (
    <PageThumbnailView
      pageNumber={pageNumber}
      width={width}
      height={height}
      image={image}
      onInView={onInView}
      onClick={onClick}
    />
  );
};

export interface PageThumbnailsContainer {
  documentId: string;
  onPageClick: (pageNumber?: number) => void;
  width?: number;
}

export const PageThumbnailsContainer: React.FC<PageThumbnailsContainer> = ({
  documentId,
  onPageClick = () => null,
  width = 300,
}) => {
  const { pdfDocumentPages } = useStateCtx();

  const pages = useRecoilValue(pdfDocumentPages(documentId));

  const thumbs = pages.map((page) => {
    const height = getPageHeight(page, width);
    const onClick = () => onPageClick(page.pageNumber);

    return (
      <PageThumbnailViewContainer
        documentId={documentId}
        key={page.pageNumber}
        pageNumber={page.pageNumber}
        width={width}
        height={height}
        onClick={onClick}
      />
    );
  });

  return <PageThumbnailsList>{thumbs}</PageThumbnailsList>;
};
