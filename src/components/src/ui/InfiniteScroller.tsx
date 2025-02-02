import React, { FC, ComponentType, useState, useCallback } from "react";
import useStateRef from "react-usestateref";

export interface PageParams {
  before?: string;
  after?: string;
  maxCursor?: string;
  minCursor?: string;
  showLoadBefore?: boolean;
  showLoadAfter?: boolean;
}

export interface LoadPageResponse<T = any> {
  nodes: T[];
  startCursor?: string;
  endCursor?: string;
}

export interface InfiniteScrollerProps {
  className?: string;
  pageClassName?: string;
  loadPage: (page: PageParams) => LoadPageResponse;
  loadBeforeEl?: ComponentType<{
    onLoad: () => void;
    response?: LoadPageResponse;
  }>;
  loadAfterEl?: ComponentType<{
    onLoad: () => void;
    response?: LoadPageResponse;
  }>;
  nodeEl: ComponentType<{ node: any }>;
  compareCursors?: (cursor1?: string, cursor2?: string) => number;
}

export const InfiniteScroller: FC<InfiniteScrollerProps> = ({
  className,
  loadPage,
  nodeEl: Node,
  pageClassName,
  loadBeforeEl: LoadBefore,
  loadAfterEl: LoadAfter,
  compareCursors = (c1, c2) => ("" + c1).localeCompare("" + c2),
}) => {
  const [pages, setPages, pagesRef] = useStateRef<PageParams[]>([
    { after: "4", showLoadBefore: true, showLoadAfter: true },
  ]);

  const ScrollPage: FC<PageParams> = useCallback(
    ({
      before,
      after,
      minCursor,
      maxCursor,
      showLoadAfter,
      showLoadBefore,
    }: PageParams) => {
      const loadedPage = loadPage({ before, after, minCursor, maxCursor });
      const { nodes, startCursor, endCursor } = loadedPage;

      const loadBefore = () => {
        if (!startCursor) return;

        const newPages = [...pagesRef.current];

        const currentPageIdx = newPages.findIndex(
          (p) => p.before === before && p.after === after
        );
        const previousPage =
          newPages[currentPageIdx === 0 ? NaN : currentPageIdx - 1];

        newPages[currentPageIdx].showLoadBefore = false;

        newPages.splice(currentPageIdx, 0, {
          minCursor: previousPage?.after,
          maxCursor: startCursor,
          before: startCursor,
          showLoadBefore: !!startCursor,
          showLoadAfter: false,
        });

        setPages(newPages);
      };

      const loadAfter = () => {
        if (!endCursor) return;

        const newPages = [...pagesRef.current];

        const currentPageIdx = newPages.findIndex(
          (p) => p.after === after && p.before === before
        );
        const nextPage = newPages[currentPageIdx + 1];

        newPages[currentPageIdx].showLoadAfter = false;

        newPages.splice(currentPageIdx + 1, 0, {
          minCursor: endCursor,
          maxCursor: nextPage?.before,
          after: endCursor,
          showLoadAfter: !!endCursor,
          showLoadBefore: false,
        });

        setPages(newPages);
      };

      return (
        <div className={pageClassName}>
          {startCursor && showLoadBefore && LoadBefore && (
            <LoadBefore onLoad={loadBefore} response={loadedPage} />
          )}
          {nodes.map((node, i) => (
            <Node key={i} node={node} />
          ))}
          {endCursor && showLoadAfter && LoadAfter && (
            <LoadAfter onLoad={loadAfter} response={loadedPage} />
          )}
        </div>
      );
    },
    [loadPage]
  );

  return (
    <div className={className}>
      {pages.map((params, i) => (
        <ScrollPage key={i} {...params} />
      ))}
    </div>
  );
};
