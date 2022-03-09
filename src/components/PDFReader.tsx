import React, { useEffect } from "react";
import useState from "react-usestateref";

import { PDFDocumentProxy } from "pdfjs-dist";

import { clearRangeSelection } from "~/lib/dom";
import { resetValue } from "~/lib/react";

import { PDFHighlight, HighlightColor } from "~/models";

import { PDFHighlighter } from "./PDFHighlighter";
import {
  ActionButton,
  HighlightTooltip,
  Sidebar,
  Drawer,
  SidebarNavbar,
} from "./PDFControls";
import { PDFDisplayProxy, ScrollPosition } from "./PDFDisplay";
import { HighlightListView } from "./HighlightListView";
import { PDFPageThumbnails } from "./PDFPageThumbnails";
import { PDFOutlineListView } from "./PDFOutlineListView";

export interface PDFReaderProps {
  pdfDocument: PDFDocumentProxy;
  title?: string;
  highlights: PDFHighlight[];
  className?: string;
  isDarkMode?: boolean;

  onHighlightCreate: (h: PDFHighlight) => void;
  onHighlightUpdate: (h: PDFHighlight) => void;
  onTitleChange?: (title: string) => void;
  onClose?: () => void;
}

export const PDFReader: React.FC<PDFReaderProps> = ({
  pdfDocument,
  title,
  highlights = [],
  className = "",
  isDarkMode = false,

  onHighlightCreate,
  onHighlightUpdate = () => null,
  onTitleChange,
  onClose,
}) => {
  const [_, setInProgressHighlight, inProgressHighlightRef] =
    useState<PDFHighlight>();
  const [selectedHighlight, setSelectedHighlight, selectedHighlightRef] =
    useState<PDFHighlight>();
  const [scrollToHighlight, setScrollToHighlight] = useState<PDFHighlight>();
  const [tooltipedHighlight, setTooltipedHighlight] = useState<PDFHighlight>();
  const [scrollToListViewHighlight, setScrollToListViewHighlight] =
    useState<PDFHighlight>();
  const [scrollToPage, setScrollToPage] = useState<number>();
  const [scrollToPosition, setScrollToPosition] = useState<ScrollPosition>();
  const [enableAreaSelection, setEnableAreaSelection] = useState<boolean>(true);
  const [highlightColor, setHighlightColor] = useState<HighlightColor>(
    HighlightColor.YELLOW
  );
  const [pdfScaleValue, setPdfScaleValue] = useState("auto");
  const [_pdfViewer, setPdfViewer] = useState<PDFDisplayProxy>();
  const [scale, setScale] = useState<number>();
  const [isDarkReader, setIsDarkReader] = useState<boolean>(isDarkMode);

  const clearAreaSelection = () => {
    if (!enableAreaSelection) return;
    resetValue(setEnableAreaSelection, true);
  };

  // clears range and area selection
  const clearSelection = () => {
    clearRangeSelection();
    clearAreaSelection();
  };

  const createHighlight = (newHighlight: PDFHighlight): void => {
    clearSelection();
    setInProgressHighlight(undefined);

    onHighlightCreate(newHighlight);
    setSelectedHighlight(newHighlight);
  };

  const deleteHighlight = (highlight: PDFHighlight): void => {
    setSelectedHighlight(undefined);

    onHighlightUpdate({ ...highlight, deleted: true });
  };

  const updateHighlight = (highlight: PDFHighlight): void => {
    onHighlightUpdate(highlight);
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
    if (selectedHighlight) {
      setScrollToListViewHighlight(selectedHighlight);
    }

    setTooltipedHighlight(selectedHighlight);
  }, [selectedHighlight]);

  useEffect(() => {
    setIsDarkReader(isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    setTooltipedHighlight(inProgressHighlightRef.current);
  }, [inProgressHighlightRef.current]);

  const currentHighlights = highlights.filter((h) => !h.deleted);

  const sidebar = (
    <Sidebar
      header={
        <SidebarNavbar
          title={title}
          onTitleChange={onTitleChange}
          onBackClicked={onClose}
        />
      }
      onTabChange={() => {
        if (selectedHighlight)
          resetValue(setScrollToListViewHighlight, selectedHighlight);
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

  const highlightTooltip = (
    <HighlightTooltip
      onCloseClicked={() => {
        if (!tooltipedHighlight) return;

        if (tooltipedHighlight.id === inProgressHighlightRef.current?.id) {
          setTooltipedHighlight(undefined);
          clearSelection();
        } else {
          deleteHighlight(tooltipedHighlight);
        }
      }}
      onBookmarkClicked={() => {
        if (!inProgressHighlightRef.current) return;

        const highlight = inProgressHighlightRef.current;

        createHighlight(highlight);
      }}
    />
  );

  return (
    <Drawer sidebar={sidebar} className={className}>
      <ActionButton
        className="bottom-16 right-4 lg:right-12"
        scale={scale}
        isDark={isDarkMode}
        onColorSelect={setHighlightColor}
        onScaleValueChange={setPdfScaleValue}
        onDarkChange={setIsDarkReader}
      />

      <PDFHighlighter
        pdfDocument={pdfDocument}
        highlights={currentHighlights}
        selectedHighlight={selectedHighlight}
        scrollTo={scrollToPosition}
        scrollToHighlight={scrollToHighlight}
        tooltipedHighlight={tooltipedHighlight}
        enableAreaSelection={enableAreaSelection}
        pdfScaleValue={pdfScaleValue}
        highlightColor={highlightColor}
        isDarkReader={isDarkReader}
        highlightTooltip={highlightTooltip}
        // event handlers
        onHighlighting={setInProgressHighlight}
        onHighlightUpdated={updateHighlight}
        onHighlightClicked={setSelectedHighlight}
        onDocumentReady={setPdfViewer}
        onKeyDown={onKeyDown}
        onScaleChanging={(e) => setScale(e.scale)}
      />
    </Drawer>
  );
};
