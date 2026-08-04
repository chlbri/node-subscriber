import { act, renderHook } from '@testing-library/react';
import { BehaviorSubject, Subject } from 'rxjs';
import { useSubscriber } from '@bemedev/react-subscriber';
import { typeMock } from './fixtures';

describe('TESTS', () => {
  describe('#01 => useSubscriber', () => {
    const subject$ = new BehaviorSubject({ count: 0, text: 'hello' });

    const { result, unmount } = renderHook(() =>
      useSubscriber(subject$, { selector: s => s.count }),
    );

    test('#00 => initial value is 0', () =>
      expect(result.current).toBe(0));

    test('#01 => emit next count', () => {
      act(() => subject$.next({ count: 1, text: 'hello' }));
    });

    test('#02 => count updates to 1', () =>
      expect(result.current).toBe(1));

    test('#03 => emit same count with different text', () => {
      act(() => subject$.next({ count: 1, text: 'world' }));
    });

    test('#04 => count remains 1', () => expect(result.current).toBe(1));

    test('#05 => unmount component', unmount);

    test('#06 => emit next count after unmount', () => {
      subject$.next({ count: 2, text: 'world' });
    });

    test('#07 => count does not update after unmount', () => {
      expect(result.current).toBe(1);
    });
  });

  describe('#02 => custom selector and equals', () => {
    const subject$ = new BehaviorSubject(10);
    const equals = vi.fn();

    const { result } = renderHook(() =>
      useSubscriber(subject$, {
        selector: val => val * 2,
        equals: typeMock(equals, (a, b) => a === b),
      }),
    );

    test('#00 => initial value is 20', () =>
      expect(result.current).toBe(20));

    test('#01 => emit next value 10', () => {
      act(() => subject$.next(10));
    });

    test('#02 => equals was called', () => {
      expect(equals).toHaveBeenCalled();
    });

    test('#03 => value remains 20', () => expect(result.current).toBe(20));

    test('#04 => emit next value 15', () => {
      act(() => subject$.next(15));
    });

    test('#05 => value updates to 30', () =>
      expect(result.current).toBe(30));
  });

  describe('#03 => plain Subject starting undefined', () => {
    const subject$ = new Subject<string>();

    const { result } = renderHook(() => useSubscriber(subject$));

    test('#00 => initial value is undefined', () => {
      expect(result.current).toBeUndefined();
    });

    test('#01 => emit value', () => {
      act(() => subject$.next('first'));
    });

    test('#02 => value is "first"', () => {
      expect(result.current).toBe('first');
    });
  });

  describe('#04 => plain Subject with defaultValue', () => {
    const subject$ = new Subject<string>();

    const { result } = renderHook(() =>
      useSubscriber(subject$, { defaultValue: 'default' }),
    );

    test('#00 => initial value is "default"', () => {
      expect(result.current).toBe('default');
    });

    test('#01 => emit value', () => {
      act(() => subject$.next('first'));
    });

    test('#02 => value is "first"', () => {
      expect(result.current).toBe('first');
    });
  });
});
