import React, { FC, useCallback, useEffect } from "react";
import useState from "react-usestateref";
import { useToggle, useResetState } from "ahooks";
import { Context, gql } from "urql";
import { v4 as uuid } from "uuid";

import { PDFDocumentProxy } from "pdfjs-dist";
import { PDFViewer } from "pdfjs-dist/web/pdf_viewer";

import { useMyMutation, useMyQuery } from "~/gql/hooks";
import { HighlightColor } from "~/gql/graphql";

import { canvasToPNGBlob } from "~/lib/dom";

import {
  PDFScrollPosition,
  PDFHighlightTooltip,
  PDFSelectionTooltip,
  PDFHighlighter,
  OutlinePosition,
  PDFHighlight,
  PDFHighlightWithKey,
  PDFHighlightType,
  getPageCanvasArea,
  scaledRectToViewportRect,
} from "@pdf-clipper/components";

const getDocumentHighlightsQuery = gql(`
  query getDocumentHighlights($documentId: ID!) @live {
    document(id: $documentId) {
      id
      highlights {
        ...DocumentHighlightFragment
      }
    }
  }
`);

const createDocumentHighlightMutation = gql(`
  mutation createDocumentHighlight($highlight: CreateDocumentHighlightInput!) {
    createDocumentHighlight(highlight: $highlight) {
      ...DocumentHighlightFragment
    }
  }
`);

const updateDocumentHighlightMutation = gql(`
  mutation updateDocumentHighlight($highlight: UpdateDocumentHighlightInput!) {
    updateDocumentHighlight(highlight: $highlight) {
      ...DocumentHighlightFragment
    }
  }
`);

const deleteDocumentHighlightMutation = gql(`
  mutation deleteDocumentHighlight($highlightId: ID!) {
    deleteDocumentHighlight(id: $highlightId) {
      id
    }
  }
`);

const uploadBlobMutation = gql(`
  mutation uploadBlob($blob: UploadBlobInput!) {
    uploadBlob(blob: $blob) {
      hash
    }
  }
`);

export interface PDFHighlighterContainerProps {
  documentId: string;
  pdfDocument: PDFDocumentProxy;
  pdfScaleValue?: string;
  selectOnCreate?: boolean;
  enableDarkMode?: boolean;
  highlightColor?: HighlightColor;
  scrollToPage?: number;
  scrollToOutlinePosition?: OutlinePosition;
  scrollToHighlightId?: string;

  onHighlightSelected?: (id: string) => void;
  onScaleChanged?: (scale: number) => void;
}

export const PDFHighlighterContainer: FC<PDFHighlighterContainerProps> = ({
  documentId,
  pdfDocument,
  pdfScaleValue = "auto",
  selectOnCreate = false,
  enableDarkMode = false,
  highlightColor,
  scrollToPage,
  scrollToOutlinePosition,
  scrollToHighlightId,

  onHighlightSelected,
  onScaleChanged,
}) => {
  const [{ data }] = useMyQuery({
    query: getDocumentHighlightsQuery,
    variables: { documentId },
    throwOnError: true,
    suspend: true,
    requestPolicy: "cache-first",
  });

  const pdfHighlights = data.document.highlights;

  const [, createDocumentHighlight] = useMyMutation(
    createDocumentHighlightMutation,
    {
      throwOnError: true,
      propagateError: true,
    }
  );
  const [, updateDocumentHighlight] = useMyMutation(
    updateDocumentHighlightMutation,
    {
      throwOnError: true,
      propagateError: true,
    }
  );
  const [, deleteDocumentHighlight] = useMyMutation(
    deleteDocumentHighlightMutation,
    {
      throwOnError: true,
      propagateError: true,
    }
  );
  const [, uploadBlob] = useMyMutation(uploadBlobMutation);

  const [
    inProgressHighlight,
    setInProgressHighlight,
    resetInProgressHighlight,
  ] = useResetState<PDFHighlight | null>(null);

  const [
    selectedHighlightId,
    setSelectedHighlightId,
    resetSelectedHighlightId,
  ] = useResetState<string | null>(null);

  const [
    currentScrolledHighlightId,
    setCurrentScrolledHighlightId,
    resetCurrentScrolledHighlightId,
  ] = useResetState<string | null>(null);
  useEffect(
    () => setCurrentScrolledHighlightId(scrollToHighlightId ?? null),
    [scrollToHighlightId]
  );

  const [scrollToPosition, setScrollToPosition, resetScrollToPosition] =
    useResetState<PDFScrollPosition | null>(null);
  const [clearSelection, { toggle: doClearSelection }] = useToggle();

  const [_pdfViewer, setPdfViewer] = useState<PDFViewer>();

  const screenshotHighlight = useCallback(
    async ({ key, location }: PDFHighlightWithKey) => {
      const page = await pdfDocument.getPage(location.pageNumber);

      const viewport = page.getViewport({ scale: 5 });

      const area = scaledRectToViewportRect(location.boundingRect, viewport);

      const canvas = await getPageCanvasArea(page, { scale: 5, area });

      const blob = await canvasToPNGBlob(canvas);

      const { data, error } = await uploadBlob({
        blob: {
          mimeType: blob.type,
          blob,
        },
      });

      if (error || !data) throw error;

      await updateDocumentHighlight({
        highlight: {
          id: key,
          location,
          imageHash: data.uploadBlob.hash,
        },
      });
    },
    [pdfDocument]
  );

  const createHighlight = useCallback(
    async (pdfHighlight: PDFHighlight | null) => {
      if (!pdfHighlight) return;

      const id = uuid();
      if (pdfHighlight.type === "area") {
        const { color, location, sequence } = pdfHighlight;

        await createDocumentHighlight({
          highlight: {
            id,
            sequence,
            documentId,
            location,
            color,
          },
        });

        console.log("doc highlight created");

        screenshotHighlight({ key: id, ...pdfHighlight });
      } else if (pdfHighlight.type === "text") {
        const { color, location, text, sequence } = pdfHighlight;

        await createDocumentHighlight({
          highlight: {
            id,
            sequence,
            documentId,
            location,
            color,
            content: text,
          },
        });
      }

      if (selectOnCreate) {
        setSelectedHighlightId(id);
      } else {
        resetSelectedHighlightId();
      }

      // clear selection and in progress highlight
      doClearSelection();
      resetInProgressHighlight();
    },
    []
  );

  const deleteHighlight = useCallback(async (id: string | null) => {
    if (!id) return;

    // unselect highlight
    resetInProgressHighlight();

    await deleteDocumentHighlight({ highlightId: id });
  }, []);

  const updateHighlight = useCallback(
    async (pdfHighlight: PDFHighlightWithKey) => {
      if (!pdfHighlight) return;

      // update selected highlight, so results immidiately reflect ui
      setSelectedHighlightId(pdfHighlight.key);

      if (pdfHighlight.type === "area") {
        const { key, location, image: _image } = pdfHighlight;

        // first only update location
        // await updateDocumentHighlight({
        //   highlight: {
        //     id: key,
        //     location,
        //   },
        // });

        // const { data, error } = await uploadBlob({
        //   blob: {
        //     mimeType: image.type,
        //     blob: image,
        //   },
        // });

        // if (error || !data) throw error;

        await updateDocumentHighlight({
          highlight: {
            id: key,
            location,
          },
        });

        screenshotHighlight(pdfHighlight);
      }
    },
    []
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      switch (event.code) {
        case "Escape":
          doClearSelection();
          break;
        case "Enter":
          if (inProgressHighlight) {
            createHighlight(inProgressHighlight);
          }

          break;
        case "Delete":
          if (selectedHighlightId) {
            deleteHighlight(selectedHighlightId);
          }

          break;
      }
    },
    [inProgressHighlight, selectedHighlightId]
  );

  useEffect(() => {
    if (!clearSelection) return;
    resetInProgressHighlight();
  }, [clearSelection]);

  useEffect(() => {
    if (scrollToPage) {
      resetCurrentScrolledHighlightId();
      setScrollToPosition({ pageNumber: scrollToPage });
    }
  }, [scrollToPage]);

  useEffect(() => {
    if (currentScrolledHighlightId) {
      resetScrollToPosition();
    }
  }, [currentScrolledHighlightId]);

  useEffect(() => {
    if (scrollToOutlinePosition) {
      setScrollToPosition(scrollToOutlinePosition as any);
    }
  }, [scrollToOutlinePosition]);

  useEffect(() => {
    if (selectedHighlightId) {
      onHighlightSelected?.(selectedHighlightId);
    }
  }, [selectedHighlightId]);

  const highlightTooltip = (
    <PDFHighlightTooltip
      onRemoveClicked={() => deleteHighlight(selectedHighlightId)}
    />
  );

  const selectionTooltip = (
    <PDFSelectionTooltip onClick={() => createHighlight(inProgressHighlight)} />
  );

  // convert from graphql response to PDFHighlight
  const highlights = pdfHighlights.map(
    ({ content, id, color, location, sequence }) => ({
      type: content?.text ? "text" : ("area" as PDFHighlightType),
      key: id,
      color,
      location,
      sequence,
    })
  );

  return (
    <PDFHighlighter
      pdfDocument={pdfDocument}
      highlights={highlights}
      scrollTo={scrollToPosition}
      scrollToHighlight={scrollToHighlightId}
      selectedHighlight={selectedHighlightId}
      clearSelection={clearSelection}
      pdfScaleValue={pdfScaleValue}
      highlightTooltip={highlightTooltip}
      selectionTooltip={selectionTooltip}
      enableDarkMode={enableDarkMode}
      highlightColor={highlightColor}
      // event handlers
      onHighlighting={setInProgressHighlight}
      onHighlightUpdated={updateHighlight}
      onHighlightClicked={setSelectedHighlightId}
      onDisplayReady={setPdfViewer}
      onKeyDown={onKeyDown}
      onScaleChanging={(e) => onScaleChanged?.(e.scale)}
      onPageScroll={() => {
        resetCurrentScrolledHighlightId();
        resetScrollToPosition();
      }}
    />
  );
};
