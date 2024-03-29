import React, {
  MouseEventHandler,
  ReactElement,
  ReactNode,
  TouchEventHandler,
  useEffect,
  useMemo,
  useRef,
} from "react";
import ReactDOM from "react-dom";
import useState from "react-usestateref";
import { useEventListener } from "ahooks";
import { useDoubleTap } from "use-double-tap";
import useMergedRef from "@react-hook/merged-ref";

import debounce from "just-debounce-it";

import { GlobalWorkerOptions, PDFDocumentProxy } from "pdfjs-dist";
import {
  EventBus,
  NullL10n,
  PDFLinkService,
  PDFViewer,
  PageView,
} from "pdfjs-dist/web/pdf_viewer";

import { getWindow, asElement } from "../lib/dom";
import { findOrCreateContainerLayer } from "../lib/pdfjs";

// import worker src to set for pdfjs global worker options
import workerSrc from "pdfjs-dist/build/pdf.worker.min.js?url";

GlobalWorkerOptions.workerSrc = workerSrc;

import "pdfjs-dist/web/pdf_viewer.css";
import "./PDFDisplay.css";

export interface PDFScrollPosition {
  pageNumber: number;
  top?: number;
  left?: number;
  destArray?: any[];
}

export interface PDFLayerPageProps {
  pageNumber: number;
  children: ReactNode;
}

export const PDFLayerPage: React.FC<PDFLayerPageProps> = ({ children }) => (
  <>{children}</>
);

export interface PDFLayerProps {
  layerName: string;
  className?: string;
  children: ReactElement<PDFLayerPageProps>[] | ReactElement<PDFLayerPageProps>;
}

export const PDFLayer: React.FC<PDFLayerProps> = () => <></>;

interface PDFDisplayEvents {
  onDisplayReady?: (viewer: PDFViewer) => void;
  onTextLayerRendered?: (event: { pageNumber: number }) => void;
  onKeyDown?: (event: KeyboardEvent) => void;
  onRangeSelection?: (isCollapsed: boolean, range: Range | null) => void;
  onPageScroll?: (position: PDFScrollPosition) => void;
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
  scrollTo?: PDFScrollPosition | null;
  layers?: ReactElement<PDFLayerProps>[];

  // whether dark mode is enabled
  enableDarkMode?: boolean;

  // whether to disable all interactions
  disableInteractions?: boolean;

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
  scrollTo = null,
  layers = [],
  enableDarkMode = false,
  disableInteractions = false,
  disableTextDoubleClick = false,

  onDisplayReady,
  onTextLayerRendered,
  onKeyDown,
  onRangeSelection,
  onPageScroll,
  onScaleChanging,
  onSingleTap,
  onDoubleTap,
}) => {
  // current pdf document that we are displaying
  const [currentPdfDocument, setCurrentPdfDocument] =
    useState<PDFDocumentProxy>();

  const [scrolledTo, setScrolledTo] = useState<PDFScrollPosition>();
  const [renderedPages, setRenderedPages] = useState(new Set<number>());

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

  // when selected text on pdf has changed
  const onSelectionChanged = () => {
    const selection = getWindow(containerRef.current).getSelection();
    if (!selection) return;

    let range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
    let commonAncestorContainer = range?.commonAncestorContainer || null;

    if (!containerRef.current?.contains(commonAncestorContainer)) {
      range = null;
    }

    onRangeSelection?.(selection.isCollapsed, range);
  };

  const onScroll = () => {
    if (!pdfViewerRef.current) return;

    setScrolledTo(undefined);
    onPageScroll?.({
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

    const rect = containerRef.current.getBoundingClientRect();

    const dx = startX - rect.left;
    const dy = startY - rect.top;

    containerRef.current.scrollLeft += dx * ((pinchScale || 1) - 1);
    containerRef.current.scrollTop += dy * ((pinchScale || 1) - 1);

    setPinchZoomState(undefined);
  };

  const onPagesInit = () => {
    onDisplayReady?.(pdfViewerRef.current!);

    if (scrollTo) doScroll(scrollTo);
  };

  const textLayerRendered = (event: {
    pageNumber: number;
    source: {
      textLayerDiv: HTMLDivElement;
      textDiv: HTMLDivElement[];
    };
  }) => {
    setRenderedPages((pages) => new Set([...pages, event.pageNumber]));
    onTextLayerRendered?.(event);
  };

  const doScroll = (position: PDFScrollPosition) => {
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

    /**
     * Create pdfViewer DIV element where viewer will be rendered
     *
     * NOTE: this DIV cannot be created with react, as if PDFDisplay element
     * gets re-mounted, there is no way to cleanup previous pdfjs render, but
     * react will not recreate DOM tree, so existing rendered pages will be
     * present. The easiest way is to resolve this is to create pdfViewer DIV
     * manually and cleanup on unmount
     */
    const pdfViewerDiv = document.createElement("div");
    pdfViewerDiv.className = "pdfViewer";
    containerRef.current.appendChild(pdfViewerDiv);

    const pdfViewer = new PDFViewer({
      container: containerRef.current,
      viewer: pdfViewerDiv,
      eventBus,
      textLayerMode: 1,
      removePageBorders: true,
      linkService,
      l10n: NullL10n,
      annotationMode: 2,
      maxCanvasPixels: -1,
      useOnlyCssZoom: false,
    });

    linkService.setViewer(pdfViewer);
    linkService.setDocument(pdfDocument);

    pdfViewer.setDocument(pdfDocument);

    setCurrentPdfDocument(pdfDocument);
    setPDFViewer(pdfViewer);

    return () => {
      // not sure this is needed
      pdfViewer.cleanup();

      // remove viewer element from DOM
      pdfViewerDiv.remove();
    };
  }, [pdfDocument]);

  // init event listeners when pdfViewer changes
  useEffect(() => {
    eventBus.on("textlayerrendered", textLayerRendered);
    eventBus.on("pagesinit", onPagesInit);
    eventBus.on("scalechanging", (e: any) => onScaleChanging?.(e));

    return () => {
      eventBus.off("pagesinit", onPagesInit);
      eventBus.off("textlayerrendered", (e: any) => onTextLayerRendered?.(e));
      eventBus.off("scalechanging", (e: any) => onScaleChanging?.(e));
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

  useEffect(() => {
    pdfViewer?.viewer?.classList.toggle("select-none", disableInteractions);
    pdfViewer?.viewer?.classList.toggle("touch-none", disableInteractions);
    pdfViewer?.viewer?.classList.toggle(
      "pointer-events-none",
      disableInteractions
    );
  }, [disableInteractions, pdfViewer]);

  // add event handlers for selection and resize
  const doc = containerRef.current?.ownerDocument;
  useEventListener("selectionchange", onSelectionChanged, { target: doc });
  useEventListener("keydown", (e) => onKeyDown?.(e), { target: doc });
  useEventListener("resize", handleScaledValue, {
    target: doc?.defaultView,
  });

  const doubleTapProps = useDoubleTap((e) => onDoubleTap?.(e), 250, {
    onSingleTap,
  });

  return (
    <div className={`${className} h-full`}>
      <div
        ref={
          _containerRef
            ? useMergedRef(containerRef, _containerRef)
            : (containerRef as any)
        }
        className={`pdfViewerContainer absolute overflow-y-scroll w-full h-full
          ${enableDarkMode ? "pdfViewerContainerDark" : ""}
          ${containerClassName}`}
        onScroll={onScroll}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        {...doubleTapProps}
      >
        {/** React must not change this div, as it is being rendered by pdfjs */}
        {/* <div className="pdfViewer" /> */}

        {containerChildren}
      </div>

      {layers
        .map(({ props: { layerName, className, children: pages } }) =>
          [...renderedPages].map((pageNumber) => {
            const pageView = getPageView(pageNumber);
            if (!pageView) return <></>;

            const allPages = Array.isArray(pages)
              ? pages
              : pages
              ? [pages]
              : [];
            const pageChild = allPages.find(
              (page) => page.props.pageNumber === pageNumber
            );

            return (
              <PDFPageLayerContainer
                key={`${layerName}-${pageNumber}`}
                pageView={pageView}
                layerName={layerName}
                className={className}
                children={pageChild}
              />
            );
          })
        )
        .flat()}

      {children}
    </div>
  );
};

const PDFPageLayerContainer: React.FC<{
  pageView: PageView;
  layerName: string;
  className?: string;
  children: ReactNode;
}> = ({ pageView, layerName, className = "", children }) => {
  const pageLayerDiv = findOrCreateContainerLayer<HTMLDivElement>(
    pageView.div,
    layerName
  );

  if (!pageLayerDiv) return <></>;

  pageLayerDiv.style.position = "absolute";
  pageLayerDiv.style.top = "0px";
  pageLayerDiv.style.left = "0px";
  pageLayerDiv.style.width =
    pageView.textLayer?.textLayerDiv.style.width || "0";
  pageLayerDiv.style.height =
    pageView.textLayer?.textLayerDiv.style.height || "0";

  pageLayerDiv.className = `${layerName} ${className}`;

  if (!pageLayerDiv) return <></>;

  return ReactDOM.createPortal(children, pageLayerDiv);
};
