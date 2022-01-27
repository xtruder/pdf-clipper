import React, { useEffect, useRef } from "react";
import useState from "react-usestateref";

import {
  Highlight,
  HighlightColor,
  NewHighlight,
  Rect,
  Viewport,
} from "~/types";

import {
  getHighlightedRectsWithinPages,
  getBoundingRectForRects,
  viewportRectToScaledPageRect,
  scaledRectToViewportRect,
} from "~/lib/coordinates";
import { getPageFromElement, getPagesFromRange } from "~/lib/pdfjs-utils";
import { asElement, isHTMLElement } from "~/lib/dom-utils";
import { groupHighlightsByPage } from "~/lib/highlights";

import {
  PageLayer,
  PDFViewerProxy,
  PDFDisplay,
  PDFDisplayProps,
  ScrollPosition,
} from "./PdfDisplay";
import { TextHighlight } from "./TextHighlight";
import { AreaHighlight } from "./AreaHighlight";
import { MouseSelection, Target } from "./MouseSelection";

import "./PdfHighlighter.css";

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
  onHighlighting?: (highlight: NewHighlight) => void;

  // onHighlightClicked is triggered when highlight is clicked
  onHighlightClicked?: (highlight: Highlight) => void;

  // onHighlightUpdated is triggered when highlight is triggered
  onHighlightUpdated?: (highlight: Highlight) => void;
}

export interface PDFHighlighterProps
  extends PDFDisplayProps,
    PDFHighlighterEvents {
  // list of existing highlights
  highlights?: Highlight[];

  // id of currently selected highlight
  selectedHighlight?: string;

  // id of highlight we should scroll to
  scrollToHighlight?: string;

  // color to use for highlight selection
  highlightColor?: HighlightColor;

  // enable highlights controls whether to enable highlights
  showHighlights?: boolean;

  // whether to enable area selection
  enableAreaSelection?: boolean;

  // Whther area selection is activated
  areaSelectionActive?: boolean;
}

export const PDFHighlighter: React.FC<PDFHighlighterProps> = ({
  highlights = [],
  selectedHighlight,
  scrollToHighlight,
  highlightColor = defaultColor,
  showHighlights = true,
  enableAreaSelection = true,
  areaSelectionActive = false,

  onHighlighting = () => null,
  onHighlightUpdated = () => null,
  onHighlightClicked = () => null,
  ...props
}) => {
  const [disableInteractions, setDisableInteractions] = useState(false);

  const [pdfViewer, setPDFViewer, pdfViewerRef] =
    useState<PDFViewerProxy | null>(null);

  const selectionColorRef = useRef(highlightColor);
  selectionColorRef.current = highlightColor;

  const enableHighlightsRef = useRef(showHighlights);
  enableHighlightsRef.current = showHighlights;

  const selectedHighlightRef = useRef(selectedHighlight);
  selectedHighlightRef.current = selectedHighlight;

  const onRangeSelection = (isCollapsed: boolean, range: Range | null) => {
    if (!enableHighlightsRef.current) return;

    const pdfViewer = pdfViewerRef.current;

    if (isCollapsed || !range) return;
    if (!pdfViewer) return;

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

    // create a new highlight
    const highlight: NewHighlight = {
      location: {
        boundingRect: viewportRectToScaledPageRect(boundingRect, page.viewport),
        rects: rects.map((rect) =>
          viewportRectToScaledPageRect(rect, page.viewport)
        ),
        pageNumber,
      },
      content: {
        text: range.toString(),
      },
      color: selectionColorRef.current,
    };

    console.log("set in progress", selectionColorRef.current);
    onHighlighting(highlight);
  };

  const onMouseSelection = (start: Target, _: Target, boundingRect: Rect) => {
    if (!pdfViewer) return;

    const page = getPageFromElement(start.target);
    if (!page) return;

    const viewport = pdfViewer.getPageView(page.number)?.viewport;
    if (!viewport) return;

    const pageBoundingRect = {
      ...boundingRect,
      top: boundingRect.top - page.node.offsetTop,
      left: boundingRect.left - page.node.offsetLeft,
      pageNumber: page.number,
    };

    // create image of selection
    const image = pdfViewer.screenshotPageArea(page.number, pageBoundingRect);

    if (!image) return;

    // create a new higlightwith image content
    const highlight: NewHighlight = {
      location: {
        boundingRect: viewportRectToScaledPageRect(
          { ...pageBoundingRect, pageNumber: page.number },
          viewport
        ),
        rects: [],
        pageNumber: page.number,
      },
      content: { image },
      color: selectionColorRef.current,
    };

    console.log("set in progress");
    onHighlighting(highlight);
  };

  const shouldStartAreaSelection = (
    event: MouseEvent | TouchEvent
  ): boolean => {
    return (
      enableHighlightsRef.current &&
      (event.altKey || areaSelectionActive) &&
      isHTMLElement(event.target) &&
      Boolean(asElement(event.target).closest(".page"))
    );
  };

  const shouldEndAreaSelection = (
    event: MouseEvent | TouchEvent | KeyboardEvent
  ): boolean => {
    if (event.type === "keyup" && event.altKey) return true;
    if (event.type === "mouseup" && areaSelectionActive) return true;
    return !event.altKey;
  };

  const scrollPositionForHighligt = (
    highlight: Highlight | undefined
  ): ScrollPosition | undefined => {
    if (!highlight || !pdfViewer) return;

    const page = pdfViewer.getPageView(highlight.location.pageNumber)!;

    const scrollPosition = {
      pageNumber: highlight.location.pageNumber,
      top:
        scaledRectToViewportRect(highlight.location.boundingRect, page.viewport)
          .top - 10,
    };

    return scrollPosition;
  };

  const renderHighlight = (
    key: any,
    highlight: Highlight,
    viewport: Viewport
  ): JSX.Element => {
    const isSelected = highlight.id === selectedHighlightRef.current;

    return highlight.content?.text ? (
      <TextHighlight
        key={key}
        rects={highlight.location.rects.map((r) =>
          scaledRectToViewportRect(r, viewport)
        )}
        color={highlight.color}
        isSelected={isSelected}
        onClick={() => onHighlightClicked(highlight)}
      />
    ) : (
      <AreaHighlight
        key={key}
        boundingRect={scaledRectToViewportRect(
          highlight.location.boundingRect,
          viewport
        )}
        color={highlight.color}
        isSelected={isSelected}
        onClick={() => onHighlightClicked(highlight)}
        onChange={(boundingRect) => {
          if (!pdfViewer) return;

          const image = pdfViewer.screenshotPageArea(
            highlight.location.pageNumber,
            boundingRect
          );
          if (!image) return;

          const newHighlight: Highlight = {
            ...highlight,
            content: { image },
            location: {
              ...highlight.location,
              boundingRect: viewportRectToScaledPageRect(
                {
                  ...boundingRect,
                  pageNumber: highlight.location.boundingRect.pageNumber,
                },
                viewport
              ),
            },
          };

          onHighlightUpdated(newHighlight);
        }}
        onDragStart={() => setDisableInteractions(true)}
        onDragStop={() => setDisableInteractions(false)}
      />
    );
  };

  const renderPageLayers = (highlights: Highlight[]): PageLayer[] => {
    const highlightsByPage = groupHighlightsByPage(highlights);

    let highlightLayer: PageLayer = {
      name: "annotationLayer",
      className: "mix-blend-multiply z-10",
      pages: [],
    };

    // iterate by all pages and render highlights for every page
    for (const [key, pageHighlights] of Object.entries(highlightsByPage)) {
      const pageNumber = Number(key);

      const element = (viewport: Viewport) => (
        <>
          {pageHighlights.map((highlight, index) =>
            renderHighlight(index, highlight, viewport)
          )}
        </>
      );

      highlightLayer.pages.push({ pageNumber, element });
    }

    return [highlightLayer];
  };

  const containerClassName = `${
    colorToRangeSelectionClassName[highlightColor]
  } ${props.containerClassName || ""}`;

  const pageLayers = renderPageLayers(showHighlights ? highlights : []);
  if (props.pageLayers) pageLayers.push(...props.pageLayers);

  let scrolledHighlight = highlights.find((h) => h.id == scrollToHighlight);

  return (
    <PDFDisplay
      {...props}
      containerClassName={containerClassName}
      onDocumentReady={(viewer) => {
        setPDFViewer(viewer);
        props.onDocumentReady && props.onDocumentReady(viewer);
      }}
      disableInteractions={disableInteractions || props.disableInteractions}
      onRangeSelection={(isCollapsed, range) => {
        onRangeSelection(isCollapsed, range);
        props.onRangeSelection && props.onRangeSelection(isCollapsed, range);
      }}
      onMouseDown={(event) => {
        if (!isHTMLElement(event.target)) return;

        const element = asElement(event.target);
      }}
      scrollTo={props.scrollTo || scrollPositionForHighligt(scrolledHighlight)}
      pageLayers={pageLayers}
      containerChildren={
        <>
          <MouseSelection
            className={`absolute mix-blend-multiply border-dashed border-2 ${colorToClassName[highlightColor]}`}
            active={enableAreaSelection}
            onDragStart={() => setDisableInteractions(true)}
            onDragEnd={() => setDisableInteractions(false)}
            shouldStart={shouldStartAreaSelection}
            shouldEnd={shouldEndAreaSelection}
            onSelection={onMouseSelection}
          />

          {props.containerChildren}
        </>
      }
    >
      {props.children}
    </PDFDisplay>
  );
};
