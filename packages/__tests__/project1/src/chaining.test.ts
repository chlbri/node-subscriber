import { createSubscriber } from '@bemedev/subscriber';
import { Subject } from 'rxjs';
import { typeMock } from './fixtures';

describe('Nested Select Chaining Tests', () => {
  type State = { user: { profile: { age: number } } };
  const fn = vi.fn();
  const subject$ = new Subject<State>();

  const builder1 = createSubscriber(subject$)
    .select(s => s.user)
    .select(u => u.profile);

  const builder2 = builder1.select(p => p.age);

  const sub = builder2.subscribe(
    typeMock(fn, s => s.user.profile.age * 2),
  );

  test('#01 => builder1 subscribable is subject$', () => {
    expect(builder1.subscribable).toBe(subject$);
  });

  test('#02 => chained selector extracts profile age', () => {
    const state = { user: { profile: { age: 25 } } };
    expect(sub.selector?.(state)).toBe(25);
  });

  test('#03 => emit state with profile age 25', () => {
    subject$.next({ user: { profile: { age: 25 } } });
  });

  test('#04 => fn was called 1 time', () => {
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('#05 => fn last returned 50', () => {
    expect(fn).toHaveLastReturnedWith(50);
  });

  test('#06 => emit same state with profile age 25', () => {
    subject$.next({ user: { profile: { age: 25 } } });
  });

  test('#07 => fn call count remains 1', () => {
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('#08 => emit state with new profile age 30', () => {
    subject$.next({ user: { profile: { age: 30 } } });
  });

  test('#09 => fn was called 2 times', () => {
    expect(fn).toHaveBeenCalledTimes(2);
  });

  test('#10 => fn last returned 60', () => {
    expect(fn).toHaveLastReturnedWith(60);
  });
});
