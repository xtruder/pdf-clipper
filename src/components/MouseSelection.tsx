import React, { useState, useEffect, useRef } from "react";

import { Rect, Point } from "~/types";
import { getBoundingRect } from "~/lib/coordinates";
import { asElement, isHTMLElement } from "~/lib/pdfjs-dom";

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
  onSelection: (
    start: Target,
    end: Target,
    boundingRect: Rect,
    resetSelection: () => void
  ) => void;
  shouldStart?: (event: MouseEvent) => boolean;
  shouldEnd?: (event: MouseEvent | KeyboardEvent) => boolean;
  onDragStart?: (start: Target) => void;
  onDragEnd?: (start: Target, end: Target | null) => void;
};

export const MouseSelection: React.FC<MouseSelectionProps> = ({
  className = "",
  containerClassName = "",
  minSelection = 10,
  active = true,

  // handlers
  onSelection,
  shouldStart = () => true,
  shouldEnd = () => true,
  onDragStart = () => null,
  onDragEnd = () => null,
}) => {
  const [dragState, setDragState] = useState<DragState>(initialDragState);
  const dragStateRef = useRef(dragState);
  dragStateRef.current = dragState;

  const { start, end, selected } = dragState;

  const rootEl = useRef<HTMLDivElement | null>(null);

  const shouldRender = (boundingRect: Rect): boolean =>
    boundingRect.width >= minSelection && boundingRect.height >= minSelection;

  // componentDidMount set event listeners
  useEffect(() => {
    if (!active) return setDragState(initialDragState);

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

    const onMouseDown = (event: MouseEvent) => {
      // don't reset drag state if still dragging
      if (dragStateRef.current.start !== null && !dragStateRef.current.selected)
        return;

      // check whether there is event target
      if (!event.target || !isHTMLElement(event.target)) return;

      // if we should not start reset the drag state
      if (!shouldStart(event)) return setDragState(initialDragState);

      const start = {
        ...containerCoords(event.pageX, event.pageY),
        target: asElement(event.target),
      };

      setDragState({
        start,
        end: null,
        selected: false,
      });

      const onMouseMove = (event: MouseEvent): void =>
        setDragState({
          start,
          end: {
            ...containerCoords(event.pageX, event.pageY),
            target: asElement(event.target),
          },
          selected: false,
        });

      const onEnd = (end: Point): void => {
        const { ownerDocument: doc } = containerEl;

        // reset mousemove event listener
        doc.body.removeEventListener("mousemove", onMouseMove as EventListener);

        // reset mouseup event listener
        doc.body.removeEventListener("mouseup", onMouseUp as EventListener);

        // reset mouseup event listener
        doc.body.removeEventListener("keyup", onKeyUp as EventListener);

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
        console.log(event);
        if (!shouldEnd(event)) return;

        const end = dragStateRef.current.end;

        if (!end) return;

        onEnd(end);
      };

      const onMouseUp = (event: MouseEvent): void => {
        if (!event.currentTarget) return;

        if (!shouldEnd(event)) return;

        onEnd(containerCoords(event.pageX, event.pageY));
      };

      // add event listener for mouseup and mousemove events
      const { ownerDocument: doc } = containerEl;
      if (doc.body) {
        doc.body.addEventListener("mouseup", onMouseUp);
        doc.body.addEventListener("mousemove", onMouseMove);
        doc.body.addEventListener("keyup", onKeyUp);
      }

      return;
    };

    // add mousedown listener on mouse down
    containerEl.addEventListener("mousedown", onMouseDown);

    // remove mousedown listener on component unmount
    return () => containerEl.removeEventListener("mousedown", onMouseDown);
  }, [shouldStart, minSelection, onSelection, onDragStart, onDragEnd, active]);

  // drag start effect handler
  useEffect(() => {
    if (!selected && start && !end) onDragStart(start);
  }, [dragState]);

  // drag end effect handler
  useEffect(() => {
    if (selected && start) {
      onDragEnd(start, end);

      if (end) {
        const boundingRect = getBoundingRect(start, end);

        onSelection(start, end, boundingRect, () =>
          setDragState(initialDragState)
        );
      }
    }
  }, [dragState]);

  return (
    <div ref={rootEl} className={containerClassName}>
      {active && start && end && (
        <div
          className={className}
          style={{ ...getBoundingRect(start, end), position: "absolute" }}
        ></div>
      )}
    </div>
  );
};
