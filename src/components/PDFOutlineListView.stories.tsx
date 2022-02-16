import React from "react";
import { suspend } from "suspend-react";
import { Story } from "@storybook/react";

import { loadPDF } from "~/lib/pdfjs";
import { PDFOutlineListView } from "./PDFOutlineListView";
import { useContextProgress } from "./ProgressIndicator";

export default {
  title: "PDFOutlineListView",
};

export const ThePDFOutlineListView: Story = (args) => {
  const { setProgress } = useContextProgress();
  const pdfDocument = suspend(() => loadPDF(args.url, setProgress), [args.url]);

  return <PDFOutlineListView document={pdfDocument} />;
};

ThePDFOutlineListView.args = {
  url: "https://arxiv.org/pdf/1708.08021.pdf",
};
