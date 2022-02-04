import React from "react";

import { Story } from "@storybook/react";
import { ActionButton, ExpandButton } from "./PDFControls";

export default {
  title: "PDFControls",
};

export const TheActionBar: Story = (args) => {
  return (
    <div className="w-full h-full">
      <ExpandButton className="top-4 left-0" />
      <ActionButton bottom={20} right={15} scale={args.scale} />
    </div>
  );
};

TheActionBar.args = {
  scale: 1,
};
