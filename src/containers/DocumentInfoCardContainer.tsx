import { useAtom, useAtomValue } from "jotai";
import React, { Suspense, useCallback } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { DocumentInfoCard } from "~/components/document/DocumentInfoCard";
import { ErrorFallback } from "~/components/ui/ErrorFallback";

import { currentAccountAtom, documentAtom, documentMembersAtom } from "~/state";

export const DocumentInfoCardContainer: React.FC<{
  documentId: string;
  onOpen?: () => void;
}> = ({ documentId, onOpen }) => {
  const DocumentInfoCardLoader = useCallback(() => {
    const { id: accountId } = useAtomValue(currentAccountAtom);
    const [{ meta = {} }, setDocument] = useAtom(documentAtom(documentId));
    const [documentMembers, dispatchDocumentMembers] = useAtom(
      documentMembersAtom(documentId)
    );

    let { title, description, cover, pageCount } = meta;

    return (
      <DocumentInfoCard
        title={title ?? undefined}
        description={description ?? undefined}
        cover={cover ?? undefined}
        pages={pageCount ?? 0}
        onDescriptionChanged={(description) =>
          setDocument({ id: documentId, meta: { ...meta, description } })
        }
        onTitleChanged={(title) =>
          setDocument({ id: documentId, meta: { ...meta, title } })
        }
        onDeleteClicked={() =>
          dispatchDocumentMembers({
            action: "remove",
            value: documentMembers.find(
              (member) => member.accountId === accountId
            )?.id,
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
