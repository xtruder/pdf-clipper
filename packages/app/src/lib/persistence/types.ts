export interface DocumentMeta {
  // document title
  title: string;

  // name of the document author
  authorName?: string;

  // number of pages in document
  pageCount?: number;

  // time when document was created
  createdAt?: Date;

  // document size in bytes
  size?: number;
}

export interface DocumentInfo {
  // unique id of the document to fetch it from storage
  id: string;
}
