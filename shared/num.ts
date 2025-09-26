// export function wrap(indx: number, max: number) {
//   return ((indx % max) + max) % max;
// }

import { getRng } from "./random";

/**
 * Wraps a value between min and max, inclusive.
 *
 * e.g.
 *
 *     expect(wrap(0, 0, 9)).toEqual(0);
 *     expect(wrap(1, 0, 9)).toEqual(1);
 *     expect(wrap(9, 0, 9)).toEqual(9);
 *     expect(wrap(10, 0, 9)).toEqual(0);
 *     expect(wrap(11, 0, 9)).toEqual(1);
 *     expect(wrap(19, 0, 9)).toEqual(9);
 *     expect(wrap(10, 0, 9)).toEqual(0);
 *     expect(wrap(-1, 0, 9)).toEqual(9);
 *     expect(wrap(-10, 0, 9)).toEqual(0);
 *     expect(wrap(-11, 0, 9)).toEqual(9);
 *
 *     expect(wrap(10, 10, 19)).toEqual(10);
 *     expect(wrap(11, 10, 19)).toEqual(11);
 *     expect(wrap(19, 10, 19)).toEqual(19);
 *     expect(wrap(20, 10, 19)).toEqual(10);
 *
 * @param value
 * @param min the minimum inclusive value
 * @param max the maximum inclusive value
 */
export function wrap(value: number, min: number, max: number): number {
  const rangeSize = max - min + 1;
  if (value < min) return max - ((min - value - 1) % rangeSize);
  else return min + ((value - min) % rangeSize);
}

// Below borrowed from: https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
export function randomRange(min: number, max: number, rng = getRng()): number {
  return rng.nextNumber() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
export function randomIntRange(min: number, max: number, rng = getRng()): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(rng.nextNumber() * (max - min + 1)) + min;
}

export function areNumbersVeryClose(a: number, b: number, epsilon = 0.000001): boolean {
  return Math.abs(a - b) < epsilon;
}

/**
 * Clamps a number between a minimum and maximum value (inclusive).
 * @param value The number to clamp.
 * @param min The minimum allowed value.
 * @param max The maximum allowed value.
 * @returns The clamped value.
 */
export function clamp(value: number, min: number, max: number): number {
  if (value < min) return min
  if (value > max) return max
  return value
}
