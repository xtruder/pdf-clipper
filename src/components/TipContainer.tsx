import React, { useState, useRef, useEffect } from "react";

import { Rect, Size } from "~/lib/dom";

// clamp value from left to right
const clamp = (value: number, left: number, right: number) =>
  Math.min(Math.max(value, left), right);

export interface TipContainerProps {
  children?: JSX.Element;
  scrollTop: number;
  boundingRect: Rect;

  // tip container position
  style: { top: number; left: number; bottom: number };
}

export const TipContainer: React.FC<TipContainerProps> = ({
  children,
  style,
  scrollTop,
  boundingRect,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  // state variables
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });
  const [currentChildren, setCurrentChildren] = useState<JSX.Element>();

  const { width, height } = size;

  const isStyleCalculationInProgress = width === 0 && height === 0;
  const shouldMove = style.top - height - 5 < scrollTop;

  // top position of container
  const top = shouldMove ? style.bottom + 5 : style.top - height - 5;

  // left position of container
  const left = clamp(style.left - width / 2, 0, boundingRect.width - width);

  // const childrenWithProps = React.Children.map(children, (child) =>
  //   React.cloneElement(child!, {
  //     onUpdate: () => setSize({ width: 0, height: 0 }),
  //     popup: {
  //       position: shouldMove ? "below" : "above",
  //     },
  //   })
  // );

  const updateSizes = () => {
    if (!ref.current) return;

    // get sizes of current container div
    const { offsetWidth, offsetHeight } = ref.current;

    // set new sizes
    setSize({ width: offsetWidth, height: offsetHeight });
  };

  // useEffect(() => {
  //   if (isStyleCalculationInProgress) setTimeout(updateSizes, 0);
  // }, [size]);

  // if children changes, update current children and update positions
  useEffect(() => {
    if (children !== currentChildren) {
      setCurrentChildren(children);
      updateSizes();
    }
  }, [currentChildren]);

  return (
    <div
      ref={ref}
      className="z-12 absolute"
      style={{
        visibility: isStyleCalculationInProgress ? "hidden" : "visible",
        top,
        left,
      }}
    >
      {children}
    </div>
  );
};
