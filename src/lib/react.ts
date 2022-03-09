import { useEffect, useState } from "react";

type UndefinedOrBoolean<T> = T extends boolean ? boolean : T;

export const resetValue = <V>(
  func: (value: UndefinedOrBoolean<V>) => void,
  newValue: UndefinedOrBoolean<V>
) => {
  func(typeof newValue === "boolean" ? !newValue : (undefined as any));
  setTimeout(() => func(newValue), 0);
};

export const useIsChanging = (interval: number, value: any): boolean => {
  const [lastTimer, setLastTimer] = useState<NodeJS.Timeout>();
  const [changing, setChanging] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (lastTimer) clearTimeout(lastTimer);

    setChanging(true);

    timer = setTimeout(() => setChanging(false), interval);
    setLastTimer(timer);

    return () => clearTimeout(timer);
  }, [value]);

  return changing;
};
