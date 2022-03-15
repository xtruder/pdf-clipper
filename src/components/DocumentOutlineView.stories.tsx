import React from "react";
import { Story } from "@storybook/react";

import { DocumentOutline } from "~/models";

import { DocumentOutlineView } from "./DocumentOutlineView";

export default {
  title: "DocumentOutlineView",
};

export const TheDocumentOutlineView: Story = (args) => {
  return <DocumentOutlineView outline={args.outline} />;
};

TheDocumentOutlineView.args = {
  outline: {
    items: [
      {
        title: "Abstract",
        items: [],
      },
      {
        title: "Introduction",
        items: [
          {
            title: "Goals",
            items: [],
          },
          {
            title: "Overview",
            items: [],
          },
          {
            title: "Contributions",
            items: [],
          },
        ],
      },
    ],
  } as DocumentOutline,
};
