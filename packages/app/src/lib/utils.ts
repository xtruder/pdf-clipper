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

export async function* streamAsyncIterator<T>(stream: ReadableStream<T>) {
  // Get a lock on the stream
  const reader = stream.getReader();

  try {
    while (true) {
      // Read from the stream
      const { done, value } = await reader.read();
      // Exit if we're done
      if (done) return;
      // Else yield the chunk
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
}

type UndefinedOrBoolean<T> = T extends boolean ? boolean : T;

export const resetValue = <V>(
  func: (value: UndefinedOrBoolean<V>) => void,
  newValue: UndefinedOrBoolean<V>
) => {
  func(typeof newValue === "boolean" ? !newValue : (undefined as any));
  setTimeout(() => func(newValue), 0);
};

export interface Cache<T> {
  get(key: string): T | undefined;
  set(key: string, value: T): void;
}

/**Simple TTL cache optimized for reads */
export function ttlCache<T>(ttl: number): Cache<T> {
  const cache: Record<string, T> = {};
  const timers: Record<string, any> = {};

  const setKeyExpiery = (key: string) => {
    // if timer already exists, clear it first
    if (timers[key]) clearTimeout(timers[key]);

    // create a new timer
    timers[key] = setTimeout(() => {
      delete timers[key];
      delete cache[key];
    }, ttl);
  };

  const get = (key: string) => {
    setKeyExpiery(key);
    return cache[key];
  };

  const set = (key: string, value: T) => {
    cache[key] = value;

    setKeyExpiery(key);
  };

  return { get, set };
}

export function lazyCache<T, Ctx>(
  cache: Cache<T>,
  resolve: (key: string, ctx: Ctx) => Promise<T>
) {
  return async (key: string, ctx: Ctx): Promise<T> => {
    let value = cache.get(key);
    if (value) return value;

    value = await resolve(key, ctx);
    cache.set(key, value);

    return value;
  };
}
