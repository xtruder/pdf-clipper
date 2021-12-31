import React from "react";

import { PartialHighlight, HighlightColor, ScaledRect, Rect } from "~/types";

const colorToClass: Record<HighlightColor, string> = {
  [HighlightColor.RED]: "bg-red-200 text-red-800",
  [HighlightColor.YELLOW]: "bg-yellow-200 text-yellow-800",
  [HighlightColor.GREEN]: "bg-green-200 text-green-800",
  [HighlightColor.BLUE]: "bg-blue-200 text-blue-800",
};

const defaultColor = HighlightColor.YELLOW;

const scrolledToColorClass: string = "bg-red-100";

export interface TextHighlightProps {
  index: string | number;
  highlight: PartialHighlight;
  isScrolledTo: boolean;
  toViewportRect: (rect: ScaledRect) => Rect;
}

export const TextHighlight: React.FC<TextHighlightProps> = ({
  index,
  highlight,
  isScrolledTo,
  toViewportRect,
}) => {
  const { location, color } = highlight;

  const colorClass = isScrolledTo
    ? scrolledToColorClass
    : colorToClass[color || defaultColor];

  return (
    <div className={`absolute`} key={index}>
      <div className="opacity-100">
        {location.rects.map((rect, index) => (
          <div
            key={index}
            style={toViewportRect(rect)}
            className={`cursor-pointer absolute ${colorClass}`}
          />
        ))}
      </div>
    </div>
  );
};
