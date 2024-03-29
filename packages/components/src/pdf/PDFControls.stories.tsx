import React from "react";

import { Story } from "@storybook/react";
import { PDFActionButton, ExpandButton } from "./PDFControls";

export default {
  title: "pdf/PDFControls",
};

export const TheActionBar: Story = (args) => {
  return (
    <div className="w-full h-full">
      <ExpandButton className="top-4 left-0" />
      <PDFActionButton scale={args.scale} />
    </div>
  );
};

TheActionBar.args = {
  scale: 1,
};
