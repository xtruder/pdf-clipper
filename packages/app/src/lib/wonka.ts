import { concat, Operator, pipe, scan, share, Source, take, tap } from "wonka";

export const tapOnce =
  <T>(callback: (value: T) => void): Operator<T, T> =>
  (source$: Source<T>): Source<T> => {
    const sharedSource$ = pipe(source$, share);
    const tapped$ = pipe(sharedSource$, tap(callback), take(1));

    return concat([tapped$, sharedSource$]);
  };

export const toArray = <T>(source: Source<T>): Source<T[]> =>
  pipe(
    source,
    scan((acc, result) => [...acc, result], [] as T[])
  );
