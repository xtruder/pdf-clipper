import React, { useCallback, useEffect } from "react";
import useState from "react-usestateref";
import { FullScreen } from "@chiragrupani/fullscreen-react";

import { useAtom, useAtomValue } from "jotai";

import { clearRangeSelection } from "~/lib/dom";
import { resetValue } from "~/lib/utils";

import {
  PDFHighlighter,
  PDFHighlight,
  PDFActionButton,
  PDFHighlightTooltip,
  PDFSidebar,
  PDFDrawer,
  PDFSidebarNavbar,
  PDFSelectionTooltip,
  PDFDisplayProxy,
  PDFScrollPosition,
  DocumentOutlineView,
  PDFPageThumbnails,
  HighlightCardList,
  HighlightColor,
} from "@pdf-clipper/components";

import { documentAtom, documentHighlightsAtom, pdfLoaderAtom } from "~/state";
import { HighlightCardContainer } from "./HighlightCardContainer";

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
  const [{ meta }, setDocument] = useAtom(documentAtom(documentId));

  // load pdf document
  const pdfDocument = useAtomValue(pdfLoaderAtom(documentId));
  useEffect(() => () => pdfLoaderAtom.remove(documentId), [documentId]);

  let { title, description, outline } = meta;

  const [highlights, dispatchHighligt] = useAtom(
    documentHighlightsAtom(documentId)
  );

  let pdfHighlights = highlights.map<PDFHighlight>((h) => ({
    id: h.id,
    content: h.content!,
    location: h.location!,
  }));

  const [inProgressHighlight, setInProgressHighlight, inProgressHighlightRef] =
    useState<PDFHighlight>();
  const [selectedHighlight, setSelectedHighlight, selectedHighlightRef] =
    useState<PDFHighlight>();
  const [scrollToHighlight, setScrollToHighlight] = useState<PDFHighlight>();
  const [scrollToListViewHighlight, setScrollToListViewHighlight] =
    useState<PDFHighlight>();
  const [scrollToPage, setScrollToPage] = useState<number>();
  const [scrollToPosition, setScrollToPosition] = useState<PDFScrollPosition>();
  const [enableAreaSelection, setEnableAreaSelection] = useState<boolean>(true);
  const [highlightColor, setHighlightColor] = useState<HighlightColor>(
    HighlightColor.YELLOW
  );
  const [pdfScaleValue, setPdfScaleValue] = useState("auto");
  const [_pdfViewer, setPdfViewer] = useState<PDFDisplayProxy>();
  const [scale, setScale] = useState<number>();
  const [isDarkReader, setIsDarkReader] = useState<boolean>(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // if highlight is selected use that one, instead of current one
  pdfHighlights = pdfHighlights.map((h) =>
    h.id === selectedHighlight?.id ? selectedHighlight : h
  );

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

  const createHighlight = useCallback(async (pdfHighlight?: PDFHighlight) => {
    if (!pdfHighlight) return;

    dispatchHighligt({
      action: "create",
      value: {
        id: pdfHighlight.id,
        documentType: "PDF",
        documentId,
        content: pdfHighlight.content,
        location: pdfHighlight.location,
      },
    });

    if (selectOnCreate) {
      setSelectedHighlight(pdfHighlight);
    } else {
      setSelectedHighlight(undefined);
    }

    // clear selection and in progress highlight
    clearSelection();
    setInProgressHighlight(undefined);
  }, []);

  const deleteHighlight = useCallback(async (pdfHighlight?: PDFHighlight) => {
    if (!pdfHighlight) return;

    // unselect highlight
    setSelectedHighlight(undefined);

    dispatchHighligt({ action: "remove", value: pdfHighlight.id });
  }, []);

  const updateHighlight = useCallback(async (pdfHighlight?: PDFHighlight) => {
    if (!pdfHighlight) return;

    // update selected highlight, so results immidiately reflect ui
    setSelectedHighlight(pdfHighlight);

    dispatchHighligt({
      action: "update",
      value: {
        id: pdfHighlight.id,
        documentType: "PDF",
        documentId,
        content: pdfHighlight.content,
        location: pdfHighlight.location,
        image: null,
      },
    });
  }, []);

  const changeTitle = (title: string) =>
    setDocument({ id: documentId, meta: { ...meta, title, description } });

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

  const sidebar = (
    <PDFSidebar
      header={
        <PDFSidebarNavbar
          title={title ?? ""}
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
          <PDFPageThumbnails
            pdfDocument={pdfDocument}
            thumbWidth={300}
            onPageClick={setScrollToPage}
          />
        ),
        highlights: (
          <HighlightCardList>
            {pdfHighlights.map((h) => (
              <HighlightCardContainer
                key={h.id}
                documentId={documentId}
                highlightId={h.id}
                selected={h.id === selectedHighlight?.id}
                scrollIntoView={h.id === scrollToListViewHighlight?.id}
                onClicked={() => setScrollToHighlight(h)}
                onDeleteClicked={() => deleteHighlight(h)}
                onEditClicked={() => {
                  setScrollToHighlight(h);
                  setSelectedHighlight(h);
                }}
                onPageClicked={() => setScrollToPage(h.location.pageNumber)}
              />
            ))}
          </HighlightCardList>
        ),
        outline: outline ? (
          <DocumentOutlineView
            outline={outline}
            onOutlineNodeClicked={(position) =>
              setScrollToPosition({
                pageNumber: position.pageNumber!,
                destArray: position.location,
              })
            }
          />
        ) : null,
      }}
    />
  );

  const highlightTooltip = (
    <PDFHighlightTooltip
      onRemoveClicked={() => deleteHighlight(selectedHighlight)}
    />
  );

  const selectionTooltip = (
    <PDFSelectionTooltip onClick={() => createHighlight(inProgressHighlight)} />
  );

  return (
    <FullScreen isFullScreen={isFullScreen} onChange={setIsFullScreen}>
      <PDFDrawer sidebar={sidebar} className={className}>
        <PDFActionButton
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
          highlights={pdfHighlights}
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
      </PDFDrawer>
    </FullScreen>
  );
};
