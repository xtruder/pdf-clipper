import React, { useEffect, ForwardedRef, useRef, forwardRef } from "react";
import useMergedRef from "@react-hook/merged-ref";
import useEvent from "@react-hook/event";

import { usePopper } from "react-popper";
import { Placement, VirtualElement } from "@popperjs/core";

import { filterObject } from "../lib/utils";

import "./TooltipContainer.css";

export type TooltipUpdateFn = () => void;

export interface TooltipContainerProps {
  ref?: ForwardedRef<HTMLDivElement>;
  tooltipedEl: Element | VirtualElement | null;
  observeEl?: HTMLElement | null;
  className?: string;
  placement?: Placement;
  show?: boolean;
  observeChanges?: boolean;
  observeScroll?: boolean;

  // tooltiped node
  children: React.ReactNode;
}

export const TooltipContainer: React.FC<TooltipContainerProps> = forwardRef(
  (
    {
      tooltipedEl,
      observeEl = tooltipedEl,
      observeChanges = observeEl !== tooltipedEl,
      observeScroll = observeEl !== tooltipedEl,
      placement = "top",
      show = true,

      className,
      children,
    },
    ref
  ) => {
    const tooltipRef = useRef<HTMLDivElement | null>(null);
    const arrowRef = useRef<HTMLDivElement | null>(null);

    const { styles, attributes, state, update } = usePopper(
      tooltipedEl,
      tooltipRef.current,
      {
        placement,
        modifiers: [
          { name: "offset", options: { offset: [0, 5] } },
          { name: "arrow", options: { element: arrowRef.current } },
        ],
      }
    );

    useEffect(() => {
      if (!observeChanges || !update || !observeEl) return;
      if (!(observeEl instanceof Node)) return;

      const observer = new MutationObserver(() => update());

      observer.observe(observeEl, { attributes: true });
      return () => observer.disconnect();
    }, [observeChanges, update, observeEl]);

    useEvent(
      observeScroll && observeEl instanceof HTMLElement ? observeEl : null,
      "scroll",
      () => update && update()
    );

    useEffect(() => {
      if (show) update && update();
    }, [show]);

    // keep popper attributes that are not false
    const popperAttrs = filterObject(attributes.popper || {}, ([_, v]) => !!v);

    const shouldShow = show && tooltipedEl;

    return (
      <div
        ref={useMergedRef(tooltipRef, ref)}
        style={show ? styles.popper : {}}
        className={`tooltip-container
        ${!shouldShow ? "hidden" : ""} ${className}`}
        {...popperAttrs}
      >
        {children}
        <div
          ref={arrowRef}
          style={styles.arrow}
          className="tooltip-arrow"
          data-placement={state?.placement}
        />
      </div>
    );
  }
);
