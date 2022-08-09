export interface Session {
  /**unique session id */
  id: string;

  /**id of account that session is associated with */
  accountId: string;

  /**session creation time */
  createdAt?: string;

  /**session last update time */
  updatedAt?: string;

  /**session deletion time */
  deletedAt?: string;

  /**list of document ids to sync */
  syncDocuments: string[];
}
