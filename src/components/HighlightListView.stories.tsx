import React from "react";
import { Story } from "@storybook/react";

import { HighlightListView } from "./HighlightListView";
import { Highlight, HighlightColor } from "~/lib/highlights/types";

export default {
  title: "HighlightListView",
};

export const TheHighlightListView: Story = (args) => {
  return (
    <div className="w-100 h-full p-5">
      <HighlightListView
        highlights={args.highlights}
        scrollToHighlight={args.scrollToHighlight}
      />{" "}
    </div>
  );
};

TheHighlightListView.args = {
  scrollToHighlight: "unknown",
  highlights: [
    {
      id: "h1",
      color: HighlightColor.BLUE,
      content: {
        text: "some highlight text",
      },
      location: {
        pageNumber: 1,
        boundingRect: {} as any,
        rects: [],
      },
    },
    {
      id: "h2",
      color: HighlightColor.YELLOW,
      content: {
        text: "some longer highlight text",
      },
      location: {
        pageNumber: 2,
        boundingRect: {} as any,
        rects: [],
      },
    },
    {
      id: "h3",
      color: HighlightColor.RED,
      content: {
        image: "https://i.stack.imgur.com/P8iKH.png",
      },
      location: {
        pageNumber: 3,
        boundingRect: {} as any,
        rects: [],
      },
    },
    {
      id: "h4",
      color: HighlightColor.RED,
      content: {
        image: "https://i.stack.imgur.com/P8iKH.png",
      },
      location: {
        pageNumber: 3,
        boundingRect: {} as any,
        rects: [],
      },
    },
    {
      id: "h5",
      color: HighlightColor.RED,
      content: {
        image: "https://i.stack.imgur.com/P8iKH.png",
      },
      location: {
        pageNumber: 3,
        boundingRect: {} as any,
        rects: [],
      },
    },
    {
      id: "h6",
      color: HighlightColor.RED,
      content: {
        image: "https://i.stack.imgur.com/P8iKH.png",
      },
      location: {
        pageNumber: 3,
        boundingRect: {} as any,
        rects: [],
      },
    },
  ] as Highlight[],
};

TheHighlightListView.argTypes = {};
