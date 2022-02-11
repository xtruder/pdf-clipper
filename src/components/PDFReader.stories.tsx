import React from "react";
import useState from "react-usestateref";
import { Story } from "@storybook/react";

import { PDFHighlight } from "~/models";

import { PDFReader } from "./PDFReader";
import { PDFLoader } from "./PDFLoader";
import { useDarkMode } from "storybook-dark-mode";

export default {
  title: "PDFReader",
};

let s4 = () => {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
};

export const ThePDFReader: Story = (args) => {
  const [highlights, setHighlights, highlightsRef] = useState<PDFHighlight[]>(
    []
  );

  const onHighlightCreate = (highlight: PDFHighlight) => {
    setHighlights([...highlightsRef.current, highlight]);
  };

  const onHighlightUpdate = (highlight: PDFHighlight) => {
    let newHighlights = highlight.deleted
      ? highlights.filter((h) => h.id !== highlight.id)
      : highlights.map((h) => (h.id === highlight.id ? highlight : h));

    setHighlights(newHighlights);
  };

  const isDarkMode = useDarkMode();

  return (
    <PDFLoader
      url={args.url}
      showDocument={(pdfDocument) => (
        <PDFReader
          className="h-screen"
          pdfDocument={pdfDocument}
          highlights={highlights}
          onHighlightCreate={onHighlightCreate}
          onHighlightUpdate={onHighlightUpdate}
          isDarkMode={isDarkMode}
        />
      )}
    />
  );
};

ThePDFReader.args = {
  url: "https://arxiv.org/pdf/1708.08021.pdf",
};
