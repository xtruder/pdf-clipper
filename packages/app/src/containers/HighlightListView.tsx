import React, { FC, Suspense, useCallback } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { gql } from "urql";
import { useMyMutation, useMyQuery } from "~/gql/hooks";

import {
  ErrorFallback,
  HighlightCard,
  HighlightCardList,
  TopbarProgressIndicator,
  useRandomProgress,
} from "@pdf-clipper/components";

export const getDocumentHighlightsQuery = gql(`
  query getDocumentHighlights($documentId: ID!) @live {
    document(id: $documentId) {
      id
      highlights {
        ...DocumentHighlightFragment
      }
    }
  }
`);

const deleteDocumentHighlight = gql(`
  mutation deleteDocumentHighlight($highlightId: ID!) {
    deleteDocumentHighlight(id: $highlightId) {
      id
    }
  }
`);

export interface HighlightListViewProps {
  documentId: string;
  selectedHighlightId?: string;
  scrollToHighlightId?: string;
  onHighlightClicked?: (highlightId: string) => void;
  onHighlightEditClicked?: (highlightId: string) => void;
  onHighlightPageClicked?: (highlightId: string, pageNumber: number) => void;
}

export const HighlightListView: FC<HighlightListViewProps> = ({
  documentId,
  selectedHighlightId,
  scrollToHighlightId,
  onHighlightClicked,
  onHighlightEditClicked,
  onHighlightPageClicked,
}) => {
  const HighlightListLoader = useCallback(() => {
    const [{ data }] = useMyQuery({
      query: getDocumentHighlightsQuery,
      variables: {
        documentId,
      },
      throwOnError: true,
    });

    const [, deleteHighlight] = useMyMutation(deleteDocumentHighlight);

    const highlights = data?.document.highlights ?? [];

    return (
      <HighlightCardList>
        {highlights.map(
          ({ id, color, image, content, location: { pageNumber } }) => (
            <HighlightCard
              key={id}
              color={color}
              image={image?.blob ? image.blob : image?.url ?? undefined}
              text={typeof content === "object" ? "" : content}
              pageNumber={pageNumber}
              selected={id === selectedHighlightId}
              scrollIntoView={id === scrollToHighlightId}
              onDeleteClicked={() => deleteHighlight({ highlightId: id })}
              onClicked={() => onHighlightClicked?.(id)}
              onEditClicked={() => onHighlightEditClicked?.(id)}
              onPageClicked={() => onHighlightPageClicked?.(id, pageNumber)}
            />
          )
        )}
      </HighlightCardList>
    );
  }, []);

  return (
    <Suspense
      fallback={<TopbarProgressIndicator progress={useRandomProgress(600)} />}
    >
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <HighlightListLoader />
      </ErrorBoundary>
    </Suspense>
  );
};
