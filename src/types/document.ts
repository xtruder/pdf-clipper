export type DocumentType = "pdf";

export type DocumentMemberRole = "admin" | "editor" | "viewer";

export interface DocumentMember {
  /**id of account that is member of document */
  accountId: string;

  /**role of account that is member of document */
  role: DocumentMemberRole;

  /**time when account was approved to be member of document */
  approvedAt?: Date;

  /**time when member was created */
  createdAt: Date;
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
export interface DocumentMeta {
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
}

export interface DocumentInfo {
  /**unique document id */
  id?: string;

  /**document creation time */
  createdAt?: Date;

  /**document last update time */
  updatedAt?: Date;

  /**id of the file associated with document */
  fileId?: string;

  /**type of the document */
  type?: DocumentType;

  /**metadata associated with document */
  meta?: DocumentMeta;

  /**list of members assocaited with document */
  members: DocumentMember[];

  /**id of the account that document was created by */
  createdBy?: string;
}
