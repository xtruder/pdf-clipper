import React, { MouseEvent, useEffect, useMemo, useRef } from "react";
import useState from "react-usestateref";
import ReactDOM from "react-dom";
import debounce from "lodash.debounce";

import { PDFDocumentProxy } from "pdfjs-dist";
import {
  EventBus,
  NullL10n,
  PDFLinkService,
  PDFViewer,
} from "pdfjs-dist/web/pdf_viewer";

import { Rect, getWindow, getCanvasAreaAsPNG } from "~/lib/dom";
import { PageView, Viewport, findOrCreateContainerLayer } from "~/lib/pdfjs";

import "pdfjs-dist/web/pdf_viewer.css";
import "./PDFDisplay.css";

export interface ScrollPosition {
  pageNumber: number;
  top?: number;
  destArray?: any[];
}

export interface PageLayer {
  name: string;
  className?: string;
  pages: {
    pageNumber: number;
    element: JSX.Element | ((viewport: Viewport) => JSX.Element);
  }[];
}

export interface PDFDisplayProxy {
  pdfDocument: PDFDocumentProxy;
  currentScale: number;
  getPageView(pageNumber: number): PageView | null;
  screenshotPageArea(pageNumber: number, area: Rect): string | null;
}

interface PDFDisplayEvents {
  onDocumentReady?: (viewer: PDFDisplayProxy) => void;
  onTextLayerRendered?: (event: { pageNumber: number }) => void;
  onKeyDown?: (event: KeyboardEvent) => void;
  onMouseDown?: (event: MouseEvent) => void;
  onMouseUp?: (event: MouseEvent) => void;
  onRangeSelection?: (isCollapsed: boolean, range: Range | null) => void;
  onPageScroll?: (position: ScrollPosition) => void;
  onScaleChanging?: (event: { scale: number; presetValue: string }) => void;
}

export interface PDFDisplayProps extends PDFDisplayEvents {
  className?: string;
  containerClassName?: string;
  pdfDocument: PDFDocumentProxy;
  pdfScaleValue?: string;
  children?: JSX.Element | null;
  containerChildren?: JSX.Element | null;
  scrollTo?: ScrollPosition;
  disableInteractions?: boolean;
  pageLayers?: PageLayer[];
}

export const PDFDisplay: React.FC<PDFDisplayProps> = ({
  className = "",
  containerClassName = "",
  pdfDocument,
  pdfScaleValue = "auto",
  children = null,
  containerChildren = null,
  scrollTo,
  disableInteractions = false,
  pageLayers = [],

  onDocumentReady = () => null,
  onTextLayerRendered = () => null,
  onKeyDown = () => null,
  onMouseUp = () => null,
  onMouseDown = () => null,
  onRangeSelection = () => null,
  onPageScroll = () => null,
  onScaleChanging = () => null,
}) => {
  // current pdf document that we are displaying
  const [currentPdfDocument, setCurrentPdfDocument] =
    useState<PDFDocumentProxy>();

  const [scrolledTo, setScrolledTo] = useState<ScrollPosition | null>(null);
  const [renderedPages, setRenderedPages] = useState(new Set<number>());

  const pageLayersRef = useRef(pageLayers);
  pageLayersRef.current = pageLayers;

  const eventBus = useMemo(() => new EventBus(), []);
  const linkService = useMemo(
    () =>
      new PDFLinkService({
        eventBus,
        externalLinkTarget: 2,
      }),
    []
  );
  const [pdfViewer, setPDFViewer, pdfViewerRef] = useState<PDFViewer>();

  // pdfjs container element ref
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleScaledValue = debounce(() => {
    if (!pdfViewerRef.current) return;

    pdfViewerRef.current.currentScaleValue = pdfScaleValue;
  }, 500);

  // Observer for document resizes
  const resizeObserver = useMemo<ResizeObserver | null>(() => {
    if (typeof ResizeObserver === "undefined") return null;
    else return new ResizeObserver(handleScaledValue);
  }, []);

  const getPageView = (pageNumber: number): PageView | null => {
    return pdfViewerRef.current!.getPageView(pageNumber - 1) || null;
  };

  // helper function to make a screeen of a page area
  const screenshotPageArea = (
    pageNumber: number,
    area: Rect
  ): string | null => {
    const page = getPageView(pageNumber);
    if (!page || !page.canvas) return null;

    return getCanvasAreaAsPNG(page.canvas, area);
  };

  // when selected text on pdf has changed
  const onSelectionChanged = () => {
    const selection = getWindow(containerRef.current).getSelection();
    if (!selection) return;

    let range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
    let commonAncestorContainer = range?.commonAncestorContainer || null;

    if (!containerRef.current?.contains(commonAncestorContainer)) {
      range = null;
    }

    onRangeSelection(selection.isCollapsed, range);
  };

  const onScroll = (_scroll: any) => {
    if (!pdfViewerRef.current) return;

    onPageScroll({
      pageNumber: pdfViewerRef.current.currentPageNumber,
      top: pdfViewerRef.current.scroll.lastY,
    });
  };

  const onPagesInit = () => {
    onDocumentReady({
      getPageView,
      screenshotPageArea,
      pdfDocument,
      get currentScale(): number {
        return pdfViewerRef.current!.currentScale;
      },
    });

    if (scrollTo) doScroll(scrollTo);
  };

  const textLayerRendered = (event: any) => {
    setRenderedPages((pages) => new Set([...pages, event.pageNumber]));
    onTextLayerRendered(event);
  };

  const doScroll = (position: ScrollPosition) => {
    if (!pdfViewerRef.current || !pdfViewerRef.current?.container) return;

    let destArray = position.destArray;

    if (!destArray && position.top) {
      const page = getPageView(position.pageNumber);
      if (!page) return;

      destArray = [
        {},
        { name: "XYZ" },
        ...page.viewport.convertToPdfPoint(0, position.top || 0),
      ];
    }

    pdfViewerRef.current.scrollPageIntoView({
      pageNumber: position.pageNumber,
      destArray,
    });

    setScrolledTo(position);
  };

  const updatePageLayers = () => {
    if (!pdfViewer) return;

    for (const layer of pageLayers) {
      for (let pageNumber of renderedPages) {
        const pageView = getPageView(pageNumber);
        if (!pageView) continue;

        // adds div to page div for highlights
        const pageLayerDiv = findOrCreateContainerLayer<HTMLDivElement>(
          pageView.div,
          layer.name
        );
        if (!pageLayerDiv) return;

        pageLayerDiv.className = `${layer.name} absolute top-0 left-0 ${
          layer.className || ""
        }`;

        const layerPage = layer.pages.find((p) => p.pageNumber === pageNumber);

        let element = layerPage?.element || <></>;
        if (typeof element === "function") {
          element = element(pageView.viewport);
        }

        ReactDOM.render(element, pageLayerDiv);
      }
    }
  };

  // observe resizes on container
  useEffect(() => {
    if (!containerRef.current) return;

    resizeObserver?.observe(containerRef.current);
    return () => resizeObserver?.disconnect();
  }, [containerRef]);

  // initialize pdfjs viewer when pdf document changes
  useEffect(() => {
    if (!containerRef.current) return;
    if (pdfDocument === currentPdfDocument) return;

    const _pdfViewer = new PDFViewer({
      container: containerRef.current,
      eventBus,
      textLayerMode: 1,
      removePageBorders: true,
      linkService,
      renderer: "canvas",
      l10n: NullL10n,
    });

    linkService.setDocument(pdfDocument);
    linkService.setViewer(_pdfViewer);

    _pdfViewer.setDocument(pdfDocument);

    setCurrentPdfDocument(pdfDocument);
    setPDFViewer(_pdfViewer);
  }, [pdfDocument]);

  // init event listeners when pdfViewer changes
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const { ownerDocument: doc } = container;

    eventBus.on("textlayerrendered", textLayerRendered);
    eventBus.on("pagesinit", onPagesInit);
    eventBus.on("scalechanging", onScaleChanging);

    doc.addEventListener("selectionchange", onSelectionChanged);
    doc.addEventListener("keydown", onKeyDown);
    doc.defaultView?.addEventListener("resize", handleScaledValue);

    container.addEventListener("scroll", onScroll);

    return () => {
      eventBus.off("pagesinit", onPagesInit);
      eventBus.off("textlayerrendered", onTextLayerRendered);
      eventBus.off("scalechanging", onScaleChanging);

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
        scrollTo.top !== scrolledTo?.top ||
        scrollTo.destArray !== scrolledTo.destArray)
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
  useEffect(
    () => updatePageLayers(),
    [pageLayers, renderedPages, pdfScaleValue]
  );

  useEffect(() => {
    pdfViewer?.viewer?.classList.toggle("select-none", disableInteractions);
    pdfViewer?.viewer?.classList.toggle("touch-none", disableInteractions);
    pdfViewer?.viewer?.classList.toggle(
      "pointer-events-none",
      disableInteractions
    );
  }, [disableInteractions, pdfViewer]);

  return (
    <div
      onPointerDown={onMouseDown}
      onPointerUp={onMouseUp}
      className={className}
    >
      <div
        ref={containerRef}
        className={`absolute overflow-auto w-full h-full ${containerClassName}`}
      >
        {/** React must not change this div, as it is being rendered by pdfjs */}
        <div className="pdfViewer" />

        {containerChildren}
      </div>

      {children}
    </div>
  );
};
