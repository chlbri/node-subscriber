import { Subject } from 'rxjs';
import { useSubscriber } from '@bemedev/react-subscriber';

describe('TYPE TESTS', () => {
  describe('#01 => useSubscriber return types', () => {
    describe('#01 => defaultValue is not set', () => {
      const subject$ = new Subject<{ count: number; text: string }>();

      test('#00 => default selector returns T | undefined', () => {
        const val = useSubscriber(subject$);
        expectTypeOf(val).toEqualTypeOf<
          { count: number; text: string } | undefined
        >();
      });

      test('#01 => custom selector returns R | undefined', () => {
        const count = useSubscriber(subject$, { selector: s => s.count });
        expectTypeOf(count).toEqualTypeOf<number | undefined>();
      });
    });

    describe('#02 => defaultValue is set', () => {
      const subject$ = new Subject<{ count: number; text: string }>();

      test('#00 => default selector returns T', () => {
        const defaultObj = { count: 0, text: 'default' };
        const val = useSubscriber(subject$, { defaultValue: defaultObj });
        expectTypeOf(val).toEqualTypeOf<{ count: number; text: string }>();
      });

      test('#01 => custom selector returns R', () => {
        const count = useSubscriber(subject$, {
          selector: s => s.count,
          equals: () => true,
          defaultValue: 0,
        });
        expectTypeOf(count).toEqualTypeOf<number>();
      });
    });
  });
});
