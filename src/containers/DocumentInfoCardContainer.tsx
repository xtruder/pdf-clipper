import React, { Suspense, useCallback, useEffect } from "react";

import { gql } from "urql";
import { useMyMutation, useMyQuery } from "~/gql/hooks";

import { DocumentInfoCard } from "@pdf-clipper/components";
import { MyErrorBoundary } from "~/MyErrorBoundary";

const getDocumentInfoQuery = gql(`
  query getDocumentInfo($documentId: ID!) @live {
    document(id: $documentId) {
      ...DocumentInfoFragment
    }
  }
`);

const updateDocumentMutation = gql(`
  mutation updateDocument($document: UpdateDocumentInput!) {
    updateDocument(document: $document) {
      ...DocumentInfoFragment
    }
  }
`);

const deleteDocumentMutation = gql(`
  mutation deleteDocument($documentId: ID!) {
    deleteDocument(id: $documentId) {
      id
    }
  }
`);

export const DocumentInfoCardContainer: React.FC<{
  documentId: string;
  onOpen?: () => void;
}> = ({ documentId, onOpen }) => {
  const DocumentInfoCardLoader = useCallback(() => {
    useEffect(() => () => console.log("info card recreated"), []);
    const [{ data }] = useMyQuery({
      query: getDocumentInfoQuery,
      variables: {
        documentId,
      },
      requestPolicy: "cache-and-network",
      throwOnError: true,
    });

    const [, updateDocument] = useMyMutation(updateDocumentMutation, {
      propagateError: true,
      throwOnError: true,
      errorPrefix: "Document update error: ",
    });

    const [, deleteDocument] = useMyMutation(deleteDocumentMutation, {
      propagateError: true,
      throwOnError: true,
      errorPrefix: "Document delete error: ",
    });

    const meta = data!.document.meta;
    const { title, description, pageCount } = meta;

    const cover = data!.document.cover?.blob
      ? data!.document.cover.blob
      : data!.document.cover?.url ?? undefined;

    return (
      <DocumentInfoCard
        title={title ?? undefined}
        description={description ?? undefined}
        cover={cover}
        pages={pageCount ?? 0}
        onDescriptionChanged={(description, reset) =>
          updateDocument({
            document: {
              id: documentId,
              meta: { ...meta, description },
            },
          }).catch(reset)
        }
        onTitleChanged={(title, reset) =>
          updateDocument({
            document: {
              id: documentId,
              meta: { ...meta, title },
            },
          }).catch(reset)
        }
        onDeleteClicked={() => deleteDocument({ documentId })}
        onOpen={onOpen}
      />
    );
  }, [documentId]);

  return (
    <Suspense
      fallback={<DocumentInfoCard isLoading={true} loadingProgress={0} />}
    >
      <MyErrorBoundary>
        <DocumentInfoCardLoader />
      </MyErrorBoundary>
    </Suspense>
  );
};
