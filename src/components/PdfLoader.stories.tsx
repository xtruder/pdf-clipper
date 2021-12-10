import React from "react";
import { Story } from "@storybook/react";

import { PdfLoader } from "./PdfLoader";

export default {
  title: "PdfLoader",
};

export const ThePdfLoader: Story = (args) => {
  return (
    <PdfLoader
      url={args.url}
      showDocument={(document) => (
        <a>New PDF document with {document.numPages} pages</a>
      )}
      onError={args.onError}
      showLoader={() => <a>Loading...</a>}
    ></PdfLoader>
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
