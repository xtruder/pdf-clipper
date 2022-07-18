import React, { FC, Suspense, useCallback } from "react";
import { useAtomValue } from "jotai";
import { ErrorBoundary } from "react-error-boundary";

import { documentHighlightAtom, documentHighlightImageAtom } from "~/state";

import {
  HighlightCard,
  DocumentInfoCard,
  ErrorFallback,
} from "@pdf-clipper/components";

interface HighlightCardContainerProps {
  documentId: string;
  highlightId: string;
  selected?: boolean;
  scrollIntoView?: boolean;

  onClicked?(): void;
  onDeleteClicked?(): void;
  onEditClicked?(): void;
  onPageClicked?(): void;
}

export const HighlightCardContainer: FC<HighlightCardContainerProps> = ({
  documentId,
  highlightId,
  selected,
  scrollIntoView,
  onClicked,
  onDeleteClicked,
  onEditClicked,
  onPageClicked,
}) => {
  const HighlightCardLoader = useCallback(() => {
    const highlight = useAtomValue(documentHighlightAtom(highlightId));

    const highlightImage = useAtomValue(
      documentHighlightImageAtom(highlightId)
    );

    return (
      <HighlightCard
        key={highlight.id}
        text={highlight.content.text}
        image={highlightImage ?? undefined}
        fallbackImage={highlight.content.thumbnail}
        color={highlight.content.color}
        pageNumber={highlight.location.pageNumber}
        selected={selected}
        scrollIntoView={scrollIntoView}
        onClicked={onClicked}
        onDeleteClicked={onDeleteClicked}
        onEditClicked={onEditClicked}
        onPageClicked={onPageClicked}
      />
    );
  }, [documentId]);

  return (
    <Suspense
      fallback={<DocumentInfoCard isLoading={true} loadingProgress={0} />}
    >
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <HighlightCardLoader />
      </ErrorBoundary>
    </Suspense>
  );
};
