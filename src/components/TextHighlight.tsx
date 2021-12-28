import React from "react";

import { PartialHighlight, HighlightColor, ScaledRect, Rect } from "~/types";

const colorToClass: Record<HighlightColor, string> = {
  [HighlightColor.RED]: "bg-red-100 text-red-800",
  [HighlightColor.YELLOW]: "bg-yellow-100 text-yellow-800",
  [HighlightColor.GREEN]: "bg-green-100 text-green-800",
  [HighlightColor.BLUE]: "bg-blue-100 text-blue-800",
};

const defaultColor = HighlightColor.YELLOW;

const scrolledToColorClass: string = "bg-red-100";

export interface TextHighlightProps {
  highlight: PartialHighlight;
  isScrolledTo: boolean;
  toViewportRect: (rect: ScaledRect) => Rect;
}

export const TextHighlight: React.FC<TextHighlightProps> = ({
  highlight,
  isScrolledTo,
  toViewportRect,
}) => {
  const { location, color } = highlight;

  const colorClass = isScrolledTo
    ? scrolledToColorClass
    : colorToClass[color || defaultColor];

  const rectClass = `cursor-pointer absolute ${colorClass}`;

  return (
    <div className={`absolute`}>
      <div className="opacity-100">
        {location.rects.map((rect, index) => (
          <div key={index} style={toViewportRect(rect)} className={rectClass} />
        ))}
      </div>
    </div>
  );
};
