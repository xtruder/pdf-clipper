import React, { Suspense } from "react";
import { useRecoilValue } from "recoil";
import { HighlightCard, HighlightCardList } from "~/components/HighlightCard";

import { Highlight, PDFHighlight } from "~/models";
import { documentHighlights } from "~/state/localState";
import { useStateCtx } from "~/state/state";

export interface HighlightListContainerProps {
  documentId: string;
  scrollToHighlight?: PDFHighlight;
  selectedHighlight?: PDFHighlight;
  onHighlightClicked?: (h: PDFHighlight) => void;
  onHighlightDeleteClicked?: (h: PDFHighlight) => void;
  onHighlightEditClicked?: (h: PDFHighlight) => void;
  onHighlightPageClicked?: (h: PDFHighlight) => void;
}

export const HighlightListContainer: React.FC<HighlightListContainerProps> = ({
  documentId,
  scrollToHighlight,
  selectedHighlight,
  onHighlightClicked = () => null,
  onHighlightDeleteClicked = () => null,
  onHighlightEditClicked = () => null,
  onHighlightPageClicked = () => null,
}) => {
  const highlights: PDFHighlight[] = useRecoilValue(
    documentHighlights(documentId)
  ).filter((h) => !h.deleted);

  // sort highlights by page number
  const sortedHighlights = [...highlights].sort(
    (h1, h2) => h1.location.pageNumber - h2.location.pageNumber
  );

  const renderHighlight = (h: Highlight, image?: string) => {
    const selected = h.id === selectedHighlight?.id;
    const scrollIntoView = h.id === scrollToHighlight?.id;

    return (
      <HighlightCard
        text={h.content.text}
        image={image || h.content.thumbnail}
        color={h.content.color}
        pageNumber={h.location.pageNumber}
        selected={selected}
        scrollIntoView={scrollIntoView}
        onClicked={() => onHighlightClicked(h)}
        onDeleteClicked={() => onHighlightDeleteClicked(h)}
        onEditClicked={() => onHighlightEditClicked(h)}
        onPageClicked={() => onHighlightPageClicked(h)}
      />
    );
  };

  const HighlightCardContainer: React.FC<{ highlight: Highlight }> = ({
    highlight,
  }) => {
    const { documentHighlightImage } = useStateCtx();

    const image = useRecoilValue(
      documentHighlightImage([documentId, highlight.id])
    );

    return renderHighlight(highlight, image);
  };

  const highlightCards = sortedHighlights.map((h) => {
    if (h.content.text) return renderHighlight(h);

    return (
      <Suspense key={h.id} fallback={renderHighlight(h)}>
        <HighlightCardContainer highlight={h} />
      </Suspense>
    );
  });

  return <HighlightCardList>{highlightCards}</HighlightCardList>;
};
