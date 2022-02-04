import React from "react";
import { Story } from "@storybook/react";

import { PDFLoader } from "./PDFLoader";

export default {
  title: "PDFLoader",
};

export const ThePDFLoader: Story = (args) => {
  return (
    <PDFLoader
      url={args.url}
      showDocument={(document) => (
        <a>New PDF document with {document.numPages} pages</a>
      )}
      onError={args.onError}
      showLoader={() => <a>Loading...</a>}
    ></PDFLoader>
  );
};

ThePDFLoader.args = {
  url: "https://arxiv.org/pdf/1708.08021.pdf",
};

ThePDFLoader.argTypes = {
  onError: {
    action: "error",
  },
};
