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

  /**metadata associated with document */
  meta: DocumentMeta;

  /**hash of the file associated with document */
  fileHash?: string;

  /**list of document member ids */
  members?: string[];

  /**account that created document */
  createdBy?: string;

  /**whether document is local and wont be synced */
  local?: boolean;
}
