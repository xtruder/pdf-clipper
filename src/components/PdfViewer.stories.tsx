import React from "react";
import { Story } from "@storybook/react";

import { PDFViewer } from "./PdfViewer";
import { PDFLoader } from "./PdfLoader";

export default {
  title: "PdfViewer",
};

export const ThePdfViewer: Story = (args) => {
  return (
    <PDFLoader
      url={args.url}
      showDocument={(document) => (
        <PDFViewer
          pdfDocument={document}
          pdfScaleValue={args.pdfScaleValue}
          disableInteractions={args.disableInteractions}
          onDocumentReady={args.onDocumentReady}
          onTextLayerRendered={args.onTextLayerRendered}
          onKeyDown={args.onKeyDown}
          onMouseDown={args.onMouseDown}
          onRangeSelection={args.onRangeSelection}
          scrollTo={{
            pageNumber: args.pageNumber,
            top: args.scrollTop,
          }}
          pageLayers={args.pageLayers}
          containerClassName="textLayer__selection_red"
        />
      )}
      onError={args.onError}
      showLoader={() => <a>Loading...</a>}
    ></PDFLoader>
  );
};

ThePdfViewer.args = {
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

ThePdfViewer.argTypes = {
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
};
