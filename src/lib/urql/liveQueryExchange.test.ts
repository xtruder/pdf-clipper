import { beforeAll, beforeEach, expect, test, vi } from "vitest";

import { pipe, take, toPromise, map } from "wonka";
import structuredClone from "@ungap/structured-clone";
import { tapOnce, toArray } from "../wonka";

import { Client, createClient, makeResult, Operation } from "urql";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { InMemoryLiveQueryStore } from "@n1ru4l/in-memory-live-query-store";
import EventSource from "eventsource";

import { liveQueryExchange } from "./liveQueryExchange";
import { createTestServer, mockExchange, typeDefs } from "./test-utils.ts";

if (!global.EventSource) {
  global.EventSource = EventSource as any;
}

const forwardQueryMock = vi.fn();

const resolvers = {
  Query: {
    todos: vi.fn(),
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

let client: Client;
let store: InMemoryLiveQueryStore;
beforeAll(async () => {
  const { url, stop, liveQueryStore } = await createTestServer(schema);
  store = liveQueryStore;

  client = createClient({
    url,
    exchanges: [liveQueryExchange(), mockExchange(forwardQueryMock)],
  });

  return stop;
});

beforeEach(() => {
  vi.clearAllMocks();
});

test("should get initial value", async () => {
  resolvers.Query.todos.mockReturnValue([
    {
      id: 1,
      content: "test",
    },
  ]);

  const { error, data } = await client
    .query(
      `
      query todos @live {
        todos {
          id
          content
        }
      }
    `,
      {}
    )
    .toPromise();

  expect(error).toBeUndefined();
  expect(data).toBeDefined();
  expect(data.todos).toHaveLength(1);
});

test("should get update on invalidated value", async () => {
  resolvers.Query.todos.mockReturnValue([]);

  const [result1, result2] = await pipe(
    client.query(
      `
      query todos @live {
        todos {
          id
          content
        }
      }
    `,
      {}
    ),
    take(2),
    tapOnce(() => {
      resolvers.Query.todos.mockReturnValue([
        {
          id: 1,
          content: "test",
        },
      ]);

      store.invalidate(["Query.todos"]);
    }),
    map(structuredClone),
    toArray,
    toPromise
  );

  expect(resolvers.Query.todos).toHaveBeenCalled();

  expect(result1.error).toBeUndefined();
  expect(result1.data.todos).toHaveLength(0);

  expect(result2.error).toBeUndefined();
  expect(result2.data).toBeDefined();
  expect(result2.data.todos).toHaveLength(1);
});

test("should passthru non live queries", async () => {
  forwardQueryMock.mockImplementationOnce((op: Operation) =>
    makeResult(op, {
      data: {
        todo: {
          id: 1,
          content: "mocked content",
        },
      },
    })
  );

  const { data } = await client
    .query(
      `
      query todo {
        todo(id: 1) {
          id
          content
        }
      }
    `,
      {}
    )
    .toPromise();

  expect(forwardQueryMock).toBeCalledTimes(1);
  expect(data?.todo?.content).eq("mocked content");
});
