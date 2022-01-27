import React, { useEffect } from "react";
import useState from "react-usestateref";

import { PDFDocumentProxy } from "pdfjs-dist";

import { Highlight, HighlightColor, NewHighlight } from "~/types";
import { clearRangeSelection } from "~/lib/dom-utils";

import { PDFLoader } from "./PdfLoader";
import { PDFHighlighter } from "./PdfHighlighter";
import { ActionButton, Sidebar, SidebarContent } from "./PdfControls";
import { PDFViewerProxy, ScrollPosition } from "./PdfDisplay";
import { HighlightListView } from "./HighlightListView";
import { PdfPageThumbnails } from "./PdfPageThumbnails";
import { PdfOutlineListView } from "./PdfOutlineListView";

let s4 = () => {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
};

export interface PDFReaderProps {
  className?: string;
  url: string;
}

export const PDFReader: React.FC<PDFReaderProps> = ({
  className = "",
  url,
}) => {
  const [highlights, setHighlights, highlightsRef] = useState<Highlight[]>([]);
  const [_, setInProgressHighlight, inProgressHighlightRef] =
    useState<NewHighlight | null>(null);
  const [selectedHighlight, setSelectedHighlight, selectedHighlightRef] =
    useState<string>();
  const [scrollToHighlight, setScrollToHighlight] = useState<string>();
  const [scrollToListViewHighlight, setScrollToListViewHighlight] =
    useState<string>();
  const [scrollToPage, setScrollToPage] = useState<number>();
  const [scrollToPosition, setScrollToPosition] = useState<ScrollPosition>();
  const [enableAreaSelection, setEnableAreaSelection] = useState<boolean>(true);
  const [areaSelectActive, setAreaSelectActive] = useState<boolean>(false);
  const [highlightColor, setHighlightColor] = useState<HighlightColor>(
    HighlightColor.YELLOW
  );
  const [pdfScaleValue, setPdfScaleValue] = useState("auto");
  const [pdfDocument, setPdfDocument] = useState<PDFDocumentProxy | null>(null);
  const [_pdfViewer, setPdfViewer] = useState<PDFViewerProxy | null>(null);
  const [scale, setScale] = useState<number>();

  const clearAreaSelection = () => {
    if (enableAreaSelection) {
      setEnableAreaSelection(false);
      setTimeout(() => setEnableAreaSelection(true), 0);
    }
  };

  const clearSelection = () => {
    clearRangeSelection();
    clearAreaSelection();
  };

  const createHighlight = (highlight: NewHighlight): void => {
    highlight.id = s4();

    setSelectedHighlight(highlight.id);
    setHighlights([...highlightsRef.current, highlight as Highlight]);

    clearSelection();
    setInProgressHighlight(null);
  };

  const deleteHighlight = (id: string): void => {
    const newHighlights = highlightsRef.current.filter((h) => h.id !== id);

    setSelectedHighlight(undefined);
    setHighlights(newHighlights);
  };

  const onHighlightUpdated = (highlight: Highlight): void => {
    const newHighlights = [...highlights];
    const idx = newHighlights.findIndex((h) => h.id === highlight.id);

    newHighlights[idx] = highlight;

    setSelectedHighlight(highlight.id);
    setHighlights(newHighlights);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    switch (event.code) {
      case "Escape":
        clearSelection();
        break;
      case "Enter":
        console.log("here");
        if (inProgressHighlightRef.current) {
          createHighlight(inProgressHighlightRef.current);
        }

        break;
      case "Delete":
        if (selectedHighlightRef.current) {
          deleteHighlight(selectedHighlightRef.current);
        }

        break;
    }
  };

  useEffect(() => {
    if (scrollToPage) {
      setScrollToHighlight(undefined);
      setScrollToPosition({ pageNumber: scrollToPage });
    }
  }, [scrollToPage]);

  useEffect(() => {
    if (scrollToHighlight) {
      setScrollToPage(undefined);
      setScrollToPosition(undefined);
    }
  }, [scrollToHighlight]);

  useEffect(() => {
    if (selectedHighlight) setScrollToListViewHighlight(selectedHighlight);
  }, [selectedHighlight]);

  const sidebar = (
    <Sidebar
      onTabChange={() => {
        if (selectedHighlight) {
          setScrollToListViewHighlight(undefined);
          setTimeout(() => setScrollToListViewHighlight(selectedHighlight), 0);
        }
      }}
      content={{
        pages: pdfDocument && (
          <PdfPageThumbnails
            pdfDocument={pdfDocument}
            onPageClick={setScrollToPage}
          />
        ),
        annotations: (
          <HighlightListView
            highlights={highlights}
            scrollToHighlight={scrollToListViewHighlight}
            selectedHighlight={selectedHighlight}
            onHighlightClicked={(h) => {
              setScrollToHighlight(h.id);
            }}
            onHighlightDeleteClicked={(h) => deleteHighlight(h.id)}
            onHighlightEditClicked={(h) => {
              setScrollToHighlight(h.id);
              setSelectedHighlight(h.id);
            }}
            onHighlightPageClicked={(h) => {
              setScrollToPage(h.location.pageNumber);
            }}
          />
        ),
        bookmarks: <></>,
        outline: pdfDocument && (
          <PdfOutlineListView
            document={pdfDocument}
            onOutlineNodeClicked={setScrollToPosition}
          />
        ),
      }}
    />
  );

  return (
    <div className={className}>
      <SidebarContent sidebar={sidebar}>
        <ActionButton
          bottom={20}
          right={25}
          onColorSelect={setHighlightColor}
          onSelectMode={setAreaSelectActive}
          onScaleValueChange={setPdfScaleValue}
          scale={scale}
        />

        <PDFLoader
          url={url}
          onDocument={setPdfDocument}
          showDocument={(document) => (
            <PDFHighlighter
              pdfDocument={document}
              highlights={highlights}
              selectedHighlight={selectedHighlight}
              scrollTo={scrollToPosition}
              scrollToHighlight={scrollToHighlight}
              enableAreaSelection={enableAreaSelection}
              areaSelectionActive={areaSelectActive}
              pdfScaleValue={pdfScaleValue}
              highlightColor={highlightColor}
              // event handlers
              onHighlighting={setInProgressHighlight}
              onHighlightUpdated={onHighlightUpdated}
              onHighlightClicked={(h) => setSelectedHighlight(h.id)}
              onDocumentReady={setPdfViewer}
              onKeyDown={onKeyDown}
              onScaleChanging={(e) => setScale(e.scale)}
            />
          )}
        />
      </SidebarContent>
    </div>
  );
};
