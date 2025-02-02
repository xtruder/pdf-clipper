import { gql } from "urql";

export const DocumentInfoFragment = gql(`
  fragment DocumentInfoFragment on Document {
    id
    type
    meta {
      title
      description
      pageCount
      outline
    }
    cover {
      url
      blob
    }
    createdAt
    updatedAt
    deletedAt
    visibility
  }
`);

export const DocumentHighlightFragment = gql(`
  fragment DocumentHighlightFragment on DocumentHighlight {
    id
    sequence
    createdAt
    updatedAt
    createdBy {
      id
      name
    }
    color
    content
    location
    image {
      url
      blob
    }
    document {
      id
    }
  }
`);
