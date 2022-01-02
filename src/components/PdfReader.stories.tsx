import React from "react";

import { Story } from "@storybook/react";
import { PDFReader } from "./PdfReader";

export default {
  title: "PDFReader",
};

export const ThePDFReader: Story = (args) => {
  return <PDFReader url={args.url} />;
};

ThePDFReader.args = {
  url: "https://arxiv.org/pdf/1708.08021.pdf",
};
