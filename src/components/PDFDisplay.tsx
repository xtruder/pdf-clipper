import React, {
  MouseEventHandler,
  ReactElement,
  ReactNode,
  TouchEventHandler,
  useEffect,
  useMemo,
  useRef,
} from "react";
import useState from "react-usestateref";
import useMergedRef from "@react-hook/merged-ref";
import ReactDOM from "react-dom";
import debounce from "lodash.debounce";
import useEvent from "@react-hook/event";
import { useDoubleTap } from "use-double-tap";

import { GlobalWorkerOptions, PDFDocumentProxy } from "pdfjs-dist";
import {
  EventBus,
  NullL10n,
  PDFLinkService,
  PDFViewer,
} from "pdfjs-dist/web/pdf_viewer";

import { Rect, getWindow, getCanvasAreaAsPNG, asElement } from "~/lib/dom";
import { PageView, Viewport, findOrCreateContainerLayer } from "~/lib/pdfjs";

// import worker src to set for pdfjs global worker options
import workerSrc from "pdfjs-dist/build/pdf.worker.min.js?url";

GlobalWorkerOptions.workerSrc = workerSrc;

import "pdfjs-dist/web/pdf_viewer.css";
import "./PDFDisplay.css";

export interface ScrollPosition {
  pageNumber: number;
  top?: number;
  left?: number;
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
  container: HTMLDivElement;
  getPageView(pageNumber: number): PageView | null;
  screenshotPageArea(pageNumber: number, area: Rect): string | null;
}

interface PDFDisplayEvents {
  onDocumentReady?: (viewer: PDFDisplayProxy) => void;
  onTextLayerRendered?: (event: { pageNumber: number }) => void;
  onKeyDown?: (event: KeyboardEvent) => void;
  onRangeSelection?: (isCollapsed: boolean, range: Range | null) => void;
  onPageScroll?: (position: ScrollPosition) => void;
  onScaleChanging?: (event: { scale: number; presetValue: string }) => void;
  onSingleTap?: MouseEventHandler;
  onDoubleTap?: MouseEventHandler;
}

export interface PDFDisplayProps extends PDFDisplayEvents {
  className?: string;
  containerRef?: React.ForwardedRef<HTMLElement>;
  containerClassName?: string;
  pdfDocument: PDFDocumentProxy;
  pdfScaleValue?: string;
  children?: JSX.Element | null;
  containerChildren?: JSX.Element | null;
  scrollTo?: ScrollPosition;

  // whether to disable all interactions
  disableInteractions?: boolean;
  pageLayers?: PageLayer[];
  isDarkReader?: boolean;

  // whether to disable double clicking text
  disableTextDoubleClick?: boolean;
}

export const PDFDisplay: React.FC<PDFDisplayProps> = ({
  className = "",
  containerRef: _containerRef,
  containerClassName = "",
  pdfDocument,
  pdfScaleValue = "auto",
  children = null,
  containerChildren = null,
  scrollTo,
  disableInteractions = false,
  pageLayers = [],
  isDarkReader = false,
  disableTextDoubleClick = false,

  onDocumentReady = () => null,
  onTextLayerRendered = () => null,
  onKeyDown = () => null,
  onRangeSelection = () => null,
  onPageScroll = () => null,
  onScaleChanging = () => null,
  onSingleTap = () => null,
  onDoubleTap = () => null,
}) => {
  // current pdf document that we are displaying
  const [currentPdfDocument, setCurrentPdfDocument] =
    useState<PDFDocumentProxy>();

  const [scrolledTo, setScrolledTo] = useState<ScrollPosition>();
  const [renderedPages, setRenderedPages] = useState(new Set<number>());

  const pageLayersRef = useRef(pageLayers);
  pageLayersRef.current = pageLayers;
  const [pinchZoomState, setPinchZoomState] = useState<{
    startX: number;
    startY: number;
    initialPitchDistance: number;
    pinchScale?: number;
  }>();

  // initialize pdfjs event bus and link service
  const eventBus = useMemo(() => new EventBus(), []);
  const linkService = useMemo(
    () =>
      new PDFLinkService({
        eventBus,
        externalLinkTarget: 2,
      }),
    [eventBus]
  );

  // pdf viewer element
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

  const onScroll = () => {
    if (!pdfViewerRef.current) return;

    setScrolledTo(undefined);
    onPageScroll({
      pageNumber: pdfViewerRef.current.currentPageNumber,
      top: containerRef.current?.scrollTop,
      left: containerRef.current?.scrollLeft,
    });
  };

  const onMouseDown: MouseEventHandler = (event) => {
    // if text double clicks are disabled and clicked within text layer
    // prevent default
    if (
      disableTextDoubleClick &&
      event.detail > 1 &&
      asElement(event.target).closest(".textLayer")
    )
      event.preventDefault();
  };

  const onTouchStart: TouchEventHandler = (event) => {
    if (event.touches.length < 2) return setPinchZoomState(undefined);

    setPinchZoomState({
      startX: (event.touches[0].pageX + event.touches[1].pageX) / 2,
      startY: (event.touches[0].pageY + event.touches[1].pageY) / 2,
      initialPitchDistance: Math.hypot(
        event.touches[1].pageX - event.touches[0].pageX,
        event.touches[1].pageY - event.touches[0].pageY
      ),
    });
  };

  const onTouchMove: TouchEventHandler = (event) => {
    if (!pdfViewer?.viewer) return;
    if (!pinchZoomState || event.touches.length < 2) return;

    let { startX, startY, initialPitchDistance, pinchScale } = pinchZoomState;

    const pinchDistance = Math.hypot(
      event.touches[1].pageX - event.touches[0].pageX,
      event.touches[1].pageY - event.touches[0].pageY
    );

    const originX = startX + (containerRef.current?.scrollLeft || 0);
    const originY = startY + (containerRef.current?.scrollTop || 0);

    pinchScale = pinchDistance / initialPitchDistance;

    const viewerEl = asElement(pdfViewer?.viewer);
    viewerEl.style.transform = `scale(${pinchScale})`;
    viewerEl.style.transformOrigin = `${originX}px ${originY}px`;

    setPinchZoomState({
      ...pinchZoomState,
      pinchScale,
    });
  };

  const onTouchEnd: TouchEventHandler = (_event) => {
    if (!pdfViewer?.viewer || !containerRef.current) return;
    if (!pinchZoomState) return;

    const { startX, startY, pinchScale } = pinchZoomState;

    const viewerEl = asElement(pdfViewer.viewer);
    viewerEl.style.transform = "none";
    viewerEl.style.transformOrigin = "unset";

    pdfViewer.currentScale *= pinchScale || 1;
    updatePageLayers();

    const rect = containerRef.current.getBoundingClientRect();

    const dx = startX - rect.left;
    const dy = startY - rect.top;

    containerRef.current.scrollLeft += dx * ((pinchScale || 1) - 1);
    containerRef.current.scrollTop += dy * ((pinchScale || 1) - 1);

    setPinchZoomState(undefined);
  };

  const onPagesInit = () => {
    onDocumentReady({
      container: containerRef.current!,
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
      textLayerMode: 2,
      removePageBorders: true,
      linkService,
      renderer: "canvas",
      l10n: NullL10n,
      annotationMode: 2,
      maxCanvasPixels: -1,
      useOnlyCssZoom: false,
    });

    linkService.setViewer(_pdfViewer);
    linkService.setDocument(pdfDocument);

    _pdfViewer.setDocument(pdfDocument);

    setCurrentPdfDocument(pdfDocument);
    setPDFViewer(_pdfViewer);
  }, [pdfDocument]);

  // init event listeners when pdfViewer changes
  useEffect(() => {
    eventBus.on("textlayerrendered", textLayerRendered);
    eventBus.on("pagesinit", onPagesInit);
    eventBus.on("scalechanging", onScaleChanging);

    return () => {
      eventBus.off("pagesinit", onPagesInit);
      eventBus.off("textlayerrendered", onTextLayerRendered);
      eventBus.off("scalechanging", onScaleChanging);
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
  }, [scrollTo]);

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

  // add event handlers for selection and resize
  const doc = containerRef.current?.ownerDocument || null;
  useEvent(doc, "selectionchange", onSelectionChanged);
  useEvent(doc, "keydown", onKeyDown);
  useEvent(doc?.defaultView || null, "resize", handleScaledValue);

  const doubleTapProps = useDoubleTap(onDoubleTap, 250, { onSingleTap });

  return (
    <div className={`${className} h-full`}>
      <div
        ref={
          _containerRef
            ? useMergedRef(containerRef, _containerRef)
            : containerRef
        }
        className={`pdfViewerContainer absolute overflow-y-scroll w-full h-full
          ${isDarkReader ? "pdfViewerContainerDark" : ""}
          ${containerClassName}`}
        onScroll={onScroll}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        {...doubleTapProps}
      >
        {/** React must not change this div, as it is being rendered by pdfjs */}
        <div className="pdfViewer" />

        {containerChildren}
      </div>

      {children}
    </div>
  );
};
