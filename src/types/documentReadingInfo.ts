/**Document reading info provides reading information associated with
 * account/document */
export interface DocumentReadingInfo {
  /**id of account that reading info is for */
  accountId: string;

  /**id of the document that reading info is for */
  documentId: string;

  /**document reading info creation time */
  createdAt?: string;

  /**document highlight last update time */
  updatedAt?: string;

  /**number of last read page */
  lastPage?: number;

  /**url of screenshot of a page where we were last reading */
  screenshotURL?: string;

  /**reading location, dependent on document type */
  location?: any;
}
