import React, { Suspense, useCallback } from "react";

import { gql } from "urql";
import { GqlContext, useMyQuery } from "~/gql/hooks";

import {
  TopbarProgressIndicator,
  useRandomProgress,
  ErrorFallback,
  DocumentInfoCardList,
} from "@pdf-clipper/components";

import { DocumentInfoCardContainer } from "./DocumentInfoCardContainer";
import { MyErrorBoundary } from "~/MyErrorBoundary";

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
  onOpen?: (documentId: string, source: string) => void;
}> = ({ className, onOpen }) => {
  const AccountDocumentsListLoader = useCallback(() => {
    const [{ data: localData }] = useMyQuery({
      query: getAccountDocumentsIdsQuery,
      source: "local",
      throwOnError: true,
      suspend: true,
    });

    const [{ data }] = useMyQuery({
      query: getAccountDocumentsIdsQuery,
      source: "remote",
      throwOnError: true,
      suspend: true,
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
          .map(({ document: { id: documentId }, source }) => (
            <GqlContext.Provider
              value={{ source: source as any }}
              key={`${source}-${documentId}`}
            >
              <DocumentInfoCardContainer
                key={`${source}-${documentId}`}
                documentId={documentId}
                onOpen={() => onOpen?.(documentId, source)}
              />
            </GqlContext.Provider>
          ))}
      </DocumentInfoCardList>
    );
  }, [onOpen]);

  return (
    <Suspense fallback={<TopbarProgressIndicator progress={0} />}>
      <MyErrorBoundary>
        <AccountDocumentsListLoader />
      </MyErrorBoundary>
    </Suspense>
  );
};
