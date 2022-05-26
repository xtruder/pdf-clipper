import { RxJsonSchema } from "rxdb";

/**File info resource provides information about file like mime type and
 * sources where file is located
 */
export interface FileInfo {
  /**unique file hash */
  hash: string;

  /**account creation time */
  createdAt: string;

  /**account last update time */
  updatedAt: string;

  /**mimetype of file */
  mimeType?: string;

  /**sources where file is located */
  sources: string[];

  /**id of account that file was created by */
  createdBy: string;
}

export const fileInfoSchema: RxJsonSchema<FileInfo> = {
  title: "file info",
  version: 0,
  keyCompression: true,
  primaryKey: "hash",
  type: "object",
  properties: {
    hash: {
      type: "string",
    },
    createdAt: {
      type: "string",
      format: "date-time",
    },
    updatedAt: {
      type: "string",
      format: "date-time",
    },
    mimeType: {
      type: "string",
    },
    sources: {
      type: "array",
      items: {
        type: "string",
      },
    },
    createdBy: {
      type: "string",
    },
  },
  required: ["hash", "createdBy", "createdAt", "updatedAt"],
} as const;
