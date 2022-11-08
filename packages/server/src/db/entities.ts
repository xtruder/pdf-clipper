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
  OneToOne,
  Index,
} from "typeorm";

import type { Relation } from "typeorm";

import {
  Account,
  AccountInfo,
  Document,
  DocumentHighlight,
  DocumentMember,
  BlobInfo,
  HighlightColor,
} from "../graphql/graphql.schema";

@Entity({ name: "accounts" })
export class AccountEntity extends BaseEntity implements Account, AccountInfo {
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

  get deleted() {
    return !!this.deletedAt;
  }

  @OneToMany(() => DocumentMemberEntity, (table) => table.account)
  documents: DocumentMemberEntity[];

  @OneToMany(() => DocumentHighlightEntity, (table) => table.createdBy)
  createdHighlights: DocumentHighlightEntity[];

  @OneToMany(() => DocumentMemberEntity, (table) => table.createdBy)
  createdDocumentMembers: DocumentMemberEntity[];

  @OneToMany(() => DocumentEntity, (table) => table.createdBy)
  createdDocuments: DocumentEntity[];

  @OneToMany(() => BlobInfoEntity, (table) => table.createdBy)
  createdBlobs: BlobInfo[];

  @OneToMany(() => BlobInfoEntity, (table) => table.createdBy)
  createdFiles: BlobInfoEntity[];
}

@Entity({ name: "blobs" })
export class BlobInfoEntity extends BaseEntity implements BlobInfo {
  @PrimaryColumn("varchar", { name: "hash", length: 100 })
  hash: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  @ManyToOne(() => AccountEntity, (table) => table.createdDocuments)
  @JoinColumn({ name: "created_by" })
  createdBy: AccountEntity;

  @Column({ name: "created_by_id", nullable: false })
  createdById: string;

  @Column("varchar", { name: "mime_type", length: 50, nullable: false })
  mimeType: string;

  @Column("integer", { name: "size", nullable: false })
  size: number;

  @Column("text", { name: "source" })
  source: string;

  @OneToOne(() => DocumentEntity, (table) => table.cover)
  documentCover: Relation<DocumentEntity>;

  @OneToOne(() => DocumentEntity, (table) => table.file)
  documentFile: Relation<DocumentEntity>;

  @OneToOne(() => DocumentHighlightEntity, (table) => table.image)
  highlightImage: Relation<DocumentHighlightEntity>;
}

export enum DocumentType {
  Pdf = "PDF",
}

export enum DocumentVisibility {
  Private = "PRIVATE",
  Public = "PUBLIC",
}

@Entity({ name: "documents" })
export class DocumentEntity extends BaseEntity implements Document {
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

  @Column({ name: "created_by_id", nullable: false })
  createdById: string;

  @Column("enum", { name: "type", enum: DocumentType, nullable: false })
  type: DocumentType;

  @Column("jsonb", { name: "meta", default: {} })
  meta: any;

  @OneToMany(() => DocumentMemberEntity, (table) => table.document, {
    cascade: ["insert", "update"],
  })
  members: DocumentMemberEntity[];

  @OneToMany(() => DocumentHighlightEntity, (table) => table.document)
  highlights: DocumentHighlightEntity[];

  @ManyToOne(() => BlobInfoEntity, (table) => table.documentFile)
  @JoinColumn({ name: "file_hash" })
  file: BlobInfoEntity;

  @Column({ name: "file_hash", nullable: false })
  fileHash: string;

  @ManyToOne(() => BlobInfoEntity, (table) => table.documentCover)
  @JoinColumn({ name: "cover_hash" })
  cover: BlobInfoEntity;

  @Column({ name: "cover_hash", nullable: true, unique: false })
  coverHash: string | null;

  @Column("enum", {
    name: "visibility",
    enum: DocumentVisibility,
    default: DocumentVisibility.Private,
    nullable: false,
  })
  visibility: DocumentVisibility;
}

@Entity({ name: "document_highlights" })
export class DocumentHighlightEntity
  extends BaseEntity
  implements DocumentHighlight
{
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at", type: "timestamp" })
  deletedAt: Date;

  @ManyToOne(() => AccountEntity, (table) => table.createdHighlights)
  @JoinColumn({ name: "created_by_id" })
  createdBy: AccountEntity;

  @Column({ name: "created_by_id" })
  createdById: string;

  @ManyToOne(() => DocumentEntity, (table) => table.highlights)
  @JoinColumn({ name: "document_id" })
  document: DocumentEntity;

  @Column({ name: "document_id" })
  documentId: string;

  @Column("varchar", { name: "sequence", length: 100 })
  sequence: string;

  @Column("varchar", { name: "color", length: 20 })
  color: HighlightColor;

  @Column("jsonb", { name: "content", default: {} })
  content: any;

  @Column("jsonb", { name: "location", default: {} })
  location: any;

  @ManyToOne(() => BlobInfoEntity, (table) => table.highlightImage)
  @JoinColumn({ name: "image_hash" })
  image: BlobInfoEntity;

  @Column("text", { name: "thumbnail", nullable: true })
  thumbnail: string;

  @Column({ name: "image_hash", nullable: true })
  imageHash: string;
}

export enum DocumentRole {
  Admin = "ADMIN",
  Editor = "EDITOR",
  Viewer = "VIEWER",
}

@Entity({ name: "document_members" })
@Index(["accountId", "documentId"], { unique: true })
export class DocumentMemberEntity extends BaseEntity implements DocumentMember {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

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

  @ManyToOne(() => AccountEntity, (table) => table.createdDocumentMembers)
  @JoinColumn({ name: "created_by" })
  createdBy: AccountEntity;

  @Column({ name: "created_by_id", nullable: true })
  createdById: string;
}
