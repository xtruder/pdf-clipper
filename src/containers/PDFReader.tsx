import React, { useCallback, useEffect } from "react";
import useState from "react-usestateref";
import { suspend } from "suspend-react";
import { FullScreen } from "@chiragrupani/fullscreen-react";

import { clearRangeSelection } from "~/lib/dom";
import { resetValue } from "~/lib/react";

import { PDFHighlighter } from "~/components/pdf/PDFHighlighter";
import { HighlightColor, PDFHighlight } from "~/components/pdf/types";
import {
  ActionButton,
  HighlightTooltip,
  Sidebar,
  Drawer,
  SidebarNavbar,
  SelectionTooltip,
} from "~/components/pdf/PDFControls";
import { PDFDisplayProxy, ScrollPosition } from "~/components/pdf/PDFDisplay";
import { DocumentOutlineView } from "~/components/document/DocumentOutlineView";

import { getDocumentOutline, loadPDF } from "~/lib/pdfjs";

import { PDFPageThumbnails } from "~/components/pdf/PDFPageThubnailsView";
import {
  HighlightCard,
  HighlightCardList,
} from "~/components/highlights/HighlightCard";
import {
  useGetDocumentHighlights,
  useGetDocumentInfo,
  useUpsertDocument,
  useUpsertDocumentHighlight,
} from "~/graphql";

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
  // get document info from api
  const {
    file,
    meta: { title },
  } = useGetDocumentInfo(documentId);

  if (!file || !file.url) throw new Error("missing document file");

  // load pdf document
  const pdfDocument = suspend(() => loadPDF(file.url!, () => {}), []);
  const outline = suspend(() => getDocumentOutline(pdfDocument), [pdfDocument]);

  const highlights = useGetDocumentHighlights(documentId).map((h) => ({
    id: h.id!,
    content: JSON.parse(h.content!),
    location: JSON.parse(h.location!),
  }));

  const [upsertDocument] = useUpsertDocument();

  const [upsertDocumentHighlight] = useUpsertDocumentHighlight(documentId);

  //  const documentChanges = useSubscription().documentChanges({ id: documentId });

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

  const createHighlight = useCallback(async (pdfHighlight?: PDFHighlight) => {
    if (!pdfHighlight) return;

    const { errors } = await upsertDocumentHighlight({
      variables: {
        documentId,
        highlight: {
          id: pdfHighlight.id,
          content: JSON.stringify(pdfHighlight.content),
          location: JSON.stringify(pdfHighlight.location),
        },
      },
    });

    if (errors) return;

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

    // mark highlight as deleted
    await upsertDocumentHighlight({
      variables: {
        documentId,
        highlight: { id: pdfHighlight.id, deleted: true },
      },
    });
  }, []);

  const updateHighlight = useCallback(async (pdfHighlight?: PDFHighlight) => {
    if (!pdfHighlight) return;

    // update highlight
    await upsertDocumentHighlight({
      variables: {
        documentId,
        highlight: {
          id: pdfHighlight.id,
          location: JSON.stringify(pdfHighlight.location),
          content: JSON.stringify(pdfHighlight.content),
        },
      },
    });
  }, []);

  const changeTitle = (title: string) =>
    upsertDocument({
      variables: { document: { id: documentId, meta: { title } } },
    });

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

  // useEffect(() => {
  //   if (!documentChanges) return;

  //   const newHighlights = [...highlights];

  //   // process highlight changes
  //   for (const highlight of documentChanges.highlights || []) {
  //     const idx = newHighlights.findIndex((h) => h.id === highlight.id);
  //     const content: PDFHighlightContent =
  //       highlight.content && JSON.parse(highlight.content);
  //     const location: PDFHighlightLocation =
  //       highlight.location && JSON.parse(highlight.location);

  //     if (!content || !location) continue;

  //     if (!idx && !highlight.deleted) {
  //       newHighlights.push({
  //         id: highlight.id!,
  //         content,
  //         location,
  //       });
  //     } else if (idx && highlight.deleted) {
  //       delete newHighlights[idx];
  //     } else if (idx) {
  //       newHighlights[idx] = {
  //         id: highlight.id!,
  //         content,
  //         location,
  //       };
  //     }
  //   }

  //   setHighlights(newHighlights);
  // }, [documentChanges]);

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

  const currentHighlights = highlights;

  const sidebar = (
    <Sidebar
      header={
        <SidebarNavbar
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
            {highlights.map((h) => (
              <HighlightCard
                text={h.content.text}
                image={h.content.thumbnail}
                color={h.content.color}
                pageNumber={h.location.pageNumber}
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
        outline: (
          <DocumentOutlineView
            outline={outline}
            onOutlineNodeClicked={(position) =>
              setScrollToPosition({
                pageNumber: position.pageNumber!,
                destArray: position.location,
              })
            }
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
