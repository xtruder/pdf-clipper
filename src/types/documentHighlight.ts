export type HighlightColor = "red" | "yellow" | "green" | "blue";

export interface DocumentHighlight {
  /**unique id of document highlight */
  id: string;

  /**id of the document that highlight is associated with */
  documentId?: string;

  /**document highlight creation time */
  createdAt: Date;

  /**document highlight last update time */
  updatedAt: Date;

  /** location of a highlight (depends on document type) */
  location?: any;

  /** content associated with highlight (depends of document type) */
  content?: any;

  /** id of account that created the highlight */
  createdBy?: string;
}
