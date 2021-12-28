import React from "react";
import { Story } from "@storybook/react";

import { PDFReader } from "./PdfReader";

export default {
  title: "PdfReader",
};

export const ThePdfReader: Story = (args) => {
  return <PDFReader url={args.url}></PDFReader>;
};

ThePdfReader.args = {
  url: "https://arxiv.org/pdf/1708.08021.pdf",
  pdfScaleValue: "auto",
  pageNumber: 1,
  scrollTop: 0,
};
