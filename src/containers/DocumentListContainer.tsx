import React, { Suspense, useCallback } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useRecoilState, useResetRecoilState, useSetRecoilState } from "recoil";

import {
  DocumentInfoCard,
  DocumentInfoCardList,
} from "~/components/DocumentInfoCard";
import { ErrorFallback } from "~/components/ErrorFallback";

import { currentAccount, documentInfo } from "~/state";

const DocumentInfoCardWrapper: React.FC<{
  documentId: string;
  onOpen: () => void;
}> = ({ documentId, onOpen }) => {
  const DocumentInfoCardContainer: React.FC = useCallback(() => {
    const [
      {
        meta: { title, description, cover, pageCount },
      },
      setDocumentInfo,
    ] = useRecoilState(documentInfo(documentId));
    const resetDocument = useResetRecoilState(documentInfo(documentId));
    const setAccountInfo = useSetRecoilState(currentAccount);

    return (
      <DocumentInfoCard
        title={title}
        description={description}
        cover={cover}
        pages={pageCount}
        onOpen={onOpen}
        // remove self from account documents
        onDeleteClicked={() => {
          setAccountInfo((info) => ({
            ...info,
            documents: info.documents.filter(
              (doc) => doc.documentId !== documentId
            ),
          }));
          resetDocument();
        }}
        onDescriptionChanged={(description) =>
          setDocumentInfo((info) => ({
            ...info,
            meta: { ...info?.meta, description },
          }))
        }
        onTitleChanged={(title) =>
          setDocumentInfo((info) => ({
            ...info,
            updatedAt: new Date().toISOString(),
            meta: { ...info.meta, title },
          }))
        }
      />
    );
  }, [documentId]);

  return (
    <Suspense
      fallback={<DocumentInfoCard isLoading={true} loadingProgress={0} />}
    >
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <DocumentInfoCardContainer />
      </ErrorBoundary>
    </Suspense>
  );
};

export const DocumentListContainer: React.FC<{
  documentIds: string[];
  className?: string;
  onOpen?: (documentId: string) => void;
}> = ({ className, documentIds, onOpen }) => {
  return (
    <DocumentInfoCardList className={className}>
      {documentIds.map((documentId) => (
        <DocumentInfoCardWrapper
          key={documentId}
          documentId={documentId}
          onOpen={() => onOpen && onOpen(documentId)}
        />
      ))}
    </DocumentInfoCardList>
  );
};
