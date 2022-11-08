import { Equal, QueryFailedError, EntityNotFoundError } from "typeorm";
import { DatabaseError } from "pg";
import { GraphQLError } from "graphql";

import {
  AccountEntity,
  BlobInfoEntity,
  DocumentEntity,
  DocumentHighlightEntity,
  DocumentMemberEntity,
  DocumentRole,
} from "../db/entities";
import {
  Account,
  Document,
  Resolvers,
  AccountInfo,
  DocumentMember,
  DocumentHighlight,
  BlobInfo,
  Maybe,
} from "./graphql.schema";
import { dateTimeScalar, uuidScalar, JSONScalar } from "./scalars";

import { LiveQueryStore } from "./live-query";
import { Loaders } from "../db/loaders";
import { BlobStorage } from "../db/blob-storage";

const handleError = async <T>(
  promise: Promise<T>,
  msg?: string,
  code?: string
): Promise<T> => {
  try {
    return await promise;
  } catch (error) {
    if (error instanceof QueryFailedError) {
      const err = error.driverError as DatabaseError;

      if (msg) {
        throw new GraphQLError(msg);
      } else if (err.code === "23505") {
        throw new GraphQLError("conflict error", {
          extensions: { code: "CONFLICT_ERROR" },
        });
      } else {
        throw new GraphQLError(err.detail || "database error");
      }
    } else if (error instanceof EntityNotFoundError) {
      throw new GraphQLError(msg || error.message, {
        extensions: { code: code || "NOT_FOUND_ERROR" },
      });
    }

    throw error;
  }
};

export interface GqlContext {
  accountId: string;
  liveQueryStore: LiveQueryStore;
  loaders: Loaders;
  blobStorage: BlobStorage;
}

export const resolvers: Resolvers<GqlContext> = {
  DateTime: dateTimeScalar,
  JSON: JSONScalar,
  ID: uuidScalar,

  // query resolvers
  Query: {
    me: async (
      _,
      _args,
      { accountId, loaders: { accountLoader } }
    ): Promise<Account> => handleError(accountLoader.mustLoad(accountId)),
    account: async (
      _,
      { id },
      { loaders: { accountLoader } }
    ): Promise<Account> => handleError(accountLoader.mustLoad(id)),
    document: async (
      _,
      { id },
      { loaders: { documentLoader } }
    ): Promise<Document> => handleError(documentLoader.mustLoad(id)),
    blobInfo: async (
      _,
      { hash },
      { loaders: { blobInfoLoader } }
    ): Promise<BlobInfo> => handleError(blobInfoLoader.mustLoad(hash)),
  },
  Document: {
    file: async (
      { file },
      _,
      { loaders: { blobInfoLoader } }
    ): Promise<BlobInfo> => handleError(blobInfoLoader.mustLoad(file?.hash)),
    cover: async (
      { cover },
      _,
      { loaders: { blobInfoLoader } }
    ): Promise<Maybe<BlobInfo>> =>
      handleError(blobInfoLoader.load(cover?.hash)),
    createdBy: async (
      { createdBy: { id: accountId } },
      _,
      { loaders: { accountLoader } }
    ): Promise<AccountInfo> => handleError(accountLoader.mustLoad(accountId)),
    members: async (
      { id: documentId },
      _,
      { loaders: { documentMembersByDocIdLoader } }
    ): Promise<DocumentMember[]> =>
      handleError(documentMembersByDocIdLoader.load(documentId)),
    highlights: async (
      { id: documentId },
      _,
      { loaders: { documentHighlightsByDocIdLoader } }
    ): Promise<DocumentHighlight[]> =>
      handleError(documentHighlightsByDocIdLoader.load(documentId)),
  },
  DocumentMember: {
    document: async (
      { document: { id: documentId } },
      _,
      { loaders: { documentLoader } }
    ): Promise<Document> => handleError(documentLoader.mustLoad(documentId)),
    account: async (
      { account: { id: accountId } },
      _,
      { loaders: { accountLoader } }
    ): Promise<AccountInfo> => handleError(accountLoader.mustLoad(accountId)),
    createdBy: async (
      { createdBy: { id: accountId } },
      _,
      { loaders: { accountLoader } }
    ): Promise<AccountInfo> => handleError(accountLoader.mustLoad(accountId)),
  },
  DocumentHighlight: {
    createdBy: async (
      { createdBy: { id: accountId } },
      _,
      { loaders: { accountLoader } }
    ): Promise<AccountInfo> => handleError(accountLoader.mustLoad(accountId)),
    image: async (
      { image },
      _,
      { loaders: { blobInfoLoader } }
    ): Promise<Maybe<BlobInfo>> =>
      handleError(blobInfoLoader.load(image?.hash)),
    document: async (
      { document: { id: documentId } },
      _,
      { loaders: { documentLoader } }
    ): Promise<Document> => handleError(documentLoader.mustLoad(documentId)),
  },

  BlobInfo: {
    createdBy: async (
      { createdBy: { id: accountId } },
      _,
      { loaders: { accountLoader } }
    ): Promise<AccountInfo> => handleError(accountLoader.mustLoad(accountId)),
    url: ({ hash }) => `http://localhost:4000/files/${hash}`,
  },

  Account: {
    documents: async (
      { id: accountId },
      _,
      { loaders: { documentMembersByAccIdLoader } }
    ): Promise<DocumentMember[]> =>
      handleError(documentMembersByAccIdLoader.load(accountId)),
  },

  Mutation: {
    async createAccount(_, { account: { name } }) {
      return handleError(
        AccountEntity.create({
          name,
        }).save()
      );
    },
    async updateAccount(_, { account: { id, name } }) {
      const account = await handleError(
        AccountEntity.findOneByOrFail({ id: Equal(id) })
      );

      if (name) account.name = name;

      return handleError(AccountEntity.save(account));
    },
    async createDocument(
      _,
      { document: input },
      { accountId, liveQueryStore }
    ) {
      const document = await handleError(
        DocumentEntity.create({
          ...input,
          createdById: accountId,
          members: [
            {
              accountId,
              acceptedAt: new Date(),
              role: DocumentRole.Admin,
            },
          ],
        }).save()
      );

      liveQueryStore.invalidate([`Account:${accountId}`]);

      return document;
    },
    async updateDocument(
      _,
      { document: { id, meta, visibility } },
      { liveQueryStore }
    ) {
      let document = await handleError(
        DocumentEntity.findOneByOrFail({ id: Equal(id) })
      );

      if (meta) document.meta = { ...(document.meta ?? {}), ...meta };
      if (visibility) document.visibility = visibility;

      await handleError(DocumentEntity.save(document));

      liveQueryStore.invalidate(`Document:${id}`);

      return document;
    },
    async deleteDocument(_, { id }, { liveQueryStore }) {
      let document = await handleError(
        DocumentEntity.findOneOrFail({
          where: { id: Equal(id) },
          relations: {
            members: true,
          },
        })
      );

      document = await handleError(DocumentEntity.softRemove(document));

      await handleError(
        DocumentMemberEntity.delete({ documentId: Equal(document.id) })
      );

      const memberIds = document.members.map((member) => member.accountId);

      liveQueryStore.invalidate(memberIds.map((id) => `Account:${id}`));

      return document;
    },
    async createDocumentHighlight(
      _,
      { highlight },
      { accountId, liveQueryStore }
    ) {
      let createdHighlight = await handleError(
        DocumentHighlightEntity.create({
          ...highlight,
          createdById: accountId,
        }).save()
      );

      createdHighlight = await handleError(
        DocumentHighlightEntity.findOneOrFail({
          where: {
            id: Equal(createdHighlight.id),
          },
          loadRelationIds: {
            relations: ["createdBy", "document", "image"],
            disableMixedMap: true,
          },
        })
      );

      liveQueryStore.invalidate(`Document:${createdHighlight.documentId}`);

      return createdHighlight;
    },
    async updateDocumentHighlight(
      _,
      { highlight: { id, content, location, imageHash } },
      { liveQueryStore }
    ) {
      let highlight = await DocumentHighlightEntity.findOneOrFail({
        where: {
          id: Equal(id),
        },
        loadRelationIds: {
          relations: ["createdBy", "document", "image"],
          disableMixedMap: true,
        },
      });

      if (content) highlight.content = content;
      if (location) highlight.location = location;
      if (imageHash) highlight.image = <any>{ hash: imageHash };

      highlight = await DocumentHighlightEntity.save(highlight);

      liveQueryStore.invalidate(`DocumentHighlight:${highlight.id}`);

      return highlight;
    },
    async deleteDocumentHighlight(_, { id }, { liveQueryStore }) {
      const highlight = await handleError(
        DocumentHighlightEntity.findOneByOrFail({
          id: Equal(id),
        })
      );

      await handleError(DocumentHighlightEntity.softRemove(highlight));

      liveQueryStore.invalidate([
        `Document(${highlight.documentId})`,
        `DocumentHighlight:${highlight.id}`,
      ]);

      return highlight;
    },
    async uploadBlob(
      _,
      { blob: { blob, source, mimeType } },
      { accountId, blobStorage }
    ) {
      const hash = await blobStorage.saveBlob(blob, mimeType);

      const blobInfo = await BlobInfoEntity.findOneBy({
        hash: Equal(hash),
      });

      // if blob already exists return existing one
      if (blobInfo) return blobInfo;

      return await handleError(
        BlobInfoEntity.create({
          hash,
          source: source ?? "",
          mimeType,
          size: blob.size,
          createdById: accountId,
        }).save()
      );
    },
    async upsertDocumentMember(
      _,
      { member: { accountId, documentId, accepted, role } },
      { accountId: createdById }
    ) {
      const documentMember = await DocumentMemberEntity.findOneBy({
        accountId,
        documentId,
      });

      if (documentMember) {
        if (accepted && !documentMember.acceptedAt)
          documentMember.acceptedAt = new Date();
        if (role) documentMember.role = role;

        if (accepted === false && documentMember.acceptedAt) {
          await DocumentMemberEntity.delete(documentMember.id);
          return null;
        }

        return await handleError(documentMember.save());
      }

      return await handleError(
        DocumentMemberEntity.create({
          accountId,
          documentId,
          acceptedAt: accepted ? new Date() : undefined,
          role,
          createdById,
        }).save()
      );
    },
  },
};
