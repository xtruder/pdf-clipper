import React from "react";
import useState from "react-usestateref";
import { suspend } from "suspend-react";

import { Story } from "@storybook/react";

import { PartialPDFHighlight, PDFHighlight } from "~/models";
import { loadPDF } from "~/lib/pdfjs";

import { PDFHighlighter } from "./PDFHighlighter";
import { useContextProgress } from "./ProgressIndicator";

import { ReactComponent as CloseIcon } from "~/assets/icons/close-outline.svg";
import { ReactComponent as BookmarkIcon } from "~/assets/icons/bookmark-outline.svg";
import { clearRangeSelection } from "~/lib/dom";
import { resetValue } from "~/lib/react";

export default {
  title: "PDFHighlighter",
};

export const ThePDFHighlighter: Story = (args) => {
  const { setProgress } = useContextProgress();
  const pdfDocument = suspend(() => loadPDF(args.url, setProgress), [args.url]);

  const [highlights, setHighlights, highlightsRef] = useState<PDFHighlight[]>(
    []
  );
  const [_, setInProgressHighlight, inProgressHighlightRef] =
    useState<PDFHighlight>();
  const [selectedHighlight, setSelectedHighlight] = useState<PDFHighlight>();
  const [tooltipedHighlight, setTooltipedHighlight] =
    useState<PartialPDFHighlight>();
  const [enableAreaSelection, setEnableAreaSelection] = useState(true);

  return (
    <PDFHighlighter
      pdfDocument={pdfDocument}
      highlights={highlights}
      pdfScaleValue={args.pdfScaleValue}
      highlightColor={args.highlightColor}
      selectedHighlight={selectedHighlight}
      tooltipedHighlight={tooltipedHighlight}
      enableAreaSelection={enableAreaSelection}
      highlightTooltip={
        <ul className="menu bg-base-100 menu-horizontal rounded-box">
          <li>
            <button
              onClick={() => {
                clearRangeSelection();
                resetValue(setEnableAreaSelection, true);

                if (tooltipedHighlight?.content) {
                  setHighlights(
                    highlightsRef.current.filter(
                      (h) => h.id !== tooltipedHighlight.id
                    )
                  );
                } else {
                  setTooltipedHighlight(undefined);
                }
              }}
            >
              <CloseIcon />
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                if (!inProgressHighlightRef.current) return;

                const highlight = inProgressHighlightRef.current;

                setSelectedHighlight(highlight);
                setHighlights([...highlightsRef.current, highlight]);

                setInProgressHighlight(undefined);
              }}
            >
              <BookmarkIcon />
            </button>
          </li>
        </ul>
      }
      showHighlights={args.showHighlights}
      areaSelectionActive={args.areaSelectionActive}
      onHighlighting={(highlight) => {
        args.onHighlighting(highlight);

        setInProgressHighlight(highlight);
        setTooltipedHighlight(highlight);
      }}
      onHighlightUpdated={(highlight) => {
        args.onHighlightUpdated(highlight);

        const newHighlights = [...highlights];
        const idx = newHighlights.findIndex((h) => h.id === highlight.id);

        newHighlights[idx] = highlight;

        setSelectedHighlight(highlight);
        setTooltipedHighlight(highlight);
        setHighlights(newHighlights);
      }}
      onHighlightClicked={(highlight) => {
        args.onHighlightClicked(highlight);

        setSelectedHighlight(highlight);
        setTooltipedHighlight(highlight);
      }}
      onKeyDown={(event: KeyboardEvent) => {
        switch (event.code) {
          case "Enter":
            if (inProgressHighlightRef.current) {
              const highlight = inProgressHighlightRef.current;

              setSelectedHighlight(highlight);
              setHighlights([...highlightsRef.current, highlight]);

              setInProgressHighlight(undefined);
            }

            break;
        }
      }}
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
