import React from "react";
import { useNavigate } from "react-router-dom";

import { debug as _debug } from "debug";

import { AccountDocumentsListContainer } from "~/containers/DocumentListContainer";
import { DocumentDropContainer } from "~/containers/DocumentDropContainer";
import {
  DocumentMetaInput,
  DocumentType,
  FileInfo,
  query,
  UpsertDocumentInput,
  useMutation,
} from "~/gqty";
import { getDocumentOutline, loadPDF, screenshotPageArea } from "~/lib/pdfjs";

const mimeToDocType: Record<string, DocumentType | undefined> = {
  "application/pdf": DocumentType.PDF,
};

export interface MainPageProps {}

export const MainPage: React.FC<MainPageProps> = ({}) => {
  const navigate = useNavigate();

  const [upsertDocument] = useMutation(
    (mutation, document: UpsertDocumentInput) =>
      mutation.upsertDocument({ document }),
    {
      suspense: true,

      // refetch account documents
      refetchQueries: [query.currentAccount.documents],
    }
  );

  const onUpload = async (fileInfo: FileInfo, file: File) => {
    const docType = mimeToDocType[fileInfo.mimeType || ""];

    if (!docType) throw new Error(`unsupported mime type ${fileInfo.mimeType}`);

    // create a new document
    const { id } = await upsertDocument({
      args: { type: docType, fileHash: fileInfo.hash },
    });

    if (docType === DocumentType.PDF) {
      // load pdf document from file
      const pdfDocument = await loadPDF(await file.text());

      // get pdf document metadata
      const { info }: { info: any } = await pdfDocument.getMetadata();

      // get first page and screenshot page as cover
      const page1 = await pdfDocument.getPage(1);
      const cover = await screenshotPageArea(page1, { width: 600 });

      // get pdf document outline
      const outline = await getDocumentOutline(pdfDocument);

      const meta: DocumentMetaInput = {
        pageCount: pdfDocument.numPages,
        title: info["Title"],
        author: info["Author"],
        cover,
        outline,
      };

      // update document metadata
      await upsertDocument({ args: { id, meta } });
    }
  };

  return (
    <div className="h-screen flex flex-col p-1">
      <DocumentDropContainer className="flex-none grow-0" onUpload={onUpload} />

      <div className="divider"></div>

      <AccountDocumentsListContainer
        className="flex-1"
        onOpen={(docId) => navigate(`/document/${docId}`)}
      />
    </div>
  );
};
