import React from "react";
import { Rnd } from "react-rnd";

import { Rect, HighlightColor } from "~/types";

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
  boundingRect: Rect;
  color?: HighlightColor;
  isSelected: boolean;

  onChange?: (rect: Rect) => void;
  onClick?: (event: MouseEvent) => void;
  onDragStart?: () => void;
  onDragStop?: () => void;
}

export const AreaHighlight: React.FC<AreaHighlightProps> = ({
  boundingRect,
  color,
  isSelected,
  onChange = () => null,
  onClick = () => null,
  onDragStart = () => null,
  onDragStop = () => null,
}) => {
  const colorClass = isSelected
    ? selectedColorToClass[color || defaultColor]
    : colorToClass[color || defaultColor];

  return (
    <div className="border-solid opacity-100 mix-blend-multiply absolute">
      <Rnd
        className={`cursor-pointer transition-colors ${colorClass}`}
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
    </div>
  );
};
