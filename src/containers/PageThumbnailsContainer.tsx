import React, { useState } from "react";
import { useRecoilCallback, useRecoilValue } from "recoil";

import { getPageHeight } from "~/lib/pdfjs";

import { documentInfo, pdfPages, pdfPageThumbnail } from "~/state";
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
  const [image, setImage] = useState<string>();

  const { fileId } = useRecoilValue(documentInfo(documentId));
  if (!fileId) throw new Error("missing fileId");

  const loadThumbnail = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        // if image has already be retrieved, do nothing
        if (image) return;

        const release = snapshot.retain();
        try {
          setImage(
            await snapshot.getPromise(pdfPageThumbnail([fileId, pageNumber]))
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
  const { fileId } = useRecoilValue(documentInfo(documentId));
  if (!fileId) throw new Error("missing fileId");

  const pages = useRecoilValue(pdfPages(fileId));

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
