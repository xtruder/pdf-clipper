type UndefinedOrBoolean<T> = T extends boolean ? boolean : T;

export const resetValue = <V>(
  func: (value: UndefinedOrBoolean<V>) => void,
  newValue: UndefinedOrBoolean<V>
) => {
  func(typeof newValue === "boolean" ? !newValue : (undefined as any));
  setTimeout(() => func(newValue), 0);
};
