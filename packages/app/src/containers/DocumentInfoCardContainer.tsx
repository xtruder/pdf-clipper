import React, { Suspense, useCallback } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { gql, useMutation, useQuery } from "urql";

import { ErrorFallback, DocumentInfoCard } from "@pdf-clipper/components";

const getDocumentInfoQuery = gql(`
  query getDocumentInfo($documentId: ID!) @live {
    document(id: $documentId) {
      ...DocumentInfoFragment
    }
  }
`);

const updateDocumentMutation = gql(`
  mutation updateDocument($document: UpdateDocumentInput!) {
    updateDocument(document: $document) {
      ...DocumentInfoFragment
    }
  }
`);

export const DocumentInfoCardContainer: React.FC<{
  documentId: string;
  onOpen?: () => void;
}> = ({ documentId, onOpen }) => {
  const DocumentInfoCardLoader = useCallback(() => {
    const [{ data, error }] = useQuery({
      query: getDocumentInfoQuery,
      variables: {
        documentId,
      },
    });

    if (!data || error) throw error;

    const [{ error: updateError }, updateDocument] = useMutation(
      updateDocumentMutation
    );

    if (updateError) throw updateError;

    const { __typename: _, ...meta } = data.document.meta;

    const { title, description, pageCount } = meta;

    const cover = data.document.cover?.blob
      ? data.document.cover.blob
      : data.document.cover?.url ?? undefined;

    return (
      <DocumentInfoCard
        title={title ?? undefined}
        description={description ?? undefined}
        cover={cover}
        pages={pageCount ?? 0}
        onDescriptionChanged={(description) =>
          updateDocument({
            document: { id: documentId, meta: { ...meta, description } },
          })
        }
        onTitleChanged={(title) =>
          updateDocument({
            document: { id: documentId, meta: { ...meta, title } },
          })
        }
        onDeleteClicked={() =>
          updateDocument({
            document: { id: documentId, deleted: true },
          })
        }
        onOpen={onOpen}
      />
    );
  }, [documentId]);

  return (
    <Suspense
      fallback={<DocumentInfoCard isLoading={true} loadingProgress={0} />}
    >
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <DocumentInfoCardLoader />
      </ErrorBoundary>
    </Suspense>
  );
};
