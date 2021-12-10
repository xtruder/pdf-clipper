import React, { useEffect, useMemo, useState } from "react";
import ReactDom from "react-dom";

import { PDFDocumentProxy } from "pdfjs-dist";
import {
  EventBus,
  PDFViewer as PDFJSViewer,
  PDFLinkService,
  NullL10n,
} from "pdfjs-dist/web/pdf_viewer";

import { PartialHighlight, Highlight, PageView } from "~/types";
import { findOrCreateContainerLayer } from "~/lib/pdfjs-dom";
import { groupHighlightsByPage } from "~/lib/highlights";
import { pageAreaToViewport } from "~/lib/coordinates";

type PdfViewerProps = {
  pdfDocument: PDFDocumentProxy;
  highlights: Highlight[];
  scrollToHighlight?: Highlight | null;
  renderHighlight: (args: {
    index: number;
    highlight: PartialHighlight;
    isScrolledTo: boolean;
    pageView: PageView;
  }) => JSX.Element;
};

export const PDFViewer: React.FC<PdfViewerProps> = ({
  pdfDocument,
  highlights = [],
  renderHighlight,
  scrollToHighlight = null,
}) => {
  // current pdf document that we are displaying
  const [currentPdfDocument, setCurrentPdfDocument] =
    useState<PDFDocumentProxy>();

  // current highlight that are bing displayed
  const [currentHighlights, setCurrentHighlights] = useState(highlights);

  // singleton instances
  const eventBus = useMemo(() => new EventBus(), []);
  const linkService = useMemo(
    () =>
      new PDFLinkService({
        eventBus,
        externalLinkTarget: 2,
      }),
    []
  );

  // PDFJS viewer which is loaded
  const [viewer, setViewer] = useState<PDFJSViewer>();

  // Observer for
  const [resizeObserver, setResizeObserver] = useState<ResizeObserver>();
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [unsubscribe, setUnsubscribe] = useState(() => () => {});
  const [ghostHighlight, setGhostHighlight] = useState<PartialHighlight>();
  const [scrolledToHighlight, setScrolledToHighlight] =
    useState<Highlight | null>(scrollToHighlight);
  const [documentIsReady, setDocumentIsReady] = useState(false);

  const getPageView = (pageNumber: number): PageView =>
    viewer!.getPageView(pageNumber - 1);

  const findOrCreateHighlightLayer = (page: number) => {
    const { textLayer } = viewer?.getPageView(page - 1) || {};

    if (!textLayer) {
      return null;
    }

    return findOrCreateContainerLayer(
      textLayer.textLayerDiv,
      "PdfHighlighter__highlight-layer"
    );
  };

  const renderHighlights = () => {
    const highlightsByPage = groupHighlightsByPage(highlights);

    for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber++) {
      const highlightLayer = findOrCreateHighlightLayer(pageNumber);

      if (!highlightLayer) {
        continue;
      }

      const pageHighlights = highlightsByPage[pageNumber] || [];

      ReactDom.render(
        <div>
          {pageHighlights.map((highlight, index) => {
            const pageView = viewer?.getPageView(pageNumber - 1);
            const isScrolledTo = scrolledToHighlight?.id === highlight.id;

            return renderHighlight({
              index,
              highlight,
              isScrolledTo,
              pageView,
            });
          })}
        </div>,
        highlightLayer
      );
    }
  };

  const onScroll = () => {
    setScrolledToHighlight(null);
    viewer?.container.removeEventListener("scroll", onScroll);
  };

  // scrolls to highlight
  const scrollTo = (highlight: Highlight) => {
    const { pageNumber, boundingArea, usePdfCoordinates } = highlight.location;

    const pageViewport = getPageView(pageNumber).viewport;

    const boundingAreaViewport = pageAreaToViewport(
      boundingArea,
      pageViewport,
      usePdfCoordinates
    );

    const scrollMargin = 10;
    const top = boundingAreaViewport.top - scrollMargin;

    viewer?.container.removeEventListener("scroll", onScroll);

    viewer?.scrollPageIntoView({
      pageNumber,
      destArray: [
        null,
        {},
        { name: "XYZ" },
        ...pageViewport.convertToPdfPoint(0, top),
      ],
    });

    setScrolledToHighlight(highlight);

    // wait for scroll to finish to add scroll event listener
    setTimeout(
      () => viewer?.container.addEventListener("scroll", onScroll),
      100
    );
  };

  const onTextLayerRendered = () => renderHighlights();

  const onDocumentReady = () => setDocumentIsReady(true);

  const attachRef = (ref: HTMLDivElement | null) => {
    setContainer(ref);
    unsubscribe();

    if (!ref) return;

    const { ownerDocument: doc } = ref;

    eventBus.on("textlayerrendered", onTextLayerRendered);
    eventBus.on("pagesinit", onDocumentReady);

    doc.addEventListener("selectionchange", onSelectionChange);
    doc.addEventListener("keydown", handleKeyDown);
    doc.defaultView?.addEventListener("resize", debouncedScaleValue);

    resizeObserver?.observe(ref);

    // set method to unsubscribe listeners, when component will unmount
    setUnsubscribe(() => {
      setDocumentIsReady(false);

      eventBus.off("pagesinit", onDocumentReady);
      eventBus.off("textlayerrendered", onTextLayerRendered);

      doc.removeEventListener("selectionchange", onSelectionChange);
      doc.removeEventListener("keydown", handleKeyDown);

      doc.defaultView?.removeEventListener("resize", debouncedScaleValue);

      resizeObserver?.disconnect();
    });
  };

  // scroll to highlight when document is ready and scrollToHighlight is set
  // or has changed
  useEffect(() => {
    if (
      documentIsReady &&
      scrollToHighlight &&
      scrolledToHighlight?.id !== scrollToHighlight.id
    ) {
      scrollTo(scrollToHighlight);
    }
  }, [documentIsReady, scrollToHighlight]);

  // when scrolled to different highlight re-render highlights
  useEffect(
    () => renderHighlights(),
    [pdfDocument, highlights, scrolledToHighlight]
  );

  // reload document if pdf document changes
  useEffect(() => {
    if (pdfDocument === currentPdfDocument) return;

    let _viewer = viewer;

    if (!_viewer) {
      if (!container) return;

      _viewer = new PDFJSViewer({
        container,
        eventBus,
        //enhanceTextSelection: true,
        removePageBorders: true,
        linkService,
        renderer: "canvas",
        l10n: NullL10n,
      });

      setViewer(_viewer);
    }

    linkService.setDocument(pdfDocument);
    linkService.setViewer(_viewer);

    _viewer.setDocument(pdfDocument);
  }, [currentPdfDocument]);

  // unsubscribe when unmounting the element
  useEffect(() => () => unsubscribe(), []);

  return (
    <div>
      <div ref={attachRef}></div>
    </div>
  );
};
