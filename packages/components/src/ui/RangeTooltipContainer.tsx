import React, { useMemo, useState } from "react";
import { VirtualElement } from "@popperjs/core";
import { useUpdateEffect, useDebounceEffect } from "ahooks";

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
  // whether range selection is changing
  const [isChanging, setIsChanging] = useState(true);

  // whether range selection has changed in last period
  const [hasChanged, setHasChanged] = useState(false);

  // delay hasChanged 250ms
  useDebounceEffect(
    () => {
      // set is changing to whether has changed in current period
      setIsChanging(hasChanged);

      // reset hasChanged
      setHasChanged(false);
    },
    [hasChanged],
    { wait: 250 }
  );

  useUpdateEffect(() => {
    // has changed in last period
    setHasChanged(true);

    // is currently changing
    setIsChanging(true);
  }, [range]);

  const tooltipedEl: VirtualElement | null = useMemo(() => {
    return {
      getBoundingClientRect: (): DOMRect => {
        return range!.getBoundingClientRect();
      },
    };
  }, [range]);

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
