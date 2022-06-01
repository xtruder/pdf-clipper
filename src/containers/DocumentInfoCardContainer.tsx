import React, { Suspense, useCallback } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { DocumentInfoCard } from "~/components/document/DocumentInfoCard";
import { ErrorFallback } from "~/components/ui/ErrorFallback";

import {
  useGetDocumentInfo,
  useRemoveMeFromDocument,
  useUpsertDocument,
} from "~/graphql";

export const DocumentInfoCardContainer: React.FC<{
  documentId: string;
  onOpen?: () => void;
}> = ({ documentId, onOpen }) => {
  const DocumentInfoCardLoader = useCallback(() => {
    const { meta } = useGetDocumentInfo(documentId);

    const [upsertDocument] = useUpsertDocument();

    // mutation for removing document from account documents
    const [removeMeFromDocument] = useRemoveMeFromDocument(documentId);

    let { title, description, cover, pageCount } = meta;

    return (
      <DocumentInfoCard
        title={title ?? undefined}
        description={description ?? undefined}
        cover={cover ?? undefined}
        pages={pageCount ?? 0}
        onDescriptionChanged={(description) =>
          upsertDocument({
            variables: { document: { id: documentId, meta: { description } } },
          })
        }
        onTitleChanged={(title) =>
          upsertDocument({
            variables: { document: { id: documentId, meta: { title } } },
          })
        }
        onDeleteClicked={() => removeMeFromDocument()}
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
