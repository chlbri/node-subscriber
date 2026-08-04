/**
 * Strict equality comparator function (`===`).
 *
 * @template T - Type of values to compare.
 *
 * @param a - First value to compare.
 * @param b - Second value to compare.
 *
 * @returns type {@linkcode boolean} indicating whether `a` and `b` are strictly equal.
 */
export const normalEquals = <T>(a: T, b: T) => a === b;

/**
 * Default identity selector function that returns the input value unchanged.
 *
 * @template T - Input type.
 * @template R - Output type, defaulting to `T`.
 *
 * @param a - Value to pass through.
 *
 * @returns The input value cast to `R`.
 */
export const defaultSelector = <T, R = T>(a: T) => a as unknown as R;
