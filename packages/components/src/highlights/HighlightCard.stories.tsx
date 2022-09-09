import React from "react";

import { Story } from "@storybook/react";
import {
  HighlightCard,
  HighlightCardList,
  HighlightCardProps,
} from "./HighlightCard";
import { HighlightColor } from "./types";

export default {
  title: "highlights/HighlightCard",
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

export const TheHighlightCardList: Story = (args) => {
  return (
    <div className="w-100 h-full p-5">
      <HighlightCardList>
        {(args.highlights as HighlightCardProps[]).map((h, i) => (
          <HighlightCard
            key={i}
            pageNumber={h.pageNumber}
            text={h.text}
            color={h.color}
            image={h.image}
          />
        ))}
      </HighlightCardList>
    </div>
  );
};

TheHighlightCardList.args = {
  scrollToHighlight: "unknown",
  highlights: [
    {
      id: "h1",
      text: "some highlight text",
      color: HighlightColor.Blue,
      pageNumber: 1,
    },
    {
      id: "h2",
      text: "some longer highlight text",
      color: HighlightColor.Yellow,
      pageNumber: 2,
    },
    {
      id: "h3",
      image: "https://i.stack.imgur.com/P8iKH.png",
      color: HighlightColor.Red,
      pageNumber: 3,
    },
    {
      id: "h4",
      image: "https://i.stack.imgur.com/P8iKH.png",
      color: HighlightColor.Red,
      pageNumber: 3,
    },
    {
      id: "h5",
      image: "https://i.stack.imgur.com/P8iKH.png",
      color: HighlightColor.Red,
      pageNumber: 5,
    },
    {
      id: "h6",
      image: "https://i.stack.imgur.com/P8iKH.png",
      color: HighlightColor.Red,
      pageNumber: 4,
    },
  ],
};
