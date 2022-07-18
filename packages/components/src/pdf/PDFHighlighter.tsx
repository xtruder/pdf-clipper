import React, {
  MouseEventHandler,
  useEffect,
  useState,
  useRef,
  useMemo,
} from "react";
import { v4 as uuid } from "uuid";

import {
  getHighlightedRectsWithinPages,
  getBoundingRectForRects,
  viewportRectToScaledPageRect,
  scaledRectToViewportRect,
  PageRect,
} from "../lib/pdf";
import { Rect, clearRangeSelection } from "../lib/dom";
import { getPageFromElement, getPagesFromRange } from "../lib/pdfjs";

import { PDFHighlight, HighlightColor } from "./types";

import {
  PDFLayer,
  PDFDisplayProxy,
  PDFDisplay,
  PDFDisplayProps,
  PDFScrollPosition,
  PDFLayerPage,
} from "./PDFDisplay";
import { PDFHighlightComponent } from "./PDFHighlight";
import { MouseSelection, Target } from "../ui/MouseSelection";
import { RangeTooltipContainer } from "../ui/RangeTooltipContainer";

import "./PDFHighlighter.css";
import { groupHighlightsByPage } from "./utils";

const colorToRangeSelectionClassName: Record<HighlightColor, string> = {
  [HighlightColor.RED]: "textLayer__selection_red",
  [HighlightColor.YELLOW]: "textLayer__selection_yellow",
  [HighlightColor.GREEN]: "textLayer__selection_green",
  [HighlightColor.BLUE]: "textLayer__selection_blue",
};

const colorToClassName: Record<HighlightColor, string> = {
  [HighlightColor.RED]: "bg-red-200",
  [HighlightColor.YELLOW]: "bg-yellow-200",
  [HighlightColor.GREEN]: "bg-green-200",
  [HighlightColor.BLUE]: "bg-blue-200",
};

const defaultColor = HighlightColor.YELLOW;

interface PDFHighlighterEvents {
  // onHighlighting is triggered when highlight selection is still in progress
  onHighlighting?: (highlight: PDFHighlight | undefined) => void;

  // onHighlightClicked is triggered when highlight is clicked
  onHighlightClicked?: (highlight?: PDFHighlight) => void;

  // onHighlightUpdated is triggered when highlight is triggered
  onHighlightUpdated?: (highlight: PDFHighlight) => void;
}

export interface PDFHighlighterProps
  extends PDFDisplayProps,
    PDFHighlighterEvents {
  // list of existing highlights
  highlights?: PDFHighlight[];

  // id of currently selected highlight
  selectedHighlight?: PDFHighlight;

  // id of highlight we should scroll to
  scrollToHighlight?: PDFHighlight;

  // color to use for highlight selection
  highlightColor?: HighlightColor;

  // tooltip used for highlight
  highlightTooltip?: JSX.Element;

  // tooltip used when selecting
  selectionTooltip?: JSX.Element;

  // enable highlights controls whether to enable highlights
  showHighlights?: boolean;

  // whether to enable area selection
  enableAreaSelection?: boolean;
}

export const PDFHighlighter: React.FC<PDFHighlighterProps> = ({
  highlights = [],
  selectedHighlight,
  highlightTooltip,
  selectionTooltip,
  scrollToHighlight,
  highlightColor = defaultColor,
  showHighlights = true,
  enableAreaSelection = true,
  enableDarkMode: isDarkReader = false,

  onHighlighting = () => null,
  onHighlightUpdated = () => null,
  onHighlightClicked = () => null,
  ...props
}) => {
  const [pdfViewer, setPDFViewer] = useState<PDFDisplayProxy | null>(null);

  const [disableInteractions, setDisableInteractions] = useState(false);
  const [rangeSelection, setRangeSelection] = useState<Range | null>(null);
  const [scrollTo, setScrollTo] = useState<PDFScrollPosition>();

  // pdf container ref
  const containerRef = useRef<HTMLElement | null>(null);

  const onRangeSelection = (isCollapsed: boolean, range: Range | null) => {
    if (!pdfViewer) return;

    if (isCollapsed || !range) {
      setRangeSelection(null);
      onHighlighting(undefined);
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

    // create a new highlight
    const highlight: PDFHighlight = {
      id: uuid(),
      location: {
        boundingRect: viewportRectToScaledPageRect(boundingRect, page.viewport),
        rects: rects.map((rect) =>
          viewportRectToScaledPageRect(rect, page.viewport)
        ),
        pageNumber,
      },
      content: { text, color: highlightColor },
    };

    onHighlighting(highlight);
  };

  const onMouseSelection = (start: Target, _: Target, boundingRect: Rect) => {
    if (!pdfViewer) return;

    const page = getPageFromElement(start.target);
    if (!page) return;

    const viewport = pdfViewer.getPageView(page.number)?.viewport;
    if (!viewport) return;

    // bounding rect of selection on a page
    const pageBoundingRect: PageRect = {
      ...boundingRect,
      top: boundingRect.top - page.node.offsetTop,
      left: boundingRect.left - page.node.offsetLeft,
      pageNumber: page.number,
    };

    // screenshot selection
    const image = pdfViewer.screenshotPageArea(page.number, pageBoundingRect);
    if (!image) return;

    // create a new higlightwith image content
    const highlight: PDFHighlight = {
      id: uuid(),
      location: {
        boundingRect: viewportRectToScaledPageRect(pageBoundingRect, viewport),
        rects: [],
        pageNumber: page.number,
      },
      content: { thumbnail: image, color: highlightColor },
    };

    onHighlighting(highlight);
  };

  const onDoubleTap: MouseEventHandler = (event) => {
    const elements = document.elementsFromPoint(event.clientX, event.clientY);

    const annotation = elements.find((el) => el.closest(".highlight"));

    if (annotation) {
      annotation.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    } else {
      onHighlightClicked(undefined);
    }
  };

  // if scrollToHighlight changes set scrollTo position
  useEffect(() => {
    if (!pdfViewer || !scrollToHighlight) return;

    const highlight = highlights.find((h) => h.id == scrollToHighlight?.id);
    setScrollTo(scrollPositionForHighlight(highlight, pdfViewer));
  }, [scrollToHighlight]);

  // clear range selection if changing selected highlight
  useEffect(() => clearRangeSelection(), [selectedHighlight]);

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
                <PDFHighlightComponent
                  key={highlight.id}
                  highlight={highlight}
                  pdfViewer={pdfViewer}
                  selectedHighlight={selectedHighlight}
                  isDarkReader={isDarkReader}
                  highlightTooltip={highlightTooltip}
                  onHighlightUpdated={onHighlightUpdated}
                  onHighlightClicked={onHighlightClicked}
                  onHighlightEditing={(h) => setDisableInteractions(!!h)}
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
          props.onDocumentReady && props.onDocumentReady(viewer);
        }}
        disableInteractions={disableInteractions || props.disableInteractions}
        disableTextDoubleClick={true}
        onRangeSelection={(isCollapsed, range) => {
          onRangeSelection(isCollapsed, range);
          props.onRangeSelection && props.onRangeSelection(isCollapsed, range);
        }}
        scrollTo={scrollTo || props.scrollTo}
        layers={[highlightsLayer]}
        onDoubleTap={(event) => {
          onDoubleTap(event);
          props.onDoubleTap && props.onDoubleTap(event);
        }}
        onPageScroll={(location) => {
          setScrollTo(undefined);
          props.onPageScroll && props.onPageScroll(location);
        }}
        containerChildren={
          <>
            <MouseSelection
              eventsElRef={containerRef}
              blendMode={isDarkReader ? "difference" : "multiply"}
              className={`border-dashed border-2 rounded-md z-10 ${colorToClassName[highlightColor]}`}
              tooltipContainerClassName="z-12"
              active={enableAreaSelection}
              tooltip={selectionTooltip}
              onDragEnd={() => setDisableInteractions(false)}
              onSelecting={() => {
                clearRangeSelection();
                setDisableInteractions(true);
              }}
              onSelection={onMouseSelection}
              onReset={() => onHighlighting(undefined)}
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
  highlight: PDFHighlight | undefined,
  pdfViewer: PDFDisplayProxy
): PDFScrollPosition | undefined => {
  if (!highlight || !pdfViewer || !highlight.location) return;

  const page = pdfViewer.getPageView(highlight.location.pageNumber)!;

  const scrollPosition = {
    pageNumber: highlight.location.pageNumber,
    top:
      scaledRectToViewportRect(highlight.location.boundingRect, page.viewport)
        .top - 10,
  };

  return scrollPosition;
};
