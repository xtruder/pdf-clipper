import { DocumentRole, FileSource } from "./generated/graphql";

export interface AccountModel {
  id: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FileModel {
  hash: string;
  sources: FileSource[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentModel {
  id: string;
  type: DocumentType;
  fileId?: string;
  title?: string;
  description?: string;
  author?: string;
  cover?: string;
  outline?: any;
  pageCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AccountDocumentModel extends DocumentModel {
  accountId: string;
  role: DocumentRole;
  memberSince: Date;
}

export interface DocumentMemberModel {
  accountId: string;
  documentId: string;
  role: DocumentRole;
  createdAt: Date;
  approvedAt?: Date;
}
