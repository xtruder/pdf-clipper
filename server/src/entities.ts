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
} from "typeorm";

@Entity({ name: "accounts" })
export class AccountEntity {
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
  documents!: DocumentMemberEntity[];

  @OneToMany(() => DocumentHighlightEntity, (table) => table.createdBy)
  createdHighlights: DocumentHighlightEntity[];

  @OneToMany(() => DocumentMemberEntity, (table) => table.createdBy)
  createdDocumentMembers: DocumentMemberEntity[];

  @OneToMany(() => DocumentEntity, (table) => table.createdBy)
  createdDocuments: DocumentEntity[];

  @OneToMany(() => FileEntity, (table) => table.createdBy)
  createdFiles: FileEntity[];
}

@Entity({ name: "files" })
export class FileEntity {
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
}

export enum DocumentType {
  Pdf = "PDF",
}

@Entity({ name: "documents" })
export class DocumentEntity {
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

  @OneToMany(() => DocumentMemberEntity, (table) => table.document)
  members: DocumentMemberEntity[];

  @OneToMany(() => DocumentHighlightEntity, (table) => table.document)
  highlights: DocumentHighlightEntity[];

  @ManyToOne(() => FileEntity, (table) => table.hash)
  @JoinColumn({ name: "file_hash" })
  file: FileEntity;

  @Column({ name: "file_hash", nullable: true })
  fileHash: string;
}

@Entity({ name: "document_highlights" })
export class DocumentHighlightEntity {
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

  @ManyToOne(() => AccountEntity, (table) => table.createdHighlights)
  @JoinColumn({ name: "created_by" })
  createdBy: AccountEntity;

  @Column({ name: "created_by" })
  createdById: string;

  @ManyToOne(() => DocumentEntity, (table) => table.highlights)
  @JoinColumn({ name: "document_id" })
  document: DocumentEntity;

  @Column({ name: "document_id" })
  documentId: string;
}

export enum DocumentRole {
  Admin = "ADMIN",
  Editor = "EDITOR",
  Viewer = "VIEWER",
}

@Entity({ name: "document_members" })
export class DocumentMemberEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt!: Date;

  @Column("timestamp", { name: "accepted_at", nullable: true })
  acceptedAt?: Date;

  @Column("enum", {
    name: "role",
    enum: DocumentRole,
    default: DocumentRole.Viewer,
  })
  role: DocumentRole;

  @ManyToOne(() => DocumentEntity, (table) => table.members)
  @JoinColumn({ name: "document_id" })
  document: DocumentEntity;

  @Column({ name: "document_id" })
  documentId: string;

  @ManyToOne(() => AccountEntity, (table) => table.documents)
  @JoinColumn({ name: "account_id" })
  account: AccountEntity;

  @Column({ name: "account_id" })
  accountId: string;

  @ManyToOne(() => AccountEntity, (table) => table.createdDocumentMembers)
  @JoinColumn({ name: "created_by" })
  createdBy: AccountEntity;

  @Column({ name: "created_by", nullable: true })
  createdById: string;
}
