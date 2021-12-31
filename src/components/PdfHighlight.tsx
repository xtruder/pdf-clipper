import React from "react";
import { scaledRectToViewportRect } from "~/lib/coordinates";

import { PartialHighlight, ScaledRect, Viewport } from "~/types";
import { AreaHighlight } from "./AreaHighlight";
import { TextHighlight } from "./TextHighlight";

export interface PdfHighlightProps {
  index: string | number;
  highlight: PartialHighlight;
  isScrolledTo: boolean;
  viewport: Viewport;
}

export const PdfHighlight: React.FC<PdfHighlightProps> = ({
  index,
  highlight,
  isScrolledTo,
  viewport,
}) => {
  const isTextHighlight = !Boolean(
    highlight.content && highlight.content.image
  );

  const toViewportRect = (rect: ScaledRect) =>
    scaledRectToViewportRect(rect, viewport);

  const component = isTextHighlight ? (
    <TextHighlight
      index={index}
      isScrolledTo={isScrolledTo}
      highlight={highlight}
      toViewportRect={toViewportRect}
    />
  ) : (
    <AreaHighlight
      isScrolledTo={isScrolledTo}
      highlight={highlight}
      toViewportRect={toViewportRect}
    />
  );

  return <div key={index}>{component}</div>;
};
