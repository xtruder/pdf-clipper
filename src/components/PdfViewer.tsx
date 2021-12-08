import React, { MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import { debounce } from "lodash";

import { PDFDocumentProxy } from "pdfjs-dist";
import {
  EventBus,
  NullL10n,
  PDFLinkService,
  PDFViewer as PDFJSViewer,
} from "pdfjs-dist/web/pdf_viewer";

import { findOrCreateContainerLayer, getWindow } from "~/lib/pdfjs-dom";
import { PageView, Rect } from "~/types";
import { getCanvasAreaAsPNG } from "~/lib/dom-util";

import "pdfjs-dist/web/pdf_viewer.css";
import "./PdfViewer.css";
import ReactDOM from "react-dom";

interface ScrollPosition {
  pageNumber: number;
  top?: number;
}

export interface PageLayer {
  name: string;
  className?: string;
  pages: {
    pageNumber: number;
    element: JSX.Element;
  }[];
}

export interface PDFDocument {
  pdfDocument: PDFDocumentProxy;
  getPageView(pageNumber: number): PageView | null;
  screenshotPageArea(pageNumber: number, area: Rect): string | null;
}

export interface PDFViewerProps {
  pdfDocument: PDFDocumentProxy;
  pdfScaleValue?: string;
  children?: JSX.Element | null;
  scrollTo?: ScrollPosition;
  disableInteractions?: boolean;
  pageLayers?: PageLayer[];

  onDocumentReady(doc: PDFDocument): void;
  onTextLayerRendered(event: { pageNumber: number }): void;
  onKeyDown(event: KeyboardEvent): void;
  onMouseDown(event: MouseEvent): void;
  onRangeSelection(isCollapsed: boolean, range: Range | null): void;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({
  pdfDocument,
  pdfScaleValue = "auto",
  children = null,
  scrollTo,
  disableInteractions = false,
  pageLayers = [],

  onDocumentReady,
  onTextLayerRendered,
  onKeyDown,
  onMouseDown,
  onRangeSelection,
}) => {
  // current pdf document that we are displaying
  const [currentPdfDocument, setCurrentPdfDocument] =
    useState<PDFDocumentProxy>();

  const [scrolledTo, setScrolledTo] = useState<ScrollPosition | null>(null);
  const [renderedPages, setRenderedPages] = useState(new Set<number>());

  const pageLayersRef = useRef(pageLayers);
  pageLayersRef.current = pageLayers;

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

  // pdfjs container element ref
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleScaledValue = debounce(() => {
    if (!pdfViewer) return;
    if (isNaN(parseFloat(pdfScaleValue)) && pdfScaleValue !== "auto") return;

    pdfViewer.currentScaleValue = pdfScaleValue;
  }, 500);

  // Observer for document resizes
  const resizeObserver = useMemo<ResizeObserver | null>(() => {
    if (typeof ResizeObserver === "undefined") return null;
    else return new ResizeObserver(handleScaledValue);
  }, []);

  const getPageView = (pageNumber: number): PageView | null => {
    return pdfViewer!.getPageView(pageNumber - 1) || null;
  };

  // helper function to make a screeen of a page area
  const screenshotPageArea = (
    pageNumber: number,
    area: Rect
  ): string | null => {
    const page = getPageView(pageNumber);
    if (!page) return null;

    return getCanvasAreaAsPNG(page.canvas, area);
  };

  // when selected text on pdf has changed
  const onSelectionChanged = debounce(() => {
    const selection = getWindow(containerRef.current).getSelection();
    if (!selection) return;

    let range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
    let commonAncestorContainer = range?.commonAncestorContainer || null;

    if (!containerRef.current?.contains(commonAncestorContainer)) {
      range = null;
    }

    onRangeSelection(selection.isCollapsed, range);
  }, 10);

  const onScroll = () => null;

  const onPagesInit = () => {
    if (scrollTo) doScroll(scrollTo);
    onDocumentReady({ getPageView, screenshotPageArea, pdfDocument });
  };

  const textLayerRendered = (event: any) => {
    setRenderedPages((pages) => new Set([...pages, event.pageNumber]));
    onTextLayerRendered(event);
  };

  const doScroll = (position: ScrollPosition) => {
    if (!pdfViewer || !pdfViewer.container) return;

    const page = getPageView(position.pageNumber);
    if (!page) return;

    pdfViewer.scrollPageIntoView({
      pageNumber: position.pageNumber,
      destArray: [
        {},
        { name: "XYZ" },
        ...page.viewport.convertToPdfPoint(0, position.top || 0),
      ],
    });

    setScrolledTo(position);
  };

  const updatePageLayers = () => {
    if (!pdfViewer) return;

    for (const layer of pageLayers) {
      for (let pageNumber of renderedPages) {
        const page = getPageView(pageNumber);
        if (!page) continue;

        // adds div to page div for highlights
        const pageLayerDiv = findOrCreateContainerLayer<HTMLDivElement>(
          page.div,
          layer.name
        );
        if (!pageLayerDiv) return;

        pageLayerDiv.className = `${layer.name} absolute top-0 left-0 ${
          layer.className || ""
        }`;

        const layerPage = layer.pages.find((p) => p.pageNumber === pageNumber);
        ReactDOM.render(layerPage?.element || <></>, pageLayerDiv);
      }
    }
  };

  // observe resizes on container
  useEffect(() => {
    if (!containerRef.current) return;

    resizeObserver?.observe(containerRef.current);
    return () => resizeObserver?.disconnect();
  }, []);

  // initialize pdfjs viewer when pdf document changes
  useEffect(() => {
    if (!containerRef.current) return;
    if (pdfDocument === currentPdfDocument) return;

    const pdfViewer = new PDFJSViewer({
      container: containerRef.current,
      eventBus,
      textLayerMode: 2,
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
  }, [pdfDocument]);

  // init event listeners when pdfViewer changes
  useEffect(() => {
    if (!pdfViewer || !containerRef.current) return;

    const container = containerRef.current;
    const { ownerDocument: doc } = container;

    eventBus.on("textlayerrendered", textLayerRendered);
    eventBus.on("pagesinit", onPagesInit);

    doc.addEventListener("selectionchange", onSelectionChanged);
    doc.addEventListener("keydown", onKeyDown);
    doc.defaultView?.addEventListener("resize", handleScaledValue);

    container.addEventListener("scroll", onScroll);

    return () => {
      eventBus.off("pagesinit", onPagesInit);
      eventBus.off("textlayerrendered", onTextLayerRendered);

      doc.removeEventListener("selectionchange", onSelectionChanged);
      doc.removeEventListener("keydown", onKeyDown);
      doc.defaultView?.removeEventListener("resize", handleScaledValue);

      container.removeEventListener("scroll", onScroll);
    };
  }, [pdfViewer]);

  useEffect(() => {
    if (
      scrollTo &&
      (scrollTo.pageNumber !== scrolledTo?.pageNumber ||
        scrollTo.top !== scrolledTo?.top)
    ) {
      doScroll(scrollTo);
    }
  }, [scrollTo, scrolledTo]);

  useEffect(() => {
    if (!pdfViewer) return;
    if (pdfScaleValue === pdfViewer.currentScaleValue) return;

    handleScaledValue();
  }, [pdfScaleValue]);

  // update page layers when pageLayers change or list of rendered pages change
  useEffect(() => updatePageLayers(), [pageLayers, renderedPages]);

  const disableInteractionsClass = disableInteractions
    ? "select-none pointer-events-none"
    : "";

  return (
    <div onPointerDown={onMouseDown}>
      <div
        ref={containerRef}
        className={`absolute overflow-auto w-full h-full ${disableInteractionsClass}`}
      >
        <div className="pdfViewer" />
        {children}
      </div>
    </div>
  );
};
