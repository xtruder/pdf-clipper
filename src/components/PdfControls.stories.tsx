import React from "react";

import { Story } from "@storybook/react";
import { ActionButton } from "./PdfControls";

export default {
  title: "PDFControls",
};

export const TheActionBar: Story = (args) => {
  return (
    <div className="w-full h-full">
      <ActionButton bottom={20} right={15} />
    </div>
  );
};

TheActionBar.args = {};
