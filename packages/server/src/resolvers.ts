import { ForbiddenError } from "apollo-server-core";
import { GraphQLResolveInfo, subscribe } from "graphql";
import {
  parseResolveInfo,
  simplifyParsedResolveInfoFragmentWithType,
} from "graphql-parse-resolve-info";

import { DocumentRole, Resolvers } from "./generated/graphql";
import { DataLoaders } from "./loaders";

import { PgPersistence } from "./pg";

function getRequestFields(info: GraphQLResolveInfo): string[] {
  const parsedInfo = parseResolveInfo(info);
  const { fields } = simplifyParsedResolveInfoFragmentWithType(
    parsedInfo as any,
    info.returnType
  );

  return Object.keys(fields);
}

const writerRoles = [
  DocumentRole.Reader,
  DocumentRole.Contributor,
  DocumentRole.Owner,
];

export interface GqlContext {
  accountId: string;
  persistence: PgPersistence;
  loaders: DataLoaders;
}

export async function createResolvers(): Promise<Resolvers<GqlContext>> {
  const resolvers: Resolvers<GqlContext> = {
    Query: {
      async account(_parent, _args, context, _info) {
        const accounts = await context.persistence.getAccounts(
          context.accountId
        );

        return accounts?.[0];
      },
      async document(_parent, args, { loaders, accountId }, _info) {
        const docMembers = await loaders.documentMembers.load(args.id);
        const docMembership = docMembers.find((m) => m.accountId === accountId);

        if (!(docMembership && writerRoles.includes(docMembership.role)))
          throw new ForbiddenError("cannot access document");

        return await loaders.documents.load(args.id);
      },
    },
    Subscription: {
      account: {
        async *subscribe(_parent, _args, { persistence, accountId }, _info) {
          const loadAccount = async () => {
            const account = (await persistence.getAccounts(accountId))?.[0];

            if (!account) throw new ForbiddenError("account not found");

            const docs = (await persistence.getAccountsDocuments(accountId))[0];

            account.documents = docIds.map((id) => ({ id }));
          };
        },
      },
    },
    Account: {
      async membership(parent, _args, { loaders }, _info) {
        return await loaders.accountDocuments.load(parent.id);
      },
    },
    DocumentInfo: {
      async members(parent, _args, { loaders }, _info) {
        return loaders.documentMembers.load(parent.id);
      },
      async file(parent, _args, { loaders }, _info) {
        return parent.fileId ? loaders.files.load(parent.fileId) : null;
      },
    },
    DocumentMember: {
      async document(parent, _args, { loaders }, _info) {
        const doc = await loaders.documents.load(parent.documentId);

        if (!doc) throw new Error("missing document");

        return doc;
      },
      async account(parent, _args, { loaders }, _info) {
        return await loaders.accounts.load(parent.accountId);
      },
    },
  };

  return resolvers;
}
