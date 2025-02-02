import { Story } from "@storybook/react";

// react
import React, { useCallback, useState } from "react";
import { suspend } from "suspend-react";
import { useResetState, useToggle } from "ahooks";

// utils
import { loadPDF } from "../lib/pdfjs";

// components
import { useContextProgress } from "../ui/ProgressIndicator";
import { PDFHighlighter } from "./PDFHighlighter";
import { PDFHighlightTooltip, PDFSelectionTooltip } from "./PDFControls";

// types
import { PDFHighlight, PDFHighlightWithKey } from "./types";

export default {
  title: "pdf/PDFHighlighter",
};

export const ThePDFHighlighter: Story = (args) => {
  const { setProgress } = useContextProgress();
  const pdfDocument = suspend(
    () => loadPDF(args.url, ({ loaded, total }) => setProgress(total / loaded)),
    [args.url]
  );

  const [highlights, setHighlights] = useState<PDFHighlightWithKey[]>([]);
  const [
    inProgressHighlight,
    setInProgressHighlight,
    resetInProgressHighlight,
  ] = useResetState<PDFHighlight | null>(null);
  const [selectedHighlight, setSelectedHighlight, resetSelectedHighlight] =
    useResetState<string | null>(null);
  const [clearSelection, { toggle: doClearSelection }] = useToggle();

  const addHighlight = useCallback(() => {
    if (!inProgressHighlight) return;

    const highlight = {
      ...inProgressHighlight,
      key: (Math.random() + 1).toString(36).substring(7),
    };

    doClearSelection();
    resetInProgressHighlight();

    setHighlights([...highlights, highlight]);
    setSelectedHighlight(highlight.key);
  }, [inProgressHighlight, highlights]);

  const deleteHighlight = useCallback(() => {
    if (!selectedHighlight) return;

    const newHighlights = highlights.filter((h) => h.key !== selectedHighlight);

    setSelectedHighlight(null);
    setHighlights(newHighlights);
  }, [selectedHighlight, highlights]);

  return (
    <div>
      <PDFHighlighter
        pdfDocument={pdfDocument}
        highlights={highlights}
        pdfScaleValue={args.pdfScaleValue}
        highlightColor={args.highlightColor}
        selectedHighlight={selectedHighlight}
        clearSelection={clearSelection}
        selectionTooltip={<PDFSelectionTooltip onClick={addHighlight} />}
        highlightTooltip={
          <PDFHighlightTooltip onRemoveClicked={deleteHighlight} />
        }
        showHighlights={args.showHighlights}
        onHighlighting={(highlight) => {
          args.onHighlighting(highlight);

          setInProgressHighlight(highlight);
        }}
        onHighlightUpdated={(highlight) => {
          args.onHighlightUpdated(highlight);

          const newHighlights = [...highlights];
          const idx = newHighlights.findIndex((h) => h.key === highlight.key);

          newHighlights[idx] = highlight;

          setHighlights(newHighlights);
          setSelectedHighlight(highlight.key);
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
              doClearSelection();
              resetSelectedHighlight();

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
