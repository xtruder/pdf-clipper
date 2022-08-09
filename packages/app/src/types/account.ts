export interface Account {
  /**unique account id */
  id: string;

  /**account creation time */
  createdAt?: string;

  /**account last update time */
  updatedAt?: string;

  /**account deletion time */
  deletedAt?: string;

  /**name of the account */
  name?: string;
}
