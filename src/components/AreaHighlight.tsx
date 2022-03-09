import React, { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { Rnd } from "react-rnd";

import { Rect } from "~/lib/dom";
import { HighlightColor } from "~/models";

import { TooltipContainer } from "./TooltipContainer";

const colorToClass: Record<HighlightColor, string> = {
  [HighlightColor.RED]: "bg-red-200",
  [HighlightColor.YELLOW]: "bg-yellow-200",
  [HighlightColor.GREEN]: "bg-green-200",
  [HighlightColor.BLUE]: "bg-blue-200",
};

const selectedColorToClass: Record<HighlightColor, string> = {
  [HighlightColor.RED]: "bg-red-300",
  [HighlightColor.YELLOW]: "bg-yellow-300",
  [HighlightColor.GREEN]: "bg-green-300",
  [HighlightColor.BLUE]: "bg-blue-300",
};

const defaultColor = HighlightColor.YELLOW;

export interface AreaHighlightProps {
  className?: string;
  boundingRect: Rect;
  color?: HighlightColor;
  isSelected: boolean;
  tooltipContainerClassName?: string;
  tooltip?: JSX.Element;
  showTooltip?: boolean;

  onChange?: (rect: Rect) => void;
  onClick?: (event: MouseEvent) => void;
  onDragStart?: () => void;
  onDragStop?: () => void;

  // event triggered when highlight escapes viewport
  onEscapeViewport?: () => void;
}

export const AreaHighlight: React.FC<AreaHighlightProps> = ({
  className = "",
  boundingRect,
  color,
  isSelected,
  tooltip,
  tooltipContainerClassName,
  showTooltip = isSelected,
  onChange = () => null,
  onClick = () => null,
  onDragStart = () => null,
  onDragStop = () => null,
  onEscapeViewport = () => null,
}) => {
  const colorClass = isSelected
    ? selectedColorToClass[color || defaultColor]
    : colorToClass[color || defaultColor];

  const resizableElRef = useRef<HTMLElement | null>(null);

  const { ref: resizbelInViewRef, inView } = useInView({ threshold: 1 });

  useEffect(() => {
    if (!inView) onEscapeViewport();
  }, [inView]);

  return (
    <div
      className={`border-solid opacity-100 mix-blend-multiply absolute ${className}`}
    >
      <Rnd
        className={`cursor-pointer transition-colors ${colorClass}`}
        ref={(ref) => {
          resizableElRef.current = ref?.resizableElement.current || null;
          resizbelInViewRef(resizableElRef.current);
        }}
        position={{ x: boundingRect.left, y: boundingRect.top }}
        size={{ width: boundingRect.width, height: boundingRect.height }}
        onMouseDown={onClick}
        onResizeStop={(_mouseEvent, _direction, ref, _delta, position) =>
          onChange({
            top: position.y,
            left: position.x,
            width: ref.offsetWidth,
            height: ref.offsetHeight,
          })
        }
        onDragStart={() => onDragStart()}
        onDragStop={(_, data) => {
          onDragStop();
          onChange({
            ...boundingRect,
            top: data.y,
            left: data.x,
          });
        }}
      />

      {/**Tooltip attached to area highlight */}
      <TooltipContainer
        className={tooltipContainerClassName}
        tooltipedEl={resizableElRef.current}
        placement="bottom"
        show={showTooltip}
        observeChanges={true}
      >
        {tooltip}
      </TooltipContainer>
    </div>
  );
};
