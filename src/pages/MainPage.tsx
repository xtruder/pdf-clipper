import React from "react";
import { useNavigate } from "react-router-dom";

import { debug as _debug } from "debug";

import { AccountDocumentsListContainer } from "~/containers/DocumentListContainer";
import { DocumentDropContainer } from "~/containers/DocumentDropContainer";
import { getDocumentOutline, loadPDF, screenshotPageArea } from "~/lib/pdfjs";
import { useUpsertDocument } from "~/graphql";
import { DocumentMetaInput, DocumentType } from "~/graphql/types";

const mimeToDocType: Record<string, DocumentType | undefined> = {
  "application/pdf": DocumentType.Pdf,
};

export interface MainPageProps {}

export const MainPage: React.FC<MainPageProps> = ({}) => {
  const navigate = useNavigate();

  const [upsertDocument] = useUpsertDocument();

  const onUpload = async (file: File, hash: string, mimeType: string) => {
    const docType = mimeToDocType[mimeType || ""];

    if (!docType) throw new Error(`unsupported mime type ${mimeType}`);

    console.log(hash, mimeType);

    // create a new document
    const result = await upsertDocument({
      variables: { document: { type: docType, fileHash: hash } },
    });

    if (!result.data) throw new Error("missing document info");

    const { id } = result.data.upsertDocument;

    if (docType === DocumentType.Pdf) {
      // load pdf document from file
      const pdfDocument = await loadPDF(await file.arrayBuffer());

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
      await upsertDocument({ variables: { document: { id, meta } } });
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
