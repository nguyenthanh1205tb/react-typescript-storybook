type NestedArray<T> = Array<T | NestedArray<T>>;

export const flatArray = <T>(arr: NestedArray<T>): Array<T> => {
  const flattened: Array<T> = [];

  const flattenHelper = (nestedArr: NestedArray<T>) => {
    for (const el of nestedArr) {
      if (el instanceof Array) {
        flattenHelper(el);
      } else {
        flattened.push(el);
      }
    }
  };

  flattenHelper(arr);
  return flattened;
};
