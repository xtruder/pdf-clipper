import React from "react";

import { Story } from "@storybook/react";

import {
  RadialProgressIndicator,
  TopbarProgressIndicator,
  useRandomProgress,
} from "./ProgressIndicator";

export default {
  title: "ui/ProgressIndicator",
};

export const TheRadialProgressIndicator: Story = (args) => {
  return (
    <div className="p-2 w-full h-screen">
      <RadialProgressIndicator
        progress={args.progress / 100}
        showPct={args.showPct}
        message={args.message}
        size={args.size}
      />
    </div>
  );
};

TheRadialProgressIndicator.argTypes = {
  size: {
    options: ["sm", "md", "lg"],
    control: { type: "select" },
  },
  progress: {
    control: { type: "range", min: 0, max: 100, step: 10 },
  },
};

TheRadialProgressIndicator.args = {
  showPct: true,
  message: "",
  progress: 30,
  size: "md",
};

export const TheTopbarProgressIndicator: Story = (args) => {
  return (
    <div className="w-full h-screen">
      <TopbarProgressIndicator
        progress={args.progress / 100}
        message={args.message}
      />
    </div>
  );
};

TheTopbarProgressIndicator.argTypes = {
  progress: {
    control: { type: "range", min: 0, max: 100, step: 10 },
  },
};

TheTopbarProgressIndicator.args = {
  message: "",
  progress: 30,
};

export const TheRandomProgressIndicator: Story = (args) => {
  const progress = useRandomProgress(
    args.duration < 1000 ? 1000 : args.duration
  );

  return (
    <div className="p-2 w-full h-screen">
      <RadialProgressIndicator progress={progress} showPct={args.showPct} />
    </div>
  );
};

TheRandomProgressIndicator.args = {
  duration: 10000,
  showPct: true,
};
