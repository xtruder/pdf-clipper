import { DocumentType } from "./document";

export enum HighlightColor {
  RED = "red",
  YELLOW = "yellow",
  GREEN = "green",
  BLUE = "blue",
}

export interface DocumentHighlight {
  /**unique document highlight id */
  id: string;

  /**id of document that highlight is for */
  documentId: string;

  /**type of the document */
  documentType?: DocumentType;

  /**highlight creation time */
  createdAt?: string;

  /**highlight last update time */
  updatedAt?: string;

  /**highlight deletion time */
  deletedAt?: string;

  /**location of a highlight (depends on document type) */
  location?: any;

  /**content associated with highlight (depends of document type) */
  content?: any;

  /**lexographically sortable highlight sequence (ex.: 00010/0345) */
  sequence: string;

  /**user who created the highlight */
  createdBy?: string;

  /**hash of the image of the highlight */
  imageHash?: string | null;

  /**whether this highlight belongs to a document that is local only */
  local?: boolean;
}
