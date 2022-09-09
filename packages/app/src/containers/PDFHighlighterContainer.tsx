import React, { FC, useCallback, useEffect } from "react";
import useState from "react-usestateref";
import { useToggle, useResetState } from "ahooks";

import { v4 as uuid } from "uuid";

import { PDFDocumentProxy } from "pdfjs-dist";
import { gql, useMutation, useQuery } from "urql";

import {
  PDFScrollPosition,
  PDFDisplayProxy,
  PDFHighlightTooltip,
  PDFSelectionTooltip,
  PDFHighlighter,
  OutlinePosition,
  PDFHighlight,
  PDFHighlightWithKey,
  PDFHighlightType,
} from "@pdf-clipper/components";
import { HighlightColor } from "~/gql/graphql";

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
    updateDocumentHighlight(highlight: {id: $highlightId, deleted: true}) {
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
  const [{ data, error }] = useQuery({
    query: getDocumentHighlightsQuery,
    variables: { documentId },
  });

  if (error) throw error;
  if (!data) throw new Error("missing document data");

  const pdfHighlights = data.document.highlights;

  const [, createDocumentHighlight] = useMutation(
    createDocumentHighlightMutation
  );
  const [, updateDocumentHighlight] = useMutation(
    updateDocumentHighlightMutation
  );
  const [, deleteDocumentHighlight] = useMutation(
    deleteDocumentHighlightMutation
  );
  const [, uploadBlob] = useMutation(uploadBlobMutation);

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

  const [_pdfViewer, setPdfViewer] = useState<PDFDisplayProxy>();

  const createHighlight = useCallback(
    async (pdfHighlight: PDFHighlight | null) => {
      if (!pdfHighlight) return;

      const id = uuid();
      if (pdfHighlight.type === "area") {
        const { color, location, image, sequence } = pdfHighlight;

        const { data, error } = await uploadBlob({
          blob: {
            mimeType: image.type,
            blob: image,
          },
        });

        if (error || !data) throw error;

        const imageHash = data.uploadBlob.hash;

        await createDocumentHighlight({
          highlight: {
            id,
            sequence,
            documentId,
            location,
            imageHash,
            color,
          },
        });
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
        const { key, location, image } = pdfHighlight;

        const { data, error } = await uploadBlob({
          blob: {
            mimeType: image.type,
            blob: image,
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

  const highlights = pdfHighlights.map((h) => ({
    type: h.image ? "area" : ("text" as PDFHighlightType),
    key: h.id,
    color: h.color,
    location: h.location,
    sequence: h.sequence,
  }));

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
      onDocumentReady={setPdfViewer}
      onKeyDown={onKeyDown}
      onScaleChanging={(e) => onScaleChanged?.(e.scale)}
      onPageScroll={() => {
        resetCurrentScrolledHighlightId();
        resetScrollToPosition();
      }}
    />
  );
};
