import React, { useEffect, useMemo, useRef, useState, MouseEvent } from "react";
import ReactDom from "react-dom";
import debounce from "lodash.debounce";

import { PDFDocumentProxy } from "pdfjs-dist";
import {
  EventBus,
  PDFViewer as PDFJSViewer,
  PDFLinkService,
  NullL10n,
} from "pdfjs-dist/web/pdf_viewer";

import { PartialHighlight, Highlight, PageView, Rect, PageRect } from "~/types";
import {
  asElement,
  findOrCreateContainerLayer,
  getPageFromElement,
  getPagesFromRange,
  getWindow,
  isHTMLElement,
} from "~/lib/pdfjs-dom";
import { groupHighlightsByPage } from "~/lib/highlights";
import {
  scaledRectToViewportRect,
  getHighlightedRectsWithinPages,
  getBoundingRectForRects,
  viewportRectToScaledPageRect,
} from "~/lib/coordinates";
import { MouseSelection } from "./MouseSelection";
import { getCanvasAreaAsPNG } from "~/lib/dom-util";
import { TipContainer } from "./TipContainer";
import { PdfHighlight, PdfHighlightProps } from "./PdfHighlight";

type RangeSelection = {
  range: Range | null;
  isCollapsed: boolean;
};

type HighlightTip = {
  boundingRect: PageRect;
  highlight: PartialHighlight;
  children: JSX.Element | null;
};

interface PdfViewerHandlers {
  onSelectionFinished(
    highlight: PartialHighlight,
    handlers: {
      hideTipAndSelection: () => void;
      transformSelection: () => void;
    }
  ): JSX.Element | null;

  // onESCKeyPressed is triggered if esc key is pressed.
  // This is usually used to cancel current selection.
  onESCKeyPressed(): void;

  // onClickedOutsideSelection is triggered if mouse click is done outside
  // the selection box.
  // This is usually used to cancel current selection.
  onClickedOutsideSelection(): void;

  onDocumentReady(helpers: {
    getPageView(pageNumber: number): PageView | undefined;
    screenshotPageArea(pageNumber: number, area: Rect): string | null;
  }): void;
}

interface PDFHighlighterProps extends PdfViewerHandlers {
  pdfDocument: PDFDocumentProxy;
  pdfScaleValue: string;

  // list of existing highlights
  highlights?: Highlight[];

  // selection is a highlight that is still in progress of selecting
  selection?: PartialHighlight;

  // id of highlight that we should scroll to
  scrollToHighlightId?: string;

  pdfHighlightComponent: React.FC<PdfHighlightProps>;
}

export const PDFHighlighter: React.FC<PDFHighlighterProps> = ({
  pdfDocument,
  highlights = [],
  selection = null,
  scrollToHighlightId = null,
  pdfScaleValue = "auto",
  pdfHighlightComponent: PdfHighlightComponent = PdfHighlight,

  onSelectionFinished,
  onESCKeyPressed,
  onClickedOutsideSelection,
}) => {
  // current pdf document that we are displaying
  const [currentPdfDocument, setCurrentPdfDocument] =
    useState<PDFDocumentProxy>();

  // keep current scrolled to highlight id
  const [scrolledToHighlightId, setScrolledToHighlightId] =
    useState(scrollToHighlightId);

  const // pdfjs EventBus, PDFLinkService, and viewer itself
    eventBus = useMemo(() => new EventBus(), []),
    linkService = useMemo(
      () =>
        new PDFLinkService({
          eventBus,
          externalLinkTarget: 2,
        }),
      []
    ),
    [pdfViewer, setPDFViewer] = useState<PDFJSViewer>();

  const // pdfjs state vars
    [documentIsReady, setDocumentIsReady] = useState(false),
    [textLayerIsRendered, setTextLayerIsRendered] = useState(false);

  // pdfjs container element ref
  const containerRef = useRef<HTMLDivElement | null>(null);

  // state variables for keeping current selection
  const [rangeSelection, setRangeSelection] = useState<RangeSelection>({
    range: null,
    isCollapsed: true,
  });

  const [highlightTip, setHighlightTip] = useState<HighlightTip | null>(null);

  const handleScaledValue: () => void = debounce(() => {
    if (!pdfViewer) return;
    pdfViewer.currentScaleValue = pdfScaleValue;
  }, 500);

  // Observer for document resizes
  const resizeObserver = useMemo<ResizeObserver | null>(() => {
    if (typeof ResizeObserver === "undefined") return null;
    else return new ResizeObserver(handleScaledValue);
  }, []);

  // util methods
  const utils = {
    getPageView(pageNumber: number): PageView | null {
      return pdfViewer!.getPageView(pageNumber - 1) || null;
    },

    // finds existing or creates a new highlight layer for pdfjs page
    findOrCreateHighlightLayer(pageNumber: number): Element | null {
      const page = utils.getPageView(pageNumber);
      if (!page || !page.textLayer) return null;

      // adds div to text layer for highlights
      return findOrCreateContainerLayer(
        page.textLayer.textLayerDiv,
        "PdfHighlighter__highlight-layer"
      );
    },

    // scrolls to highlight
    scrollToHighlight(highlightId: string) {
      if (!pdfViewer || !pdfViewer.container) return;

      const highlight = highlights.find((h) => h.id == highlightId);

      if (!highlight) return;

      const onScroll = () => {
        setScrolledToHighlightId(null);
        pdfViewer.container.removeEventListener("scroll", onScroll);
      };

      const { pageNumber, boundingRect, usePdfCoordinates } =
        highlight.location;

      const page = utils.getPageView(pageNumber);
      if (!page) return;

      const boundingViewportRect = scaledRectToViewportRect(
        boundingRect,
        page.viewport,
        usePdfCoordinates
      );

      const scrollMargin = 10;
      const top = boundingViewportRect.top - scrollMargin;

      pdfViewer.container.removeEventListener("scroll", onScroll);

      pdfViewer.scrollPageIntoView({
        pageNumber,
        destArray: [
          null,
          {},
          { name: "XYZ" },
          ...page.viewport.convertToPdfPoint(0, top),
        ],
      });

      setScrolledToHighlightId(highlight.id);

      // wait for scroll to finish to add scroll event listener
      setTimeout(
        () => pdfViewer.container.addEventListener("scroll", onScroll),
        100
      );
    },

    // helper function to make a screeen of a page area
    screenshotPageArea(pageNumber: number, area: Rect): string | null {
      const page = utils.getPageView(pageNumber);
      if (!page) return null;

      return getCanvasAreaAsPNG(page.canvas, area);
    },

    // initializes pdfjs viewer, links it with pdf link service and sets document
    initPDFJsViewer() {
      if (pdfDocument === currentPdfDocument) return;

      const pdfViewer = new PDFJSViewer({
        container: containerRef.current!,
        eventBus,
        //enhanceTextSelection: true,
        removePageBorders: true,
        linkService,
        renderer: "canvas",
        l10n: NullL10n,
      });

      linkService.setDocument(pdfDocument);
      linkService.setViewer(pdfViewer);

      pdfViewer.setDocument(pdfDocument);

      setCurrentPdfDocument(pdfDocument);
      setPDFViewer(pdfViewer);
    },

    // init event listeners initializes listeners on event bus and document
    initEventListeners() {
      // when selected text on pdf has changed
      const onSelectionChanged = () => {
        const selection = getWindow(containerRef.current).getSelection();
        if (!selection) return;

        let range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
        let commonAncestorContainer = range?.commonAncestorContainer || null;

        if (!containerRef.current?.contains(commonAncestorContainer)) {
          range = null;
        }

        setRangeSelection({
          isCollapsed: selection.isCollapsed,
          range,
        });
      };

      // when text layer is rendered
      const onTextLayerRendered = () => setTextLayerIsRendered(true);

      // when document gets ready
      const onDocumentReady = () => setDocumentIsReady(true);

      const onKeyDown = (event: KeyboardEvent) => {
        if (event.code === "Escape") onESCKeyPressed();
      };

      if (!pdfViewer || !containerRef.current) return;

      const { ownerDocument: doc } = containerRef.current;

      eventBus.on("textlayerrendered", onTextLayerRendered);
      eventBus.on("pagesinit", onDocumentReady);

      doc.addEventListener("selectionchange", onSelectionChanged);
      doc.addEventListener("keydown", onKeyDown);
      doc.defaultView?.addEventListener("resize", handleScaledValue);

      // remove event listeners on changes
      return () => {
        setDocumentIsReady(false);
        setTextLayerIsRendered(false);

        eventBus.off("pagesinit", onDocumentReady);
        eventBus.off("textlayerrendered", onTextLayerRendered);

        doc.removeEventListener("selectionchange", onSelectionChanged);
        doc.removeEventListener("keydown", onKeyDown);

        doc.defaultView?.removeEventListener("resize", handleScaledValue);
      };
    },
  };

  // Event handler methods
  const events = {
    onRangeSelected(range: Range) {
      // get pages from selected range
      const pages = getPagesFromRange(range);
      if (pages.length === 0) return;

      // get highlighted rects within pages
      const rects = getHighlightedRectsWithinPages(range, pages);
      if (rects.length === 0) return;

      // get rect bounding all the rects
      const boundingRect = getBoundingRectForRects(rects);

      const pageNumber = pages[0].number;
      const page = utils.getPageView(pageNumber)!;

      // create a new highlight
      const highlight: PartialHighlight = {
        location: {
          boundingRect: viewportRectToScaledPageRect(
            boundingRect,
            page.viewport
          ),
          rects: rects.map((rect) =>
            viewportRectToScaledPageRect(rect, page.viewport)
          ),
          pageNumber,
        },
        content: {
          text: range.toString(),
        },
      };

      setHighlightTip({
        boundingRect: boundingRect,
        highlight,
        children: onSelectionFinished(highlight, {
          hideTipAndSelection: () => utils.hideTipAndSelection(),
          transformSelection: () => setCurrentSelection(highlight),
        }),
      });
    },

    onPointerDown(event: MouseEvent) {
      if (!isHTMLElement(event.target)) return;

      const element = asElement(event.target);

      if (element.closest("")) return;

      onClickedOutsideSelection();
    },
  };

  // Renderer Methods
  const renderers = {
    // renders highlights for all pages to pdfjs highlight layer
    renderHighlights() {
      let allHighlights: PartialHighlight[] = highlights;
      if (selection) allHighlights.push(selection);

      const highlightsByPage = groupHighlightsByPage(allHighlights);

      // iterate by all pages and render highlights for every page
      for (const [key, pageHighlights] of Object.entries(highlightsByPage)) {
        const pageNumber = Number(key);

        const highlightLayer = utils.findOrCreateHighlightLayer(pageNumber);
        const viewport = utils.getPageView(pageNumber)?.viewport;

        if (!highlightLayer || !viewport) continue;

        // render highlights for a page
        ReactDom.render(
          <div>
            {pageHighlights.map((highlight, index) => (
              <PdfHighlightComponent
                index={index}
                highlight={highlight}
                isScrolledTo={scrolledToHighlightId === highlight.id}
                viewport={viewport}
              />
            ))}
          </div>,
          highlightLayer
        );
      }
    },

    renderTip(): JSX.Element | undefined {
      if (!highlightTip?.children || !pdfViewer) return;

      const { boundingRect, children } = highlightTip;

      const // page number and div
        pageNumber = boundingRect.pageNumber,
        pageDiv = utils.getPageView(pageNumber)!.div;

      const // tip position
        left = pageDiv.offsetLeft + boundingRect.left + boundingRect.width / 2,
        top = pageDiv.offsetTop + boundingRect.top,
        bottom = pageDiv.offsetTop + boundingRect.top + boundingRect.height;

      return (
        <TipContainer
          scrollTop={pdfViewer.container.scrollTop}
          boundingRect={pageDiv.getBoundingClientRect()}
          style={{ left, top, bottom }}
        >
          {children}
        </TipContainer>
      );
    },

    renderMouseSelection(): JSX.Element {
      const toggleTextSelection = (flag: boolean) =>
        pdfViewer?.viewer?.classList.toggle(
          "PdfViewer--disable-selection",
          flag
        );

      return (
        <MouseSelection
          className="border-dashed border-2 bg-dark-100"
          containerClassName="w-100 h-100 bg-light-50"
          onDragStart={() => toggleTextSelection(true)}
          onDragEnd={() => toggleTextSelection(false)}
          shouldStart={(event) =>
            isHTMLElement(event.target) &&
            Boolean(asElement(event.target).closest(".page"))
          }
          onSelection={(start, end, boundingRect, resetSelection) => {
            const page = getPageFromElement(start.target);
            if (!page) return;

            const viewport = utils.getPageView(page.number)!.viewport;

            const pageBoundingRect = {
              ...boundingRect,
              top: boundingRect.top - page.node.offsetTop,
              left: boundingRect.left - page.node.offsetLeft,
              pageNumber: page.number,
            };

            // create image of selection
            const image = utils.screenshotPageArea(
              page.number,
              pageBoundingRect
            );

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

            setHighlightTip({
              highlight,
              boundingRect: pageBoundingRect,
              children: onSelectionFinished(highlight, {
                hideTipAndSelection: () => utils.hideTipAndSelection(),
                transformSelection: () => setCurrentSelection(highlight),
              }),
            });
          }}
        ></MouseSelection>
      );
    },
  };

  // Effect Handlers
  {
    // observe resizes on container
    useEffect(() => {
      if (!containerRef.current) return;

      resizeObserver?.observe(containerRef.current);
      return () => resizeObserver?.disconnect();
    }, []);

    // initialize pdfjs viewer when pdf document changes
    useEffect(utils.initPDFJsViewer, [pdfDocument]);

    // initi event listeners when pdfViewer changes
    useEffect(utils.initEventListeners, [pdfViewer]);

    // when pdf document is ready handle scale value
    useEffect(() => {
      if (documentIsReady) handleScaledValue();
    }, [documentIsReady]);

    // scroll to highlight when document is ready and scrollToHighlight is set
    // or has changed
    useEffect(() => {
      if (
        documentIsReady &&
        scrollToHighlightId &&
        scrolledToHighlightId !== scrollToHighlightId
      )
        utils.scrollToHighlight(scrollToHighlightId);
    }, [documentIsReady, scrollToHighlightId]);

    // render highlights on events
    useEffect(() => {
      if (!currentPdfDocument || !textLayerIsRendered) return;
      debounce(() => renderers.renderHighlights(), 50);
    }, [textLayerIsRendered, scrolledToHighlightId, selection]);

    // when range or isCollapsed changes, selection has changed
    useEffect(
      () =>
        debounce(() => {
          if (rangeSelection.isCollapsed || !rangeSelection.range) return;
          else events.onRangeSelected(rangeSelection.range);
        }, 500),
      [rangeSelection]
    );
  }

  return (
    <div onPointerDown={events.onPointerDown}>
      <div ref={containerRef} onContextMenu={(e) => e.preventDefault()}>
        <div>
          <div className="pdfViewer" />
          {renderers.renderTip()}
          {renderers.renderMouseSelection()}
        </div>
      </div>
    </div>
  );
};
