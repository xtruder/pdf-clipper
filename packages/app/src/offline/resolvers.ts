import { Resolvers, DocumentRole, DocumentVisibility } from "./graphql.schema";

import type { Database } from "./db";
import { sha256 } from "~/lib/crypto";

export interface GqlContext {
  accountId: string;
  db: Database;
}

const resolvers: Resolvers<GqlContext> = {
  Query: {
    me: async (_, _args, { accountId, db }) => {
      const account = await db.accounts.get({ id: accountId });

      if (!account) throw new Error("account not found");

      return account;
    },
    document: async (_, { id }, { db }) => {
      const document = await db.documents.get(id);

      if (!document) throw new Error("document not found");

      return document;
    },
    blobInfo: async (_, { hash }, { db }) => {
      const blobInfo = await db.blobs.get({ hash });

      if (!blobInfo) throw new Error("blob not found");

      return blobInfo;
    },
  },
  Mutation: {
    createDocument: async (
      _,
      { document: { fileHash, meta = {}, coverHash, type, visibility } },
      { db, accountId }
    ) =>
      db.transaction("rw", db.documents, db.documentMembers, async () => {
        const id = await db.documents.add({
          file: { hash: fileHash },
          createdBy: { id: accountId },
          meta,
          type,
          visibility: visibility || DocumentVisibility.Private,
          ...(coverHash ? { cover: { hash: coverHash } } : {}),
        });

        // add account as member of document
        await db.documentMembers.add({
          document: { id },
          account: { id: accountId },
          createdBy: { id: accountId },
          role: DocumentRole.Admin,
        });

        return await db.documents.get(id);
      }),
    updateDocument: async (
      _,
      { document: { id, meta, visibility, deleted } },
      { db }
    ) => {
      await db.documents.update(id, {
        ...(meta && { meta }),
        ...(visibility && { visibility }),
        ...(deleted && { deletedAt: new Date() }),
      });

      if (deleted) {
        await db.documentMembers.where("document.id").equals(id).delete();
      }

      return await db.documents.get(id);
    },
    upsertDocumentMember: async (
      _,
      { member: { accountId, documentId, accepted, role } },
      { db, accountId: createdById }
    ) => {
      await db.documentMembers.put({
        account: { id: accountId },
        document: { id: documentId },
        accepted,
        role,
        createdBy: { id: createdById },
      });

      return await db.documentMembers.get({
        account: { id: accountId },
        document: { id: documentId },
      });
    },
    createDocumentHighlight: async (
      _,
      {
        highlight: {
          id,
          sequence,
          documentId,
          color,
          content,
          location,
          imageHash,
        },
      },
      { db, accountId }
    ) => {
      await db.documentHighlights.add({
        id,
        sequence,
        document: { id: documentId },
        createdBy: { id: accountId },
        color,
        content,
        location,
        ...(imageHash ? { image: { hash: imageHash } } : {}),
      });

      return await db.documentHighlights.get({ id });
    },
    updateDocumentHighlight: async (
      _,
      { highlight: { id, content, location, imageHash, deleted } },
      { db }
    ) => {
      if (deleted) {
        await db.documentHighlights.delete({ id });
        return {
          id,
        };
      }

      await db.documentHighlights.update(id, {
        id,
        ...(content ? { content } : {}),
        ...(location ? { location } : {}),
        ...(imageHash ? { image: { hash: imageHash } } : {}),
      });

      return await db.documentHighlights.get({ id });
    },
    uploadBlob: async (_, { blob: { blob, mimeType, source } }, { db }) => {
      const hash = await sha256(await blob.arrayBuffer());

      await db.blobs.put({
        hash,
        size: blob.size,
        blob,
        mimeType,
        source,
      });

      return await db.blobs.get(hash);
    },
  },
  Account: {
    // get all document members where accountId matches
    documents: async (account, _args, { db }) => {
      return db.documentMembers
        .where("account.id")
        .equals(account.id!)
        .toArray();
    },
  },
  Document: {
    createdBy: async (document, _args, { db }) => {
      return await db.accounts.get(document.createdBy?.id);
    },
    highlights: async (document, _, { db }) => {
      let q = db.documentHighlights.where("document.id").equals(document.id!);
      // if (offset) q = q.offset(offset);
      // if (limit) q = q.limit(limit);

      return q.sortBy("updatedAt");
    },
    members: async (document, _args, { db }) => {
      return db.documentMembers
        .where("document.id")
        .equals(document.id!)
        .toArray();
    },
    file: async (document, _args, { db }) => {
      return db.blobs.get(document.file?.hash);
    },
    cover: async (document, _args, { db }) => {
      if (!document.cover?.hash) return null;
      return db.blobs.get(document.cover.hash);
    },
  },
  DocumentMember: {
    createdBy: async (member, _args, { db }) => {
      return db.accounts.get({ id: member.createdBy?.id });
    },
    account: async (member, _args, { db }) => {
      return db.accounts.get({ id: member.account?.id });
    },
    document: async (member, _args, { db }) => {
      return db.documents.get({ id: member.document?.id });
    },
  },
  DocumentHighlight: {
    createdBy: async (highlight, _args, { db }) => {
      return db.accounts.get({ id: highlight.createdBy?.id });
    },
    document: async (highlight, _args, { db }) => {
      return db.documents.get({ id: highlight.document?.id });
    },
    image: async (highlight, _args, { db }) => {
      if (!highlight.image?.hash) return null;
      return db.blobs.get(highlight.image.hash);
    },
  },
};

export default resolvers;
