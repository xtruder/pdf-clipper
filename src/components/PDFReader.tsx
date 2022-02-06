import React, { useEffect } from "react";
import useState from "react-usestateref";

import { PDFDocumentProxy } from "pdfjs-dist";

import { clearRangeSelection } from "~/lib/dom";
import { resetValue } from "~/lib/react";

import { PDFHighlight, NewPDFHighlight, HighlightColor } from "~/models";

import { PDFHighlighter } from "./PDFHighlighter";
import { ActionButton, Sidebar, SidebarContent } from "./PDFControls";
import { PDFDisplayProxy, ScrollPosition } from "./PDFDisplay";
import { HighlightListView } from "./HighlightListView";
import { PDFPageThumbnails } from "./PDFPageThumbnails";
import { PDFOutlineListView } from "./PDFOutlineListView";

export interface PDFReaderProps {
  pdfDocument: PDFDocumentProxy;
  highlights: PDFHighlight[];
  className?: string;
  isDarkMode?: boolean;

  onHighlightCreate: (h: NewPDFHighlight) => PDFHighlight;
  onHighlightUpdate: (h: PDFHighlight) => void;
}

export const PDFReader: React.FC<PDFReaderProps> = ({
  pdfDocument,
  highlights = [],
  className = "",
  isDarkMode = false,

  onHighlightCreate,
  onHighlightUpdate = () => null,
}) => {
  const [currentHighlights, setCurrentHighlights, currentHighlightsRef] =
    useState<PDFHighlight[]>([]);
  const [_, setInProgressHighlight, inProgressHighlightRef] =
    useState<NewPDFHighlight>();
  const [selectedHighlight, setSelectedHighlight, selectedHighlightRef] =
    useState<PDFHighlight>();
  const [scrollToHighlight, setScrollToHighlight] = useState<PDFHighlight>();
  const [scrollToListViewHighlight, setScrollToListViewHighlight] =
    useState<PDFHighlight>();
  const [scrollToPage, setScrollToPage] = useState<number>();
  const [scrollToPosition, setScrollToPosition] = useState<ScrollPosition>();
  const [enableAreaSelection, setEnableAreaSelection] = useState<boolean>(true);
  const [areaSelectActive, setAreaSelectActive] = useState<boolean>(false);
  const [highlightColor, setHighlightColor] = useState<HighlightColor>(
    HighlightColor.YELLOW
  );
  const [pdfScaleValue, setPdfScaleValue] = useState("auto");
  const [_pdfViewer, setPdfViewer] = useState<PDFDisplayProxy>();
  const [scale, setScale] = useState<number>();
  const [isDarkReader, setIsDarkReader] = useState<boolean>(isDarkMode);

  const clearAreaSelection = () => {
    if (!enableAreaSelection) return;
    resetValue(setEnableAreaSelection, false, true);
  };

  // clears range and area selection
  const clearSelection = () => {
    clearRangeSelection();
    clearAreaSelection();
  };

  const createHighlight = (newHighlight: NewPDFHighlight): void => {
    const highlight = onHighlightCreate(newHighlight);

    setCurrentHighlights([...currentHighlightsRef.current, highlight]);
    setSelectedHighlight(highlight);

    clearSelection();
    setInProgressHighlight(undefined);
  };

  const deleteHighlight = (highlight: PDFHighlight): void => {
    const newHighlights = currentHighlightsRef.current.filter(
      (h) => h.id !== highlight.id
    );

    highlight.deleted = true;

    onHighlightUpdate(highlight);
    setCurrentHighlights(newHighlights);
    setSelectedHighlight(undefined);
  };

  const updateHighlight = (highlight: PDFHighlight): void => {
    const newHighlights = currentHighlightsRef.current.map((h) =>
      h.id === highlight.id ? highlight : h
    );

    onHighlightUpdate(highlight);
    setCurrentHighlights(newHighlights);
    setSelectedHighlight(highlight);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    switch (event.code) {
      case "Escape":
        clearSelection();
        break;
      case "Enter":
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

  // sync input highlights with current highlights
  useEffect(() => {
    const currentHighlights = [...currentHighlightsRef.current];

    for (const highlight of highlights) {
      const idx = currentHighlights.findIndex((h) => highlight.id === h.id);

      if (idx > -1) {
        currentHighlights[idx] = highlight;
      } else if (idx > -1 && highlight.deleted) {
        delete currentHighlights[idx];
      } else {
        currentHighlights.push(highlight);
      }
    }

    setCurrentHighlights(currentHighlights);
  }, [highlights]);

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

  useEffect(() => {
    setIsDarkReader(isDarkMode);
  }, [isDarkMode]);

  const sidebar = (
    <Sidebar
      onTabChange={() => {
        if (selectedHighlight)
          resetValue(
            setScrollToListViewHighlight,
            undefined,
            selectedHighlight
          );
      }}
      content={{
        pages: pdfDocument && (
          <PDFPageThumbnails
            pdfDocument={pdfDocument}
            onPageClick={setScrollToPage}
          />
        ),
        annotations: (
          <HighlightListView
            highlights={currentHighlights}
            scrollToHighlight={scrollToListViewHighlight}
            selectedHighlight={selectedHighlight}
            onHighlightClicked={setScrollToHighlight}
            onHighlightDeleteClicked={deleteHighlight}
            onHighlightEditClicked={(h) => {
              setScrollToHighlight(h);
              setSelectedHighlight(h);
            }}
            onHighlightPageClicked={(h) =>
              setScrollToPage(h.location.pageNumber)
            }
          />
        ),
        outline: pdfDocument && (
          <PDFOutlineListView
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
          scale={scale}
          isDark={isDarkMode}
          onColorSelect={setHighlightColor}
          onSelectMode={setAreaSelectActive}
          onScaleValueChange={setPdfScaleValue}
          onDarkChange={setIsDarkReader}
        />

        <PDFHighlighter
          pdfDocument={pdfDocument}
          highlights={currentHighlights}
          selectedHighlight={selectedHighlight}
          scrollTo={scrollToPosition}
          scrollToHighlight={scrollToHighlight}
          enableAreaSelection={enableAreaSelection}
          areaSelectionActive={areaSelectActive}
          pdfScaleValue={pdfScaleValue}
          highlightColor={highlightColor}
          isDarkReader={isDarkReader}
          // event handlers
          onHighlighting={setInProgressHighlight}
          onHighlightUpdated={updateHighlight}
          onHighlightClicked={setSelectedHighlight}
          onDocumentReady={setPdfViewer}
          onKeyDown={onKeyDown}
          onScaleChanging={(e) => setScale(e.scale)}
        />
      </SidebarContent>
    </div>
  );
};
