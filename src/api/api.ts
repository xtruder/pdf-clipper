import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { withScalars } from "apollo-link-scalars";
import { buildClientSchema } from "graphql";
import Observable from "zen-observable";

// import graphql schema as raw string due performance reasons
import graphqlRawSchema from "./generated/graphql.schema.json?raw";

import { Account, DocumentHighlight, DocumentInfo } from "~/types";

import {
  CreateDocumentImagePostPolicyDocument,
  CreateDocumentImagePostPolicyMutation,
  CreateDocumentImagePostPolicyMutationVariables,
  GetAccountDataDocument,
  GetAccountDataQuery,
  GetAccountDataQueryVariables,
  GetAccountDocument,
  GetAccountInfoDocument,
  GetAccountInfoQuery,
  GetAccountInfoQueryVariables,
  GetAccountQuery,
  GetAccountQueryVariables,
  GetDocumentDocument,
  GetDocumentHighlightDocument,
  GetDocumentHighlightQuery,
  GetDocumentHighlightQueryVariables,
  GetDocumentHighlightsDocument,
  GetDocumentHighlightsQuery,
  GetDocumentHighlightsQueryVariables,
  GetDocumentQuery,
  GetDocumentQueryVariables,
  SubscribeDocumentHighlightsDocument,
  SubscribeDocumentHighlightsSubscription,
  SubscribeDocumentHighlightsSubscriptionVariables,
  UpsertAccountDocumentsDocument,
  UpsertAccountDocumentsMutation,
  UpsertAccountDocumentsMutationVariables,
  UpsertDocumentHighlightDocument,
  UpsertDocumentHighlightMutation,
  UpsertDocumentHighlightMutationVariables,
  UpsertDocumentMutation,
  UpsertDocumentMutationVariables,
} from "./generated/graphql";
import { handleFetchResp, handleQueryResp } from "./util";

const schema = buildClientSchema(JSON.parse(graphqlRawSchema));

const typesMap = {
  // parse timestamptz scalar into Date and vice versa
  timestamptz: {
    serialize: (parsed: unknown): string | null =>
      parsed instanceof Date ? parsed.toString() : null,
    parseValue: (raw: unknown): Date | null => {
      if (!raw) return null;
      if (typeof raw === "string") return new Date(raw);

      throw new Error("invalid value to parse");
    },
  },
};

export class ApiClient {
  private client: ApolloClient<any>;
  private documentImagePostPolicy?: {
    postURL: string;
    formData: Record<string, string>;
  };

  constructor(uri: string) {
    const link = ApolloLink.from([
      withScalars({ schema, typesMap }),
      new HttpLink({ uri }),
    ]);

    this.client = new ApolloClient({
      link,
      cache: new InMemoryCache(),
    });
  }

  private async getDocumentImagePostPolicy(documentId: string): Promise<{
    postURL: string;
    formData: Record<string, string>;
  }> {
    if (this.documentImagePostPolicy) return this.documentImagePostPolicy;

    const resp = handleFetchResp(
      await this.client.mutate<
        CreateDocumentImagePostPolicyMutation,
        CreateDocumentImagePostPolicyMutationVariables
      >({
        mutation: CreateDocumentImagePostPolicyDocument,
        variables: {
          documentId,
        },
      })
    );

    return resp?.createDocumentImagePostPolicy!;
  }

  private async uploadDocumentImage(
    documentId: string,
    file: Blob,
    fileName: string
  ): Promise<void> {
    const form = new FormData();

    const key = `documents/${documentId}/images/${fileName}`;

    const documentImagePostPolicy = await this.getDocumentImagePostPolicy(
      documentId
    );

    Object.entries({
      ...documentImagePostPolicy.formData,
      key,
    }).forEach(([key, value]) => form.append(key, value));

    form.append("file", file);

    // upload file using multipart upload
    const resp = await fetch(documentImagePostPolicy.postURL, {
      method: "POST",
      body: form,
    });

    if (!resp.ok)
      throw new Error(
        `Error uploading file ${resp.status}: ${resp.statusText}`
      );
  }

  private writeAccountInfoQuery(account: GetAccountInfoQuery["account"]) {
    this.client.writeQuery<GetAccountInfoQuery, GetAccountInfoQueryVariables>({
      query: GetAccountInfoDocument,
      variables: { accountId: account?.id },
      data: {
        __typename: "query_root",
        account,
      },
    });
  }

  private writeDocumentHighlightQuery(
    documentHighlight: GetDocumentHighlightQuery["documentHighlight"]
  ) {
    this.client.writeQuery<
      GetDocumentHighlightQuery,
      GetDocumentHighlightQueryVariables
    >({
      query: GetDocumentHighlightDocument,
      variables: { highlightId: documentHighlight?.id },
      data: {
        __typename: "query_root",
        documentHighlight,
      },
    });
  }

  async getAccountData(accountId: string): Promise<Account | null> {
    const { account } = handleQueryResp(
      await this.client.query<
        GetAccountDataQuery,
        GetAccountDataQueryVariables
      >({
        query: GetAccountDataDocument,
        variables: { accountId },
        errorPolicy: "all",
      })
    );

    if (!account) return null;

    // cache query for account document
    this.client.writeQuery<GetAccountQuery, GetAccountQueryVariables>({
      query: GetAccountDocument,
      variables: { accountId },
      data: { account },
    });

    // cache getDocument query for documents returned in getAccountData
    for (const doc of account.documents) {
      this.client.writeQuery<GetDocumentQuery, GetDocumentQueryVariables>({
        query: GetDocumentDocument,
        variables: { documentId: doc.documentId },
        data: {
          document: doc.document,
        },
      });
    }

    return account;
  }

  async getAccount(accountId: string): Promise<Account | null> {
    const { account } = handleQueryResp(
      await this.client.query<GetAccountQuery, GetAccountQueryVariables>({
        query: GetAccountDocument,
        variables: { accountId },
      })
    );

    if (!account) return null;

    return account;
  }

  async getDocument(documentId: string): Promise<DocumentInfo | null> {
    const { document } = handleQueryResp(
      await this.client.query<GetDocumentQuery, GetDocumentQueryVariables>({
        query: GetDocumentDocument,
        variables: { documentId },
      })
    );

    if (!document) return null;

    // write cache for getAccountInfo for document creator
    if (document.creator) this.writeAccountInfoQuery(document.creator);

    // write cache for getAccountInfo for every document member
    document.members.forEach((m) => this.writeAccountInfoQuery(m.account));

    return document;
  }

  async upsertDocument(document: DocumentInfo): Promise<DocumentInfo | null> {
    // insert updated document
    const { insertDocument } =
      handleFetchResp(
        await this.client.mutate<
          UpsertDocumentMutation,
          UpsertDocumentMutationVariables
        >({
          mutation: UpsertDocumentHighlightDocument,
          variables: {
            object: { ...document, members: null },
            updatedAt: document.updatedAt,
          },
        })
      ) || {};

    const { insertAccountDocuments } =
      handleFetchResp(
        await this.client.mutate<
          UpsertAccountDocumentsMutation,
          UpsertAccountDocumentsMutationVariables
        >({
          mutation: UpsertAccountDocumentsDocument,
          variables: {
            objects: document.members.map((m) => ({
              accountId: m.accountId,
              documentId: document.id,
              role: m.role,
              acceptedAt: m.approvedAt,
            })),
          },
        })
      ) || {};

    // update document members with changes applied
    const members = document.members.map((m) => {
      const changedEl = insertAccountDocuments?.returning.find(
        (el) => el.documentId === document.id && el.accountId === m.accountId
      );

      if (!changedEl) return m;

      const { role, acceptedAt } = changedEl;
      return { ...m, role, approvedAt: acceptedAt };
    });

    return { ...document, ...insertDocument, members };
  }

  async getDocumentHighlights(
    documentId: string
  ): Promise<DocumentHighlight[]> {
    const { documentHighlights } = handleQueryResp(
      await this.client.query<
        GetDocumentHighlightsQuery,
        GetDocumentHighlightsQueryVariables
      >({
        query: GetDocumentHighlightsDocument,
        variables: { documentId },
      })
    );

    for (const highlight of documentHighlights) {
      // cache individual highlights
      this.writeDocumentHighlightQuery(highlight);

      // cache account infor for highlight creator
      this.writeAccountInfoQuery(highlight.creator);
    }

    return documentHighlights;
  }

  /**gets document highlight by highlight id */
  async getDocumentHighlight(
    highlightId: string
  ): Promise<DocumentHighlight | null> {
    const result = await this.client.query<
      GetDocumentHighlightQuery,
      GetDocumentHighlightQueryVariables
    >({
      query: GetDocumentHighlightDocument,
      variables: { highlightId },
    });

    if (!result.data.documentHighlight) return null;

    const highlight = result.data.documentHighlight;

    // cache highlight creator
    this.writeAccountInfoQuery(highlight.creator);

    return highlight;
  }

  /**subscribe on any changes on highlights */
  subscribeHighlights(documentId: string): Observable<
    {
      id: string;
      updatedAt: Date;
    }[]
  > {
    return this.client
      .subscribe<
        SubscribeDocumentHighlightsSubscription,
        SubscribeDocumentHighlightsSubscriptionVariables
      >({
        query: SubscribeDocumentHighlightsDocument,
        variables: { documentId },
      })
      .filter((value) => !!value.data?.documentHighlights)
      .map((value) => value.data?.documentHighlights!);
  }

  async upsertDocumentHighlight(
    highlight: DocumentHighlight
  ): Promise<DocumentHighlight | null> {
    const resp = handleFetchResp(
      await this.client.mutate<
        UpsertDocumentHighlightMutation,
        UpsertDocumentHighlightMutationVariables
      >({
        mutation: UpsertDocumentHighlightDocument,
        variables: {
          highlight,
          updatedAt: highlight.updatedAt,
        },
      })
    );

    return resp?.insertDocumentHighlight || null;
  }
}
