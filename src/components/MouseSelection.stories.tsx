import React from "react";
import { Story } from "@storybook/react";

import { MouseSelection } from "./MouseSelection";

export default {
  title: "MouseSelection",
};

export const TheMouseSelection: Story = (args) => {
  return (
    <MouseSelection
      className="border-dashed border-2 bg-dark-100"
      containerClassName="w-100 h-100 bg-light-50"
      minSelection={args.minSelection}
      shouldStart={() => args.shouldStart}
      onSelection={args.onSelection}
      onDragStart={args.onDragStart}
      onDragEnd={args.onDragEnd}
      onReset={args.onReset}
    ></MouseSelection>
  );
};

TheMouseSelection.args = {
  shouldStart: true,
  minSelection: 10,
};

TheMouseSelection.argTypes = {
  onSelection: {
    action: "drag selection",
  },
  onDragStart: {
    action: "drag start",
  },
  onDragEnd: {
    action: "drag end",
  },
  onReset: {
    action: "drag reset",
  },
};
