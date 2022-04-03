import React, { Suspense, useCallback } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useRecoilState, useSetRecoilState } from "recoil";

import {
  DocumentInfoCard,
  DocumentInfoCardList,
} from "~/components/DocumentInfoCard";
import { ErrorFallback } from "~/components/ErrorFallback";

import { accountDocuments, documentInfo } from "~/state";

const DocumentInfoCardWrapper: React.FC<{
  documentId: string;
  onOpen: () => void;
}> = ({ documentId, onOpen }) => {
  const DocumentInfoCardContainer: React.FC = useCallback(() => {
    const [{ title, description, cover, pageCount }, setDocumentInfo] =
      useRecoilState(documentInfo(documentId));
    const setAccountDocuments = useSetRecoilState(accountDocuments);

    return (
      <DocumentInfoCard
        title={title}
        description={description}
        cover={cover}
        pages={pageCount}
        onOpen={onOpen}
        // remove self from account documents
        onDeleteClicked={() =>
          setAccountDocuments((docs) => docs.filter((d) => d.id !== documentId))
        }
        onDescriptionChanged={(description) =>
          setDocumentInfo((info) => ({ ...info, description }))
        }
        onTitleChanged={(title) =>
          setDocumentInfo((info) => ({ ...info, title }))
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
