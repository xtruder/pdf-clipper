import React, { useRef } from "react";
import { Story } from "@storybook/react";

import { ReactComponent as CloseIcon } from "~/assets/icons/close-outline.svg";
import { ReactComponent as BookmarkIcon } from "~/assets/icons/bookmark-outline.svg";

import { MouseSelection } from "./MouseSelection";
import { Scrollboard } from "./Scrollboard";

export default {
  title: "MouseSelection",
};

export const TheMouseSelection: Story = (args) => {
  const contentRef = useRef<HTMLDivElement | null>(null);

  return (
    <Scrollboard contentRef={contentRef}>
      <p>Tap and drag or hold alt to start selecting.</p>
      <MouseSelection
        eventsElRef={contentRef}
        className="mix-blend-multiply border-dashed border-2 bg-green-100"
        active={args.active}
        minSelection={args.minSelection}
        shouldStart={() => args.shouldStart}
        onSelection={args.onSelection}
        onSelecting={args.onSelecting}
        onDragStart={args.onDragStart}
        onDragEnd={args.onDragEnd}
        onReset={args.onReset}
        selectionKey={args.selectionKey}
        tooltip={
          <ul className="menu bg-base-100 menu-horizontal rounded-box">
            <li>
              <button>
                <CloseIcon />
              </button>
            </li>
            <li>
              <button>
                <BookmarkIcon />
              </button>
            </li>
          </ul>
        }
      />
    </Scrollboard>
  );
};

TheMouseSelection.args = {
  shouldStart: true,
  active: true,
  minSelection: 10,
  selectionKey: "alt",
};

TheMouseSelection.argTypes = {
  selectionKey: {
    control: { type: "select", options: ["alt", "ctrl"] },
  },
  onSelection: {
    action: "selection",
  },
  onSelecting: {
    action: "selecting",
  },
  onDragStart: {
    action: "drag start",
  },
  onDragEnd: {
    action: "drag end",
  },
  onReset: {
    action: "reset",
  },
};
