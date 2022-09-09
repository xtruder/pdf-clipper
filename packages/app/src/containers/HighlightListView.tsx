import React, { FC, Suspense, useCallback } from "react";
import { gql, useMutation, useQuery } from "urql";

import {
  ErrorFallback,
  HighlightCard,
  HighlightCardList,
  TopbarProgressIndicator,
  useRandomProgress,
} from "@pdf-clipper/components";
import { GetDocumentHighlightsQuery } from "~/gql/graphql";
import { ErrorBoundary } from "react-error-boundary";

const getDocumentHighlightsQuery = gql(`
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
    updateDocumentHighlight(highlight: {id: $highlightId, deleted: true}) {
      id
    }
  }
`);

type Highlight = GetDocumentHighlightsQuery["document"]["highlights"][0];

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
    const [{ data, error }] = useQuery({
      query: getDocumentHighlightsQuery,
      variables: {
        documentId,
      },
    });

    if (error) throw error;

    const [, deleteHighlight] = useMutation(deleteDocumentHighlight);

    const highlights = data?.document.highlights ?? [];

    return (
      <HighlightCardList>
        {highlights.map(
          ({
            id,
            color,
            image,
            content,
            location: { pageNumber },
          }: Highlight) => (
            <HighlightCard
              key={id}
              color={color}
              image={image?.blob ? image.blob : image?.url ?? undefined}
              text={content}
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
