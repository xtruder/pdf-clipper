import React, { Suspense, useCallback } from "react";
import { ErrorBoundary } from "react-error-boundary";

import {
  TopbarProgressIndicator,
  useRandomProgress,
  ErrorFallback,
  DocumentInfoCardList,
} from "@pdf-clipper/components";

import { DocumentInfoCardContainer } from "./DocumentInfoCardContainer";
import { gql, useQuery } from "urql";

const getAccountDocumentsIdsQuery = gql(`
  query me @live {
    me {
      id
      documents {
        id
        document {
          id
        }
      }
    }
  }
`);

export const AccountDocumentsListContainer: React.FC<{
  className?: string;
  onOpen?: (documentId: string) => void;
}> = ({ className, onOpen }) => {
  const AccountDocumentsListLoader = useCallback(() => {
    const [{ data, error }] = useQuery({
      query: getAccountDocumentsIdsQuery,
    });

    if (error || !data) throw error;

    const {
      me: { documents: accountDocs },
    } = data;

    return (
      <DocumentInfoCardList className={className}>
        {accountDocs.map(({ document: { id: documentId } }) => (
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
