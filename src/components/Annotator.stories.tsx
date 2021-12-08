import React from "react";
import { Story } from "@storybook/react";

import { Annotator } from "./Annotator";

export default {
  title: "Annotator",
};

export const TheAnnotator: Story = (args) => {
  return (
    <div
      style={{
        height: "100vh",
        width: "75vw",
        position: "relative",
      }}
    >
      <Annotator url={args.url}></Annotator>
    </div>
  );
};

TheAnnotator.args = {
  url: "https://arxiv.org/pdf/1708.08021.pdf",
};
