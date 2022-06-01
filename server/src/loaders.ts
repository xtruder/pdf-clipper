import DataLoader from "dataloader";
import { In, DeepPartial } from "typeorm";
import {
  AccountEntity,
  DocumentEntity,
  DocumentMemberEntity,
  DocumentHighlightEntity,
  FileEntity,
} from "./entities";
import {
  AccountInfo,
  DocumentMember,
  DocumentHighlight,
  Document,
  FileInfo,
} from "./graphql.schema";

export const createLoaders = () => ({
  accountInfoLoader: new DataLoader<string, AccountInfo | null>(async (ids) => {
    const accounts = await AccountEntity.findBy({
      id: In(ids as string[]),
    });

    return ids
      .map((id) => accounts.find((acc) => acc.id === id))
      .map((v) => v?.toAccountInfo() || null);
  }),
  documentLoader: new DataLoader<string, DeepPartial<Document>>(async (ids) => {
    const documents = await DocumentEntity.findBy({
      id: In(ids as string[]),
    });

    return ids
      .map((id) => documents.find((doc) => doc.id === id))
      .map((v) => v?.toDocument() || null);
  }),
  documentMembersLoader: new DataLoader<string, DeepPartial<DocumentMember>[]>(
    async (ids) => {
      // get all members where document id matches and eagerly load account info
      const documentMembers = await DocumentMemberEntity.find({
        where: {
          documentId: In(ids as string[]),
        },
        order: {
          createdAt: "DESC",
        },
      });

      return ids
        .map((docId) => documentMembers.filter((m) => m.documentId === docId))
        .map((g) => g.map((m) => m.toDocumentMember()));
    }
  ),
  documentHighlightsLoader: new DataLoader<
    string,
    DeepPartial<DocumentHighlight[]>
  >(async (ids) => {
    const highlights = await DocumentHighlightEntity.find({
      where: {
        documentId: In(ids as string[]),
      },
      order: {
        createdAt: "DESC",
      },
    });

    return ids
      .map((docId) => highlights.filter((h) => h.documentId === docId))
      .map((g) => g.map((e) => e?.toDocumentHighlight() || null));
  }),
});

export type Loaders = ReturnType<typeof createLoaders>;
