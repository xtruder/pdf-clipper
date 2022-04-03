/**File info resource provides information about file like mime type and
 * sources where file is located
 */
export interface FileInfo {
  // id of the file (sha-256 of the file)
  id: string;

  // mimetype of a file
  mimeType?: string;

  // file source urls
  sources: string[];
}
