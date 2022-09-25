import { Equal, QueryFailedError, EntityNotFoundError } from "typeorm";
import { DatabaseError } from "pg";

import { GraphQLYogaError } from "@graphql-yoga/node";

import {
  AccountEntity,
  BlobInfoEntity,
  DocumentEntity,
  DocumentHighlightEntity,
  DocumentMemberEntity,
  DocumentRole,
} from "./entities";
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

import { LiveQueryStore } from "./liveQuery";
import { createHash } from "crypto";

const handleError = async <T>(
  promise: Promise<T>,
  msg?: string,
  code?: string
): Promise<T> => {
  try {
    return await promise;
  } catch (error) {
    console.log(error);

    if (error instanceof QueryFailedError) {
      const err = error.driverError as DatabaseError;

      if (msg) {
        throw new GraphQLYogaError(msg);
      } else if (err.code === "23505") {
        throw new GraphQLYogaError("conflict error", {
          code: "CONFLICT_ERROR",
        });
      } else {
        throw new GraphQLYogaError(err.detail || "database error");
      }
    } else if (error instanceof EntityNotFoundError) {
      throw new GraphQLYogaError(msg || error.message, {
        code: code || "NOT_FOUND_ERROR",
      });
    }

    throw error;
  }
};

export interface GqlContext {
  // saveFile: (stream: Readable, key: string) => Promise<void>;
  // getFileUrl: (key: string) => Promise<string>;
  // saveImage: (stream: Readable, key: string) => Promise<void>;
  // getImageUrl: (key: string) => Promise<string>;
  accountId: string;
  liveQueryStore: LiveQueryStore;
}

export const resolvers: Resolvers<GqlContext> = {
  DateTime: dateTimeScalar,
  JSON: JSONScalar,
  ID: uuidScalar,

  // query resolvers
  Query: {
    me: async (_, _args, { accountId }): Promise<Account> =>
      handleError(AccountEntity.findOneByOrFail({ id: accountId })),
    account: async (_, { id }, { accountId: _accId }): Promise<Account> =>
      handleError(
        AccountEntity.findOneByOrFail({
          id: Equal(id),
        })
      ),
    document: async (_, { id }): Promise<Document> =>
      handleError(
        DocumentEntity.findOneByOrFail({
          id: Equal(id),
        })
      ),
    blobInfo: async (_, { hash }): Promise<BlobInfo> =>
      handleError(
        BlobInfoEntity.findOneByOrFail({
          hash: Equal(hash),
        })
      ),
  },
  Document: {
    members: async ({ id: documentId }): Promise<DocumentMember[]> =>
      handleError(
        DocumentMemberEntity.findBy({
          documentId: Equal(documentId),
        })
      ),
    highlights: async ({ id: documentId }): Promise<DocumentHighlight[]> =>
      handleError(
        DocumentHighlightEntity.findBy({
          documentId: Equal(documentId),
        })
      ),
    file: async ({ id: documentId }): Promise<Maybe<BlobInfo>> =>
      handleError(
        BlobInfoEntity.findOneBy({
          documentFile: {
            id: Equal(documentId),
          },
        })
      ),
    cover: async ({ id: documentId }): Promise<Maybe<BlobInfo>> =>
      handleError(
        BlobInfoEntity.findOneBy({
          documentCover: {
            id: Equal(documentId),
          },
        })
      ),
    createdBy: async ({ id: documentId }): Promise<AccountInfo> =>
      handleError(
        AccountEntity.findOneByOrFail({
          documents: {
            documentId: Equal(documentId),
          },
        })
      ),
  },
  DocumentMember: {
    document: async ({ id: docMemberId }): Promise<Document> =>
      handleError(
        DocumentEntity.findOneByOrFail({
          members: {
            id: Equal(docMemberId),
          },
        })
      ),
    account: async ({ id: docMemberId }): Promise<AccountInfo> =>
      handleError(
        AccountEntity.findOneByOrFail({
          documents: {
            id: Equal(docMemberId),
          },
        })
      ),
    createdBy: async ({ id: docMemberId }): Promise<AccountInfo> =>
      handleError(
        AccountEntity.findOneByOrFail({
          documents: {
            id: Equal(docMemberId),
          },
        })
      ),
  },
  DocumentHighlight: {
    image: async ({ id: highlightId }): Promise<Maybe<BlobInfo>> =>
      handleError(
        BlobInfoEntity.findOneBy({
          highlightImage: {
            id: Equal(highlightId),
          },
        })
      ),
    document: async ({ id: highlightId }): Promise<Document> =>
      handleError(
        DocumentEntity.findOneByOrFail({
          highlights: {
            id: Equal(highlightId),
          },
        })
      ),
    createdBy: async ({ id: highlightId }): Promise<AccountInfo> =>
      handleError(
        AccountEntity.findOneByOrFail({
          createdHighlights: {
            id: Equal(highlightId),
          },
        })
      ),
  },

  BlobInfo: {
    createdBy: async ({ hash: blobHash }): Promise<AccountInfo> =>
      handleError(
        AccountEntity.findOneByOrFail({
          createdBlobs: {
            hash: Equal(blobHash),
          },
        })
      ),
  },

  Account: {
    documents: async ({ id: accountId }): Promise<DocumentMember[]> =>
      handleError(DocumentMemberEntity.findBy({ accountId: Equal(accountId) })),
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
    async createDocument(_, { document }, { accountId }) {
      return handleError(
        DocumentEntity.create({
          ...document,
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
    },
    async updateDocument(_, { document: { id, meta, visibility } }) {
      const document = await handleError(
        DocumentEntity.findOneByOrFail({ id: Equal(id) })
      );

      if (meta) document.meta = { ...(document.meta ?? {}), ...meta };
      if (visibility) document.visibility = visibility;

      return await handleError(DocumentEntity.save(document));
    },
    async deleteDocument(_, { id }) {
      const document = await handleError(
        DocumentEntity.findOneByOrFail({ id: Equal(id) })
      );

      return await handleError(DocumentEntity.softRemove(document));
    },
    async createDocumentHighlight(_, { highlight }, { accountId }) {
      return await handleError(
        DocumentHighlightEntity.create({
          ...highlight,
          createdById: accountId,
        }).save()
      );
    },
    async updateDocumentHighlight(
      _,
      { highlight: { id, content, location, imageHash } }
    ) {
      const highlight = await DocumentHighlightEntity.findOneByOrFail({
        id: Equal(id),
      });

      if (content) highlight.content = content;
      if (location) highlight.location = location;
      if (imageHash) highlight.imageHash = imageHash;

      return DocumentHighlightEntity.save(highlight);
    },
    async deleteDocumentHighlight(_, { id }) {
      const highlight = await handleError(
        DocumentHighlightEntity.findOneByOrFail({
          id: Equal(id),
        })
      );

      return handleError(DocumentHighlightEntity.softRemove(highlight));
    },
    async uploadBlob(_, { blob: { blob, source, mimeType } }, { accountId }) {
      const hash = createHash("sha256");
      hash.update(new Uint8Array(await blob.arrayBuffer()));

      return await handleError(
        BlobInfoEntity.create({
          hash: hash.digest("hex"),
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
