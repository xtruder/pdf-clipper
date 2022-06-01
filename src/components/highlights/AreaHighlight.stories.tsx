import { Story } from "@storybook/react";
import React, { useState } from "react";

import { ReactComponent as CloseIcon } from "~/assets/icons/close-outline.svg";
import { ReactComponent as BookmarkIcon } from "~/assets/icons/bookmark-outline.svg";

import { Rect } from "~/lib/dom";

import { AreaHighlight } from "./AreaHighlight";
import { Scrollboard } from "../ui/Scrollboard";

export default {
  title: "AreaHighlight",
};

export const TheAreaHighlight: Story = (_args) => {
  const [boundingRect, setBoundingRect] = useState<Rect>({
    left: 0,
    top: 0,
    width: 200,
    height: 200,
  });

  return (
    <Scrollboard
      onSize={(width, height) =>
        setBoundingRect({
          ...boundingRect,
          left: width / 2 - boundingRect.width / 2,
          top: height / 2 - boundingRect.height / 2,
        })
      }
    >
      <p>This is some text</p>
      <AreaHighlight
        boundingRect={boundingRect}
        onChange={setBoundingRect}
        isSelected={true}
        blendMode={"multiply"}
        selectedClassName="z-10"
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
