import { Story } from "@storybook/react";
import React, { useState } from "react";

import { ReactComponent as CloseIcon } from "~/assets/icons/close-outline.svg";
import { ReactComponent as BookmarkIcon } from "~/assets/icons/bookmark-outline.svg";

import { Scrollboard } from "./Scrollboard";
import { clearRangeSelection, getRangeRects, Rect } from "~/lib/dom";
import { TextHighlight } from "./TextHighlight";
import useEvent from "@react-hook/event";

const loreipsum =
  `Enim dolorem dolorum omnis atque necessitatibus. Consequatur aut adipisci
    qui iusto illo eaque. Consequatur repudiandae et. Nulla ea quasi eligendi.
    Saepe velit autem minima.`.trim();

export default {
  title: "TextHighlight",
};

export const TheTextHighlight: Story = (_args) => {
  const [clientRects, setClientRects] = useState<Rect[]>();
  const [scrollPosition, setScrollPosition] = useState({
    scrollLeft: 0,
    scrollTop: 0,
  });

  const updateSelection = () => {
    const selection = window.getSelection();
    if (!selection) return;

    let range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
    if (!range) return;

    const { scrollLeft, scrollTop } = scrollPosition;

    setClientRects(
      getRangeRects(range).map((r) => ({
        ...r,
        left: r.left + scrollLeft,
        top: r.top + scrollTop,
      }))
    );
  };

  useEvent(document, "keydown", (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      updateSelection();
      setTimeout(clearRangeSelection, 0);
    }

    if (e.key === "Delete") {
      setClientRects(undefined);
    }
  });

  return (
    <Scrollboard onScroll={setScrollPosition}>
      <p className="w-120">
        {loreipsum}
        {loreipsum}
        {loreipsum}
        {loreipsum}
        {loreipsum}
        {loreipsum}
        {loreipsum}
        {loreipsum}
        {loreipsum}
        {loreipsum}
      </p>
      {clientRects && (
        <TextHighlight
          rects={clientRects}
          textBlendMode={"multiply"}
          tooltip={
            <ul className="menu bg-neutral menu-horizontal rounded-box">
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
      )}
    </Scrollboard>
  );
};
