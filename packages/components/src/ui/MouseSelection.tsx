import React, { useState, useEffect, useRef } from "react";
import { useEventListener, useUpdateEffect } from "ahooks";

import {
  Rect,
  Point,
  asElement,
  isHTMLElement,
  getBoundingRect,
  touchPoint,
  isEventNear,
} from "../lib/dom";

import { TooltipContainer } from "./TooltipContainer";

export type Target = Point & {
  target: HTMLElement;
};

type DragState = {
  start: Target | null;
  end: Target | null;
  selected: boolean;
};

const initialDragState: DragState = {
  start: null,
  end: null,
  selected: false,
};

export type MouseSelectionProps = {
  // selection div class name
  className?: string;

  // class name of container around selection div
  containerClassName?: string;

  // minimal number of pixels that must be selected
  minSelection?: number;

  /**clear the selection  */
  clearSelection?: boolean;

  // key to start selection
  selectionKey?: "alt" | "ctrl";

  // tooltip component
  tooltip?: JSX.Element;

  // className for tooltip container
  tooltipContainerClassName?: string;

  // ref for parent element where to add event listeners
  eventsElRef: React.RefObject<HTMLElement>;

  // blend mode to use for area highlighter
  blendMode?: "normal" | "multiply" | "difference";

  // onSelection is triggered when selection is made
  onSelection?: (start: Target, end: Target, boundingRect: Rect) => void;

  // onSelecting is being triggered while dragging
  onSelecting?: (start: Target, cur: Target, boundingRect: Rect) => void;

  // shouldStart determines whether mouse selection should be started
  shouldStart?: (event: MouseEvent | TouchEvent) => boolean;

  // shouldReset determines whether previous selection should be reset
  shouldReset?: (event: MouseEvent | TouchEvent) => boolean;

  // shouldEnd determines whether mouse selection should end
  shouldEnd?: (event: MouseEvent | TouchEvent | KeyboardEvent) => boolean;

  // onDragStart is triggered when mouse drag is started
  onDragStart?: (start: Target) => void;

  // onDragEnd is triggered when mouse drag is ended
  onDragEnd?: (start: Target, end: Target | null) => void;

  // onReset is triggered when selection has been reset
  onReset?: () => void;
};

export const MouseSelection: React.FC<MouseSelectionProps> = ({
  className = "",
  containerClassName = "",
  minSelection = 10,
  clearSelection = false,
  selectionKey = "alt",
  tooltip,
  tooltipContainerClassName,
  eventsElRef,
  blendMode = "normal",

  // handlers
  onSelection = () => null,
  onSelecting = () => null,
  shouldEnd = () => true,
  shouldReset = () => true,
  onDragStart = () => null,
  onDragEnd = () => null,
  onReset = () => null,
}) => {
  const [dragState, setDragState] = useState<DragState>(initialDragState);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const selectionRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const [lastTouch, setLastTouch] = useState<MouseEvent | TouchEvent>();

  const shouldRender = (boundingRect: Rect): boolean =>
    boundingRect.width >= minSelection && boundingRect.height >= minSelection;

  const resetSelection = () => {
    onReset();
    setDragState(initialDragState);
  };

  const hasModKey = (event: MouseEvent | TouchEvent | KeyboardEvent) =>
    selectionKey === "alt"
      ? event.altKey
      : selectionKey === "ctrl"
      ? event.ctrlKey
      : false;

  // gets coordinates within container
  const containerCoords = (pageX: number, pageY: number): Point => {
    const parentEl = eventsElRef.current!;

    let containerBoundingRect: DOMRect | null = null;

    if (!containerBoundingRect) {
      containerBoundingRect = parentEl.getBoundingClientRect();
    }

    return {
      x: pageX - containerBoundingRect.left + parentEl.scrollLeft,
      y:
        pageY - containerBoundingRect.top + parentEl.scrollTop - window.scrollY,
    };
  };

  const onPointerDown = (event: MouseEvent | TouchEvent) => {
    // if there is multi touch going on do nothing
    if ("touches" in event && event.touches.length > 1) return;

    // if pointer down is within tooltip, do nothing
    if (tooltipRef.current?.contains(asElement(event.target))) return;

    // don't reset drag state if still dragging
    if (dragState.start && !dragState.selected) {
      if (hasModKey(event)) return;
      return resetSelection();
    }

    // if already selected, check if we should reset selection
    if (dragState.selected && shouldReset(event)) return resetSelection();

    // check whether there is event target
    if (!event.target || !isHTMLElement(event.target)) return;

    // if event is right not right for starting or we should not start return
    if (!hasModKey(event) && !isEventNear(lastTouch, event)) {
      setLastTouch(event);
      return;
    }

    setLastTouch(event);

    const { pageX, pageY } = touchPoint(event);

    const start = {
      ...containerCoords(pageX, pageY),
      target: asElement(event.target),
    };

    setDragState({
      start,
      end: null,
      selected: false,
    });
  };

  const onPointerMove = (event: MouseEvent | TouchEvent): void => {
    if (!dragState.start) return;
    if (dragState.selected) return;

    let { pageX, pageY } = touchPoint(event);

    if (
      !isHTMLElement(event.target) ||
      !eventsElRef.current?.contains(asElement(event.target))
    )
      return;

    setDragState({
      ...dragState,
      end: {
        ...containerCoords(pageX, pageY),
        target: asElement(event.target),
      },
    });

    event.preventDefault();
  };

  const onEnd = (end: Point): void => {
    if (!dragState.start || !dragState.end) return;

    const boundingRect = getBoundingRect(dragState.start, end);

    if (!shouldRender(boundingRect)) {
      return resetSelection();
    }

    setDragState({ ...dragState, selected: true });
  };

  const onKeyUp = (event: KeyboardEvent): void => {
    if (!dragState.start) return;

    // if mod key is stil pressed or we should not end, don't end drag
    if (event.key.toLowerCase() !== selectionKey) return;

    const end = dragState.end;
    if (!end) return;

    onEnd(end);
  };

  const onPointerUp = (event: MouseEvent | TouchEvent): void => {
    if (!dragState.start) return;
    if (!event.currentTarget) return;

    if (isEventNear(lastTouch, event)) {
      return resetSelection();
    }

    // if mod key is stil pressed or we should not end, don't end drag
    if (hasModKey(event) || !shouldEnd(event)) return;

    let { pageX, pageY } = touchPoint(event);

    onEnd(containerCoords(pageX, pageY));
  };

  useEventListener("keyup", onKeyUp, { target: document });
  useEventListener("mousedown", onPointerDown, { target: eventsElRef });
  useEventListener("touchstart", onPointerDown, { target: eventsElRef });
  useEventListener("mousemove", onPointerMove, { target: eventsElRef });
  useEventListener("touchmove", onPointerMove, { target: eventsElRef });
  useEventListener("mouseup", onPointerUp, { target: eventsElRef });
  useEventListener("touchend", onPointerUp, { target: eventsElRef });

  const { start, end, selected } = dragState;

  // dragState handlers
  useEffect(() => {
    if (!selected && start && !end) {
      onDragStart(start);
    } else if (!selected && start && end) {
      onSelecting(start, end, getBoundingRect(start, end));
    } else if (selected && start) {
      onDragEnd(start, end);

      if (end) onSelection(start, end, getBoundingRect(start, end));
    }
  }, [dragState]);

  // when clear selection is changed, reset current selection
  useUpdateEffect(resetSelection, [clearSelection]);

  return (
    <div ref={containerRef} className={containerClassName}>
      {start && end && (
        <>
          <div
            className={`absolute mix-blend-${blendMode} ${className}`}
            ref={selectionRef}
            style={getBoundingRect(start, end)}
          />
          {tooltip && (
            <TooltipContainer
              ref={tooltipRef}
              className={tooltipContainerClassName}
              tooltipedEl={selectionRef.current}
              placement="bottom"
              show={selected}
            >
              {tooltip}
            </TooltipContainer>
          )}
        </>
      )}
    </div>
  );
};
