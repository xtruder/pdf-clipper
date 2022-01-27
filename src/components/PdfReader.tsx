import React from "react";
import useState from "react-usestateref";

import { Highlight, HighlightColor, NewHighlight } from "~/types";
import { clearRangeSelection } from "~/lib/dom-util";

import { PDFLoader } from "./PdfLoader";
import { PDFHighlighter } from "./PdfHighlighter";
import { ActionButton, Sidebar, SidebarContent } from "./PdfControls";
import { PDFViewerProxy } from "./PdfDisplay";
import { HighlightListView } from "./HighlightListView";
import { useEffect } from "react";

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
  const [enableAreaSelection, setEnableAreaSelection] = useState<boolean>(true);
  const [areaSelectActive, setAreaSelectActive] = useState<boolean>(false);
  const [highlightColor, setHighlightColor] = useState<HighlightColor>(
    HighlightColor.YELLOW
  );
  const [pdfScaleValue, setPdfScaleValue] = useState("auto");
  const [pdfViewer, setPdfViewer] = useState<PDFViewerProxy | null>(null);
  const [scale, setScale] = useState<number>();
  const [showSidebar, setShowSidebar] = useState(false);

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
    if (scrollToPage) setScrollToHighlight(undefined);
  }, [scrollToPage]);

  useEffect(() => {
    if (scrollToHighlight) setScrollToPage(undefined);
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
              console.log("page clicked");
              setScrollToPage(h.location.pageNumber);
            }}
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
          showDocument={(document) => (
            <PDFHighlighter
              pdfDocument={document}
              highlights={highlights}
              selectedHighlight={selectedHighlight}
              scrollTo={scrollToPage ? { pageNumber: scrollToPage } : undefined}
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
