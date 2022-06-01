import React, { Suspense, useCallback } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { DocumentInfoCardList } from "~/components/document/DocumentInfoCard";

import { ErrorFallback } from "~/components/ui/ErrorFallback";
import {
  TopbarProgressIndicator,
  useRandomProgress,
} from "~/components/ui/ProgressIndicator";
import { useGetCurrentAccountDocuments } from "~/graphql";

import { DocumentInfoCardContainer } from "./DocumentInfoCardContainer";

export const AccountDocumentsListContainer: React.FC<{
  className?: string;
  onOpen?: (documentId: string) => void;
}> = ({ className, onOpen }) => {
  const AccountDocumentsListLoader = useCallback(() => {
    const { data } = useGetCurrentAccountDocuments();

    const documents = data.currentAccount?.documents ?? [];

    return (
      <>
        {documents
          .filter((m) => m.document)
          .map((m) => m.document!)
          .map(({ id }) => (
            <DocumentInfoCardContainer
              key={id}
              documentId={id}
              onOpen={() => onOpen?.(id)}
            />
          ))}
      </>
    );
  }, [onOpen]);

  return (
    <Suspense
      fallback={<TopbarProgressIndicator progress={useRandomProgress(600)} />}
    >
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <DocumentInfoCardList className={className}>
          <AccountDocumentsListLoader />
        </DocumentInfoCardList>
      </ErrorBoundary>
    </Suspense>
  );
};
