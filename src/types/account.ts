import { DocumentMemberRole } from "./document";

/**Document reading info provides reading information associated with
 * account/document */
export interface AccountDocumentReadingInfo {
  /**number of last read page */
  lastPage?: number;

  /**url of screenshot of a page where we were last reading */
  screenshotURL?: string;

  /**reading location, dependent on document type */
  location?: any;

  /**document reading info creation time */
  createdAt: string;

  /**document highlight last update time */
  updatedAt: string;
}

export interface AccountDocumentMembership {
  /**id of document that account is member of */
  documentId: string;

  /**role that account has in a document */
  role: DocumentMemberRole;

  /**time when account/document membership was created */
  readonly createdAt: Date;

  /**time when account was approved to be member of document */
  readonly approvedAt?: Date;
}

export interface Account {
  /**unique account id */
  readonly id?: string;

  /**optional account name */
  name?: string | null;

  /**documents that account is member of */
  documents: AccountDocumentMembership[];

  /**account creation time */
  readonly createdAt?: Date;

  /**account last update time */
  readonly updatedAt?: Date;
}

/**Public account information */
export interface AccountInfo {
  /**unique account id */
  readonly id: string;

  /**name of the account */
  name?: string;
}
