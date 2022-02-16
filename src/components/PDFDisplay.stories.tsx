import React from "react";
import { Story } from "@storybook/react";
import { useDarkMode } from "storybook-dark-mode";
import { suspend } from "suspend-react";

import { PDFDisplay } from "./PDFDisplay";
import { loadPDF } from "~/lib/pdfjs";
import { useContextProgress } from "./ProgressIndicator";

export default {
  title: "PDFDisplay",
};

export const ThePDFDisplay: Story = (args) => {
  const isDarkMode = useDarkMode();
  const { setProgress } = useContextProgress();
  const pdfDocument = suspend(() => loadPDF(args.url, setProgress), [args.url]);

  return (
    <PDFDisplay
      pdfDocument={pdfDocument}
      pdfScaleValue={args.pdfScaleValue}
      disableInteractions={args.disableInteractions}
      scrollTo={{
        pageNumber: args.pageNumber,
        top: args.scrollTop,
      }}
      pageLayers={args.pageLayers}
      isDarkReader={isDarkMode}
      //containerClassName="textLayer__selection_red"
      // handlers
      onDocumentReady={args.onDocumentReady}
      onTextLayerRendered={args.onTextLayerRendered}
      onKeyDown={args.onKeyDown}
      onMouseDown={args.onMouseDown}
      onRangeSelection={args.onRangeSelection}
      onPageScroll={args.onPageScroll}
    />
  );
};

ThePDFDisplay.args = {
  url: "https://arxiv.org/pdf/1708.08021.pdf",
  pdfScaleValue: "auto",
  pageNumber: 1,
  scrollTop: 0,
  disableInteractions: false,
  pageLayers: [
    {
      name: "annotationsLayer",
      pages: [
        {
          pageNumber: 1,
          element: <span>Hello World</span>,
        },
        {
          pageNumber: 2,
          element: <span>Hello Slovenia</span>,
        },
        {
          pageNumber: 8,
          element: <span>Hello PDF</span>,
        },
      ],
    },
  ],
};

ThePDFDisplay.argTypes = {
  onError: {
    action: "error",
  },
  onDocumentReady: {
    action: "document ready",
  },
  onTextLayerRendered: {
    action: "text layer rendered",
  },
  onKeyDown: {
    action: "on key down",
  },
  onMouseDown: {
    action: "on mouse down",
  },
  onRangeSelection: {
    action: "on range selection",
  },
  onPageScroll: {
    action: "on page scroll",
  },
};
