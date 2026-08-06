import {
  createManagedSubcriber,
  createSubscriber,
} from '@bemedev/subscriber/managed';

describe('TESTS', () => {
  const _CASES = [createManagedSubcriber, createSubscriber] as const;

  const CASES = _CASES.map((v, index, all) => {
    const _index = (index + 1)
      .toLocaleString()
      .padStart(Math.log10(all.length) + 1, '0');

    const invite = `#${_index} => ${v.name}`;
    return [v, v.name, invite];
  });

  describe('#01 => Existance', () => {
    describe.each(CASES)('$2', (fn, name) => {
      test(`#01 => ${name} is defined`, () => {
        expect(fn).toBeDefined();
      });

      test(`#02 => ${name} is function`, () => {
        expect(fn).toBeInstanceOf(Function);
      });
    });
  });

  test('#02 => "createManagedSubscriber" and "createSubscriber" should be equals', () => {
    expect(createManagedSubcriber).toBe(createSubscriber);
  });
});
