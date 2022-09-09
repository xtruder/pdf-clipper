import React, {
  MouseEventHandler,
  useEffect,
  useState,
  useRef,
  useMemo,
} from "react";
import { useBoolean, useResetState, useUpdateEffect } from "ahooks";

import {
  getHighlightedRectsWithinPages,
  getBoundingRectForRects,
  viewportRectToScaledPageRect,
  scaledRectToViewportRect,
  PageRect,
} from "../lib/pageRects";
import {
  Rect,
  clearRangeSelection,
  getCanvasArea,
  canvasToPNGBlob,
} from "../lib/dom";
import { getPageFromElement, getPagesFromRange } from "../lib/pdfjs";

import {
  HighlightColor,
  PDFHighlight,
  PDFHighlightInfo,
  PDFHighlightInfoWithKey,
  PDFHighlightWithKey,
} from "./types";

import {
  PDFLayer,
  PDFDisplayProxy,
  PDFDisplay,
  PDFDisplayProps,
  PDFScrollPosition,
  PDFLayerPage,
} from "./PDFDisplay";
import { PDFHighlightContainer } from "./PDFHighlight";
import { MouseSelection, Target } from "../ui/MouseSelection";
import { RangeTooltipContainer } from "../ui/RangeTooltipContainer";

import "./PDFHighlighter.css";
import { getHighlightSequence, groupHighlightsByPage } from "./utils";

const colorToRangeSelectionClassName: Record<HighlightColor, string> = {
  [HighlightColor.Red]: "textLayer__selection_red",
  [HighlightColor.Yellow]: "textLayer__selection_yellow",
  [HighlightColor.Green]: "textLayer__selection_green",
  [HighlightColor.Blue]: "textLayer__selection_blue",
};

const colorToClassName: Record<HighlightColor, string> = {
  [HighlightColor.Red]: "bg-red-200",
  [HighlightColor.Yellow]: "bg-yellow-200",
  [HighlightColor.Green]: "bg-green-200",
  [HighlightColor.Blue]: "bg-blue-200",
};

const defaultColor = HighlightColor.Yellow;

interface PDFHighlighterEvents {
  /**onHighlighting is triggered when highlighting is happening */
  onHighlighting?: (highlight: PDFHighlight | null) => void;

  /**onHighlightUpdated is triggered when highlight is triggered */
  onHighlightUpdated?: (highlight: PDFHighlightWithKey) => void;

  /**onHighlightClicked is triggered when highlight is clicked */
  onHighlightClicked?: (key: string | null) => void;
}

export interface PDFHighlighterProps
  extends PDFDisplayProps,
    PDFHighlighterEvents {
  // list of existing highlights
  highlights?: Required<PDFHighlightInfoWithKey>[];

  // key of currently selected highlight
  selectedHighlight?: string | null;

  // key of highlight we should scroll to
  scrollToHighlight?: string | null;

  /**selected highlight color */
  highlightColor?: HighlightColor;

  // tooltip used for highlight
  highlightTooltip?: JSX.Element;

  // tooltip used when selecting
  selectionTooltip?: JSX.Element;

  // enable highlights controls whether to enable highlights
  showHighlights?: boolean;

  /**whether to clear selection */
  clearSelection?: boolean;
}

export const PDFHighlighter: React.FC<PDFHighlighterProps> = ({
  highlights = [],
  highlightTooltip,
  selectionTooltip,
  selectedHighlight = null,
  scrollToHighlight = null,
  highlightColor = defaultColor,
  showHighlights = true,
  enableDarkMode: isDarkReader = false,
  clearSelection = false,

  onHighlighting,
  onHighlightUpdated,
  onHighlightClicked,

  ...props
}) => {
  const [pdfViewer, setPDFViewer] = useState<PDFDisplayProxy | null>(null);

  const [
    interactionsDisabled,
    { setTrue: disableInteractions, setFalse: enableInteractions },
  ] = useBoolean();
  const [rangeSelection, setRangeSelection, resetRangeSelection] =
    useResetState<Range | null>(null);
  const [scrollTo, setScrollTo, resetScrollTo] =
    useResetState<PDFScrollPosition | null>(null);

  // pdf container ref
  const containerRef = useRef<HTMLElement | null>(null);

  const onRangeSelection = (isCollapsed: boolean, range: Range | null) => {
    if (!pdfViewer) return;

    if (isCollapsed || !range) {
      resetRangeSelection();
      onHighlighting?.(null);
      return;
    }

    setRangeSelection(range);

    // get pages from selected range
    const pages = getPagesFromRange(range);
    if (pages.length === 0) return;

    // get highlighted rects within pages
    const rects = getHighlightedRectsWithinPages(range, pages);
    if (rects.length === 0) return;

    // get rect bounding all the rects
    const boundingRect = getBoundingRectForRects(rects);

    const pageNumber = pages[0].number;
    const page = pdfViewer.getPageView(pageNumber)!;
    const text = range.toString();

    const scaledBoundingRect = viewportRectToScaledPageRect(
      boundingRect,
      page.viewport
    );

    const sequence = getHighlightSequence(pageNumber, scaledBoundingRect);

    onHighlighting?.({
      type: "text",
      text,
      color: highlightColor,
      location: {
        boundingRect: scaledBoundingRect,
        rects: rects.map((rect) =>
          viewportRectToScaledPageRect(rect, page.viewport)
        ),
        pageNumber,
      },
      sequence,
    });
  };

  const onMouseSelection = async (
    start: Target,
    _: Target,
    boundingRect: Rect
  ) => {
    if (!pdfViewer) return;

    const pageElement = getPageFromElement(start.target);
    if (!pageElement) return;

    const page = pdfViewer.getPageView(pageElement.number);
    if (!page) return;

    // bounding rect of selection on a page
    const pageBoundingRect: PageRect = {
      ...boundingRect,
      top: boundingRect.top - pageElement.node.offsetTop,
      left: boundingRect.left - pageElement.node.offsetLeft,
      pageNumber: pageElement.number,
    };

    const canvasArea = getCanvasArea(page.canvas, pageBoundingRect);
    const image = await canvasToPNGBlob(canvasArea);

    const scaledBoundingRect = viewportRectToScaledPageRect(
      pageBoundingRect,
      page.viewport
    );

    const sequence = getHighlightSequence(pageElement.number, pageBoundingRect);

    onHighlighting?.({
      type: "area",
      image,
      color: highlightColor,
      location: {
        boundingRect: scaledBoundingRect,
        rects: [],
        pageNumber: pageElement.number,
      },
      sequence,
    });
  };

  const onDoubleTap: MouseEventHandler = (event) => {
    const elements = document.elementsFromPoint(event.clientX, event.clientY);

    const annotation = elements.find((el) => el.closest(".highlight"));

    if (annotation) {
      annotation.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    } else {
      onHighlightClicked?.(null);
    }
  };

  // if scrollToHighlight changes set scrollTo position
  useEffect(() => {
    if (!pdfViewer || !scrollToHighlight) return;

    const highlight = highlights.find((h) => h.key === scrollToHighlight);
    setScrollTo(scrollPositionForHighlight(highlight, pdfViewer));
  }, [scrollToHighlight]);

  // clear range selection if changing selected highlight
  useUpdateEffect(clearRangeSelection, [selectedHighlight]);

  // clear range selection when changing selection
  useUpdateEffect(clearRangeSelection, [clearSelection]);

  const containerClassName = `
    ${colorToRangeSelectionClassName[highlightColor]}
    ${props.containerClassName || ""}`;

  const highlightsByPage = useMemo(
    () => groupHighlightsByPage([...highlights]),
    [highlights]
  );

  const highlightsLayer = useMemo(
    () => (
      <PDFLayer layerName="annotationsLayer">
        {Object.entries(highlightsByPage).map(([key, pageHighlights]) => {
          const pageNumber = Number(key);

          return (
            <PDFLayerPage pageNumber={pageNumber} key={pageNumber}>
              {pageHighlights.map((highlight) => (
                <PDFHighlightContainer
                  key={highlight.key}
                  highlight={highlight}
                  pdfViewer={pdfViewer}
                  isSelected={highlight.key === selectedHighlight}
                  isDarkReader={isDarkReader}
                  highlightTooltip={highlightTooltip}
                  onUpdated={onHighlightUpdated}
                  onClicked={() => onHighlightClicked?.(highlight.key)}
                  onEditing={(editing) => {
                    if (editing) {
                      disableInteractions();
                      clearRangeSelection();
                    } else {
                      enableInteractions();
                    }
                  }}
                />
              ))}
            </PDFLayerPage>
          );
        })}
      </PDFLayer>
    ),
    [
      pdfViewer,
      highlightsByPage,
      highlightTooltip,
      isDarkReader,
      selectedHighlight,
      onHighlightUpdated,
      onHighlightClicked,
    ]
  );

  return (
    <>
      {rangeSelection && (
        <RangeTooltipContainer
          className="z-10"
          tooltip={selectionTooltip}
          range={rangeSelection}
          scrollElRef={containerRef}
        />
      )}

      <PDFDisplay
        {...props}
        containerRef={containerRef}
        containerClassName={containerClassName}
        enableDarkMode={isDarkReader}
        onDocumentReady={(viewer) => {
          setPDFViewer(viewer);
          props.onDocumentReady?.(viewer);
        }}
        disableInteractions={interactionsDisabled || props.disableInteractions}
        disableTextDoubleClick={true}
        onRangeSelection={(isCollapsed, range) => {
          onRangeSelection(isCollapsed, range);
          props.onRangeSelection?.(isCollapsed, range);
        }}
        scrollTo={scrollTo || props.scrollTo}
        layers={[highlightsLayer]}
        onDoubleTap={(event) => {
          onDoubleTap(event);
          props.onDoubleTap?.(event);
        }}
        onPageScroll={(location) => {
          resetScrollTo();
          props.onPageScroll?.(location);
        }}
        containerChildren={
          <>
            <MouseSelection
              eventsElRef={containerRef}
              blendMode={isDarkReader ? "difference" : "multiply"}
              className={`border-dashed border-2 rounded-md z-10 ${colorToClassName[highlightColor]}`}
              tooltipContainerClassName="z-12"
              tooltip={selectionTooltip}
              clearSelection={clearSelection}
              onDragEnd={enableInteractions}
              onSelecting={() => {
                clearRangeSelection();
                disableInteractions();
              }}
              onSelection={onMouseSelection}
              onReset={() => onHighlighting?.(null)}
            />

            {props.containerChildren}
          </>
        }
      >
        {props.children}
      </PDFDisplay>
    </>
  );
};

const scrollPositionForHighlight = (
  highlight: PDFHighlightInfo | undefined,
  pdfViewer: PDFDisplayProxy
): PDFScrollPosition | null => {
  if (!highlight || !pdfViewer || !highlight.location) return null;

  const page = pdfViewer.getPageView(highlight.location.pageNumber)!;

  const scrollPosition = {
    pageNumber: highlight.location.pageNumber,
    top:
      scaledRectToViewportRect(highlight.location.boundingRect, page.viewport)
        .top - 10,
  };

  return scrollPosition;
};
