import React from "react";
import { Story } from "@storybook/react";

import { PdfReader } from "./PdfReader";

export default {
  title: "PdfReader",
};

export const ThePdfReader: Story = (args) => {
  return (
    <div
      style={{
        height: "100vh",
        width: "75vw",
        position: "relative",
      }}
    >
      <PdfReader url={args.url}></PdfReader>
    </div>
  );
};

ThePdfReader.args = {
  url: "https://arxiv.org/pdf/1708.08021.pdf",
};
