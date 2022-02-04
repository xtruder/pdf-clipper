import React from "react";
import { PDFHighlight } from "~/models";
import { HighlightCard } from "./HighlightCard";

export interface HighlightListViewProps {
  highlights: PDFHighlight[];
  scrollToHighlight?: PDFHighlight;
  selectedHighlight?: PDFHighlight;
  onHighlightClicked?: (h: PDFHighlight) => void;
  onHighlightDeleteClicked?: (h: PDFHighlight) => void;
  onHighlightEditClicked?: (h: PDFHighlight) => void;
  onHighlightPageClicked?: (h: PDFHighlight) => void;
}

export const HighlightListView: React.FC<HighlightListViewProps> = ({
  highlights,
  scrollToHighlight,
  selectedHighlight,
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
        const selected = h.id === selectedHighlight?.id;
        const scrollIntoView = h.id === scrollToHighlight?.id;

        return (
          <li key={h.id} className="mt-2">
            <HighlightCard
              text={h.content.text}
              image={h.content.image}
              color={h.content.color}
              pageNumber={h.location.pageNumber}
              selected={selected}
              scrollIntoView={scrollIntoView}
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
