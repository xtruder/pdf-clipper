import { Exchange, Operation } from "urql";
import {
  filter,
  fromPromise,
  fromValue,
  map,
  merge,
  mergeMap,
  pipe,
  share,
} from "wonka";

export interface SkipExchangeParams {
  /**original exchange to process events with */
  exchange: Exchange;

  /**function to determine whether to skip exchange or not */
  shouldSkip: (op: Operation) => Promise<boolean> | boolean;
}

/**Simple urql exchange that skips (forwards) operations based on filter */
export const skipExchange: (params: SkipExchangeParams) => Exchange =
  ({ exchange, shouldSkip }) =>
  ({ forward, ...opts }) =>
  (ops$) => {
    const sharedOps$ = share(ops$);

    const processOps$ = pipe(
      sharedOps$,
      mergeMap((op) => {
        return pipe(
          fromPromise(Promise.resolve(shouldSkip(op))),
          filter((skip) => op.kind !== "teardown" && !skip),
          map(() => op)
        );
      }),
      exchange({
        forward: (fwdOps$) =>
          pipe(
            fwdOps$,

            // don't foward teardown twice
            filter((op) => op.kind !== "teardown"),
            forward
          ),
        ...opts,
      })
    );

    const forwardOps$ = pipe(
      sharedOps$,
      mergeMap((op) => {
        if (op.kind === "teardown") return fromValue(op);

        return pipe(
          fromPromise(Promise.resolve(shouldSkip(op))),
          filter((skip) => skip),
          map(() => op)
        );
      }),
      forward
    );

    return merge([processOps$, forwardOps$]);
  };
