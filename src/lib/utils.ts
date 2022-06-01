export const groupBy = <T, K extends keyof any>(
  list: T[],
  getKey: (item: T) => K
) =>
  list.reduce((previous, currentItem) => {
    const group = getKey(currentItem);
    if (!previous[group]) previous[group] = [];
    previous[group].push(currentItem);
    return previous;
  }, {} as Record<K, T[]>);

export const unique = <T>(list: T[]): T[] =>
  list.filter((x, i, a) => a.indexOf(x) === i);

type Entry<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T];

export function filterObject<T extends object>(
  obj: T,
  fn: (entry: Entry<T>, i: number, arr: Entry<T>[]) => boolean
) {
  return Object.fromEntries(
    (Object.entries(obj) as Entry<T>[]).filter(fn)
  ) as Partial<T>;
}

export const s4 = () => {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
};

export const setRandomInterval = <F extends Function>(
  callback: F,
  min: number,
  max: number
) => {
  let timer: NodeJS.Timeout;

  const randomInterval = () => Math.random() * (max - min + 1) + min;
  const callCallback = () => {
    callback();
    timer = setTimeout(callCallback, randomInterval());
  };

  timer = setTimeout(callCallback, randomInterval());

  return () => clearTimeout(timer);
};

export const waitError = <T>(promise: Promise<T>): Promise<Error | null> => {
  return promise.then(() => null).catch((err) => err);
};

export function notEmpty<TValue>(
  value: TValue | null | undefined
): value is TValue {
  if (value === null || value === undefined) return false;
  return true;
}

export function deepEqual(objA: any, objB: any, map = new WeakMap()): boolean {
  // P1
  if (Object.is(objA, objB)) return true;

  // P2
  if (objA instanceof Date && objB instanceof Date) {
    return objA.getTime() === objB.getTime();
  }
  if (objA instanceof RegExp && objB instanceof RegExp) {
    return objA.toString() === objB.toString();
  }

  // P3
  if (
    typeof objA !== "object" ||
    objA === null ||
    typeof objB !== "object" ||
    objB === null
  ) {
    return false;
  }

  // P4
  if (map.get(objA) === objB) return true;
  map.set(objA, objB);

  // P5
  const keysA = Reflect.ownKeys(objA);
  const keysB = Reflect.ownKeys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (let i = 0; i < keysA.length; i++) {
    if (
      !Reflect.has(objB, keysA[i]) ||
      !deepEqual(objA[keysA[i]], objB[keysA[i]], map)
    ) {
      return false;
    }
  }

  return true;
}
