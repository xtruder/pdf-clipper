export enum DocumentType {
  PDF = "pdf",
}

export enum DocumentMessageName {
  Document = "document",
  HighlightCreated = "highlight_created",
  HighlightUpdated = "highlight_updated",
  HighlightRemoved = "highlight_removed",
  MemberAdded = "member_added",
  MemberRemoved = "member_removed",
}

export interface DocumentEvent {
  /**name defines type assocaited with event */
  type: DocumentMessageName;

  /**docId defines id of document that event is associated with */
  docId: string;

  /**data associated with event */
  data: any;

  /**accountId defines id of account that produced event */
  accountId: string;

  /**timestamp defines unix timestamp of event */
  timestamp: number;
}
