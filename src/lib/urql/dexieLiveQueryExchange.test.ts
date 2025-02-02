import "fake-indexeddb/auto";
import { test, beforeEach, expect, vi } from "vitest";

import { pipe, take, toPromise } from "wonka";
import { toArray } from "../wonka";

import { createClient, makeResult, Operation } from "urql";
import { makeExecutableSchema } from "@graphql-tools/schema";

import Dexie, { Table } from "dexie";

import { mockExchange, typeDefs } from "./test-utils";
import { dexieLiveQueryExchange } from "./dexieLiveQueryExchange";

interface Todo {
  id?: number;
  content: string;
}

class TestDB extends Dexie {
  todos!: Table<Todo>;

  constructor() {
    super("db");

    this.version(1).stores({
      todos: "++id,content",
    });
  }
}

const db = new TestDB();

const resolvers = {
  Query: {
    todo: async (_: any, { id }: { id: number }, db: TestDB) => {
      return await db.todos.get(id);
    },
    todos: async (_info: any, _args: any, db: TestDB) => {
      return await db.todos.toArray();
    },
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const forwardQueryMock = vi.fn();

const client = createClient({
  url: "/graphql",
  exchanges: [
    dexieLiveQueryExchange({
      context: db,
      schema,
    }),
    mockExchange(forwardQueryMock),
  ],
});

beforeEach(() => db.todos.clear());
beforeEach(() => {
  vi.resetAllMocks();
});

test("should get first result", async () => {
  await db.todos.add({ id: 1, content: "content" });

  const result = await client
    .query(
      `
      query todo @live {
        todo(id: 1) {
          id
          content
        }
      }
    `,
      {}
    )
    .toPromise();

  expect(result.error).toBeUndefined();
  expect(result.data?.todo?.content).eq("content");
});

test("should get update on changes", async () => {
  await db.todos.add({ id: 1, content: "content" });

  const resultPromise = pipe(
    client.query(
      `
      query todo @live {
        todo(id: 1) {
          id
          content
        }
      }
    `,
      {}
    ),
    take(2),
    toArray,
    toPromise
  );

  await db.todos.put({ id: 1, content: "new content" });

  const [result1, result2] = await resultPromise;

  expect(result1.error).toBeUndefined();
  expect(result1.data?.todo?.content).eq("content");

  expect(result2.error).toBeUndefined();
  expect(result2.data?.todo?.content).eq("new content");
});

test("should get update on new content", async () => {
  const resultPromise = pipe(
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
    toArray,
    toPromise
  );

  db.todos.put({ id: 1, content: "third content" });

  const [result1, result2] = await resultPromise;

  expect(result1.error).toBeUndefined();
  expect(result1.data?.todos).toHaveLength(0);

  expect(result2.error).toBeUndefined();
  expect(result2.data?.todos).toHaveLength(1);
  expect(result2.data?.todos[0].content).eq("third content");
});

test("should forward operations on non-live query", async () => {
  await db.todos.add({ id: 1, content: "content" });

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
