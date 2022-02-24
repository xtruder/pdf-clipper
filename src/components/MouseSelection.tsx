import React, { useState, useEffect, useRef } from "react";

import {
  Rect,
  Point,
  asElement,
  isHTMLElement,
  getBoundingRect,
} from "~/lib/dom";

const touchPoint = (event: MouseEvent | TouchEvent) => {
  if ("changedTouches" in event && event["changedTouches"].length > 0) {
    const last = event.changedTouches.length - 1;
    return {
      pageX: event.changedTouches[last].pageX,
      pageY: event.changedTouches[last].pageY,
    };
  } else if ("touches" in event && event["touches"].length > 0) {
    return { pageX: event.touches[0].pageX, pageY: event.touches[0].pageY };
  } else if ("pageX" in event && "pageY" in event) {
    return { pageX: event.pageX, pageY: event.pageY };
  }

  throw new Error("invalid event");
};

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

  // whether selection selection is active
  active?: boolean;

  // key to start selection
  selectionKey?: "alt" | "ctrl";

  // onSelection is triggered when selection is made
  onSelection?: (
    start: Target,
    end: Target,
    boundingRect: Rect,
    resetSelection: () => void
  ) => void;

  // onSelecting is being triggered while dragging
  onSelecting?: (
    start: Target,
    cur: Target,
    boundingRect: Rect,
    resetSelection: () => void
  ) => void;

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
  active = true,
  selectionKey = "alt",

  // handlers
  onSelection = () => null,
  onSelecting = () => null,
  shouldStart = () => true,
  shouldEnd = () => true,
  shouldReset = () => true,
  onDragStart = () => null,
  onDragEnd = () => null,
  onReset = () => null,
}) => {
  const [dragState, setDragState] = useState<DragState>(initialDragState);
  const dragStateRef = useRef(dragState);
  dragStateRef.current = dragState;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const activeRef = useRef(active);
  activeRef.current = active;

  const shouldRender = (boundingRect: Rect): boolean =>
    boundingRect.width >= minSelection && boundingRect.height >= minSelection;

  const resetSelection = () => {
    onReset();
    setDragState(initialDragState);
  };

  const lastPointerDownRef = useRef<MouseEvent | TouchEvent>();

  const hasModKey = (event: MouseEvent | TouchEvent | KeyboardEvent) =>
    selectionKey === "alt"
      ? event.altKey
      : selectionKey === "ctrl"
      ? event.ctrlKey
      : false;

  const isNear = (
    event: MouseEvent | TouchEvent,
    previousEvent?: MouseEvent | TouchEvent
  ): boolean => {
    if (!previousEvent) return false;

    const p1 = touchPoint(event);
    const p2 = touchPoint(previousEvent);

    const distancePx =
      Math.abs(p1.pageX - p2.pageX) + Math.abs(p1.pageY - p2.pageY);

    return distancePx < 20 && event.timeStamp - previousEvent.timeStamp < 200;
  };

  // componentDidMount set event listeners
  useEffect(() => {
    if (!activeRef.current) return;

    const parentEl = containerRef.current?.parentElement;

    if (!parentEl) return;

    // gets coordinates within container
    const containerCoords = (pageX: number, pageY: number): Point => {
      let containerBoundingRect: DOMRect | null = null;

      if (!containerBoundingRect) {
        containerBoundingRect = parentEl.getBoundingClientRect();
      }

      return {
        x: pageX - containerBoundingRect.left + parentEl.scrollLeft,
        y:
          pageY -
          containerBoundingRect.top +
          parentEl.scrollTop -
          window.scrollY,
      };
    };

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (dragStateRef.current.selected && shouldReset(event))
        return resetSelection();

      // don't reset drag state if still dragging
      if (dragStateRef.current.start || dragStateRef.current.selected) return;

      // check whether there is event target
      if (!event.target || !isHTMLElement(event.target)) return;

      const { pageX, pageY } = touchPoint(event);

      const isRightEvent =
        isNear(event, lastPointerDownRef.current) || hasModKey(event);

      // update last pointer down
      lastPointerDownRef.current = event;

      // if event is right not right for starting or we should not start return
      if (!isRightEvent || !shouldStart(event)) {
        return shouldReset(event) && resetSelection();
      }

      const start = {
        ...containerCoords(pageX, pageY),
        target: asElement(event.target),
      };

      setDragState({
        start,
        end: null,
        selected: false,
      });

      event.preventDefault();
    };

    const onPointerMove = (event: MouseEvent | TouchEvent): void => {
      if (!dragStateRef.current.start) return;
      if (dragStateRef.current.selected) return;

      let { pageX, pageY } = touchPoint(event);

      if (
        !isHTMLElement(event.target) ||
        !parentEl.contains(asElement(event.target))
      )
        return;

      setDragState({
        ...dragStateRef.current,
        end: {
          ...containerCoords(pageX, pageY),
          target: asElement(event.target),
        },
      });

      event.preventDefault();
    };

    const onEnd = (end: Point): void => {
      if (!dragStateRef.current.start || !dragStateRef.current.end) return;

      const boundingRect = getBoundingRect(dragStateRef.current.start, end);

      if (!shouldRender(boundingRect)) {
        return resetSelection();
      }

      setDragState({ ...dragStateRef.current, selected: true });
    };

    const onKeyUp = (event: KeyboardEvent): void => {
      if (!dragStateRef.current.start) return;

      // if mod key is stil pressed or we should not end, don't end drag
      if (!hasModKey(event) || !shouldEnd(event)) return;

      const end = dragStateRef.current.end;
      if (!end) return;

      onEnd(end);
    };

    const onPointerUp = (event: MouseEvent | TouchEvent): void => {
      if (!dragStateRef.current.start) return;
      if (!event.currentTarget) return;

      // if mod key is stil pressed or we should not end, don't end drag
      if (hasModKey(event) || !shouldEnd(event)) return;

      let { pageX, pageY } = touchPoint(event);

      onEnd(containerCoords(pageX, pageY));
    };

    // add mousedown listener on mouse down
    document.addEventListener("keyup", onKeyUp);
    parentEl.addEventListener("mousedown", onPointerDown);
    parentEl.addEventListener("touchstart", onPointerDown);
    parentEl.addEventListener("mousemove", onPointerMove);
    parentEl.addEventListener("touchmove", onPointerMove);
    parentEl.addEventListener("mouseup", onPointerUp);
    parentEl.addEventListener("touchend", onPointerUp);

    // remove mousedown listener on changes
    return () => {
      parentEl.removeEventListener("mousedown", onPointerDown);
      parentEl.removeEventListener("touchstart", onPointerDown);
      parentEl.removeEventListener("mousemove", onPointerMove);
      parentEl.removeEventListener("mouseup", onPointerUp);
      parentEl.removeEventListener("touchmove", onPointerMove);
      parentEl.removeEventListener("touchend", onPointerUp);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, [
    shouldStart,
    minSelection,
    onSelection,
    onDragStart,
    onDragEnd,
    selectionKey,
  ]);

  const { start, end, selected } = dragState;

  // dragState handlers
  useEffect(() => {
    if (!selected && start && !end) {
      onDragStart(start);
    } else if (!selected && start && end) {
      onSelecting(start, end, getBoundingRect(start, end), resetSelection);
    } else if (selected && start) {
      onDragEnd(start, end);

      if (end)
        onSelection(start, end, getBoundingRect(start, end), resetSelection);
    }
  }, [dragState]);

  useEffect(() => {
    if (!active) resetSelection();
  }, [active]);

  return (
    <div ref={containerRef} className={containerClassName}>
      {active && start && end && (
        <div
          className={className}
          style={{
            ...getBoundingRect(start, end),
            position: "absolute",
          }}
        ></div>
      )}
    </div>
  );
};
