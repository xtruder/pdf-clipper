import { Story } from "@storybook/react";
import React, { useState } from "react";

import { ReactComponent as CloseIcon } from "../assets/icons/close-outline.svg";
import { ReactComponent as BookmarkIcon } from "../assets/icons/bookmark-outline.svg";

import { TooltipContainer } from "./TooltipContainer";
import { Scrollboard } from "./Scrollboard";

export default {
  title: "ui/TooltipContainer",
};

export const TheTooltipContainer: Story = (_args) => {
  const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null);

  return (
    <Scrollboard>
      <div>
        <div
          ref={setContainerEl}
          className="w-50 h-50 bg-green-400 rounded-md p-1"
        >
          Hello tooltip container
        </div>
        <TooltipContainer tooltipedEl={containerEl}>
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
        </TooltipContainer>
      </div>
    </Scrollboard>
  );
};
