/**type of the document */
export type DocumentType = "PDF";

export interface OutlineNode {
  /**title assocaited with outline node */
  title: string;

  /**page number where outline is located */
  pageNumber?: number;

  /**document specific outline node position */
  position?: any;

  /**child outline nodes */
  items?: OutlineNode[];
}

export interface DocumentOutline {
  items: OutlineNode[];
}

/**metadata associated with document */
export interface DocumentMeta {
  /**title of the document */
  title?: string;

  /**document author */
  author?: string;

  /**document description */
  description?: string;

  /**url of document cover image */
  cover?: string;

  /**number of pages */
  pageCount?: number;

  // outline of the document
  outline?: DocumentOutline;
}

/**file associated with document */
export interface DocumentFile {
  /**sha256 hash of file */
  hash: string;

  /**mime type associated with file */
  mimeType: string;

  /**size of the file */
  size: number;

  /**file source */
  source?: string;
}

export interface Document {
  /**unique id of document */
  id: string;

  /**type of the document */
  type?: DocumentType;

  /**document creation time */
  createdAt?: string;

  /**document last update time */
  updatedAt?: string;

  /**document deletion time */
  deletedAt?: string;

  /**file associated with document */
  file?: DocumentFile;

  /**hash of file assocaited with document */
  fileHash?: string;

  /**metadata associated with document */
  meta: DocumentMeta;

  /**list of document member ids */
  members?: string[];

  /**account that created document */
  createdBy?: string;

  /**whether document is local and wont be synced */
  local?: boolean;
}
