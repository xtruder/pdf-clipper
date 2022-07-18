import { Story } from "@storybook/react";

// react
import React from "react";
import useState from "react-usestateref";
import { suspend } from "suspend-react";

// utils
import { loadPDF } from "~/lib/pdfjs";
import { clearRangeSelection } from "~/lib/dom";
import { resetValue } from "~/lib/utils";

// components
import { useContextProgress } from "../ui/ProgressIndicator";
import { PDFHighlighter } from "./PDFHighlighter";
import { HighlightTooltip, SelectionTooltip } from "./PDFControls";

// types
import { PDFHighlight } from "./types";

export default {
  title: "PDFHighlighter",
};

export const ThePDFHighlighter: Story = (args) => {
  const { setProgress } = useContextProgress();
  const pdfDocument = suspend(
    () => loadPDF(args.url, ({ loaded, total }) => setProgress(total / loaded)),
    [args.url]
  );

  const [highlights, setHighlights, highlightsRef] = useState<PDFHighlight[]>(
    []
  );
  const [_, setInProgressHighlight, inProgressHighlightRef] =
    useState<PDFHighlight>();
  const [selectedHighlight, setSelectedHighlight] = useState<PDFHighlight>();
  const [enableAreaSelection, setEnableAreaSelection] = useState(true);

  const addHighlight = () => {
    if (!inProgressHighlightRef.current) return;

    const highlight = inProgressHighlightRef.current;

    resetValue(setEnableAreaSelection, true);
    clearRangeSelection();
    setInProgressHighlight(undefined);

    setHighlights([...highlightsRef.current, highlight]);
    setSelectedHighlight(highlight);
  };

  const deleteHighlight = () => {
    if (!selectedHighlight) return;

    const newHighlights = highlightsRef.current.filter(
      (h) => h.id !== selectedHighlight.id
    );

    setSelectedHighlight(undefined);
    setHighlights(newHighlights);
  };

  return (
    <div onKeyDown={() => console.log("here")}>
      <PDFHighlighter
        pdfDocument={pdfDocument}
        highlights={highlights}
        pdfScaleValue={args.pdfScaleValue}
        highlightColor={args.highlightColor}
        selectedHighlight={selectedHighlight}
        enableAreaSelection={enableAreaSelection}
        selectionTooltip={<SelectionTooltip onClick={addHighlight} />}
        highlightTooltip={
          <HighlightTooltip onRemoveClicked={deleteHighlight} />
        }
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

          setHighlights(newHighlights);
          setSelectedHighlight(highlight);
        }}
        onHighlightClicked={(highlight) => {
          setSelectedHighlight(highlight);

          args.onHighlightClicked(highlight);
        }}
        onKeyDown={(event: KeyboardEvent) => {
          switch (event.code) {
            case "Enter":
              addHighlight();

              break;
            case "Escape":
              clearRangeSelection();
              resetValue(setEnableAreaSelection, true);
              setSelectedHighlight(undefined);

              break;
            case "Delete":
              deleteHighlight();

              break;
          }
        }}
      />
    </div>
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
