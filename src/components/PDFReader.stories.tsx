import React from "react";
import useState from "react-usestateref";
import { suspend } from "suspend-react";

import { Story } from "@storybook/react";
import { useDarkMode } from "storybook-dark-mode";

import { PDFHighlight } from "~/models";

import { PDFReader } from "./PDFReader";
import { useContextProgress } from "./ProgressIndicator";
import { loadPDF } from "~/lib/pdfjs";

export default {
  title: "PDFReader",
};

export const ThePDFReader: Story = (args) => {
  const { setProgress } = useContextProgress();
  const pdfDocument = suspend(() => loadPDF(args.url, setProgress), [args.url]);

  const [highlights, setHighlights, highlightsRef] = useState<PDFHighlight[]>(
    []
  );

  const onHighlightCreate = (highlight: PDFHighlight) => {
    setHighlights([...highlightsRef.current, highlight]);
  };

  const onHighlightUpdate = (highlight: PDFHighlight) => {
    let newHighlights = highlights.map((h) =>
      h.id === highlight.id ? highlight : h
    );

    setHighlights(newHighlights);
  };

  const isDarkMode = useDarkMode();

  return (
    <PDFReader
      className="h-screen"
      pdfDocument={pdfDocument}
      highlights={highlights}
      onHighlightCreate={onHighlightCreate}
      onHighlightUpdate={onHighlightUpdate}
      isDarkMode={isDarkMode}
      title={"Fast and Precise Type Checking for JavaScript"}
    />
  );
};

ThePDFReader.args = {
  url: "https://arxiv.org/pdf/1708.08021.pdf",
};
