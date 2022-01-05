import React from "react";
import useState from "react-usestateref";

import { Highlight, HighlightColor, NewHighlight } from "~/types";
import { clearRangeSelection } from "~/lib/dom-util";

import { PDFLoader } from "./PdfLoader";
import { PDFHighlighter } from "./PdfHighlighter";
import { ActionButton } from "./PdfControls";

let s4 = () => {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
};

export interface PDFReaderProps {
  url: string;
}

export const PDFReader: React.FC<PDFReaderProps> = ({ url }) => {
  const [highlights, setHighlights, highlightsRef] = useState<Highlight[]>([]);
  const [_, setInProgressHighlight, inProgressHighlightRef] =
    useState<NewHighlight | null>(null);
  const [selectedHighlight, setSelectedHighlight, selectedHighlightRef] =
    useState<string>();
  const [enableAreaSelection, setEnableAreaSelection] = useState<boolean>(true);
  const [areaSelectActive, setAreaSelectActive] = useState<boolean>(false);
  const [highlightColor, setHighlightColor] = useState<HighlightColor>(
    HighlightColor.YELLOW
  );

  const clearAreaSelection = () => {
    if (enableAreaSelection) {
      setEnableAreaSelection(false);
      setTimeout(() => setEnableAreaSelection(true), 0);
    }
  };

  const clearSelection = () => {
    clearRangeSelection();
    clearAreaSelection();
  };

  const createHighlight = (highlight: NewHighlight): void => {
    highlight.id = s4();

    setSelectedHighlight(highlight.id);
    setHighlights([...highlightsRef.current, highlight as Highlight]);

    clearSelection();
    setInProgressHighlight(null);
  };

  const deleteHighlight = (id: string): void => {
    const newHighlights = highlightsRef.current.filter((h) => h.id !== id);

    setSelectedHighlight(undefined);
    setHighlights(newHighlights);
  };

  const onHighlightUpdated = (highlight: Highlight): void => {
    const newHighlights = [...highlights];
    const idx = newHighlights.findIndex((h) => h.id === highlight.id);

    newHighlights[idx] = highlight;

    setSelectedHighlight(highlight.id);
    setHighlights(newHighlights);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    switch (event.code) {
      case "Escape":
        clearSelection();
        break;
      case "Enter":
        console.log("here");
        if (inProgressHighlightRef.current) {
          createHighlight(inProgressHighlightRef.current);
        }

        break;
      case "Delete":
        if (selectedHighlightRef.current) {
          deleteHighlight(selectedHighlightRef.current);
        }

        break;
    }
  };

  return (
    <PDFLoader
      url={url}
      showDocument={(document) => (
        <PDFHighlighter
          pdfDocument={document}
          highlights={highlights}
          selectedHighlight={selectedHighlight}
          enableAreaSelection={enableAreaSelection}
          areaSelectionActive={areaSelectActive}
          onHighlighting={setInProgressHighlight}
          onHighlightUpdated={onHighlightUpdated}
          onHighlightClicked={(h) => setSelectedHighlight(h.id)}
          onKeyDown={onKeyDown}
          highlightColor={highlightColor}
        >
          <ActionButton
            bottom={20}
            right={15}
            onColorSelect={setHighlightColor}
            onSelectMode={setAreaSelectActive}
          />
        </PDFHighlighter>
      )}
    />
  );
};
