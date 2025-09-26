export const arrayify = <T>(valueOrArrayOrRecord: T | T[]): T[] => {
  if (Array.isArray(valueOrArrayOrRecord)) return valueOrArrayOrRecord;
  return [valueOrArrayOrRecord];
};

export const contains = <T>(array: T[], pred: (t: T) => boolean): boolean => {
  for (const el of array) if (pred(el)) return true;
  return false;
};

export const containsById = <T extends { id: string }>(
  array: T[],
  item: T,
): boolean => contains(array, (i) => i.id == item.id);

export const getIds = <T>(objs: { id: T }[]): T[] => objs.map((o) => o.id);

export const getKinds = <T>(objs: { kind: T }[]): T[] =>
  objs.map((o) => o.kind);

export const hasDuplicates = <T extends string>(array: T[]): boolean =>
  new Set(array).size != array.length;

export const partition = <T>(items: T[], numChunks: number): T[][] => {
  // const chunks: T[][] = [];
  // const chunkSize = Math.ceil(items.length / numChunks);
  // for (let i = 0; i < numChunks; i++) chunks.push(items.slice(i * chunkSize, chunkSize));
  // return chunks;

  const newArray: T[][] = [];
  for (let c = 0; c < numChunks; c++) {
    newArray.push([]);
  }

  for (let i = 0; i < items.length; i++) {
    const mod = i % numChunks;
    newArray[mod]!.push(items[i]!);
  }
  return newArray;
};

// Thanks ChatGPT
export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    result.push(chunk);
  }
  return result;
}

export const deDupe = <T extends string>(array: T[]): T[] => [
  ...new Set(array),
];

export const deDupeWith = <T>(array: T[], getId: (item: T) => string): T[] => {
  const map = new Map<string, T>();
  for (const item of array) map.set(getId(item), item);
  return Array.from(map.values());
};

// Borrowed from: https://stackoverflow.com/questions/2218999/how-to-remove-all-duplicates-from-an-array-of-objects
export const uniqueBy = <T>(uniqueKey: keyof T, objects: T[]): T[] => {
  const ids = objects.map((object) => object[uniqueKey]);
  return objects.filter(
    (object, index) => !ids.includes(object[uniqueKey], index + 1),
  );
};

export const uniqueByFn =
  <T>(uniqueKey: keyof T) =>
  (objects: T[]): T[] => {
    return uniqueBy(uniqueKey, objects);
  };

export const sum = <T>(arr: T[], key: keyof T): number => {
  let val = 0;
  for (const a of arr) val += Number(a[key]);
  return val;
};

export const average = <T>(arr: T[], key: keyof T): number =>
  arr.length == 0 ? 0 : sum(arr, key) / arr.length;

export const sumNumbers = (arr: number[]): number => {
  let val = 0;
  for (const a of arr) val += a;
  return val;
};

// export const getNextInRotation = <T extends string>({
//   item,
//   rotation,
//   rotationIncrement = 1,
// }: {
//   item: T;
//   rotation: T[];
//   rotationIncrement?: number;
// }): T => {
//   if (rotation.length == 0)
//     throw new Error(`cannot get next in rotation when the rotation is empty`);
//   let index = rotation.indexOf(item);
//   if (index == -1) return ensure(rotation[0]);
//   index += rotationIncrement;
//   index = wrap(index, 0, rotation.length - 1);
//   return ensure(rotation[index]);
// };

type Indices<L extends number, T extends number[] = []> = T["length"] extends L
  ? T[number]
  : Indices<L, [T["length"], ...T]>;

export type LengthAtLeast<T extends readonly any[], L extends number> = Pick<
  Required<T>,
  Indices<L>
>;

// Borrowed from: https://stackoverflow.com/a/69370003/521097
export function hasLengthAtLeast<T extends readonly any[], L extends number>(
  arr: T,
  len: L,
): arr is T & LengthAtLeast<T, L> {
  return arr.length >= len;
}

export function isNotEmpty<T extends readonly any[]>(
  arr: T,
): arr is T & LengthAtLeast<T, 1> {
  return hasLengthAtLeast(arr, 1);
}

export const guaranteeUniqueIds = (items: { id: string }[]) => {
  const ids = new Set<string>();
  for (const item of items) {
    if (ids.has(item.id)) {
      throw new Error(`node id '${item.id}' is not unique`);
    }
    ids.add(item.id);
  }
};

export const join = <TJoinable, TGlue>(
  data: TJoinable[],
  glue: TGlue,
): (TJoinable | TGlue)[] => {
  const joined: (TJoinable | TGlue)[] = [];
  for (let i = 0; i < data.length; i++) {
    joined.push(data[i]!);
    if (i != data.length - 1) joined.push(glue);
  }
  return joined;
};
