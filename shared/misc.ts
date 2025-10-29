export function pick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
  const ret: Pick<T, K> = {} as Pick<T, K>;
  keys.forEach((key) => {
    ret[key] = obj[key];
  });
  return ret;
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

export function exhaustiveCheck(param: never): never {
  throw new Error(`Exhaustive check failed: ${param}`);
}

export function wait(ms: number) {
  return new Promise((resolve, reject) => setTimeout(resolve, ms));
}

export const iife = <T>(fn: () => T): T => fn();

/**
 * Gets the address string from a houseAddress, whether it's a string or object
 */
export function getAddressString(
  houseAddress:
    | string
    | { address: string; lat: number; lng: number }
    | { address: string; placeId: string }
    | undefined,
): string {
  if (!houseAddress) return "";
  if (typeof houseAddress === "string") return houseAddress;
  return houseAddress.address;
}

export function produceLiteral<Key extends string>(
  keys: Key[],
): { [key in Key]: key } {
  const literal: Partial<{ [key in Key]: key }> = {};

  for (const key of keys) literal[key] = key;

  return literal as { [key in Key]: key };
}
