import React from "react";

import { clearRangeSelection, Rect, canvasToPNGBlob } from "../lib/dom";
import {
  viewportRectToScaledPageRect,
  scaledRectToViewportRect,
} from "../lib/pageRects";

import { PDFDisplayProxy } from "./PDFDisplay";
import { AreaHighlight } from "../highlights/AreaHighlight";
import { TextHighlight } from "../highlights/TextHighlight";

import { PDFHighlightInfoWithKey, PDFHighlightWithKey } from "./types";
import { getHighlightSequence } from "./utils";

export interface PDFHighlightContainerProps {
  pdfViewer: PDFDisplayProxy | null;
  highlight: PDFHighlightInfoWithKey;
  isSelected?: boolean;
  isDarkReader: boolean;
  highlightTooltip?: JSX.Element;

  onUpdated?: (highlight: PDFHighlightWithKey) => void | Promise<void>;
  onClicked?: () => void;
  onEditing?: (isEditing: boolean) => void;
}

export const PDFHighlightContainer: React.FC<PDFHighlightContainerProps> = ({
  pdfViewer,
  highlight,
  isSelected,
  isDarkReader,
  highlightTooltip,

  // event handlers
  onUpdated,
  onClicked,
  onEditing,
}) => {
  if (!highlight.location) return <></>;

  const viewport = pdfViewer?.getPageView(
    highlight.location.pageNumber
  )?.viewport;
  if (!viewport) return <></>;

  const onAreaHighlightChanged = async (boundingRect: Rect) => {
    if (!pdfViewer) return;
    if (!highlight.location) return;

    const canvasArea = pdfViewer.getPageArea(
      highlight.location.pageNumber,
      boundingRect
    );
    if (!canvasArea) return;

    const scaledBoundingRect = viewportRectToScaledPageRect(
      {
        ...boundingRect,
        pageNumber: highlight.location.boundingRect.pageNumber,
      },
      viewport
    );

    const sequence = getHighlightSequence(
      scaledBoundingRect.pageNumber,
      scaledBoundingRect
    );

    const image = await canvasToPNGBlob(canvasArea);

    const newHighlight: PDFHighlightWithKey = {
      type: "area",
      key: highlight.key,
      color: highlight.color,
      location: {
        ...highlight.location,
        boundingRect: scaledBoundingRect,
      },
      sequence,
      image,
    };

    onUpdated?.(newHighlight);
  };

  const blendMode = isDarkReader ? "difference" : "multiply";

  return highlight.type === "text" ? (
    <TextHighlight
      tooltip={highlightTooltip}
      tooltipContainerClassName="z-10"
      textBlendMode={blendMode}
      rects={highlight.location.rects.map((r) =>
        scaledRectToViewportRect(r, viewport)
      )}
      color={highlight.color}
      isSelected={isSelected}
      onSelect={onClicked}
    />
  ) : (
    <AreaHighlight
      tooltip={highlightTooltip}
      selectedClassName="z-10"
      tooltipContainerClassName="z-10"
      blendMode={blendMode}
      boundingRect={scaledRectToViewportRect(
        highlight.location.boundingRect,
        viewport
      )}
      color={highlight.color}
      isSelected={isSelected}
      onClick={() => {
        clearRangeSelection();
        onClicked?.();
      }}
      onChanged={onAreaHighlightChanged}
      onChanging={onEditing}
      //onEscapeViewport={() => onHighlightClicked(undefined)}
    />
  );
};
