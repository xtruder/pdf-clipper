/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

declare module "urql" {

  export function gql(source: "\n  mutation createDocument($input: CreateDocumentInput!) {\n    createDocument(document: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').CreateDocumentDocument;
  export function gql(source: "\n  mutation uploadBlob($blob: UploadBlobInput!) {\n    uploadBlob(blob: $blob) {\n      hash\n    }\n  }\n"): typeof import('./graphql').UploadBlobDocument;
  export function gql(source: "\n  query getDocumentInfo($documentId: ID!) @live {\n    document(id: $documentId) {\n      ...DocumentInfoFragment\n    }\n  }\n"): typeof import('./graphql').GetDocumentInfoDocument;
  export function gql(source: "\n  mutation updateDocument($document: UpdateDocumentInput!) {\n    updateDocument(document: $document) {\n      ...DocumentInfoFragment\n    }\n  }\n"): typeof import('./graphql').UpdateDocumentDocument;
  export function gql(source: "\n  mutation deleteDocument($documentId: ID!) {\n    deleteDocument(id: $documentId) {\n      id\n    }\n  }\n"): typeof import('./graphql').DeleteDocumentDocument;
  export function gql(source: "\n  query me @live {\n    me {\n      id\n      documents {\n        id\n        document {\n          id\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').MeDocument;
  export function gql(source: "\n  query getDocumentHighlights($documentId: ID!) @live {\n    document(id: $documentId) {\n      id\n      highlights {\n        ...DocumentHighlightFragment\n      }\n    }\n  }\n"): typeof import('./graphql').GetDocumentHighlightsDocument;
  export function gql(source: "\n  mutation deleteDocumentHighlight($highlightId: ID!) {\n    deleteDocumentHighlight(id: $highlightId) {\n      id\n    }\n  }\n"): typeof import('./graphql').DeleteDocumentHighlightDocument;
  export function gql(source: "\n  mutation createDocumentHighlight($highlight: CreateDocumentHighlightInput!) {\n    createDocumentHighlight(highlight: $highlight) {\n      ...DocumentHighlightFragment\n    }\n  }\n"): typeof import('./graphql').CreateDocumentHighlightDocument;
  export function gql(source: "\n  mutation updateDocumentHighlight($highlight: UpdateDocumentHighlightInput!) {\n    updateDocumentHighlight(highlight: $highlight) {\n      ...DocumentHighlightFragment\n    }\n  }\n"): typeof import('./graphql').UpdateDocumentHighlightDocument;
  export function gql(source: "\n  query getDocumentInfoWithFile($documentId: ID!) @live {\n    document(id: $documentId) {\n      ...DocumentInfoFragment\n      file {\n        hash\n        url\n        blob\n      }\n    }\n  }\n"): typeof import('./graphql').GetDocumentInfoWithFileDocument;
  export function gql(source: "\n  fragment DocumentInfoFragment on Document {\n    id\n    type\n    meta {\n      title\n      description\n      pageCount\n      outline\n    }\n    cover {\n      url\n      blob\n    }\n    createdAt\n    updatedAt\n    deletedAt\n    visibility\n  }\n"): typeof import('./graphql').DocumentInfoFragmentFragmentDoc;
  export function gql(source: "\n  fragment DocumentHighlightFragment on DocumentHighlight {\n    id\n    sequence\n    createdAt\n    updatedAt\n    createdBy {\n      id\n      name\n    }\n    color\n    content\n    location\n    image {\n      url\n      blob\n    }\n    document {\n      id\n    }\n  }\n"): typeof import('./graphql').DocumentHighlightFragmentFragmentDoc;
  export function gql(source: string): unknown;

    export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<    infer TType,    any  >    ? TType    : never;  
}