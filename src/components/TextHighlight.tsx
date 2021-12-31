import React from "react";

import { HighlightColor, Rect } from "~/types";

const colorToClass: Record<HighlightColor, string> = {
  [HighlightColor.RED]: "bg-red-200 text-red-800",
  [HighlightColor.YELLOW]: "bg-yellow-200 text-yellow-800",
  [HighlightColor.GREEN]: "bg-green-200 text-green-800",
  [HighlightColor.BLUE]: "bg-blue-200 text-blue-800",
};

const selectedColorToClass: Record<HighlightColor, string> = {
  [HighlightColor.RED]: "bg-red-300",
  [HighlightColor.YELLOW]: "bg-yellow-300",
  [HighlightColor.GREEN]: "bg-green-300",
  [HighlightColor.BLUE]: "bg-blue-300",
};

const defaultColor = HighlightColor.YELLOW;

export interface TextHighlightProps {
  rects: Rect[];
  color?: HighlightColor;
  isSelected: boolean;

  // event handlers
  onClick?: (event: React.MouseEvent) => void;
}

export const TextHighlight: React.FC<TextHighlightProps> = ({
  rects,
  color,
  isSelected,

  onClick = () => null,
}) => {
  const colorClass = isSelected
    ? selectedColorToClass[color || defaultColor]
    : colorToClass[color || defaultColor];

  return (
    <div className={`absolute`}>
      <div className={`opacity-100`}>
        {rects.map((rect, index) => (
          <div
            key={index}
            style={rect}
            className={`cursor-pointer absolute ${colorClass}`}
            onClick={(e) => onClick(e)}
          />
        ))}
      </div>
    </div>
  );
};
