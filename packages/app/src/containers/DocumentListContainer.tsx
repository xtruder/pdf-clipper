import React, { Suspense, useCallback } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useAtomValue } from "jotai";

import {
  TopbarProgressIndicator,
  useRandomProgress,
  ErrorFallback,
  DocumentInfoCardList,
} from "@pdf-clipper/components";

import { accountDocumentsAtom, currentAccountAtom } from "~/state";

import { DocumentInfoCardContainer } from "./DocumentInfoCardContainer";

export const AccountDocumentsListContainer: React.FC<{
  className?: string;
  onOpen?: (documentId: string) => void;
}> = ({ className, onOpen }) => {
  const AccountDocumentsListLoader = useCallback(() => {
    const { id: accountId } = useAtomValue(currentAccountAtom);
    const accountDocs = useAtomValue(accountDocumentsAtom(accountId));

    return (
      <DocumentInfoCardList className={className}>
        {accountDocs.map(({ documentId }) => (
          <DocumentInfoCardContainer
            key={documentId}
            documentId={documentId}
            onOpen={() => onOpen?.(documentId)}
          />
        ))}
      </DocumentInfoCardList>
    );
  }, [onOpen]);

  return (
    <Suspense
      fallback={<TopbarProgressIndicator progress={useRandomProgress(600)} />}
    >
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <AccountDocumentsListLoader />
      </ErrorBoundary>
    </Suspense>
  );
};