import React from "react";

import { Story } from "@storybook/react";
import { HighlightCard } from "./HighlightCard";

export default {
  title: "HighlightCard",
};

const loremIpsum = `Lorem ipsum odor amet, consectetuer adipiscing elit. Ac purus in massa egestas mollis varius;
dignissim elementum. Mollis tincidunt mattis hendrerit dolor eros enim, nisi ligula ornare.
Hendrerit parturient habitant pharetra rutrum gravida porttitor eros feugiat. Mollis elit
sodales taciti duis praesent id. Consequat urna vitae morbi nunc congue.`;

const argTypes = {
  color: {
    control: { type: "select", options: ["red", "green", "blue", "yellow"] },
  },
  onClicked: {
    action: "clicked",
  },
  onEditClicked: {
    action: "edit clicked",
  },
  onDeleteClicked: {
    action: "delete clicked",
  },
};

export const TheTextHighlightCard: Story = (args) => {
  return (
    <div className="w-100 h-full p-5">
      <HighlightCard
        text={loremIpsum}
        color={args.color}
        pageNumber={10}
        onClicked={args.onClicked}
        onEditClicked={args.onEditClicked}
        onDeleteClicked={args.onDeleteClicked}
      />
    </div>
  );
};

TheTextHighlightCard.argTypes = argTypes;

export const ThePhotoHighlightCard: Story = (args) => {
  return (
    <div className="w-100 h-full p-5">
      <HighlightCard
        image="https://i.stack.imgur.com/P8iKH.png"
        color={args.color}
        pageNumber={11}
        onClicked={args.onClicked}
        onEditClicked={args.onEditClicked}
        onDeleteClicked={args.onDeleteClicked}
      />
    </div>
  );
};

ThePhotoHighlightCard.argTypes = argTypes;
