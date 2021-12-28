import React from "react";
import { Story } from "@storybook/react";

import { PDFLoader } from "./PdfLoader";

export default {
  title: "PdfLoader",
};

export const ThePdfLoader: Story = (args) => {
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

ThePdfLoader.args = {
  url: "https://arxiv.org/pdf/1708.08021.pdf",
};

ThePdfLoader.argTypes = {
  onError: {
    action: "error",
  },
};
