import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useRecoilValue, useSetRecoilState } from "recoil";

import {
  DocumentInfoCard,
  DocumentInfoCardList,
} from "~/components/DocumentInfoCard";
import { ErrorFallback } from "~/components/ErrorFallback";
import { useStateCtx } from "~/state/state";

const DocumentInfoCardContainer: React.FC<{
  documentId: string;
  onOpen: () => void;
}> = ({ documentId, onOpen }) => {
  const { documentInfo } = useStateCtx();

  const { title, description, cover, pageCount } = useRecoilValue(
    documentInfo(documentId)
  );

  const setDocumentInfo = useSetRecoilState(documentInfo(documentId));

  return (
    <DocumentInfoCard
      title={title}
      description={description}
      cover={cover}
      pages={pageCount}
      onOpen={onOpen}
      onDescriptionChanged={(description) =>
        setDocumentInfo((info) => ({ ...info, description }))
      }
      onTitleChanged={(title) =>
        setDocumentInfo((info) => ({ ...info, title }))
      }
    />
  );
};

const DocumentInfoCardWrapper: React.FC<{ documentId: string }> = ({
  documentId,
  children,
}) => {
  const { documentLoadProgress: pdfDocumentLoadProgress } = useStateCtx();

  const progress = useRecoilValue(pdfDocumentLoadProgress(documentId));

  return (
    <Suspense
      fallback={
        <DocumentInfoCard isLoading={true} loadingProgress={progress} />
      }
    >
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        {children}
      </ErrorBoundary>
    </Suspense>
  );
};

export const DocumentListContainer: React.FC<{
  documentIds: string[];
  onOpen?: (documentId: string) => void;
}> = ({ documentIds, onOpen }) => {
  return (
    <DocumentInfoCardList>
      {documentIds.map((documentId) => (
        <DocumentInfoCardWrapper documentId={documentId} key={documentId}>
          <DocumentInfoCardContainer
            documentId={documentId}
            onOpen={() => onOpen && onOpen(documentId)}
          />
        </DocumentInfoCardWrapper>
      ))}
    </DocumentInfoCardList>
  );
};
