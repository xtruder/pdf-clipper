import React from "react";
import { Highlight } from "~/types";
import { HighlightCard } from "./HighlightCard";

export interface HighlightListViewProps {
  highlights: Highlight[];
  onHighlightClicked?: (h: Highlight) => void;
  onHighlightDeleteClicked?: (h: Highlight) => void;
  onHighlightEditClicked?: (h: Highlight) => void;
  onHighlightPageClicked?: (h: Highlight) => void;
}

export const HighlightListView: React.FC<HighlightListViewProps> = ({
  highlights,
  onHighlightClicked = () => null,
  onHighlightDeleteClicked = () => null,
  onHighlightEditClicked = () => null,
  onHighlightPageClicked = () => null,
}) => {
  // sort highlights by page number
  const sortedHighlights = [...highlights].sort(
    (h1, h2) => h1.location.pageNumber - h2.location.pageNumber
  );

  return (
    <ul>
      {sortedHighlights.map((h) => {
        return (
          <li key={h.id} className="mt-2">
            <HighlightCard
              text={h.content.text}
              image={h.content.image}
              color={h.color}
              pageNumber={h.location.pageNumber}
              onClicked={() => onHighlightClicked(h)}
              onDeleteClicked={() => onHighlightDeleteClicked(h)}
              onEditClicked={() => onHighlightEditClicked(h)}
              onPageClicked={() => onHighlightPageClicked(h)}
            />
          </li>
        );
      })}
    </ul>
  );
};
