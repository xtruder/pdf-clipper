import React, { Suspense, useCallback, useMemo } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { gql } from "urql";
import { GqlContext, useMyQuery } from "~/gql/hooks";

import {
  TopbarProgressIndicator,
  useRandomProgress,
  ErrorFallback,
  DocumentInfoCardList,
} from "@pdf-clipper/components";

import { DocumentInfoCardContainer } from "./DocumentInfoCardContainer";

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
    const [{ data: localData }] = useMyQuery({
      query: getAccountDocumentsIdsQuery,
      context: useMemo(() => ({ source: "local", suspense: true }), []),
      throwOnError: true,
    });

    const [{ data }] = useMyQuery({
      query: getAccountDocumentsIdsQuery,
      context: useMemo(() => ({ suspense: false }), []),
    });

    const docs = (data?.me.documents ?? []).map((d) => ({
      ...d,
      source: "remote",
    }));
    const localDocs = (localData?.me.documents ?? []).map((d) => ({
      ...d,
      source: "local",
    }));

    return (
      <DocumentInfoCardList className={className}>
        {localDocs
          .concat(docs)
          .map(({ document: { id: documentId }, source: source }) => (
            <GqlContext.Provider value={{ source: source as any }}>
              <DocumentInfoCardContainer
                key={documentId}
                documentId={documentId}
                onOpen={() => onOpen?.(documentId)}
              />
            </GqlContext.Provider>
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
