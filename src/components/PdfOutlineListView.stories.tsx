import React from "react";

import { Story } from "@storybook/react";
import { PDFLoader } from "./PdfLoader";
import { PdfOutlineListView } from "./PdfOutlineListView";

export default {
  title: "PDFOutlineListView",
};

export const ThePDFOutlineListView: Story = (args) => {
  return (
    <PDFLoader
      url={args.url}
      showDocument={(document) => <PdfOutlineListView document={document} />}
      showLoader={() => <a>Loading...</a>}
    />
  );
};

ThePDFOutlineListView.args = {
  url: "https://arxiv.org/pdf/1708.08021.pdf",
};
