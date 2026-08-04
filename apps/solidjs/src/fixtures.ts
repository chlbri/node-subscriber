import type { Fn } from '@bemedev/subscriber/lib/libs/bemedev/globals/types';
import type { Mock } from 'vitest';

//TODO: add to my lib @bemedev/dev-utils/vitest-extended
/**
 * Helper function to type-safely attach a mock implementation to a Vitest mock function.
 *
 * @template {Fn} T - Function signature type.
 *
 * @param mock - Vitest mock function instance.
 * @param fn - Implementation function matching signature `T`.
 *
 * @returns The mock function typed as `T`.
 */
export const typeMock = <T extends Fn>(mock: Mock<NoInfer<T>>, fn: T) => {
  return mock.mockImplementation(fn as any) as T;
};
