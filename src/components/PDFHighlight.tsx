import React from "react";
import { clearRangeSelection, Rect } from "~/lib/dom";
import {
  viewportRectToScaledPageRect,
  scaledRectToViewportRect,
} from "~/lib/pdf";
import { PDFHighlight } from "~/models";
import { AreaHighlight } from "./AreaHighlight";
import { PDFDisplayProxy } from "./PDFDisplay";
import { TextHighlight } from "./TextHighlight";

export interface PDFHighlightProps {
  pdfViewer: PDFDisplayProxy | null;
  highlight: PDFHighlight;
  selectedHighlight?: PDFHighlight;
  isDarkReader: boolean;
  highlightTooltip?: JSX.Element;

  onHighlightUpdated: (highlight: PDFHighlight) => void;
  onHighlightClicked: (highlight: PDFHighlight) => void;
  onHighlightEditing: (highlight?: PDFHighlight) => void;
}

export const PDFHighlightComponent: React.FC<PDFHighlightProps> = ({
  pdfViewer,
  highlight,
  selectedHighlight,
  isDarkReader,
  highlightTooltip,

  // event handlers
  onHighlightUpdated,
  onHighlightClicked,
  onHighlightEditing,
}) => {
  const isSelected = highlight.id === selectedHighlight?.id;

  const viewport = pdfViewer?.getPageView(
    highlight.location.pageNumber
  )?.viewport;
  if (!viewport) return <></>;

  const onAreaHighlightChanged = (boundingRect: Rect) => {
    if (!pdfViewer) return;

    const image = pdfViewer.screenshotPageArea(
      highlight.location.pageNumber,
      boundingRect
    );
    if (!image) return;

    const newHighlight: PDFHighlight = {
      ...highlight,
      content: { thumbnail: image, color: highlight.content.color },
      location: {
        ...highlight.location,
        boundingRect: viewportRectToScaledPageRect(
          {
            ...boundingRect,
            pageNumber: highlight.location.boundingRect.pageNumber,
          },
          viewport
        ),
      },
      timestamp: Date.now(),
    };

    onHighlightUpdated(newHighlight);
  };

  const blendMode = isDarkReader ? "difference" : "multiply";

  return highlight.content.text ? (
    <TextHighlight
      tooltip={highlightTooltip}
      tooltipContainerClassName="z-10"
      textBlendMode={blendMode}
      rects={highlight.location.rects.map((r) =>
        scaledRectToViewportRect(r, viewport)
      )}
      color={highlight.content.color}
      isSelected={isSelected}
      onSelect={() => onHighlightClicked(highlight)}
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
      color={highlight.content.color}
      isSelected={isSelected}
      onClick={() => {
        clearRangeSelection();
        onHighlightClicked(highlight);
      }}
      onChange={onAreaHighlightChanged}
      onDragStart={() => onHighlightEditing(highlight)}
      onDragStop={() => onHighlightEditing(undefined)}
      //onEscapeViewport={() => onHighlightClicked(undefined)}
    />
  );
};
