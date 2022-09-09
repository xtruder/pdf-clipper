import React, { useEffect, useMemo, useRef } from "react";

import { getBoundingRectForRects, Rect } from "../lib/dom";

import { HighlightColor } from "./types";
import { TooltipContainer } from "../ui/TooltipContainer";
import { useUpdate } from "ahooks";

const colorToClass: Record<HighlightColor, string> = {
  [HighlightColor.Red]: "bg-red-200 text-red-800",
  [HighlightColor.Yellow]: "bg-yellow-200 text-yellow-800",
  [HighlightColor.Green]: "bg-green-200 text-green-800",
  [HighlightColor.Blue]: "bg-blue-200 text-blue-800",
};

const selectedColorToClass: Record<HighlightColor, string> = {
  [HighlightColor.Red]: "bg-red-300",
  [HighlightColor.Yellow]: "bg-yellow-300",
  [HighlightColor.Green]: "bg-green-300",
  [HighlightColor.Blue]: "bg-blue-300",
};

const defaultColor = HighlightColor.Yellow;

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

  onSelect,
}) => {
  const colorClass = isSelected
    ? selectedColorToClass[color || defaultColor]
    : colorToClass[color || defaultColor];

  const wrapperElRef = useRef<HTMLDivElement | null>(null);

  const boundingRect = useMemo(() => getBoundingRectForRects(rects), [rects]);

  // do manual update when wrapper reference is changed, so tooltip is correctly
  // updated
  useEffect(useUpdate(), [wrapperElRef]);

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

      {/** wrapper element, so we can place tooltips ref somewhere */}
      <div
        ref={wrapperElRef}
        className="opacity-0 absolute pointer-events-none"
        style={boundingRect}
      />

      {/** tooltip container element */}
      <TooltipContainer
        className={tooltipContainerClassName}
        tooltipedEl={wrapperElRef.current}
        placement="bottom"
        show={showTooltip}
      >
        {tooltip}
      </TooltipContainer>
    </div>
  );
};
