import React from "react";
import useState from "react-usestateref";
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
  const [highlights, setHighlights, highlightsRef] = useState<Highlight[]>([]);
  const [selectedHighlight, setSelectedHighlight] = useState<string>();

  return (
    <PDFReader
      url={args.url}
      highlights={highlights}
      pdfScaleValue={args.pdfScaleValue}
      selectionColor={args.selectionColor}
      selectedHighlight={selectedHighlight}
      enableHighlights={args.enableHighlights}
      onHighlightCreate={(highlight) => {
        highlight.id = s4();

        setSelectedHighlight(highlight.id);
        setHighlights([...highlightsRef.current, highlight as Highlight]);
      }}
      onHighlightUpdate={(highlight) => {
        const newHighlights = [...highlights];
        const idx = newHighlights.findIndex((h) => h.id === highlight.id);

        newHighlights[idx] = highlight;

        setSelectedHighlight(highlight.id);
        setHighlights(newHighlights);
      }}
      onHighlightSelection={(highlight) => setSelectedHighlight(highlight.id)}
    ></PDFReader>
  );
};

ThePdfReader.args = {
  url: "https://arxiv.org/pdf/1708.08021.pdf",
  pdfScaleValue: "auto",
  pageNumber: 1,
  scrollTop: 0,
  selectionColor: "red",
  enableHighlights: true,
};
