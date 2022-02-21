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
  className?: string;
  containerClassName?: string;
  minSelection?: number;
  active?: boolean;
  onSelection?: (
    start: Target,
    end: Target,
    boundingRect: Rect,
    resetSelection: () => void
  ) => void;
  onSelecting?: (
    start: Target,
    cur: Target,
    boundingRect: Rect,
    resetSelection: () => void
  ) => void;
  shouldStart?: (event: MouseEvent | TouchEvent) => boolean;
  shouldEnd?: (event: MouseEvent | TouchEvent | KeyboardEvent) => boolean;
  onDragStart?: (start: Target) => void;
  onDragEnd?: (start: Target, end: Target | null) => void;
  onReset?: () => void;
};

export const MouseSelection: React.FC<MouseSelectionProps> = ({
  className = "",
  containerClassName = "",
  minSelection = 10,
  active = true,

  // handlers
  onSelection = () => null,
  onSelecting = () => null,
  shouldStart = () => true,
  shouldEnd = () => true,
  onDragStart = () => null,
  onDragEnd = () => null,
  onReset = () => null,
}) => {
  const [dragState, setDragState] = useState<DragState>(initialDragState);
  const dragStateRef = useRef(dragState);
  dragStateRef.current = dragState;

  const { start, end, selected } = dragState;

  const rootEl = useRef<HTMLDivElement | null>(null);

  const shouldRender = (boundingRect: Rect): boolean =>
    boundingRect.width >= minSelection && boundingRect.height >= minSelection;

  const resetSelection = () => {
    setDragState(initialDragState);
    onReset();
  };

  // componentDidMount set event listeners
  useEffect(() => {
    if (!active) return resetSelection();

    const containerEl = rootEl.current?.parentElement;

    if (!containerEl) return;

    let containerBoundingRect: DOMRect | null = null;

    // gets coordinates within container
    const containerCoords = (pageX: number, pageY: number): Point => {
      if (!containerBoundingRect) {
        containerBoundingRect = containerEl.getBoundingClientRect();
      }

      return {
        x: pageX - containerBoundingRect.left + containerEl.scrollLeft,
        y:
          pageY -
          containerBoundingRect.top +
          containerEl.scrollTop -
          window.scrollY,
      };
    };

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      // don't reset drag state if still dragging
      if (dragStateRef.current.start !== null && !dragStateRef.current.selected)
        return;

      // check whether there is event target
      if (!event.target || !isHTMLElement(event.target)) return;

      // if we should not start reset the drag state
      if (!shouldStart(event)) return resetSelection();

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

      const onPointerMove = (event: MouseEvent | TouchEvent): void => {
        let { pageX, pageY } = touchPoint(event);

        setDragState({
          start,
          end: {
            ...containerCoords(pageX, pageY),
            target: asElement(event.target),
          },
          selected: false,
        });
      };

      const onEnd = (end: Point): void => {
        const { ownerDocument: doc } = containerEl;

        // reset mousemove event listeners
        doc.body.removeEventListener("mousemove", onPointerMove);
        doc.body.removeEventListener("mouseup", onPointerUp);
        doc.body.removeEventListener("touchmove", onPointerMove);
        doc.body.removeEventListener("touchend", onPointerUp);
        doc.body.removeEventListener("keyup", onKeyUp);

        const boundingRect = getBoundingRect(start, end);

        if (
          !isHTMLElement(event.target) ||
          !containerEl.contains(asElement(event.target)) ||
          !shouldRender(boundingRect)
        ) {
          return setDragState({ start, end: null, selected: true });
        }

        setDragState({
          start,
          end: { ...end, target: asElement(event.target) },
          selected: true,
        });
      };

      const onKeyUp = (event: KeyboardEvent): void => {
        if (!shouldEnd(event)) return;

        const end = dragStateRef.current.end;

        if (!end) return;

        onEnd(end);
      };

      const onPointerUp = (event: MouseEvent | TouchEvent): void => {
        if (!event.currentTarget) return;

        if (!shouldEnd(event)) return;

        let { pageX, pageY } = touchPoint(event);

        onEnd(containerCoords(pageX, pageY));
      };

      // add event listener for mouseup and mousemove events
      const { ownerDocument: doc } = containerEl;
      if (doc.body) {
        doc.body.addEventListener("mousemove", onPointerMove);
        doc.body.addEventListener("touchmove", onPointerMove);
        doc.body.addEventListener("mouseup", onPointerUp);
        doc.body.addEventListener("touchend", onPointerUp);
        doc.body.addEventListener("keyup", onKeyUp);
      }

      event.preventDefault();
    };

    // add mousedown listener on mouse down
    containerEl.addEventListener("mousedown", onPointerDown);
    containerEl.addEventListener("touchstart", onPointerDown);

    // remove mousedown listener on changes
    return () => {
      containerEl.removeEventListener("mousedown", onPointerDown);
      containerEl.removeEventListener("touchstart", onPointerDown);
    };
  }, [shouldStart, minSelection, onSelection, onDragStart, onDragEnd, active]);

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

  return (
    <div ref={rootEl} className={containerClassName}>
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
