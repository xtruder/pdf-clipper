import React, { useEffect } from "react";
import useState from "react-usestateref";
import { useRecoilState, useRecoilValue } from "recoil";
import { FullScreen } from "@chiragrupani/fullscreen-react";
import { clearRangeSelection } from "~/lib/dom";
import { resetValue } from "~/lib/react";

import { useStateCtx } from "~/state/state";
import { PDFHighlight, HighlightColor } from "~/models";

import { PDFHighlighter } from "~/components/PDFHighlighter";
import {
  ActionButton,
  HighlightTooltip,
  Sidebar,
  Drawer,
  SidebarNavbar,
  SelectionTooltip,
} from "~/components/PDFControls";
import { PDFDisplayProxy, ScrollPosition } from "~/components/PDFDisplay";
import { DocumentOutlineView } from "~/components/DocumentOutlineView";
import { PageThumbnailsContainer } from "./PageThumbnailsContainer";
import { HighlightListContainer } from "./HighlightListContainer";

export interface PDFReaderProps {
  documentId: string;
  className?: string;
  isDarkMode?: boolean;

  // whether to select highlight on highlight creation
  selectOnCreate?: boolean;
  onClose?: () => void;
}

export const PDFReader: React.FC<PDFReaderProps> = ({
  documentId,
  className = "",
  onClose,
  isDarkMode = false,
  selectOnCreate = true,
}) => {
  const { currentAccount, documentInfo, documentHighlights, pdfDocumentProxy } =
    useStateCtx();

  const [docInfo, setDocInfo] = useRecoilState(documentInfo(documentId));
  if (!documentInfo) throw new Error("Missing document");

  const pdfDocument = useRecoilValue(pdfDocumentProxy(documentId));
  if (!pdfDocument) throw new Error("Missing document");

  const account = useRecoilValue(currentAccount);

  const [highlights, setHighlights] = useRecoilState(
    documentHighlights(documentId)
  );

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
  const [isDarkReader, setIsDarkReader] = useState<boolean>(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

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

    highlight.meta = {
      owner: account.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setHighlights((highlights) => [...highlights, highlight]);

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

    setHighlights((highlights) =>
      highlights.map((h) =>
        h.id === highlight.id ? { ...highlight, deleted: true } : h
      )
    );
  };

  const updateHighlight = (highlight?: PDFHighlight): void => {
    if (!highlight) return;

    // update existing highlight
    setHighlights((highlights) =>
      highlights.map((h) => (h.id === highlight.id ? highlight : h))
    );
  };

  const changeTitle = (title: string): void =>
    setDocInfo((docInfo) => ({ ...docInfo, title }));

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
          title={docInfo.title}
          onTitleChange={changeTitle}
          onBackClicked={onClose}
        />
      }
      onTabChange={() => {
        if (selectedHighlight)
          resetValue(setScrollToListViewHighlight, selectedHighlight);
      }}
      content={{
        pages: (
          <PageThumbnailsContainer
            documentId={documentId}
            onPageClick={setScrollToPage}
          />
        ),
        highlights: (
          <HighlightListContainer
            documentId={documentId}
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
        outline: docInfo.outline ? (
          <DocumentOutlineView
            outline={docInfo.outline}
            onOutlineNodeClicked={(position) =>
              setScrollToPosition({
                pageNumber: position.pageNumber!,
                destArray: position.location,
              })
            }
          />
        ) : (
          <></>
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
    <FullScreen isFullScreen={isFullScreen} onChange={setIsFullScreen}>
      <Drawer sidebar={sidebar} className={className}>
        <ActionButton
          className="bottom-10 right-6 lg:right-12"
          scale={scale}
          isDark={isDarkMode}
          onColorSelect={setHighlightColor}
          onScaleValueChange={setPdfScaleValue}
          onDarkChange={setIsDarkReader}
          onFullScreen={() => setIsFullScreen(!isFullScreen)}
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
    </FullScreen>
  );
};
