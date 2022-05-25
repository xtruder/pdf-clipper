import React, { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { Rnd } from "react-rnd";

import { Rect } from "~/lib/dom";
import { HighlightColor } from "~/types";

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
  isSelected?: boolean;
  selectedClassName?: string;
  tooltipContainerClassName?: string;
  tooltip?: JSX.Element;
  showTooltip?: boolean;
  blendMode?: "normal" | "multiply" | "difference";

  onChange?: (rect: Rect) => void;
  onClick?: () => void;
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
  selectedClassName = "",
  tooltip,
  tooltipContainerClassName,
  showTooltip = isSelected,
  blendMode = "normal",

  onChange = () => null,
  onClick = () => null,
  onDragStart = () => null,
  onDragStop = () => null,
  onEscapeViewport = () => null,
}) => {
  const colorClass = isSelected
    ? selectedColorToClass[color || defaultColor]
    : colorToClass[color || defaultColor];

  const rndRef = useRef<Rnd | null>(null);
  const rndElRef = useRef<HTMLElement | null>(null);
  const { ref: rndInViewRef, inView } = useInView({ threshold: 1 });

  useEffect(() => {
    if (!rndRef.current || !rndRef.current.resizableElement.current) return;

    rndElRef.current = rndRef.current.resizableElement.current;
    rndInViewRef(rndRef.current.resizableElement.current);
  }, [rndRef]);

  useEffect(() => {
    if (!inView) onEscapeViewport();
  }, [inView]);

  return (
    <>
      {/**Resizable and draggable component */}
      <Rnd
        ref={rndRef}
        className={`transition-colors rounded-md
          mix-blend-${blendMode} ${colorClass}
          ${isSelected && selectedClassName} ${className}`}
        disableDragging={!isSelected}
        position={{ x: boundingRect.left, y: boundingRect.top }}
        size={{ width: boundingRect.width, height: boundingRect.height }}
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
      >
        <div className="highlight h-full w-full" onClick={() => onClick()} />
      </Rnd>

      {/**Tooltip attached to area highlight */}
      <TooltipContainer
        className={tooltipContainerClassName}
        tooltipedEl={rndElRef.current}
        placement="bottom"
        show={showTooltip}
        observeChanges={true}
      >
        {tooltip}
      </TooltipContainer>
    </>
  );
};
