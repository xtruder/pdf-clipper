/**File info resource provides information about file like mime type and
 * sources where file is located
 */
export interface FileInfo {
  /**unique file id */
  id?: string;

  /**file creation time */
  createdAt?: string;

  // mimetype of a file
  mimeType?: string;

  // file source urls
  sources: string[];
}
