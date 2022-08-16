import { Equal, MoreThan, IsNull, Not, QueryFailedError, In } from "typeorm";
import GraphQLUpload from "graphql-upload/GraphQLUpload.js";

import {
  AccountEntity,
  BlobInfoEntity,
  DocumentEntity,
  DocumentHighlightEntity,
  DocumentMemberEntity,
} from "./entities";
import {
  Account,
  Document,
  Resolvers,
  AccountInfo,
  DocumentMember,
  DocumentHighlight,
  BlobInfo,
  Session,
  AccountUpdateResult,
} from "./graphql.schema";
import { uuidScalar, dateTimeScalar, JSONScalar } from "./scalars";
import { onNotification } from "./subscriptions";
import { AppDataSource } from "./data-source";

const handleQuery = async <T>(query: () => Promise<T>): Promise<T> => {
  try {
    return await query();
  } catch (err) {
    if (err instanceof QueryFailedError) {
      throw new UserInputError((err as any).detail);
    }

    throw err;
  }
};

export interface GqlContext {
  // saveFile: (stream: Readable, key: string) => Promise<void>;
  // getFileUrl: (key: string) => Promise<string>;
  // saveImage: (stream: Readable, key: string) => Promise<void>;
  // getImageUrl: (key: string) => Promise<string>;
  accountId: string;
}

export const resolvers: Resolvers<GqlContext> = {
  UUID: uuidScalar,
  DateTime: dateTimeScalar,
  JSON: JSONScalar,
  Upload: GraphQLUpload,

  // query resolvers
  Query: {
    async getAccountChanges(
      _,
      { limit, since },
      { accountId }
    ): Promise<Account[]> {
      return await AccountEntity.find({
        where: {
          id: accountId,
          updatedAt: MoreThan(since),
        },
        take: limit,
      });
    },
    async getAccountInfoChanges(
      _,
      { limit, since },
      { accountId }
    ): Promise<AccountInfo[]> {
      return await AccountEntity.find({
        where: {
          documents: {
            accountId: Equal(accountId),
            acceptedAt: Not(IsNull()),
          },
          updatedAt: MoreThan(since),
        },
        take: limit,
      });
    },
    async getDocumentChanges(
      _,
      { limit, since },
      { accountId }
    ): Promise<Document[]> {
      return await DocumentEntity.find({
        where: {
          members: {
            role: In(["ADMIN", "VIEWER", "EDITOR"]),
            accountId: Equal(accountId),
            acceptedAt: Not(IsNull()),
          },
          updatedAt: MoreThan(since),
        },
        take: limit,
      });
    },
    async getDocumentMemberChanges(
      _,
      { limit, since },
      { accountId }
    ): Promise<DocumentMember[]> {
      return DocumentMemberEntity.find({
        where: {
          document: {
            members: {
              role: In(["ADMIN", "VIEWER", "EDITOR"]),
              accountId: Equal(accountId),
              acceptedAt: Not(IsNull()),
            },
          },
          updatedAt: MoreThan(since),
        },
        take: limit,
      });
    },
    async getDocumentHighlightChanges(
      _,
      { limit, since },
      { accountId }
    ): Promise<DocumentHighlight[]> {
      return DocumentHighlightEntity.find({
        where: {
          document: {
            members: {
              role: In(["ADMIN", "VIEWER", "EDITOR"]),
              accountId: Equal(accountId),
              acceptedAt: Not(IsNull()),
            },
          },
          updatedAt: MoreThan(since),
        },
        take: limit,
      });
    },
    async getBlobInfoChanges(
      _,
      { limit, since },
      { accountId }
    ): Promise<BlobInfo[]> {
      return BlobInfoEntity.find({
        where: [
          {
            documents: {
              members: {
                role: In(["ADMIN", "VIEWER", "EDITOR"]),
                accountId: Equal(accountId),
                acceptedAt: Not(IsNull()),
              },
            },
            updatedAt: MoreThan(since),
          },
          {
            createdBy: accountId,
          },
        ],
        take: limit,
      });
    },
  },

  // subscriptions
  Subscription: {
    syncAccountUpdates: {
      subscribe: (_parent, _args, { accountId }) =>
        onNotification<Account>(`accounts:${accountId}`),
      resolve: (payload: Account) => [payload],
    },
    syncSessionUpdates: {
      subscribe: (_parent, _args, { accountId }) =>
        onNotification<Session>(`sessions:${accountId}`),
      resolve: (payload: Session): Session[] => [payload],
    },
    syncAccountInfoUpdates: {
      subscribe: (_parent, _args, { accountId }) =>
        onNotification<AccountInfo>(`accountinfos:${accountId}`),
      resolve: (payload: AccountInfo): AccountInfo[] => [payload],
    },
    syncDocumentUpdates: {
      subscribe: (_parent, _args, { accountId }) =>
        onNotification<Document>(`documents:${accountId}`),
      resolve: (payload: Document): Document[] => [payload],
    },
    syncDocumentMemberUpdates: {
      subscribe: (_parent, _args, { accountId }) =>
        onNotification<DocumentMember>(`documentmembers:${accountId}`),
      resolve: (payload: DocumentMember): DocumentMember[] => [payload],
    },
    syncDocumentHighlightUpdates: {
      subscribe: (_parent, _args, { accountId }) =>
        onNotification<DocumentHighlight>(`documenthighlights:${accountId}`),
      resolve: (payload: DocumentHighlight): DocumentHighlight[] => [payload],
    },
    syncBlobInfoUpdates: {
      subscribe: (_parent, _args, { accountId }) =>
        onNotification<BlobInfo>(`blobinfos:${accountId}`),
      resolve: (payload: BlobInfo): BlobInfo[] => [payload],
    },
  },
  Mutation: {
    async pushAccountChanges(
      _parent,
      { input: accounts },
      { accountId }
    ): Promise<AccountUpdateResult> {
      await AppDataSource.manager.transaction(async (mgr) => {
        const result = await mgr.upsert(AccountEntity, accounts, ["id"]);

        result.identifiers.map((value) => value["id"]);
      });
    },
  },
  // mutation resolvers
  // Mutation: {
  //   uploadFile: async (
  //     _parent,
  //     { file: inputFile },
  //     { accountId, saveFile }
  //   ): Promise<DeepPartial<FileInfo>> => {
  //     const { createReadStream, mimetype: mimeType } = await inputFile;

  //     const stream: ReadStream = createReadStream();

  //     console.log("hashing file");

  //     // hash stream content and upload file
  //     const hasherStream = new PassThrough();

  //     stream.pipe(hasherStream);

  //     const [hash, tmpStream] = await Promise.all([
  //       hashStream(hasherStream, "sha256"),
  //       writeTmpStream(stream, "upload"),
  //     ]);

  //     const file = await AppDataSource.manager.transaction(async (mgr) => {
  //       let file = await mgr.findOneBy(FileEntity, { hash: Equal(hash) });

  //       if (file) {
  //         // if file already exists do not upload again and just return existing
  //         // entitiy
  //         //return file;
  //       } else {
  //         file = mgr.create(FileEntity, {
  //           hash,
  //           mimeType,
  //           createdById: accountId,
  //         });
  //       }

  //       file = await handleQuery(() => mgr.save(file, { reload: true }));

  //       console.log("saving file");

  //       // save file based on hash before commiting transaction
  //       await saveFile(tmpStream, hash);

  //       return file;
  //     });

  //     return file.toFileInfo();
  //   },
  //   updateAccount: (_, { account: { id, name } }, ctx) =>
  //     AppDataSource.manager.transaction(async (mgr) => {
  //       const account = await mgr.findOneBy(AccountEntity, {
  //         id,
  //       });

  //       if (account.id !== ctx.accountId)
  //         throw new ForbiddenError("invalid account");

  //       account.name = name;

  //       await handleQuery(() => mgr.save(account));

  //       return account.toAccount();
  //     }),
  //   removeMeFromDocument: async (_parent, { documentId }, { accountId }) =>
  //     AppDataSource.manager.transaction(async (mgr) => {
  //       const docs = await mgr.findBy(DocumentMemberEntity, {
  //         accountId: Equal(accountId),
  //         documentId: Equal(documentId),
  //       });

  //       if (!docs.length) return false;

  //       await mgr.remove(docs);

  //       return true;
  //     }),
  //   upsertFileInfo: async (
  //     _parent,
  //     { fileInfo: { hash, mimeType, sources } },
  //     { accountId }
  //   ) =>
  //     AppDataSource.manager.transaction(async (mgr) => {
  //       let file = await mgr.findOneBy(FileEntity, { hash: Equal(hash) });

  //       if (file) {
  //         if (file.createdById !== accountId)
  //           throw new ForbiddenError("invalid account");

  //         if (hash) file.hash = hash;
  //         if (mimeType) file.mimeType = mimeType;
  //         if (sources) file.sources = sources;
  //       } else {
  //         file = mgr.create(FileEntity, {
  //           hash,
  //           mimeType,
  //           sources,
  //           createdById: accountId,
  //         });
  //       }

  //       file = await handleQuery(() => mgr.save(file, { reload: true }));

  //       return file.toFileInfo();
  //     }),
  //   upsertDocument: async (
  //     _parent,
  //     { document: { id, fileHash, meta, type, members = [], deleted } },
  //     { accountId }
  //   ) =>
  //     AppDataSource.manager.transaction(async (mgr) => {
  //       let document: DocumentEntity | undefined;

  //       if (id) {
  //         document = await mgr.findOne(DocumentEntity, {
  //           where: { id: Equal(id) },
  //           relations: { members: true, file: true },
  //           withDeleted: true,
  //         });
  //       }

  //       if (!document) {
  //         if (!members.find((m) => m.accountId === accountId)) {
  //           members.push({
  //             accountId,
  //             accepted: true,
  //             role: DocumentRole.Admin,
  //           });
  //         }

  //         // create a new document
  //         document = mgr.create(DocumentEntity, {
  //           id,
  //           fileHash,
  //           type,
  //           createdById: accountId,
  //           members: members.map(({ accountId, role, accepted }) => ({
  //             accountId,
  //             role,
  //             acceptedAt: accepted ? new Date() : null,
  //           })),
  //           meta: { ...meta },
  //         });
  //       } else {
  //         const accMember = document.members.find(
  //           (m) => m.accountId === accountId && m.acceptedAt
  //         );

  //         if (
  //           !accMember ||
  //           (accMember.role !== DocumentRole.Editor &&
  //             accMember.role !== DocumentRole.Admin)
  //         ) {
  //           throw new ForbiddenError("invalid document role to edit document");
  //         }

  //         if (members && members.length) {
  //           if (accMember.role !== DocumentRole.Admin) {
  //             throw new ForbiddenError(
  //               "invalid document role to change membership"
  //             );
  //           }

  //           document.members = members.map((member) => {
  //             // try to find exiting member entity or create a new one
  //             const memberEnt =
  //               document.members.find(
  //                 (m) => m.accountId === member.accountId
  //               ) ||
  //               mgr.create(DocumentMemberEntity, {
  //                 accountId: member.accountId,
  //                 documentId: document.id,
  //                 role: member.role,
  //                 createdById: accountId,
  //               });

  //             memberEnt.accepted = member.accepted;
  //             memberEnt.role = member.role;

  //             return memberEnt;
  //           });
  //         }

  //         if (meta) document.meta = { ...document.meta, ...meta };

  //         if (deleted) {
  //           if (accMember.role !== DocumentRole.Admin)
  //             throw new ForbiddenError(
  //               "invalid document role to delete document"
  //             );

  //           document.deletedAt = document.deletedAt || new Date();
  //         } else if (deleted === false) {
  //           if (accMember.role !== DocumentRole.Admin)
  //             throw new ForbiddenError(
  //               "invalid document role to undelete document"
  //             );

  //           document.deletedAt = null;
  //         }
  //       }

  //       document = await handleQuery(() =>
  //         mgr.save(document, { reload: true })
  //       );

  //       return document.toDocument();
  //     }),
  //   upsertDocumentHighlight: (
  //     _parent,
  //     { documentId, highlight: { id, content, deleted, location, image } },
  //     { accountId, saveImage }
  //   ) =>
  //     AppDataSource.manager.transaction(async (mgr) => {
  //       let highlight: DocumentHighlightEntity | undefined;

  //       if (id) {
  //         highlight = await mgr.findOne(DocumentHighlightEntity, {
  //           where: { id: Equal(id) },
  //           relations: { document: { members: true } },
  //         });

  //         if (
  //           highlight &&
  //           !highlight.document?.members.find(
  //             (m) =>
  //               m.accountId === accountId &&
  //               m.acceptedAt &&
  //               (m.role === DocumentRole.Editor ||
  //                 m.role === DocumentRole.Admin)
  //           )
  //         )
  //           throw new ForbiddenError("invalid document role");
  //       }

  //       if (!highlight) {
  //         highlight = mgr.create(DocumentHighlightEntity, {
  //           id,
  //           location,
  //           content,
  //           documentId,
  //           createdById: accountId,
  //         });
  //       } else {
  //         if (content) highlight.content = content;
  //         if (location) highlight.location = location;
  //         if (deleted) highlight.deletedAt = highlight.deletedAt || new Date();
  //         else if (deleted === false) highlight.deletedAt = null;
  //       }

  //       highlight = await handleQuery(() =>
  //         mgr.save(highlight, { reload: true })
  //       );

  //       if (image) {
  //         const { createReadStream, mimetype: mimeType } = await image;
  //         const stream: ReadStream = createReadStream();

  //         if (mimeType !== "image/png")
  //           throw new Error("invalid highlight image type");

  //         await saveImage(stream, highlight.id);
  //       }

  //       return highlight.toDocumentHighlight();
  //     }),
  // },
};
