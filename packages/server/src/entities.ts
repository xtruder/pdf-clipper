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
  BaseEntity,
} from "typeorm";

import { DeepPartial } from "typeorm";

import {
  Account,
  AccountInfo,
  Session,
  Document,
  DocumentHighlight,
  DocumentMember,
  BlobInfo,
} from "./graphql.schema";

@Entity({ name: "accounts" })
export class AccountEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id: string;

  @Column("varchar", { name: "name", nullable: true, length: 200 })
  name?: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at", type: "timestamp" })
  deletedAt?: Date;

  @OneToMany(() => DocumentMemberEntity, (table) => table.account)
  documents: DocumentMemberEntity[];

  @OneToMany(() => DocumentHighlightEntity, (table) => table.creator)
  createdHighlights: DocumentHighlightEntity[];

  @OneToMany(() => DocumentMemberEntity, (table) => table.creator)
  createdDocumentMembers: DocumentMemberEntity[];

  @OneToMany(() => DocumentEntity, (table) => table.creator)
  createdDocuments: DocumentEntity[];

  @OneToMany(() => BlobInfoEntity, (table) => table.creator)
  createdFiles: BlobInfoEntity[];

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
    deleted: !!this.deletedAt,
  });
}

@Entity({ name: "blobs" })
export class BlobInfoEntity extends BaseEntity {
  @PrimaryColumn("varchar", { name: "hash", length: 100 })
  hash: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  @ManyToOne(() => AccountEntity, (table) => table.createdDocuments)
  @JoinColumn({ name: "created_by" })
  creator: AccountEntity;

  @Column({ name: "created_by", nullable: false })
  createdBy: string;

  @Column("varchar", { name: "mime_type", length: 50, nullable: false })
  mimeType: string;

  @Column("integer", { name: "size", nullable: false })
  size: number;

  @Column("string", { name: "source" })
  source: string;

  @OneToMany(() => DocumentEntity, (table) => table.id)
  documents: DocumentEntity[];

  @OneToMany(() => DocumentHighlightEntity, (table) => table.id)
  highlights: DocumentHighlightEntity[];

  toBlobInfo = (): BlobInfo => ({
    hash: this.hash,
    mimeType: this.mimeType,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    createdBy: this.creator.toAccountInfo(),
    size: this.size,
    source: this.source,
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
  creator: AccountEntity;

  @Column({ name: "created_by" })
  createdBy: string;

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

  @ManyToOne(() => BlobInfoEntity, (table) => table.hash)
  @JoinColumn({ name: "file_hash" })
  file: BlobInfoEntity;

  @Column({ name: "file_hash", nullable: true })
  fileHash: string;

  toDocument = (): Document => ({
    id: this.id,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    deletedAt: this.deletedAt,
    type: this.type,
    meta: this.meta,
    createdBy: this.createdBy,
    fileHash: this.fileHash,
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
  creator: AccountEntity;

  @Column({ name: "created_by" })
  createdBy: string;

  @ManyToOne(() => DocumentEntity, (table) => table.highlights)
  @JoinColumn({ name: "document_id" })
  document: DocumentEntity;

  @Column({ name: "document_id" })
  documentId: string;

  @ManyToOne(() => BlobInfoEntity, (table) => table.hash)
  @JoinColumn({ name: "image_hash" })
  image: BlobInfoEntity;

  @Column({ name: "image_hash", nullable: true })
  imageHash: string;

  toDocumentHighlight = (): DocumentHighlight => ({
    id: this.id,
    documentId: this.documentId,
    location: this.location,
    content: this.content,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    deletedAt: this.deletedAt,
    createdBy: this.createdBy,
  });
}

export enum DocumentRole {
  Admin = "ADMIN",
  Editor = "EDITOR",
  Viewer = "VIEWER",
}

@Entity({ name: "document_members" })
export class DocumentMemberEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at", type: "timestamp" })
  deletedAt: Date;

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
  creator: AccountEntity;

  @Column({ name: "created_by", nullable: true })
  createdBy: string;

  toDocumentMember = (): DocumentMember => ({
    id: this.id,
    documentId: this.documentId,
    role: this.role,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    deletedAt: this.deletedAt,
    acceptedAt: this.acceptedAt,
    accountId: this.accountId,
    createdBy: this.createdBy,
  });
}
