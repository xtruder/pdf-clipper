/**role that account has in document */
export type DocumentRole = "admin" | "viewer" | "editor";

export interface DocumentMember {
  id?: string;

  documentId: string;

  /**id of member account */
  accountId: string;

  /**role of member */
  role?: DocumentRole;

  /**time when membership request was created */
  createdAt?: string;

  /**last update time of document membership */
  updatedAt?: string;

  /**time when membership has been deleted */
  deletedAt?: string;

  /**time when account was accepted as member of document */
  acceptedAt?: string;

  /**account that created document member */
  createdBy?: string;
}
