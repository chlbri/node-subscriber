/**
 * Strict equality comparator function (`===`).
 *
 * @template T - Type of values to compare.
 *
 * @param a - First value to compare.
 * @param b - Second value to compare.
 *
 * @returns `-- type {@linkcode boolean}` indicating strict equality.
 */
export const normalEquals = <T>(a: T, b: T) => a === b;
