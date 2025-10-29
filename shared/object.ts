export const getInObjStrong = function <T extends object, U extends keyof T>(
  obj: T,
  key: U,
) {
  return obj[key];
};

export const getInObj = function <T extends object, U extends string>(
  obj: T,
  key: U,
): unknown {
  if (key in obj == false) {
    const keys = Object.keys(obj);
    throw new Error(
      `Cannot get '${key}' from the given object, the property doesnt exist in the given object. Other properties that do exist are: '${
        keys.length > 20
          ? keys.slice(0, 20).join(", ") + ` ... <${keys.length - 20} more>`
          : keys.slice(0, 20).join(", ")
      }'`,
    );
  }

  return (obj as Record<U, unknown>)[key];
};

export const findInObj = function <T extends object, U extends string>(
  obj: T,
  key: U,
): unknown {
  return (obj as Record<U, unknown>)[key];
};

export const clone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

export function pick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
  const ret: Partial<Pick<T, K>> = {};
  keys.forEach((key) => {
    ret[key] = obj[key];
  });
  return ret as Pick<T, K>;
}

export function omit<T extends object, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Omit<T, K> {
  const ret: Partial<T> = {};
  for (const key in obj) {
    const k = key as keyof T;
    if (!keys.includes(k as K)) ret[k] = obj[k];
  }
  return ret as Omit<T, K>;
}

export const mapObj = <T extends string, U, V>(
  obj: Record<T, U>,
  mapper: (key: T, value: U) => V,
): Record<T, V> =>
  Object.fromEntries(
    Object.entries(obj).map(
      ([key, value]) => [key, mapper(key as T, value as U)] as const,
    ),
  ) as Record<T, V>;

export const filterObj = <T extends string, U>(
  obj: Record<T, U>,
  predicate: (key: T, value: U) => boolean,
): Partial<Record<T, U>> =>
  Object.fromEntries(
    Object.entries(obj).filter(([key, value]) =>
      predicate(key as T, value as U),
    ),
  ) as Partial<Record<T, U>>;

export const mapObjInParallel = async <T extends string, U, V>(
  obj: Record<T, U>,
  mapper: (key: T, value: U) => Promise<V>,
): Promise<Record<T, V>> => {
  const entries = Object.entries(obj);
  const promises = entries.map(
    async ([key, value]) => [key, await mapper(key as T, value as U)] as const,
  );
  const results = await Promise.all(promises);
  return Object.fromEntries(results) as Record<T, V>;
};

export const has = <
  T extends Record<P, T[P]>,
  P extends keyof T,
  Z extends T[P],
>(
  object: T,
  prop: P,
  typeofParam: Z,
): object is T & Record<P, Z> => {
  return typeof object[prop] === typeof typeofParam;
};
