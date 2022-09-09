import React from "react";
import { Story } from "@storybook/react";
import {
  InfiniteScroller,
  LoadPageResponse,
  PageParams,
} from "./InfiniteScroller";

export default {
  title: "ui/InfiniteScroller",
};

const Node = ({ node }: any) => <div>{node.title}</div>;

const LoadMore = ({ onLoad }: { onLoad: () => void }) => (
  <button onClick={onLoad}>Load More...</button>
);

export const TheInfiniteScroller: Story = (args) => {
  const todos = [
    {
      id: "1",
      title: "buy tomato",
    },
    {
      id: "2",
      title: "buy potato",
    },
    {
      id: "3",
      title: "wash dishes",
    },
    {
      id: "4",
      title: "wash clothes",
    },
    {
      id: "5",
      title: "go to supermarket",
    },
    {
      id: "6",
      title: "meet with friends",
    },
    {
      id: "7",
      title: "go jogging",
    },
    {
      id: "8",
      title: "do programming",
    },
  ];

  const loadPage = ({
    after,
    before,
    minCursor,
    maxCursor,
  }: PageParams): LoadPageResponse => {
    let results = [...todos];

    if (minCursor) {
      results = results.filter((t) => t.id.localeCompare(minCursor) > 0);
    }

    if (maxCursor) {
      results = results.filter((t) => t.id.localeCompare(maxCursor) < 0);
    }

    if (after) {
      results = results.filter((t) => t.id.localeCompare(after) > 0);
    } else if (before) {
      results = results.filter((t) => t.id.localeCompare(before) < 0);
    }

    results.sort((t1, t2) => t1.id.localeCompare(t2.id));
    results = after
      ? results.splice(0, 3)
      : results.splice(results.length - 3, 3);

    if (!results.length) {
      return { nodes: [] };
    }

    const startCursor =
      results[0]?.id !== todos[0].id ? results[0]?.id : undefined;
    const endCursor =
      results.at(-1) !== todos.at(-1) ? results.at(-1)?.id : undefined;

    return {
      nodes: results,
      startCursor,
      endCursor,
    };
  };

  return (
    <InfiniteScroller
      loadPage={loadPage}
      nodeEl={Node}
      loadAfterEl={LoadMore}
      loadBeforeEl={LoadMore}
    />
  );
};
