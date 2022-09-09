import { createClient, makeResult, Operation } from "urql";
import { beforeEach, expect, test, vi } from "vitest";

import { mockExchange } from "./test-utils.ts";
import { skipExchange } from "./skipExchange";

const shouldSkipExchangeMock = vi.fn();
const fordwardedExchangeMock = vi.fn();
const maybeSkipedExchangeMock = vi.fn();

const client = createClient({
  url: "/graphql",
  exchanges: [
    skipExchange({
      exchange: mockExchange(maybeSkipedExchangeMock),
      shouldSkip: shouldSkipExchangeMock,
    }),
    mockExchange(fordwardedExchangeMock),
  ],
});

beforeEach(() => {
  vi.resetAllMocks();
});

test("should skip exchange if skip is true", async () => {
  shouldSkipExchangeMock.mockImplementation(async () => true);
  fordwardedExchangeMock.mockImplementation((op: Operation) =>
    makeResult(op, {
      data: {
        loreipsum: {
          test: "hello world!",
        },
      },
    })
  );

  const result = await client
    .query(
      `
    {
      loreipsum {
        test
      }
    }
  `,
      {}
    )
    .toPromise();

  expect(result.data).toEqual({ loreipsum: { test: "hello world!" } });
  expect(shouldSkipExchangeMock).toBeCalled();
  expect(fordwardedExchangeMock).toHaveBeenCalledOnce();
  expect(maybeSkipedExchangeMock).not.toBeCalled();
});

test("should execute exchange if skip is false", async () => {
  shouldSkipExchangeMock.mockImplementation(async () => false);

  maybeSkipedExchangeMock.mockImplementation((op: Operation) =>
    makeResult(op, {
      data: {
        loreipsum: {
          test: "hello world!",
        },
      },
    })
  );

  const result = await client
    .query(
      `
    {
      loreipsum {
        test
      }
    }
  `,
      {}
    )
    .toPromise();

  expect(result.data).toEqual({ loreipsum: { test: "hello world!" } });
  expect(shouldSkipExchangeMock).toBeCalled();
  expect(fordwardedExchangeMock).not.toBeCalled();
  expect(maybeSkipedExchangeMock).toBeCalledTimes(1);
});
