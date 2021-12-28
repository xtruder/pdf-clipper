import React, { useEffect, useRef, useState } from "react";

import { PDFLoader } from "./PdfLoader";
import { MouseSelection, Target } from "./MouseSelection";
import { PageLayer, PDFDocument, PDFViewer } from "./PdfViewer";

import {
  asElement,
  getPageFromElement,
  getPagesFromRange,
  isHTMLElement,
} from "~/lib/pdfjs-dom";
import { Highlight, PartialHighlight, Rect } from "~/types";
import {
  getBoundingRectForRects,
  getHighlightedRectsWithinPages,
  viewportRectToScaledPageRect,
} from "~/lib/coordinates";
import { groupHighlightsByPage } from "~/lib/highlights";
import { PdfHighlight } from "./PdfHighlight";
import debounce from "lodash.debounce";

export interface PDFReaderProps {
  url: string;
  pdfScale?: string;
  pageNumber?: number;
  scrollTop?: number;

  // list of existing highlights
  highlights?: Highlight[];

  // selection is a highlight that is still in progress of selecting
  selection?: PartialHighlight;
}

export const PDFReader: React.FC<PDFReaderProps> = ({
  url,
  highlights = [],
  selection,
}) => {
  const [disableInteractions, setDisableInteractions] = useState(false);
  const [pdfDocument, setPDFDocument] = useState<PDFDocument | null>(null);
  const [currentSelection, setCurrentSelection] =
    useState<PartialHighlight | null>(null);
  const [inprogressSelection, setInprogressSelection] =
    useState<PartialHighlight | null>(null);

  const pdfDocumentRef = useRef(pdfDocument);
  pdfDocumentRef.current = pdfDocument;

  const inprogressSelectionRef = useRef(inprogressSelection);
  inprogressSelectionRef.current = inprogressSelection;

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
    const highlight: PartialHighlight = {
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
    };

    console.log("set in progress");
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
    const highlight: PartialHighlight = {
      location: {
        boundingRect: viewportRectToScaledPageRect(
          { ...boundingRect, pageNumber: page.number },
          viewport
        ),
        rects: [],
        pageNumber: page.number,
      },
      content: { image },
    };

    setCurrentSelection(highlight);
  };

  const shouldStartAreaSelection = (event: MouseEvent): boolean => {
    return (
      event.altKey &&
      isHTMLElement(event.target) &&
      Boolean(asElement(event.target).closest(".page"))
    );
  };

  const renderPageLayers = (allHighlights: PartialHighlight[]): PageLayer[] => {
    const highlightsByPage = groupHighlightsByPage(allHighlights);

    let highlightLayer: PageLayer = {
      name: "annotationLayer",
      className: "mix-blend-multiply",
      pages: [],
    };

    // iterate by all pages and render highlights for every page
    for (const [key, pageHighlights] of Object.entries(highlightsByPage)) {
      const pageNumber = Number(key);

      const viewport = pdfDocument?.getPageView(pageNumber)?.viewport;
      if (!viewport) continue;

      const element = (
        <>
          {pageHighlights.map((highlight, index) => (
            <PdfHighlight
              index={index}
              highlight={highlight}
              isScrolledTo={false}
              viewport={viewport}
            ></PdfHighlight>
          ))}
        </>
      );

      highlightLayer.pages.push({ pageNumber, element });
    }

    return [highlightLayer];
  };

  let allHighlights: PartialHighlight[] = [...highlights];
  if (currentSelection) allHighlights.push(currentSelection);

  useEffect(() => {}, [highlights]);

  useEffect(() => {}, [selection, currentSelection]);

  return (
    <PDFLoader
      url={url}
      showDocument={(document) => (
        <PDFViewer
          pdfDocument={document}
          disableInteractions={disableInteractions}
          onDocumentReady={setPDFDocument}
          onRangeSelection={onRangeSelection}
          onKeyDown={(event) => {
            if (event.code === "Escape") setCurrentSelection(null);
            if (event.code === "Enter") {
              setCurrentSelection(inprogressSelectionRef.current);
            }
          }}
          onMouseDown={(event) => {
            if (!isHTMLElement(event.target)) return;

            const element = asElement(event.target);
          }}
          pageLayers={renderPageLayers(allHighlights)}
        >
          <MouseSelection
            className="absolute mix-blend-multiply border-dashed border-2 bg-yellow-200"
            onDragStart={() => {
              console.log("drag start");
              setDisableInteractions(true);
            }}
            onDragEnd={() => {
              console.log("drag end");
              setDisableInteractions(false);
            }}
            shouldStart={shouldStartAreaSelection}
            onSelection={onMouseSelection}
          />
        </PDFViewer>
      )}
      showLoader={() => <a>Loading...</a>}
    ></PDFLoader>
  );
};
