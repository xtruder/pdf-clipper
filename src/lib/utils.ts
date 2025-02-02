type UndefinedOrBoolean<T> = T extends boolean ? boolean : T;

export const resetValue = <V>(
  func: (value: UndefinedOrBoolean<V>) => void,
  resetValue: UndefinedOrBoolean<V> = false as any
) => {
  func(typeof resetValue === "boolean" ? !resetValue : (undefined as any));
  setTimeout(() => func(resetValue), 0);
};
