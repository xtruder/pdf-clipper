export interface Session {
  /**unique session id */
  id: string;

  /**id of account that session is associated with */
  accountId: string;

  /**session creation time */
  createdAt?: string;

  /**list of document ids to sync */
  syncDocuments: string[];
}
