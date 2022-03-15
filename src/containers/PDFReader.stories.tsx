import React from "react";
import useState from "react-usestateref";
import { suspend } from "suspend-react";

import { Story } from "@storybook/react";
import { useDarkMode } from "storybook-dark-mode";

import { PDFHighlight, DocumentType } from "~/models";

import { PDFReader } from "./PDFReader";
import { useContextProgress } from "../components/ProgressIndicator";
import { loadPDF } from "~/lib/pdfjs";
import { useSetRecoilState } from "recoil";
import { useStateCtx } from "~/state/state";

export default {
  title: "PDFReader",
};

export const ThePDFReader: Story = (args) => {
  const docId = "100";
  const { documentSources, documentInfo } = useStateCtx();

  useSetRecoilState(documentSources(docId))({
    id: docId,
    type: DocumentType.PDF,
    sources: ["https://arxiv.org/pdf/1708.08021.pdf"],
  });

  useSetRecoilState(documentInfo(docId))({
    id: docId,
    title: "A brief histroy of time",
    url: "",
    type: DocumentType.PDF,
  });

  const isDarkMode = useDarkMode();

  return (
    <PDFReader
      className="h-screen"
      isDarkMode={isDarkMode}
      documentId={docId}
    />
  );
};

ThePDFReader.args = {
  url: "https://arxiv.org/pdf/1708.08021.pdf",
};
