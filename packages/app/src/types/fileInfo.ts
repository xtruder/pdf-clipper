import { RxJsonSchema, RxDocument, RxCollection } from "rxdb";
import { BaseResource, baseSchemaProps } from "./base";

/**File info resource provides information about file like mime type and
 * sources where file is located
 */
export interface FileInfo extends BaseResource {
  // mimetype of a file
  mimeType?: string;

  // file source urls
  sources: string[];
}

export const fileInfoSchema: RxJsonSchema<FileInfo> = {
  title: "file info",
  version: 0,
  keyCompression: true,
  primaryKey: "id",
  type: "object",
  properties: {
    mimeType: {
      type: "string",
    },
    sources: {
      type: "array",
      items: {
        type: "string",
      },
    },
    ...baseSchemaProps,
  },
  required: ["id"],
} as const;

export type FileInfoDocument = RxDocument<FileInfo>;

export type FileInfoCollection = RxCollection<FileInfo>;
