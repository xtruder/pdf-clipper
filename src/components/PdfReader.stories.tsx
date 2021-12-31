import React, { useState } from "react";
import { Story } from "@storybook/react";

import { PDFReader } from "./PdfReader";

import { Highlight } from "~/types";

export default {
  title: "PdfReader",
};

let s4 = () => {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
};

export const ThePdfReader: Story = (args) => {
  const [highlights, setHighlights] = useState<Highlight[]>([]);

  return (
    <PDFReader
      url={args.url}
      highlights={highlights}
      pdfScaleValue={args.pdfScaleValue}
      selectionColor={args.selectionColor}
      onNewHighlight={(highlight) => {
        const id = s4();
        console.log("here");

        setHighlights([...highlights, { ...highlight, id }]);
      }}
      onHighlightUpdate={(highlight) => {
        const newHighlights = [...highlights];
        const idx = newHighlights.findIndex((h) => h.id === highlight.id);

        newHighlights[idx] = highlight;

        setHighlights(newHighlights);
      }}
    ></PDFReader>
  );
};

ThePdfReader.args = {
  url: "https://arxiv.org/pdf/1708.08021.pdf",
  pdfScaleValue: "auto",
  pageNumber: 1,
  scrollTop: 0,
  selectionColor: "red",
};
