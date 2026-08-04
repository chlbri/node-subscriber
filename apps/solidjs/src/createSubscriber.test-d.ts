import { expectTypeOf } from 'vitest';
import { Subject } from 'rxjs';
import type { Accessor } from 'solid-js';
import { createSubscriber } from '@bemedev/solid-subscriber';

describe('TYPE TESTS', () => {
  describe('#01 => createSubscriber return types', () => {
    describe('#01 => defaultValue is not set', () => {
      const subject$ = new Subject<{ count: number; text: string }>();

      test('#00 => default selector returns Accessor<T | undefined>', () => {
        const val = createSubscriber(subject$);
        expectTypeOf(val).toEqualTypeOf<
          Accessor<{ count: number; text: string } | undefined>
        >();
        expectTypeOf(val()).toEqualTypeOf<
          { count: number; text: string } | undefined
        >();
      });

      test('#01 => custom selector returns Accessor<R | undefined>', () => {
        const count = createSubscriber(subject$, {
          selector: s => s.count,
        });
        expectTypeOf(count).toEqualTypeOf<Accessor<number | undefined>>();
        expectTypeOf(count()).toEqualTypeOf<number | undefined>();
      });
    });

    describe('#02 => defaultValue is set', () => {
      const subject$ = new Subject<{ count: number; text: string }>();

      test('#00 => default selector returns Accessor<T>', () => {
        const defaultObj = { count: 0, text: 'default' };
        const val = createSubscriber(subject$, {
          defaultValue: defaultObj,
        });
        expectTypeOf(val).toEqualTypeOf<
          Accessor<{ count: number; text: string }>
        >();
        expectTypeOf(val()).toEqualTypeOf<{
          count: number;
          text: string;
        }>();
      });

      test('#01 => custom selector returns Accessor<R>', () => {
        const count = createSubscriber(subject$, {
          selector: s => s.count,
          equals: () => true,
          defaultValue: 0,
        });
        expectTypeOf(count).toEqualTypeOf<Accessor<number>>();
        expectTypeOf(count()).toEqualTypeOf<number>();
      });
    });
  });
});
