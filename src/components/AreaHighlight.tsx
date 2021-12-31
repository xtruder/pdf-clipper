import React from "react";
import { Rnd } from "react-rnd";

import { PartialHighlight, ScaledRect, Rect, HighlightColor } from "~/types";

const colorToClass: Record<HighlightColor, string> = {
  [HighlightColor.RED]: "bg-red-200",
  [HighlightColor.YELLOW]: "bg-yellow-200",
  [HighlightColor.GREEN]: "bg-green-200",
  [HighlightColor.BLUE]: "bg-blue-200",
};

const defaultColor = HighlightColor.YELLOW;

export interface AreaHighlightProps {
  highlight: PartialHighlight;
  isScrolledTo: boolean;
  toViewportRect: (rect: ScaledRect) => Rect;
}

export const AreaHighlight: React.FC<AreaHighlightProps> = ({
  highlight,
  toViewportRect,
}) => {
  const rect = toViewportRect(highlight.location.boundingRect);

  const colorClass = colorToClass[highlight.color || defaultColor];

  return (
    <div className="border-solid opacity-100 mix-blend-multiply absolute">
      <Rnd
        className={`cursor-pointer transition-colors ${colorClass}`}
        position={{ x: rect.left, y: rect.top }}
        size={{ width: rect.width, height: rect.height }}
      />
    </div>
  );
};
