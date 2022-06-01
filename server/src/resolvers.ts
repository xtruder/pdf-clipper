import DataLoader from "dataloader";
import { GraphQLScalarType, Kind } from "graphql";
import { Equal, In, IsNull, Not } from "typeorm";
import { ForbiddenError } from "apollo-server-errors";

import { AppDataSource } from "./data-source";
import {
  AccountEntity,
  DocumentEntity,
  DocumentHighlightEntity,
  DocumentMemberEntity,
  DocumentRole,
  FileEntity,
} from "./entities";
import {
  Account,
  Document,
  AccountDocument,
  DocumentMember,
  Resolvers,
  DocumentHighlight,
  AccountInfo,
  FileInfo,
} from "./graphql.schema";
import { DeepPartial } from "./types";

const dateTimeScalar = new GraphQLScalarType<Date, string>({
  name: "DateTime",

  description: "DateTime custom scalar type",

  serialize(value: Date): string {
    return value.toISOString();
  },

  parseValue(value: string): Date {
    return new Date(value); // Convert incoming integer to Date
  },

  parseLiteral(ast): Date | null {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value); // Convert hard-coded AST string to Date
    }

    return null; // Invalid hard-coded value (not an integer)
  },
});

const JSONScalar = new GraphQLScalarType<any, string>({
  name: "JSON",

  description: "JSON scalar type",

  serialize(value: any): string {
    return JSON.stringify(value);
  },

  parseValue(value: string): any {
    return JSON.parse(value);
  },

  parseLiteral(ast): any | null {
    if (ast.kind === Kind.STRING) {
      try {
        return JSON.parse(ast.value);
      } catch {
        return null;
      }
    }

    return null;
  },
});

const accountEntityToAccountInfo = ({
  id,
  name,
}: AccountEntity): AccountInfo => ({
  id,
  name,
});

const documentEntityToDocument = ({
  id,
  createdAt,
  updatedAt,
  deletedAt,
  type,
  meta,
  fileHash,
  createdBy,
  createdById,
}: DocumentEntity): DeepPartial<Document> => ({
  id,
  createdAt,
  updatedAt,
  deletedAt,
  type,
  meta,
  file: { hash: fileHash },
  createdBy: createdBy
    ? { id: createdBy.id, name: createdBy.name }
    : { id: createdById },
});

const fileEntityToFileInfo = ({
  hash,
  mimeType,
  createdAt,
  updatedAt,
  createdBy,
  createdById,
  sources,
}: FileEntity): DeepPartial<FileInfo> => ({
  hash,
  mimeType,
  sources,
  createdAt,
  updatedAt,
  createdBy: createdBy
    ? { id: createdBy.id, name: createdBy.name }
    : { id: createdById },
});

const accountEntityToAccount = ({
  id,
  createdAt,
  updatedAt,
  deletedAt,
  name,
}: AccountEntity): DeepPartial<Account> => ({
  id,
  createdAt,
  updatedAt,
  deletedAt,
  name,
});

const documentMemberEntityToAccountDocument = ({
  role,
  createdAt,
  acceptedAt,
  documentId,
}: DocumentMemberEntity): DeepPartial<AccountDocument> => ({
  role,
  createdAt,
  acceptedAt,
  document: { id: documentId },
});

const documentMemberEntityToDocumentMember = ({
  role,
  createdAt,
  acceptedAt,
  account,
  accountId,
}: DocumentMemberEntity): DeepPartial<DocumentMember> => ({
  role,
  createdAt,
  acceptedAt,
  account: account ? { id: account.id, name: account.name } : { id: accountId },
});

const documentHighlightEntityToDocumentHighlight = ({
  id,
  location,
  content,
  createdAt,
  updatedAt,
  deletedAt,
  createdBy,
  createdById,
}: DocumentHighlightEntity): DeepPartial<DocumentHighlight> => ({
  id,
  location,
  content,
  createdAt,
  updatedAt,
  deletedAt,
  createdBy: createdBy
    ? { id: createdBy.id, name: createdBy.name }
    : { id: createdById },
});

export const createLoaders = () => ({
  accountInfoLoader: new DataLoader<string, AccountInfo | null>(async (ids) => {
    const accounts = await AppDataSource.manager.findBy(AccountEntity, {
      id: In(ids as string[]),
    });

    return ids
      .map((id) => accounts.find((acc) => acc.id === id))
      .map((v) => (v ? accountEntityToAccountInfo(v) : null));
  }),
  documentLoader: new DataLoader<string, DeepPartial<Document>>(async (ids) => {
    const documents = await AppDataSource.manager.findBy(DocumentEntity, {
      id: In(ids as string[]),
    });

    return ids
      .map((id) => documents.find((doc) => doc.id === id))
      .map((v) => (v ? documentEntityToDocument(v) : null));
  }),
  documentMembersLoader: new DataLoader<string, DeepPartial<DocumentMember>[]>(
    async (ids) => {
      // get all members where document id matches and eagerly load account info
      const documentMembers = await AppDataSource.manager.find(
        DocumentMemberEntity,
        {
          where: {
            documentId: In(ids as string[]),
          },
          order: {
            createdAt: "DESC",
          },
        }
      );

      return ids
        .map((docId) => documentMembers.filter((m) => m.documentId === docId))
        .map((g) => g.map(documentMemberEntityToDocumentMember));
    }
  ),
  documentHighlightsLoader: new DataLoader<
    string,
    DeepPartial<DocumentHighlight[]>
  >(async (ids) => {
    const highlights = await AppDataSource.manager.find(
      DocumentHighlightEntity,
      {
        where: {
          documentId: In(ids as string[]),
        },
        order: {
          createdAt: "DESC",
        },
      }
    );

    return ids
      .map((docId) => highlights.filter((h) => h.documentId === docId))
      .map((g) => g.map(documentHighlightEntityToDocumentHighlight));
  }),
});

export interface GqlContext extends ReturnType<typeof createLoaders> {
  accountId: string;
}

export async function createResolvers(): Promise<Resolvers> {
  const resolvers: Resolvers<GqlContext> = {
    // query resolvers
    Query: {
      async currentAccount(
        _parent,
        _args,
        { accountId }
      ): Promise<Partial<DeepPartial<Account> | null>> {
        const account = await AppDataSource.manager.findOneBy(AccountEntity, {
          id: Equal(accountId),
        });

        if (!account) return null;

        return accountEntityToAccount(account);
      },
      async document(
        _parent,
        args,
        { accountId }
      ): Promise<DeepPartial<Document> | null> {
        const docs = await AppDataSource.manager.findBy(DocumentEntity, [
          {
            id: Equal(args.id),
            members: {
              id: Equal(accountId),
              acceptedAt: Not(IsNull()),
            },
          },
          {
            id: Equal(args.id),
            createdById: Equal(accountId),
          },
        ]);

        if (!docs.length) return null;

        return documentEntityToDocument(docs[0]);
      },
    },
    Account: {
      async documents(parent): Promise<DeepPartial<AccountDocument>[]> {
        // get all members where account id matches and eagerly load some relations
        const accountDocs = await AppDataSource.manager.find(
          DocumentMemberEntity,
          {
            where: {
              accountId: Equal(parent.id),
            },
            order: {
              createdAt: "DESC",
            },
          }
        );

        return accountDocs.map(documentMemberEntityToAccountDocument);
      },
    },
    DocumentMember: {
      account: (parent, _, { accountInfoLoader }) =>
        accountInfoLoader.load(parent.account?.id),
    },
    AccountDocument: {
      document: (parent, _, { documentLoader }) =>
        documentLoader.load(parent.document?.id),
    },
    Document: {
      // loads documents members for document using dataloader
      members: (parent, _, { documentMembersLoader }) =>
        documentMembersLoader.load(parent.id),

      // loads document highlights for a document
      highlights: (parent, _, { documentHighlightsLoader }) =>
        documentHighlightsLoader.load(parent.id),
    },
    DateTime: dateTimeScalar,
    JSON: JSONScalar,

    // mutation resolvers
    Mutation: {
      updateAccount: (_, { account: { id, name } }, ctx) =>
        AppDataSource.manager.transaction(async (mgr) => {
          const account = await mgr.findOneBy(AccountEntity, {
            id,
          });

          if (account.id !== ctx.accountId)
            throw new ForbiddenError("invalid account");

          account.name = name;

          await mgr.save(account);

          return accountEntityToAccount(account);
        }),
      removeMeFromDocument: async (_parent, { documentId }, { accountId }) =>
        AppDataSource.manager.transaction(async (mgr) => {
          const docs = await mgr.findBy(DocumentMemberEntity, {
            accountId: Equal(accountId),
            documentId: Equal(documentId),
          });

          if (!docs.length) return false;

          await mgr.remove(docs);

          return true;
        }),
      upsertFileInfo: async (
        _parent,
        { fileInfo: { hash, mimeType, sources } },
        { accountId }
      ) =>
        AppDataSource.manager.transaction(async (mgr) => {
          let file = await mgr.findOneBy(FileEntity, { hash: Equal(hash) });

          if (file) {
            if (file.createdById !== accountId)
              throw new ForbiddenError("invalid account");

            file = mgr.merge(FileEntity, file, { hash, mimeType, sources });
          } else {
            file = mgr.create(FileEntity, {
              hash,
              mimeType,
              sources,
              createdById: accountId,
            });
          }

          return fileEntityToFileInfo(await mgr.save(file, { reload: true }));
        }),
      upsertDocument: async (
        _parent,
        { document: { id, fileHash, meta, type } },
        { accountId }
      ) =>
        AppDataSource.manager.transaction(async (mgr) => {
          let document: DocumentEntity | undefined;

          if (id) {
            document = await mgr.findOne(DocumentEntity, {
              where: { id: Equal(id) },
              relations: { members: true },
            });

            if (
              document &&
              !document.members.find(
                (m) =>
                  m.accountId === accountId &&
                  m.acceptedAt &&
                  (m.role === DocumentRole.Editor ||
                    m.role === DocumentRole.Admin)
              )
            )
              throw new ForbiddenError("invalid document role");
          }

          if (!document) {
            // create a new document
            document = await mgr.save(
              DocumentEntity,
              {
                id,
                fileHash,
                meta: { ...meta },
                type,
                createdById: accountId,
              },
              { reload: true }
            );

            // make account admin of newly created document
            await mgr.insert(DocumentMemberEntity, {
              documentId: document.id,
              accountId,
              role: DocumentRole.Admin,
              acceptedAt: new Date(),
            });
          } else {
            document = mgr.merge(DocumentEntity, document, {
              meta: { ...meta },
            });

            document = await mgr.save(document, { reload: true });
          }

          return documentEntityToDocument(document);
        }),
      upsertDocumentHighlight: (
        _parent,
        { documentId, highlight: { id, content, deleted, location } },
        { accountId }
      ) =>
        AppDataSource.manager.transaction(async (mgr) => {
          let highlight: DocumentHighlightEntity | undefined;

          if (id) {
            highlight = await mgr.findOne(DocumentHighlightEntity, {
              where: { id: Equal(id) },
              relations: { document: { members: true } },
            });

            if (
              highlight &&
              !highlight.document?.members.find(
                (m) =>
                  m.accountId === accountId &&
                  m.acceptedAt &&
                  (m.role === DocumentRole.Editor ||
                    m.role === DocumentRole.Admin)
              )
            )
              throw new ForbiddenError("invalid document role");
          }

          if (!highlight)
            highlight = mgr.create(DocumentHighlightEntity, {
              id,
              location,
              content,
              documentId,
              createdById: accountId,
            });
          else {
            highlight = mgr.merge(DocumentHighlightEntity, highlight, {
              id,
              content,
              location,
              deletedAt: deleted ? new Date() : null,
            });
          }

          highlight = await mgr.save(highlight, { reload: true });

          return documentHighlightEntityToDocumentHighlight(highlight);
        }),
    },
  };

  return resolvers;
}
