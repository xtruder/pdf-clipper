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

/**Document info provides information about document, like associated file,
 * document type, metadata like author, title, description, cover and such.
 */
export interface DocumentInfo {
  // id of the document
  id: string;

  // id of the file for document
  fileId?: string;

  // type of the document
  type?: DocumentType;

  // document title
  title?: string;

  // document author
  author?: string;

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

/**Document reading info provides reading information associated with
 * account/document
 */
export interface DocumentReadingInfo {
  // id of the account
  accountId: string;

  // id of the document
  docId: string;

  // last reading page
  lastPage?: number;

  // screenshot of page
  screenshot?: string;

  // information about reading location
  location?: any;
}
