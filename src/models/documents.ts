export enum DocumentType {
  PDF = "pdf",
}

export interface OutlinePosition {
  pageNumber?: number;
  location?: any;
  top?: number;
}

export interface OutlineNode extends OutlinePosition {
  title: string;
  items: OutlineNode[];
}

export interface DocumentOutline {
  items: OutlineNode[];
}

export interface DocumentInfo {
  // sha256 hash of document (to be content addressable)
  id: string;

  // url of the document
  url: string;

  // type of the document
  type: DocumentType;

  // document title
  title?: string;

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

export interface DocumentSources {
  // if of the document
  id: string;

  // type of the document
  type: DocumentType;

  // document source urls
  sources: string[];
}

export interface DocumentReadingInfo {
  // last reading page
  lastPage?: number;

  // screenshot of page
  screenshot?: string;

  // information about reading location
  location?: any;
}
