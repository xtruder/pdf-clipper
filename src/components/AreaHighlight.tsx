import React from "react";
import { Rnd } from "react-rnd";

import { Rect, HighlightColor } from "~/types";

const colorToClass: Record<HighlightColor, string> = {
  [HighlightColor.RED]: "bg-red-200",
  [HighlightColor.YELLOW]: "bg-yellow-200",
  [HighlightColor.GREEN]: "bg-green-200",
  [HighlightColor.BLUE]: "bg-blue-200",
};

const defaultColor = HighlightColor.YELLOW;

export interface AreaHighlightProps {
  boundingRect: Rect;
  color?: HighlightColor;
  isScrolledTo: boolean;

  onChange?: (rect: Rect) => void;
}

export const AreaHighlight: React.FC<AreaHighlightProps> = ({
  color,
  boundingRect,
  onChange = () => null,
}) => {
  const colorClass = colorToClass[color || defaultColor];

  return (
    <div className="border-solid opacity-100 mix-blend-multiply absolute">
      <Rnd
        className={`cursor-pointer transition-colors ${colorClass}`}
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
        onDragStop={(_, data) =>
          onChange({
            ...boundingRect,
            top: data.y,
            left: data.x,
          })
        }
      />
    </div>
  );
};
