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

type UndefinedOrBoolean<T> = T extends boolean ? boolean : T;

export const resetValue = <V>(
  func: (value: UndefinedOrBoolean<V>) => void,
  newValue: UndefinedOrBoolean<V>
) => {
  func(typeof newValue === "boolean" ? !newValue : (undefined as any));
  setTimeout(() => func(newValue), 0);
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
