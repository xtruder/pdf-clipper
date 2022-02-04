export const resetValue = <T>(func: (value: T) => void, reset: T, value: T) => {
  func(reset);
  setTimeout(() => func(value), 0);
};
