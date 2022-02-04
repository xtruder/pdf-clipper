import React from "react";
import { Story } from "@storybook/react";

import { PDFHighlight, HighlightColor } from "~/models";

import { HighlightListView } from "./HighlightListView";

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
      content: {
        text: "some highlight text",
        color: HighlightColor.BLUE,
      },
      location: {
        pageNumber: 1,
        boundingRect: {} as any,
        rects: [],
      },
    },
    {
      id: "h2",
      content: {
        text: "some longer highlight text",
        color: HighlightColor.YELLOW,
      },
      location: {
        pageNumber: 2,
        boundingRect: {} as any,
        rects: [],
      },
    },
    {
      id: "h3",
      content: {
        image: "https://i.stack.imgur.com/P8iKH.png",
        color: HighlightColor.RED,
      },
      location: {
        pageNumber: 3,
        boundingRect: {} as any,
        rects: [],
      },
    },
    {
      id: "h4",
      content: {
        image: "https://i.stack.imgur.com/P8iKH.png",
        color: HighlightColor.RED,
      },
      location: {
        pageNumber: 3,
        boundingRect: {} as any,
        rects: [],
      },
    },
    {
      id: "h5",
      content: {
        image: "https://i.stack.imgur.com/P8iKH.png",
        color: HighlightColor.RED,
      },
      location: {
        pageNumber: 3,
        boundingRect: {} as any,
        rects: [],
      },
    },
    {
      id: "h6",
      content: {
        image: "https://i.stack.imgur.com/P8iKH.png",
        color: HighlightColor.RED,
      },
      location: {
        pageNumber: 3,
        boundingRect: {} as any,
        rects: [],
      },
    },
  ] as PDFHighlight[],
};

TheHighlightListView.argTypes = {};
