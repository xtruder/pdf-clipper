import React, { Suspense, useCallback } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { DocumentInfoCard } from "~/components/document/DocumentInfoCard";
import { ErrorFallback } from "~/components/ui/ErrorFallback";

import { DocumentMeta, useMutation, useQuery, query } from "~/gqty";

export const DocumentInfoCardContainer: React.FC<{
  documentId: string;
  onOpen?: () => void;
}> = ({ documentId, onOpen }) => {
  const DocumentInfoCardLoader = useCallback(() => {
    // fetch document meta from api
    const { meta } = useQuery({ suspense: true }).document({ id: documentId });

    // mutation for updating document meta
    const [upsertDocument] = useMutation(
      (mutation, updateMeta: Partial<DocumentMeta>) =>
        mutation.upsertDocument({
          document: {
            id: documentId,
            meta: { ...meta, ...updateMeta },
          },
        }),
      {
        suspense: true,
        refetchQueries: [
          query.currentAccount.documents,
          query.document({ id: documentId }),
        ],
      }
    );

    // mutation for removing document from account documents
    const [removeMeFromDocument] = useMutation(
      (mutation) => mutation.removeMeFromDocument({ documentId }),
      {
        suspense: true,
        refetchQueries: [
          query.currentAccount.documents,
          query.document({ id: documentId }),
        ],
      }
    );

    let { title, description, cover, pageCount } = meta;

    return (
      <DocumentInfoCard
        title={title ?? undefined}
        description={description ?? undefined}
        cover={cover ?? undefined}
        pages={pageCount ?? 0}
        onDescriptionChanged={(description) =>
          upsertDocument({ args: { description } })
        }
        onTitleChanged={(title) => upsertDocument({ args: { title } })}
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
