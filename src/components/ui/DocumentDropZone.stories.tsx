import React from "react";

import { Story } from "@storybook/react";
import { DocumentDropZone } from "./DocumentDropZone";

export default {
  title: "DocumentDropZone",
};

export const TheDocumentDropZone: Story = (_args) => {
  return (
    <div className="p-2 w-100 h-40">
      <DocumentDropZone />
    </div>
  );
};

TheDocumentDropZone.args = {};
