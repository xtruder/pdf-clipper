import { Story } from "@storybook/react";

import React, { useEffect } from "react";
import { useSetRecoilState } from "recoil";

import { DocumentType } from "~/types";
import { documentInfo, fileInfo } from "~/state";

import { PDFReader } from "./PDFReader";

export default {
  title: "PDFReader",
};

export const ThePDFReader: Story = (args) => {
  const fileId = "1000";
  const docId = "100";

  const setFileInfo = useSetRecoilState(fileInfo(fileId));
  const setDocumentInfo = useSetRecoilState(documentInfo(docId));

  useEffect(() => {
    console.log("effect handler");
    setFileInfo({
      id: fileId,
      sources: [args.url],
    });

    setDocumentInfo({
      id: docId,
      fileId,
      title: "A brief histroy of time",
      type: DocumentType.PDF,
    });
  }, [args.url]);

  return <PDFReader className="h-screen" documentId={docId} />;
};

ThePDFReader.args = {
  url: "https://arxiv.org/pdf/1708.08021.pdf",
};
