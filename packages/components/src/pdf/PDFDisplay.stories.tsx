import { Story } from "@storybook/react";
import React from "react";

// utils
import { useDarkMode } from "storybook-dark-mode";
import { suspend } from "suspend-react";

import { loadPDF } from "../lib/pdfjs";

// components
import { PDFLayerPage, PDFLayer, PDFDisplay } from "./PDFDisplay";
import { useContextProgress } from "../ui/ProgressIndicator";

export default {
  title: "pdf/PDFDisplay",
};

export const ThePDFDisplay: Story = (args) => {
  const isDarkMode = useDarkMode();
  const { setProgress } = useContextProgress();
  const pdfDocument = suspend(
    () => loadPDF(args.url, ({ loaded, total }) => setProgress(total / loaded)),
    [args.url]
  );

  return (
    <PDFDisplay
      pdfDocument={pdfDocument}
      pdfScaleValue={args.pdfScaleValue}
      disableInteractions={args.disableInteractions}
      disableTextDoubleClick={args.disableTextDoubleClick}
      scrollTo={{
        pageNumber: args.pageNumber,
        top: args.scrollTop,
        left: 0,
      }}
      layers={[
        <PDFLayer layerName="annotationsLayer">
          <PDFLayerPage pageNumber={1}>
            <span>Hello Mars</span>
          </PDFLayerPage>
          <PDFLayerPage pageNumber={2}>
            <span>Hello Slovenia</span>
          </PDFLayerPage>
          <PDFLayerPage pageNumber={8}>
            <span>Hello PDF</span>
          </PDFLayerPage>
        </PDFLayer>,
      ]}
      enableDarkMode={isDarkMode}
      //containerClassName="textLayer__selection_red"
      // handlers
      onDisplayReady={args.onDocumentReady}
      onTextLayerRendered={args.onTextLayerRendered}
      onKeyDown={args.onKeyDown}
      onRangeSelection={args.onRangeSelection}
      onPageScroll={args.onPageScroll}
      onSingleTap={args.onSingleTap}
      onDoubleTap={args.onDoubleTap}
    />
  );
};

ThePDFDisplay.args = {
  url: "https://arxiv.org/pdf/1708.08021.pdf",
  pdfScaleValue: "auto",
  pageNumber: 1,
  scrollTop: 0,
  disableInteractions: false,
  disableTextDoubleClick: false,
};

ThePDFDisplay.argTypes = {
  onError: {
    action: "error",
  },
  onDisplayReady: {
    action: "display ready",
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
  onSingleTap: {
    action: "single tap",
  },
  onDoubleTap: {
    action: "double tap",
  },
};
