import React from "react";
import useState from "react-usestateref";
import { Story } from "@storybook/react";

import { PDFHighlight, NewPDFHighlight } from "~/models";
import { PDFLoader } from "./PDFLoader";
import { PDFHighlighter } from "./PDFHighlighter";

export default {
  title: "PDFHighlighter",
};

let s4 = () => {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
};

export const ThePDFHighlighter: Story = (args) => {
  const [highlights, setHighlights, highlightsRef] = useState<PDFHighlight[]>(
    []
  );
  const [_, setInProgressHighlight, inProgressHighlightRef] =
    useState<NewPDFHighlight | null>(null);
  const [selectedHighlight, setSelectedHighlight] = useState<PDFHighlight>();

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
          areaSelectionActive={args.areaSelectionActive}
          onHighlighting={(highlight) => {
            args.onHighlighting(highlight);

            setInProgressHighlight(highlight);
          }}
          onHighlightUpdated={(highlight) => {
            args.onHighlightUpdated(highlight);

            const newHighlights = [...highlights];
            const idx = newHighlights.findIndex((h) => h.id === highlight.id);

            newHighlights[idx] = highlight;

            setSelectedHighlight(highlight);
            setHighlights(newHighlights);
          }}
          onHighlightClicked={(highlight) => {
            args.onHighlightClicked(highlight);

            setSelectedHighlight(highlight);
          }}
          onKeyDown={(event: KeyboardEvent) => {
            switch (event.code) {
              case "Enter":
                if (inProgressHighlightRef.current) {
                  const highlight = {
                    ...inProgressHighlightRef.current,
                    id: s4(),
                  };

                  setSelectedHighlight(highlight);
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
  areaSelectionActive: false,
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
