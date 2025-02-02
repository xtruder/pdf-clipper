import { beforeAll, beforeEach, describe, expect, test, vi } from "vitest";

import { fromPromise, toObservable, pipe, toPromise, take, map } from "wonka";
import { tapOnce, toArray } from "~/lib/wonka";
import structuredClone from "@ungap/structured-clone";

import { Client } from "urql";
import { InMemoryLiveQueryStore } from "@n1ru4l/in-memory-live-query-store";

import * as dexie from "dexie";
import { createClient } from "./client";

import { createTestServer } from "~/lib/urql";
import resolvers from "~/offline/resolvers";
import schema from "~/offline/schema";

vi.mock("dexie", () => ({
  liveQuery: vi.fn().mockImplementation((querier) => {
    const result = querier();
    return toObservable(fromPromise(Promise.resolve(result)));
  }),
}));
const mockedDexie = vi.mocked(dexie);

vi.mock("~/offline/resolvers");
const mockedResolvers = vi.mocked(resolvers as any, true);

beforeEach(async () => {
  vi.clearAllMocks();
});

test("should create client", async () => {
  const client = createClient({
    url: "!invalid",
    accountId,
    db,
  });

  expect(client).instanceOf(Client);
});

const accountId = "accid";
const db = {} as any;
const nativeFs = {} as any;

describe("offline resolvers", () => {
  let client: Client;

  beforeEach(() => {
    client = createClient({
      url: "!invalid",
      accountId,
      db,
    });
  });

  test("should do query", async () => {
    mockedResolvers.Query?.document?.mockReturnValue({ id: "docid" });

    const { data, error } = await client
      .query(
        `query getDocumentInfo {
          document(id: "docid") {
            id
          }
        }
      `,
        {},
        {
          offline: true,
        }
      )
      .toPromise();

    expect(error).toBeUndefined();
    expect(data).toBeDefined();
    expect(data?.document).toBeDefined();
    expect(mockedResolvers.Query.document).toHaveBeenCalledOnce();
  });

  test("should do live query", async () => {
    mockedResolvers.Query.document.mockReturnValue({ id: "docid" });

    const { data, error } = await client
      .query(
        `query getDocumentInfo @live {
          document(id: "docid") {
            id
          }
        }
      `,
        {},
        {
          offline: true,
        }
      )
      .toPromise();

    expect(error).toBeUndefined();
    expect(data?.document).toBeDefined();
    expect(mockedDexie.liveQuery).toHaveBeenCalled();
    expect(mockedResolvers.Query.document).toHaveBeenCalledOnce();
  });

  test("should do mutation", async () => {
    mockedResolvers.Mutation.updateDocument.mockReturnValue({ id: "docid" });

    const { data, error } = await client
      .mutation(
        `
        mutation updateDocument($document: UpdateDocumentInput!) {
         updateDocument(document: $document) {
            id
          }
        }`,
        {
          document: {
            id: "docid",
            meta: {
              title: "test",
            },
          },
        },
        {
          offline: true,
        }
      )
      .toPromise();

    expect(error).toBeUndefined();
    expect(data.updateDocument).toBeDefined();
    expect(mockedResolvers.Mutation.updateDocument).toHaveBeenCalledOnce();
  });
});

describe("remote resolvers", () => {
  let client: Client;
  let store: InMemoryLiveQueryStore;

  // setup testing graphql server
  beforeAll(async () => {
    const { url, stop, liveQueryStore } = await createTestServer(schema);
    store = liveQueryStore;

    client = createClient({
      url,
      accountId,
      db,
    });

    return stop;
  });

  test("should do remote query", async () => {
    mockedResolvers.Query.document.mockReturnValue({ id: "docid" });

    const { data, error } = await client
      .query(
        `
          query document {
            document(id: "docid") {
              id
            }
          }
        `,
        {}
      )
      .toPromise();

    expect(error).toBeUndefined();
    expect(data.document).to.toBeDefined();
    expect(mockedResolvers.Query.document).toHaveBeenCalledOnce();
  });

  test("should do remote live query", async () => {
    mockedResolvers.Query.document.mockReturnValue({
      id: "docid",
      meta: { title: "title1" },
    });

    const [result1, result2] = await pipe(
      client.query(
        `
          query document @live {
            document(id: "docid") {
              id
              meta {
                title
              }
            }
          }
        `,
        {}
      ),
      take(2),
      tapOnce(() => {
        mockedResolvers.Query.document.mockReturnValue({
          id: "docid",
          meta: { title: "title2" },
        });

        store.invalidate([`Document:docid`]);
      }),
      map(structuredClone),
      toArray,
      toPromise
    );

    expect(result1.error).toBeUndefined();
    expect(result1.data?.document).toBeDefined();

    expect(result2.error).toBeUndefined();
    expect(result2.data?.document).toBeDefined();

    expect(result1.data).not.toEqual(result2.data);
  });
});
