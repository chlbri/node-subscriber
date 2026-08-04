import { createRoot } from 'solid-js';
import { BehaviorSubject, Subject } from 'rxjs';
import { createSubscriber } from '@bemedev/solid-subscriber';
import { typeMock } from './fixtures';

describe('TESTS', () => {
  describe('#01 => createSubscriber', () => {
    const subject$ = new BehaviorSubject({ count: 0, text: 'hello' });

    createRoot(dispose => {
      const count = createSubscriber(subject$, { selector: s => s.count });

      test('#00 => initial value is 0', () => expect(count()).toBe(0));

      test('#01 => emit next count', () => {
        subject$.next({ count: 1, text: 'hello' });
      });

      test('#02 => count updates to 1', () => expect(count()).toBe(1));

      test('#03 => emit same count with different text', () => {
        subject$.next({ count: 1, text: 'world' });
      });

      test('#04 => count remains 1', () => expect(count()).toBe(1));

      test('#05 => dispose root context', dispose);

      test('#06 => emit next count after dispose', () => {
        subject$.next({ count: 2, text: 'world' });
      });

      test('#07 => count does not update after dispose', () => {
        expect(count()).toBe(1);
      });
    });
  });

  describe('#02 => custom selector and equals', () => {
    const subject$ = new BehaviorSubject(10);
    const equals = vi.fn();

    createRoot(dispose => {
      const value = createSubscriber(subject$, {
        selector: val => val * 2,
        equals: typeMock(equals, (a, b) => a === b),
      });

      test('#00 => initial value is 20', () => expect(value()).toBe(20));
      test('#01 => emit next value 20', () => subject$.next(20));

      test('#02 => equals was called', () => {
        expect(equals).toHaveBeenCalled();
      });

      test('#03 => value is 40', () => expect(value()).toBe(40));
      test('#04 => emit next value 15', () => subject$.next(15));
      test('#05 => value updates to 30', () => expect(value()).toBe(30));
      test('#06 => dispose root', dispose);
    });
  });

  describe('#03 => plain Subject starting undefined', () => {
    const subject$ = new Subject<string>();

    createRoot(dispose => {
      const value = createSubscriber(subject$);

      test('#00 => initial value is undefined', () => {
        expect(value()).toBeUndefined();
      });

      test('#01 => emit value', () => subject$.next('first'));

      test('#02 => value is "first"', () => {
        expect(value()).toBe('first');
      });

      test('#03 => dispose root', dispose);
    });
  });

  describe('#04 => plain Subject with defaultValue', () => {
    const subject$ = new Subject<string>();

    createRoot(dispose => {
      const value = createSubscriber(subject$, {
        defaultValue: 'default',
      });

      test('#00 => initial value is "default"', () => {
        expect(value()).toBe('default');
      });

      test('#01 => emit value', () => subject$.next('first'));
      test('#02 => value is "first"', () => expect(value()).toBe('first'));
      test('#03 => dispose root', dispose);
    });
  });
});
