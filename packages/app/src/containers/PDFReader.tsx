import React, { FC, useState, useEffect } from "react";
import { suspend } from "suspend-react";

import { gql, useMutation, useQuery } from "urql";

import { FullScreen } from "@chiragrupani/fullscreen-react";

import { resetValue } from "~/lib/utils";

import {
  PDFActionButton,
  PDFSidebar,
  PDFDrawer,
  PDFSidebarNavbar,
  DocumentOutlineView,
  PDFPageThumbnails,
  HighlightColor,
  OutlinePosition,
  loadPDF,
  useContextProgress,
} from "@pdf-clipper/components";
import { HighlightListView } from "./HighlightListView";
import { PDFHighlighterContainer } from "./PDFHighlighterContainer";

const getDocumentInfoQuery = gql(`
  query getDocumentInfo($documentId: ID!) @live {
    document(id: $documentId) {
      ...DocumentInfoFragment
    }
  }
`);

const getDocumentFileQuery = gql(`
  query getDocumentFile($documentId: ID!) {
    document(id: $documentId) {
      id
      file {
        hash
        url
        blob
      }
    }
  }
`);

const updateDocumentMutation = gql(`
  mutation updateDocument($document: UpdateDocumentInput!) {
    updateDocument(document: $document) {
      ...DocumentInfoFragment
    }
  }
`);

export interface PDFReaderProps {
  documentId: string;
  className?: string;
  isDarkMode?: boolean;

  // whether to select highlight on highlight creation
  selectOnCreate?: boolean;
  onClose?: () => void;
}

export const PDFReader: FC<PDFReaderProps> = ({
  documentId,
  className = "",
  isDarkMode = false,
  onClose,
}) => {
  const [{ data, error }] = useQuery({
    query: getDocumentInfoQuery,
    variables: { documentId },
  });
  if (error || !data) throw error;

  const [{ data: docFileData, error: docFileError }] = useQuery({
    query: getDocumentFileQuery,
    variables: { documentId },
  });
  if (docFileError || !docFileData) throw docFileError;

  const [, updateDocument] = useMutation(updateDocumentMutation);

  let source: Blob | string;
  if (docFileData.document.file?.blob) {
    source = docFileData.document.file?.blob;
  } else if (docFileData.document.file?.url) {
    source = docFileData.document.file?.url;
  } else {
    throw new Error("missing file source");
  }

  const { setProgress } = useContextProgress();

  // load pdf document
  const pdfDocument = suspend(
    () => loadPDF(source, ({ loaded, total }) => setProgress(total / loaded)),
    [documentId]
  );

  const meta = data.document.meta;
  let { title, description, outline } = meta;

  const [selectedHighlightId, setSelectedHighlightId] = useState<string>();
  const [scrollToHighlightId, setScrollToHighlightId] = useState<string>();
  const [scrollToListViewHighlight, setScrollToListViewHighlight] =
    useState<string>();
  const [scrollToOutlinePosition, setScrollToOutlinePosition] =
    useState<OutlinePosition>();
  const [scrollToPage, setScrollToPage] = useState<number>();
  const [highlightColor, setHighlightColor] = useState<HighlightColor>(
    HighlightColor.Yellow
  );
  const [pdfScaleValue, setPdfScaleValue] = useState("auto");
  const [scale, setScale] = useState<number>();
  const [isDarkReader, setIsDarkReader] = useState<boolean>(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const changeTitle = (title: string) =>
    updateDocument({
      document: {
        id: documentId,
        meta: {
          ...meta,
          title,
          description,
        },
      },
    });

  useEffect(() => {
    if (selectedHighlightId) {
      setScrollToListViewHighlight(selectedHighlightId);
    }
  }, [selectedHighlightId]);

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
        if (selectedHighlightId)
          resetValue(setScrollToListViewHighlight, selectedHighlightId);
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
          <HighlightListView
            documentId={documentId}
            selectedHighlightId={selectedHighlightId}
            scrollToHighlightId={scrollToListViewHighlight}
            onHighlightClicked={setScrollToHighlightId}
            onHighlightEditClicked={(id) => {
              setScrollToHighlightId(id);
              setSelectedHighlightId(id);
            }}
            onHighlightPageClicked={(_, pageNumber) =>
              setScrollToPage(pageNumber)
            }
          />
        ),
        outline: outline ? (
          <DocumentOutlineView
            outline={outline}
            onOutlineNodeClicked={setScrollToOutlinePosition}
          />
        ) : null,
      }}
    />
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

        <PDFHighlighterContainer
          pdfDocument={pdfDocument}
          documentId={documentId}
          pdfScaleValue={pdfScaleValue}
          enableDarkMode={isDarkReader}
          onScaleChanged={setScale}
          scrollToPage={scrollToPage}
          scrollToHighlightId={scrollToHighlightId}
          scrollToOutlinePosition={scrollToOutlinePosition}
          highlightColor={highlightColor}
          onHighlightSelected={setSelectedHighlightId}
        />
      </PDFDrawer>
    </FullScreen>
  );
};
