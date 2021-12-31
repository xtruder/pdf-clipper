import React, { useEffect, useRef } from "react";
import useState from "react-usestateref";

import { PDFLoader } from "./PdfLoader";
import { MouseSelection, Target } from "./MouseSelection";
import { PageLayer, PDFDocument, PDFViewer } from "./PdfViewer";

import {
  asElement,
  getPageFromElement,
  getPagesFromRange,
  isHTMLElement,
} from "~/lib/pdfjs-dom";
import {
  Highlight,
  HighlightColor,
  NewHighlight,
  PartialHighlight,
  Rect,
  Viewport,
} from "~/types";
import {
  getBoundingRectForRects,
  getHighlightedRectsWithinPages,
  scaledRectToViewportRect,
  viewportRectToScaledPageRect,
} from "~/lib/coordinates";
import { groupHighlightsByPage } from "~/lib/highlights";

import "./PdfReader.css";
import { clearRangeSelection } from "~/lib/dom-util";
import { TextHighlight } from "./TextHighlight";
import { AreaHighlight } from "./AreaHighlight";

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

interface PDFReaderHandlers {
  onNewHighlight?: (highlight: NewHighlight) => void;
  onHighlightUpdate?: (highlight: Highlight) => void;
}

export interface PDFReaderProps extends PDFReaderHandlers {
  url: string;
  pdfScaleValue?: string;
  pageNumber?: number;
  scrollTop?: number;

  // list of existing highlights
  highlights?: Highlight[];

  // selection is a highlight that is still in progress of selecting
  selection?: PartialHighlight;

  // color to use for selection
  selectionColor?: HighlightColor;
}

export const PDFReader: React.FC<PDFReaderProps> = ({
  url,
  pdfScaleValue,
  highlights = [],
  selection,
  selectionColor = defaultColor,

  onNewHighlight = () => null,
  onHighlightUpdate = () => null,
}) => {
  const [disableInteractions, setDisableInteractions] = useState(false);
  const [pdfDocument, setPDFDocument, pdfDocumentRef] =
    useState<PDFDocument | null>(null);
  const [currentSelection, setCurrentSelection] = useState<NewHighlight | null>(
    null
  );
  const [inprogressSelection, setInprogressSelection, inprogressSelectionRef] =
    useState<NewHighlight | null>(null);

  const [mouseSelectionActive, setMouseSelectionActive] = useState(true);

  const selectionColorRef = useRef(selectionColor);
  selectionColorRef.current = selectionColor;

  const onRangeSelection = (isCollapsed: boolean, range: Range | null) => {
    const pdfDocument = pdfDocumentRef.current;

    if (isCollapsed || !range) return;
    if (!pdfDocument) return;

    // get pages from selected range
    const pages = getPagesFromRange(range);
    if (pages.length === 0) return;

    // get highlighted rects within pages
    const rects = getHighlightedRectsWithinPages(range, pages);
    if (rects.length === 0) return;

    // get rect bounding all the rects
    const boundingRect = getBoundingRectForRects(rects);

    const pageNumber = pages[0].number;
    const page = pdfDocument.getPageView(pageNumber)!;

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
    setCurrentSelection(null);
    setInprogressSelection(highlight);
  };

  const onMouseSelection = (start: Target, end: Target, boundingRect: Rect) => {
    if (!pdfDocument) return;

    const page = getPageFromElement(start.target);
    if (!page) return;

    const viewport = pdfDocument.getPageView(page.number)?.viewport;
    if (!viewport) return;

    const pageBoundingRect = {
      ...boundingRect,
      top: boundingRect.top - page.node.offsetTop,
      left: boundingRect.left - page.node.offsetLeft,
      pageNumber: page.number,
    };

    // create image of selection
    const image = pdfDocument.screenshotPageArea(page.number, pageBoundingRect);

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
    setCurrentSelection(null);
    setInprogressSelection(highlight);
  };

  const shouldStartAreaSelection = (event: MouseEvent): boolean => {
    return (
      event.altKey &&
      isHTMLElement(event.target) &&
      Boolean(asElement(event.target).closest(".page"))
    );
  };

  const shouldEndAreaSelection = (
    event: MouseEvent | KeyboardEvent
  ): boolean => {
    if (event.type === "keyup" && event.altKey) return true;
    return !event.altKey;
  };

  const renderHighlight = (
    key: any,
    highlight: Highlight,
    viewport: Viewport
  ): JSX.Element => {
    if (highlight.content?.text) {
      return (
        <TextHighlight
          key={key}
          rects={highlight.location.rects.map((r) =>
            scaledRectToViewportRect(r, viewport)
          )}
          color={highlight.color}
          isScrolledTo={false}
        />
      );
    } else {
      return (
        <AreaHighlight
          key={key}
          boundingRect={scaledRectToViewportRect(
            highlight.location.boundingRect,
            viewport
          )}
          color={highlight.color}
          isScrolledTo={false}
          onChange={(boundingRect) => {
            onHighlightUpdate({
              ...highlight,
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
            });
          }}
        />
      );
    }
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

  useEffect(() => {
    if (currentSelection === inprogressSelection && currentSelection !== null) {
      onNewHighlight(currentSelection);
      setInprogressSelection(null);

      if (currentSelection.content.text) clearRangeSelection();
      else {
        setMouseSelectionActive(false);
        setTimeout(() => setMouseSelectionActive(true), 0);
      }
    }
  }, [currentSelection]);

  return (
    <PDFLoader
      url={url}
      showDocument={(document) => (
        <PDFViewer
          pdfDocument={document}
          pdfScaleValue={pdfScaleValue}
          disableInteractions={disableInteractions}
          containerClassName={colorToRangeSelectionClassName[selectionColor]}
          onDocumentReady={setPDFDocument}
          onRangeSelection={onRangeSelection}
          onKeyDown={(event) => {
            if (event.code === "Escape") clearRangeSelection();
            if (event.code === "Enter") {
              setCurrentSelection(inprogressSelectionRef.current);
            }
          }}
          onMouseDown={(event) => {
            if (!isHTMLElement(event.target)) return;

            const element = asElement(event.target);
          }}
          pageLayers={renderPageLayers(highlights)}
        >
          <MouseSelection
            className={`absolute mix-blend-multiply border-dashed border-2 ${colorToClassName[selectionColor]}`}
            active={mouseSelectionActive}
            onDragStart={() => setDisableInteractions(true)}
            onDragEnd={() => setDisableInteractions(false)}
            shouldStart={shouldStartAreaSelection}
            shouldEnd={shouldEndAreaSelection}
            onSelection={onMouseSelection}
          />
        </PDFViewer>
      )}
      showLoader={() => <a>Loading...</a>}
    ></PDFLoader>
  );
};
