import { createTests } from '@bemedev/dev-utils/vitest-extended';
import type { Fn } from '@bemedev/subscriber/types';
import type { Mock } from 'vitest';

//TODO: add to my lib @bemedev/dev-utils/vitest-extended
export const typeMock = <T extends Fn>(mock: Mock<NoInfer<T>>, fn: T) => {
  return mock.mockImplementation(fn as any) as T;
};

export const testFunctions = (...fns: Fn[]) => {
  fns.forEach((fn, index, all) => {
    const _index = (index + 1)
      .toLocaleString()
      .padStart(Math.log10(all.length) + 1, '0');

    const { acceptation } = createTests(fn);
    const invite = `#${_index} => ${fn.name}`;
    describe(invite, acceptation);
  });
};
