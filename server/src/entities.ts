import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToOne,
  PrimaryColumn,
  JoinColumn,
  Unique,
  BaseEntity,
} from "typeorm";

import {
  Account,
  AccountDocument,
  AccountInfo,
  Document,
  DocumentHighlight,
  DocumentMember,
  FileInfo,
} from "./graphql.schema";
import { DeepPartial } from "./types";

@Entity({ name: "accounts" })
export class AccountEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id: string;

  @Column("varchar", { name: "title", nullable: true, length: 200 })
  name?: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at", type: "timestamp" })
  deletedAt: Date;

  @OneToMany(() => DocumentMemberEntity, (table) => table.account)
  documents: DocumentMemberEntity[];

  @OneToMany(() => DocumentHighlightEntity, (table) => table.createdBy)
  createdHighlights: DocumentHighlightEntity[];

  @OneToMany(() => DocumentMemberEntity, (table) => table.createdBy)
  createdDocumentMembers: DocumentMemberEntity[];

  @OneToMany(() => DocumentEntity, (table) => table.createdBy)
  createdDocuments: DocumentEntity[];

  @OneToMany(() => FileEntity, (table) => table.createdBy)
  createdFiles: FileEntity[];

  toAccount = (): DeepPartial<Account> => ({
    id: this.id,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    deletedAt: this.deletedAt,
    name: this.name,
  });

  toAccountInfo = (): AccountInfo => ({
    id: this.id,
    name: this.name,
  });
}

@Entity({ name: "files" })
export class FileEntity extends BaseEntity {
  @PrimaryColumn("varchar", { name: "hash", length: 100 })
  hash: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  @ManyToOne(() => AccountEntity, (table) => table.createdDocuments)
  @JoinColumn({ name: "created_by" })
  createdBy: AccountEntity;

  @Column({ name: "created_by" })
  createdById: string;

  @Column("varchar", { name: "mime_type", length: 50 })
  mimeType: string;

  @Column("jsonb", { name: "sources", default: [] })
  sources: string[];

  @OneToMany(() => DocumentEntity, (table) => table.id)
  documents: DocumentEntity[];

  toFileInfo = (): DeepPartial<FileInfo> => ({
    hash: this.hash,
    mimeType: this.mimeType,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    createdBy: { id: this.createdById },
  });
}

export enum DocumentType {
  Pdf = "PDF",
}

@Entity({ name: "documents" })
export class DocumentEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at", type: "timestamp" })
  deletedAt: Date;

  @ManyToOne(() => AccountEntity, (table) => table.createdDocuments)
  @JoinColumn({ name: "created_by" })
  createdBy: AccountEntity;

  @Column({ name: "created_by" })
  createdById: string;

  @Column("enum", { name: "type", enum: DocumentType })
  type: DocumentType;

  @Column("jsonb", { name: "meta", default: {} })
  meta: any;

  @OneToMany(() => DocumentMemberEntity, (table) => table.document, {
    cascade: ["insert", "update"],
  })
  members: DocumentMemberEntity[];

  @OneToMany(() => DocumentHighlightEntity, (table) => table.document)
  highlights: DocumentHighlightEntity[];

  @ManyToOne(() => FileEntity, (table) => table.hash)
  @JoinColumn({ name: "file_hash" })
  file: FileEntity;

  @Column({ name: "file_hash", nullable: true })
  fileHash: string;

  toDocument = (): DeepPartial<Document> => ({
    id: this.id,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    deletedAt: this.deletedAt,
    type: this.type,
    meta: this.meta,
    file: this.file ? this.file.toFileInfo() : { hash: this.fileHash },
    createdBy: { id: this.createdById },
  });
}

@Entity({ name: "document_highlights" })
export class DocumentHighlightEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at", type: "timestamp" })
  deletedAt: Date;

  @Column("jsonb", { name: "content" })
  content: any;

  @Column("jsonb", { name: "location" })
  location: any;

  @ManyToOne(() => AccountEntity, (table) => table.createdHighlights, {
    eager: true,
  })
  @JoinColumn({ name: "created_by" })
  createdBy: AccountEntity;

  @Column({ name: "created_by" })
  createdById: string;

  @ManyToOne(() => DocumentEntity, (table) => table.highlights)
  @JoinColumn({ name: "document_id" })
  document: DocumentEntity;

  @Column({ name: "document_id" })
  documentId: string;

  toDocumentHighlight = (): DocumentHighlight => ({
    id: this.id,
    location: this.location,
    content: this.content,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    deletedAt: this.deletedAt,
    createdBy: { id: this.createdById },
  });
}

export enum DocumentRole {
  Admin = "ADMIN",
  Editor = "EDITOR",
  Viewer = "VIEWER",
}

@Entity({ name: "document_members" })
@Unique(["accountId", "documentId"])
export class DocumentMemberEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @Column("timestamp", { name: "accepted_at", nullable: true })
  acceptedAt?: Date;

  @Column("enum", {
    name: "role",
    enum: DocumentRole,
    default: DocumentRole.Viewer,
  })
  role: DocumentRole;

  @ManyToOne(() => AccountEntity, (table) => table.documents)
  @JoinColumn({ name: "account_id" })
  account: AccountEntity;

  @Column({ name: "account_id" })
  accountId: string;

  @ManyToOne(() => DocumentEntity, (table) => table.members, {
    orphanedRowAction: "delete",
  })
  @JoinColumn({ name: "document_id" })
  document: DocumentEntity;

  @Column({ name: "document_id" })
  documentId: string;

  @ManyToOne(() => AccountEntity, (table) => table.createdDocumentMembers, {
    eager: true,
  })
  @JoinColumn({ name: "created_by" })
  createdBy: AccountEntity;

  @Column({ name: "created_by", nullable: true })
  createdById: string;

  set accepted(accepted: boolean) {
    if (accepted) {
      this.acceptedAt = this.acceptedAt || new Date();
    } else {
      if (typeof accepted !== "boolean") return;

      this.acceptedAt = null;
    }
  }

  get accepted(): boolean {
    return !!this.acceptedAt;
  }

  toDocumentMember = (): DeepPartial<DocumentMember> => ({
    role: this.role,
    createdAt: this.createdAt,
    acceptedAt: this.acceptedAt,
    account: { id: this.accountId },
    createdBy: { id: this.createdById },
  });

  toAccountDocument = (): DeepPartial<AccountDocument> => ({
    role: this.role,
    createdAt: this.createdAt,
    acceptedAt: this.acceptedAt,
    document: { id: this.documentId },
    createdBy: { id: this.createdById },
  });
}
