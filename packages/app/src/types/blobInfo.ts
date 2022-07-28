export type BlobType = "docfile" | "highlightimg";

/**information about stored blob */
export interface BlobInfo {
  /**sha256 hash of blob */
  hash: string;

  /**type of blob */
  type: BlobType;

  /**blob creation time */
  createdAt?: string;

  /**blob last update time */
  updatedAt?: string;

  /**account that created this blob */
  createdBy?: string;

  /**mime type of the blob */
  mimeType: string;

  /**size of the blob in bytes */
  size: number;

  /**blob sources */
  source?: string;

  /**whether to sync blob */
  sync?: boolean;
}
