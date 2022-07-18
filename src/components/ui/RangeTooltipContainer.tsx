import React, { useMemo, useRef } from "react";
import { VirtualElement } from "@popperjs/core";

import { useIsChanging } from "~/lib/react-hooks";

import { TooltipContainer } from "./TooltipContainer";

import "./RangeTooltipContainer.css";

export interface RangeTooltipContainerProps {
  range: Range | null;
  scrollOffset?: { top: number; left: number };
  scrollElRef?: React.RefObject<HTMLElement>;
  tooltip?: JSX.Element;
  showTooltip?: boolean;
  className?: string;
}

export const RangeTooltipContainer: React.FC<RangeTooltipContainerProps> = ({
  range,
  scrollElRef,
  tooltip,
  showTooltip = true,
  className = "",
}) => {
  const rangeRef = useRef(range);
  rangeRef.current = range;

  const tooltipedEl: VirtualElement | null = useMemo(() => {
    return {
      getBoundingClientRect: (): DOMRect => {
        return rangeRef.current!.getBoundingClientRect();
      },
    };
  }, [rangeRef]);

  const isChanging = useIsChanging(250, rangeRef.current);

  return (
    <TooltipContainer
      className={`range-tooltip-container fixed ${className}`}
      tooltipedEl={tooltipedEl}
      observeEl={scrollElRef?.current}
      placement="bottom"
      show={showTooltip && !isChanging}
    >
      {tooltip}
    </TooltipContainer>
  );
};
