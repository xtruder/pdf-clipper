export enum DocumentType {
  PDF = "pdf",
}

export interface OutlineNode {
  title: string;
  pageNumber?: number;
  items: OutlineNode[];
}

export interface DocumentOutline {
  items: OutlineNode[];
}

export interface DocumentInfo {
  // sha256 hash of document (to be content addressable)
  id: string;

  // type of the document (only pdf for now)
  type: DocumentType;

  // unique location where document is stored
  url?: string;

  // document title
  title: string;

  // document description
  description?: string;

  // document cover image
  cover?: string;

  // number of pages that document has
  pageCount?: number;

  // outline of the document
  outline?: DocumentOutline;

  // account that created document
  creator?: string;

  // document creation time as unix timestamp
  createdAt?: number;
}

export interface DocumentReadingInfo {
  // document id
  documentId: string;

  // last reading page
  lastPage: number;

  // screenshot of page
  screenshot: string;

  // information about reading location
  location: any;
}
