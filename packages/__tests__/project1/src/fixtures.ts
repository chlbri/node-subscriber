import type { Fn } from '@bemedev/subscriber/lib/libs/bemedev/globals/types';
import type { Mock } from 'vitest';

//TODO: add to my lib @bemedev/dev-utils/vitest-extended
export const typeMock = <T extends Fn>(mock: Mock<NoInfer<T>>, fn: T) => {
  return mock.mockImplementation(fn as any) as T;
};
