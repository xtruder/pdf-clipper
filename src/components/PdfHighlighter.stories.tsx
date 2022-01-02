import React from "react";
import useState from "react-usestateref";
import { Story } from "@storybook/react";

import { Highlight, NewHighlight } from "~/types";
import { PDFLoader } from "./PdfLoader";
import { PDFHighlighter } from "./PdfHighlighter";

export default {
  title: "PdfHighlighter",
};

let s4 = () => {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
};

export const ThePDFHighlighter: Story = (args) => {
  const [highlights, setHighlights, highlightsRef] = useState<Highlight[]>([]);
  const [_, setInProgressHighlight, inProgressHighlightRef] =
    useState<NewHighlight | null>(null);
  const [selectedHighlight, setSelectedHighlight] = useState<string>();

  return (
    <PDFLoader
      url={args.url}
      showDocument={(document) => (
        <PDFHighlighter
          pdfDocument={document}
          highlights={highlights}
          pdfScaleValue={args.pdfScaleValue}
          highlightColor={args.highlightColor}
          selectedHighlight={selectedHighlight}
          showHighlights={args.showHighlights}
          onHighlighting={(highlight) => {
            args.onHighlighting(highlight);

            setInProgressHighlight(highlight);
          }}
          onHighlightUpdated={(highlight) => {
            args.onHighlightUpdated(highlight);

            const newHighlights = [...highlights];
            const idx = newHighlights.findIndex((h) => h.id === highlight.id);

            newHighlights[idx] = highlight;

            setSelectedHighlight(highlight.id);
            setHighlights(newHighlights);
          }}
          onHighlightClicked={(highlight) => {
            args.onHighlightClicked(highlight);

            setSelectedHighlight(highlight.id);
          }}
          onKeyDown={(event: KeyboardEvent) => {
            switch (event.code) {
              case "Enter":
                if (inProgressHighlightRef.current) {
                  const highlight = {
                    ...inProgressHighlightRef.current,
                    id: s4(),
                  };

                  setSelectedHighlight(highlight.id);
                  setHighlights([...highlightsRef.current, highlight]);

                  setInProgressHighlight(null);
                }

                break;
            }
          }}
        />
      )}
    />
  );
};

ThePDFHighlighter.args = {
  url: "https://arxiv.org/pdf/1708.08021.pdf",
  pdfScaleValue: "auto",
  pageNumber: 1,
  scrollTop: 0,
  showHighlights: true,
};

ThePDFHighlighter.argTypes = {
  highlightColor: {
    control: { type: "select", options: ["red", "green", "blue", "yellow"] },
  },
  onHighlighting: {
    action: "highlighting",
  },
  onHighlightUpdated: {
    action: "highlight updated",
  },
  onHighlightClicked: {
    action: "highlight clicked",
  },
};
