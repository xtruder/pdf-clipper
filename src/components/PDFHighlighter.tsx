import React, { useRef } from "react";
import useState from "react-usestateref";

import { PDFHighlight, HighlightColor, PartialPDFHighlight } from "~/models";
import {
  groupHighlightsByPage,
  getHighlightedRectsWithinPages,
  getBoundingRectForRects,
  viewportRectToScaledPageRect,
  scaledRectToViewportRect,
  PageRect,
} from "~/lib/pdf";

import { Rect, asElement, isHTMLElement } from "~/lib/dom";
import { getPageFromElement, getPagesFromRange, Viewport } from "~/lib/pdfjs";
import { s4 } from "~/lib/utils";

import {
  PageLayer,
  PDFDisplayProxy,
  PDFDisplay,
  PDFDisplayProps,
  ScrollPosition,
} from "./PDFDisplay";
import { TextHighlight } from "./TextHighlight";
import { AreaHighlight } from "./AreaHighlight";
import { MouseSelection, Target } from "./MouseSelection";
import { TipContainer } from "./TipContainer";

import "./PDFHighlighter.css";

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
  onHighlightClicked?: (highlight: PDFHighlight) => void;

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

  // highlight to show tooltip for, with tooltip content
  tooltipedHighlight?: PartialPDFHighlight;

  highlightTooltip?: JSX.Element;

  // id of highlight we should scroll to
  scrollToHighlight?: PDFHighlight;

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
  tooltipedHighlight,
  highlightTooltip,
  scrollToHighlight,
  highlightColor = defaultColor,
  showHighlights = true,
  enableAreaSelection = true,
  areaSelectionActive = false,
  isDarkReader = false,

  onHighlighting = () => null,
  onHighlightUpdated = () => null,
  onHighlightClicked = () => null,
  ...props
}) => {
  const [disableInteractions, setDisableInteractions] = useState(false);

  const [pdfViewer, setPDFViewer, pdfViewerRef] =
    useState<PDFDisplayProxy | null>(null);

  const selectionColorRef = useRef(highlightColor);
  selectionColorRef.current = highlightColor;

  const enableHighlightsRef = useRef(showHighlights);
  enableHighlightsRef.current = showHighlights;

  const selectedHighlightRef = useRef(selectedHighlight);
  selectedHighlightRef.current = selectedHighlight;

  const highlightTipRef = useRef<HTMLDivElement>();

  const onRangeSelection = (isCollapsed: boolean, range: Range | null) => {
    if (!enableHighlightsRef.current) return;

    const pdfViewer = pdfViewerRef.current;
    if (!pdfViewer) return;

    if (isCollapsed || !range) {
      onHighlighting(undefined);
      return;
    }

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
      id: s4(),
      location: {
        boundingRect: viewportRectToScaledPageRect(boundingRect, page.viewport),
        rects: rects.map((rect) =>
          viewportRectToScaledPageRect(rect, page.viewport)
        ),
        pageNumber,
      },
      content: { text, color: selectionColorRef.current },
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
      id: s4(),
      location: {
        boundingRect: viewportRectToScaledPageRect(pageBoundingRect, viewport),
        rects: [],
        pageNumber: page.number,
      },
      content: { image, color: selectionColorRef.current },
    };

    console.log("set in progress");
    onHighlighting(highlight);
  };

  const shouldResetAreaSelection = (
    event: MouseEvent | TouchEvent
  ): boolean => {
    return !(
      highlightTipRef.current &&
      event.target &&
      highlightTipRef.current.contains(event.target as any)
    );
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
    highlight: PDFHighlight | undefined
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
    highlight: PDFHighlight,
    viewport: Viewport
  ): JSX.Element => {
    const isSelected = highlight.id === selectedHighlightRef.current?.id;

    const onAreaHighlightChanged = (boundingRect: Rect) => {
      if (!pdfViewer) return;

      const image = pdfViewer.screenshotPageArea(
        highlight.location.pageNumber,
        boundingRect
      );
      if (!image) return;

      const newHighlight: PDFHighlight = {
        ...highlight,
        content: { image, color: highlight.content.color },
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
    };

    return highlight.content.text ? (
      <TextHighlight
        key={key}
        rects={highlight.location.rects.map((r) =>
          scaledRectToViewportRect(r, viewport)
        )}
        color={highlight.content.color}
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
        color={highlight.content.color}
        isSelected={isSelected}
        onClick={() => onHighlightClicked(highlight)}
        onChange={onAreaHighlightChanged}
        onDragStart={() => setDisableInteractions(true)}
        onDragStop={() => setDisableInteractions(false)}
      />
    );
  };

  const renderHighlightTooltip = (
    highlight: PartialPDFHighlight,
    tooltip: JSX.Element
  ) => {
    if (!pdfViewer) return;

    const pageView = pdfViewer.getPageView(highlight.location.pageNumber);
    if (!pageView) return;

    const boundingRect = scaledRectToViewportRect(
      highlight.location.boundingRect,
      pageView.viewport
    );

    const pageNode = pageView.div;
    const pageBoundingClientRect = pageNode?.getBoundingClientRect();

    if (!pageNode || !pageBoundingClientRect) return;

    return (
      <TipContainer
        scrollTop={pdfViewer.container.scrollTop}
        boundingRect={pageBoundingClientRect}
        style={{
          left:
            pageNode?.offsetLeft + boundingRect.left + boundingRect.width / 2,
          top: boundingRect.top + pageNode.offsetTop,
          bottom: boundingRect.top + pageNode.offsetTop + boundingRect.height,
        }}
        onRef={(ref) => {
          highlightTipRef.current = ref;
        }}
      >
        {tooltip}
      </TipContainer>
    );
  };

  const renderPageLayers = (highlights: PDFHighlight[]): PageLayer[] => {
    const highlightsByPage = groupHighlightsByPage([...highlights]);

    let highlightLayer: PageLayer = {
      name: "highlightLayer",
      className: `${
        isDarkReader ? "mix-blend-difference" : "mix-blend-multiply"
      } z-10`,
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

  let scrolledHighlight = highlights.find((h) => h.id == scrollToHighlight?.id);

  return (
    <PDFDisplay
      {...props}
      containerClassName={containerClassName}
      isDarkReader={isDarkReader}
      onDocumentReady={(viewer) => {
        setPDFViewer(viewer);
        props.onDocumentReady && props.onDocumentReady(viewer);
      }}
      disableInteractions={disableInteractions || props.disableInteractions}
      onRangeSelection={(isCollapsed, range) => {
        onRangeSelection(isCollapsed, range);
        props.onRangeSelection && props.onRangeSelection(isCollapsed, range);
      }}
      // onMouseDown={(event) => {
      //   if (!isHTMLElement(event.target)) return;

      //   //const element = asElement(event.target);
      // }}
      scrollTo={props.scrollTo || scrollPositionForHighligt(scrolledHighlight)}
      pageLayers={pageLayers}
      containerChildren={
        <>
          <MouseSelection
            className={`absolute border-dashed border-2
              ${colorToClassName[highlightColor]}
              ${isDarkReader ? "mix-blend-difference" : "mix-blend-multiply"}`}
            active={enableAreaSelection}
            onDragStart={() => setDisableInteractions(true)}
            onDragEnd={() => setDisableInteractions(false)}
            shouldStart={shouldStartAreaSelection}
            shouldReset={shouldResetAreaSelection}
            shouldEnd={shouldEndAreaSelection}
            onSelection={onMouseSelection}
            onReset={() => onHighlighting(undefined)}
          />

          {tooltipedHighlight && highlightTooltip
            ? renderHighlightTooltip(tooltipedHighlight, highlightTooltip)
            : null}

          {props.containerChildren}
        </>
      }
    >
      {props.children}
    </PDFDisplay>
  );
};
