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
  SelectionTooltip,
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

  // whether to select highlight on highlight creation
  selectOnCreate?: boolean;

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
  selectOnCreate = false,

  onHighlightCreate,
  onHighlightUpdate = () => null,
  onTitleChange,
  onClose,
}) => {
  const [inProgressHighlight, setInProgressHighlight, inProgressHighlightRef] =
    useState<PDFHighlight>();
  const [selectedHighlight, setSelectedHighlight, selectedHighlightRef] =
    useState<PDFHighlight>();
  const [scrollToHighlight, setScrollToHighlight] = useState<PDFHighlight>();
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
    setSelectedHighlight(undefined);
  };

  const createHighlight = (highlight?: PDFHighlight): void => {
    if (!highlight) return;

    // create a new highlight and mark it as selected
    onHighlightCreate(highlight);

    if (selectOnCreate) {
      setSelectedHighlight(highlight);
    } else {
      setSelectedHighlight(undefined);
    }

    // clear selection and in progress highlight
    clearSelection();
    setInProgressHighlight(undefined);
  };

  const deleteHighlight = (highlight?: PDFHighlight): void => {
    if (!highlight) return;

    // unselect highlight
    setSelectedHighlight(undefined);

    // mark highlight as deleted
    onHighlightUpdate({ ...highlight, deleted: true });
  };

  const updateHighlight = (highlight?: PDFHighlight): void => {
    if (!highlight) return;

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
  }, [selectedHighlight]);

  useEffect(() => setIsDarkReader(isDarkMode), [isDarkMode]);

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
      onRemoveClicked={() => deleteHighlight(selectedHighlight)}
    />
  );

  const selectionTooltip = (
    <SelectionTooltip onClick={() => createHighlight(inProgressHighlight)} />
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
        enableAreaSelection={enableAreaSelection}
        pdfScaleValue={pdfScaleValue}
        highlightColor={highlightColor}
        enableDarkMode={isDarkReader}
        highlightTooltip={highlightTooltip}
        selectionTooltip={selectionTooltip}
        // event handlers
        onHighlighting={setInProgressHighlight}
        onHighlightUpdated={updateHighlight}
        onHighlightClicked={setSelectedHighlight}
        onDocumentReady={setPdfViewer}
        onKeyDown={onKeyDown}
        onScaleChanging={(e) => setScale(e.scale)}
        onPageScroll={() => {
          setScrollToHighlight(undefined);
          setScrollToPosition(undefined);
        }}
      />
    </Drawer>
  );
};
