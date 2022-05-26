import React, { useMemo, useRef } from "react";

import { getBoundingRectForRects, Rect } from "~/lib/dom";
import { HighlightColor } from "~/types";

import { TooltipContainer } from "./TooltipContainer";

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
  className?: string;
  rects: Rect[];
  color?: HighlightColor;
  isSelected?: boolean;
  showTooltip?: boolean;
  tooltip?: JSX.Element;
  tooltipContainerClassName?: string;
  textBlendMode?: "multiply" | "difference" | "normal";

  // event handlers
  onSelect?: () => void;
}

export const TextHighlight: React.FC<TextHighlightProps> = ({
  className,
  rects,
  color,
  isSelected = false,
  tooltip,
  tooltipContainerClassName,
  showTooltip = isSelected,
  textBlendMode = "normal",

  onSelect = () => null,
}) => {
  const colorClass = isSelected
    ? selectedColorToClass[color || defaultColor]
    : colorToClass[color || defaultColor];

  const containerElRef = useRef<HTMLDivElement | null>(null);

  const boundingRect = useMemo(() => getBoundingRectForRects(rects), [rects]);

  return (
    <div className={`highlight ${className}`} onClick={onSelect}>
      {/** Rendered rects */}
      <div>
        {rects.map((rect, index) => (
          <div
            key={index}
            style={rect}
            className={`cursor-pointer absolute mix-blend-${textBlendMode} ${colorClass}`}
          />
        ))}
      </div>

      {/** wrapper element, so we can place ref somewhere */}
      <div
        ref={containerElRef}
        className="opacity-0 absolute pointer-events-none"
        style={boundingRect}
      />

      {/** tooltip container element */}
      <TooltipContainer
        className={tooltipContainerClassName}
        tooltipedEl={containerElRef.current}
        placement="bottom"
        show={showTooltip}
      >
        {tooltip}
      </TooltipContainer>
    </div>
  );
};
