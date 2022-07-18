export interface Account {
  /**unique account id */
  id: string;

  /**account creation time */
  createdAt?: string;

  /**account last update time */
  updatedAt?: string;

  /**name of the account */
  name?: string;

  /**whether this is default user account */
  default?: boolean;
}
