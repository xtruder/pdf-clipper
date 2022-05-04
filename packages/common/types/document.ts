import { JTDSchemaType } from "ajv/dist/jtd";

export enum DocumentType {
  PDF = "pdf",
}

export interface Document {
  /**docId defines unique id of the document */
  docId: string;

  /**docType defines type of the document */
  docType: DocumentType;

  /**fileId defines id of file assocaited with document */
  fileId?: string;

  /**archived defines whether document is archived */
  archived?: boolean;

  /**deleted defines whether document is deleted */
  deleted?: boolean;
}

export const documentSchema: JTDSchemaType<Document> = {
  properties: {
    docId: {
      type: "string",
    },
    docType: {
      enum: [DocumentType.PDF],
    },
  },
  optionalProperties: {
    fileId: {
      type: "string",
    },
    archived: {
      type: "boolean",
    },
    deleted: {
      type: "boolean",
    },
  },
};
