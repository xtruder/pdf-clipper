import { GraphQLError } from "graphql";
import { shield, rule, deny, allow } from "graphql-shield";
import { Equal, In, IsNull, Not } from "typeorm";
import {
  AccountEntity,
  BlobInfoEntity,
  DocumentMemberEntity,
} from "../db/entities";

const withError = (
  result: any,
  throwErr: GraphQLError = new GraphQLError("authorization error", {
    extensions: {
      code: "AUTHORIZATION_ERROR",
    },
  })
) => (!!result ? !!result : throwErr);

const isAuthenticated = rule({ cache: "contextual" })(
  async (_parent, _args, { accountId }) =>
    withError(
      await AccountEntity.findOneBy({ id: accountId }),
      new GraphQLError("account not authenticated", {
        extensions: {
          code: "AUTHENTICATION_ERROR",
        },
      })
    )
);

const isDocumentMember = rule({ cache: "contextual" })(
  async (_parent, args, ctx) =>
    withError(
      await DocumentMemberEntity.findOneBy({
        role: In(["ADMIN", "VIEWER", "EDITOR"]),
        documentId: Equal(args.id),
        accountId: Equal(ctx.accountId),
      }),
      new GraphQLError("account not member of document", {
        extensions: {
          code: "AUTHORIZATION_ERROR",
        },
      })
    )
);

const isDocumentEditor = (getDocId: (parent: any, args: any) => any) =>
  rule({ cache: "no_cache" })(async (parent, args, ctx) => {
    console.log(ctx.accountId);
    const id = getDocId(parent, args);
    console.log(id);
    return withError(
      await DocumentMemberEntity.findOneBy({
        role: In(["ADMIN", "EDITOR"]),
        documentId: Equal(id),
        accountId: Equal(ctx.accountId),
      }),
      new GraphQLError("account not document editor", {
        extensions: {
          code: "AUTHORIZATION_ERROR",
        },
      })
    );
  });

const isHighlightEditor = (getId: (parent: any, args: any) => any) =>
  rule({ cache: "no_cache" })(async (parent, args, ctx) => {
    const id = getId(parent, args);

    return withError(
      await DocumentMemberEntity.findOneBy({
        role: In(["ADMIN", "EDITOR"]),
        accountId: Equal(ctx.accountId),
        document: {
          highlights: {
            id: Equal(id),
          },
        },
      }),
      new GraphQLError("account not highlight editor", {
        extensions: {
          code: "AUTHORIZATION_ERROR",
        },
      })
    );
  });

const canViewBlobInfo = rule({ cache: "contextual" })(
  async ({ hash }, _args, { accountId }) =>
    withError(
      await BlobInfoEntity.findOneOrFail({
        where: [
          {
            hash: Equal(hash),
            documentCover: {
              members: {
                role: In(["ADMIN", "VIEWER", "EDITOR"]),
                accountId: Equal(accountId),
                acceptedAt: Not(IsNull()),
              },
            },
          },
          {
            hash: Equal(hash),
            documentFile: {
              members: {
                role: In(["ADMIN", "VIEWER", "EDITOR"]),
                accountId: Equal(accountId),
                acceptedAt: Not(IsNull()),
              },
            },
          },
          {
            createdById: Equal(accountId),
          },
        ],
      })
    )
);

export const permissions = shield(
  {
    Query: {
      me: isAuthenticated,
      document: isDocumentMember,
      blobInfo: canViewBlobInfo,
    },
    Mutation: {
      createAccount: allow,
      createDocument: isAuthenticated,
      updateDocument: isDocumentEditor((_, args) => args?.document?.id),
      deleteDocument: isDocumentEditor((_, { id }) => id),
      createDocumentHighlight: isDocumentEditor(
        (_, args) => args?.highlight?.documentId
      ),
      updateDocumentHighlight: isHighlightEditor(
        (_, args) => args?.highlight?.id
      ),
      deleteDocumentHighlight: isHighlightEditor((_, args) => args?.id),
      uploadBlob: isAuthenticated,
      upsertDocumentMember: isDocumentEditor(
        (_, args) => args?.member?.documentId
      ),
    },
    Account: allow,
    AccountInfo: allow,
    Document: allow,
    DocumentMember: allow,
    DocumentHighlight: allow,
    BlobInfo: allow,
    DocumentMeta: allow,
  },
  {
    fallbackRule: deny,
    allowExternalErrors: true,
  }
);
