import React, { useCallback, useEffect } from "react";
import {
  useRecoilValue,
  useRecoilValueLoadable,
  useResetRecoilState,
} from "recoil";
import { HighlightCard, HighlightCardList } from "~/components/HighlightCard";

import { DocumentHighlight, PDFHighlight } from "~/types";
import { documentHighlightImage, documentHighlights } from "~/state";

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
  const HighlightCardContainer: React.FC<{ highlight: DocumentHighlight }> =
    useCallback(
      ({ highlight }) => {
        const selected = highlight.id === selectedHighlight?.id;
        const scrollIntoView = highlight.id === scrollToHighlight?.id;

        const imageLoadable = useRecoilValueLoadable(
          documentHighlightImage([
            documentId,
            highlight.id,
            (highlight.updatedAt
              ? new Date(highlight.updatedAt)
              : new Date()
            ).getTime(),
          ])
        );

        return (
          <HighlightCard
            text={highlight.content.text}
            image={imageLoadable.valueMaybe() || highlight.content?.thumbnail}
            color={highlight.content.color}
            pageNumber={highlight.location.pageNumber}
            selected={selected}
            scrollIntoView={scrollIntoView}
            onClicked={() => onHighlightClicked(highlight)}
            onDeleteClicked={() => onHighlightDeleteClicked(highlight)}
            onEditClicked={() => onHighlightEditClicked(highlight)}
            onPageClicked={() => onHighlightPageClicked(highlight)}
          />
        );
      },
      [documentId, scrollToHighlight, selectedHighlight]
    );

  const highlights: PDFHighlight[] = useRecoilValue(
    documentHighlights(documentId)
  ).filter((h) => h.location);

  // sort highlights by page number
  const sortedHighlights = [...highlights].sort(
    (h1, h2) => h1.location!.pageNumber - h2.location!.pageNumber
  );

  return (
    <HighlightCardList>
      {sortedHighlights.map((h) => {
        return <HighlightCardContainer highlight={h} key={h.id} />;
      })}
    </HighlightCardList>
  );
};
