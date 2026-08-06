import {
  createSubscriber,
  defaultSelector,
  normalEquals,
} from '@bemedev/subscriber';
import { Subject } from 'rxjs';
import { typeMock } from './fixtures';

describe('RxJS workflow Tests', () => {
  const fn1 = vi.fn();
  const fn2 = vi.fn();
  const fn3 = vi.fn();
  const alwaysTrue = () => true;
  const subject$ = new Subject<number>();

  const builder1 = createSubscriber(subject$);
  const builder2 = createSubscriber(subject$).select(defaultSelector);
  const builder3 = createSubscriber(subject$);

  const sub1 = builder1.subscribe(typeMock(fn1, val => val * 2));
  const sub2 = builder2.subscribe(typeMock(fn2, val => val + 10));

  const sub3 = builder3.subscribe(
    typeMock(fn3, val => val + 100),
    alwaysTrue,
  );

  test('#00 => sub1 initial state is active', () => {
    expect(sub1.state).toBe('active');
  });

  test('#01 => sub2 initial state is active', () => {
    expect(sub2.state).toBe('active');
  });

  test('#02 => sub3 initial state is active', () => {
    expect(sub3.state).toBe('active');
  });

  test('#03 => fn1 is not called initially', () => {
    expect(fn1).not.toHaveBeenCalled();
  });

  test('#04 => fn2 is not called initially', () => {
    expect(fn2).not.toHaveBeenCalled();
  });

  test('#05 => fn3 is not called initially', () => {
    expect(fn3).not.toHaveBeenCalled();
  });

  test('#06 => sub1 uses normalEquals by default', () => {
    expect(sub1.equals).toBe(normalEquals);
  });

  test('#07 => sub2 uses normalEquals by default', () => {
    expect(sub2.equals).toBe(normalEquals);
  });

  test('#08 => sub3 uses alwaysTrue equals', () => {
    expect(sub3.equals).toBe(alwaysTrue);
  });

  test('#09 => sub1 state remains active', () => {
    expect(sub1.state).toBe('active');
  });

  test('#10 => sub2 state remains active', () => {
    expect(sub2.state).toBe('active');
  });

  test('#11 => sub3 state remains active', () => {
    expect(sub3.state).toBe('active');
  });

  test('#12 => builder1 subscribable is subject$', () => {
    expect(builder1.subscribable).toBe(subject$);
  });

  test('#13 => sub1 subscribable is subject$', () => {
    expect(sub1.subscribable).toBe(subject$);
  });

  test('#14 => sub1 select property is undefined', () => {
    expect((sub1 as any).select).toBeUndefined();
  });

  test('#15 => sub1 renew property is undefined', () => {
    expect((sub1 as any).renew).toBeUndefined();
  });

  test('#16 => emit value 1 on subject$', () => subject$.next(1));

  test('#17 => fn1 was called 1 time', () => {
    expect(fn1).toHaveBeenCalledTimes(1);
  });

  test('#18 => fn1 last returned 2', () => {
    expect(fn1).toHaveLastReturnedWith(2);
  });

  test('#19 => fn2 was called 1 time', () => {
    expect(fn2).toHaveBeenCalledTimes(1);
  });

  test('#20 => fn2 last returned 11', () => {
    expect(fn2).toHaveLastReturnedWith(11);
  });

  test('#21 => fn3 was called 1 time', () => {
    expect(fn3).toHaveBeenCalledTimes(1);
  });

  test('#22 => fn3 last returned 101', () => {
    expect(fn3).toHaveLastReturnedWith(101);
  });

  test('#23 => emit value 1 again on subject$', () => subject$.next(1));

  test('#24 => fn1 call count remains 1', () => {
    expect(fn1).toHaveBeenCalledTimes(1);
  });

  test('#25 => fn2 call count remains 1', () => {
    expect(fn2).toHaveBeenCalledTimes(1);
  });

  test('#26 => fn3 call count remains 1', () => {
    expect(fn3).toHaveBeenCalledTimes(1);
  });

  test('#27 => emit value 2 on subject$', () => subject$.next(2));

  test('#28 => fn1 was called 2 times', () => {
    expect(fn1).toHaveBeenCalledTimes(2);
  });

  test('#29 => fn1 last returned 4', () => {
    expect(fn1).toHaveLastReturnedWith(4);
  });

  test('#30 => fn2 was called 2 times', () => {
    expect(fn2).toHaveBeenCalledTimes(2);
  });

  test('#31 => fn2 last returned 12', () => {
    expect(fn2).toHaveLastReturnedWith(12);
  });

  test('#32 => fn3 call count remains 1', () => {
    expect(fn3).toHaveBeenCalledTimes(1);
  });

  test('#33 => reSubscribe active sub1 returns active', () => {
    expect(sub1.reSubscribe()).toBe('active');
  });

  test('#34 => close sub1', sub1.close);

  test('#35 => sub1 state is paused', () => {
    expect(sub1.state).toBe('paused');
  });

  test('#36 => close sub1 again', sub1.close);

  test('#37 => sub1 state remains paused', () => {
    expect(sub1.state).toBe('paused');
  });

  test('#38 => emit value 3 while paused', () => subject$.next(3));

  test('#39 => fn1 call count remains 2', () => {
    expect(fn1).toHaveBeenCalledTimes(2);
  });

  test('#40 => fn2 was called 3 times', () => {
    expect(fn2).toHaveBeenCalledTimes(3);
  });

  test('#41 => fn2 last returned 13', () => {
    expect(fn2).toHaveLastReturnedWith(13);
  });

  test('#42 => open sub1', sub1.open);
  test('#43 => open sub1 again', sub1.open);
  test('#44 => emit value 4 after open', () => subject$.next(4));

  test('#45 => fn1 was called 4 times', () => {
    expect(fn1).toHaveBeenCalledTimes(4);
  });

  test('#46 => fn1 last returned 8', () => {
    expect(fn1).toHaveLastReturnedWith(8);
  });

  test('#47 => fn1 was last called with 4', () => {
    expect(fn1).toHaveBeenLastCalledWith(4);
  });

  test('#48 => unsubscribe sub1', sub1.unsubscribe);

  test('#49 => sub1 state is inactive', () => {
    expect(sub1.state).toBe('inactive');
  });

  test('#50 => emit value 5 after unsubscribe', () => subject$.next(5));

  test('#51 => fn1 call count remains 4', () => {
    expect(fn1).toHaveBeenCalledTimes(4);
  });

  test('#52 => open inactive sub1', sub1.open);

  test('#53 => sub1 state remains inactive', () => {
    expect(sub1.state).toBe('inactive');
  });

  test('#54 => close inactive sub1', sub1.close);

  test('#55 => sub1 state remains inactive', () => {
    expect(sub1.state).toBe('inactive');
  });

  test('#56 => fn1 call count remains 4', () => {
    expect(fn1).toHaveBeenCalledTimes(4);
  });

  test('#57 => reSubscribe sub1', sub1.reSubscribe);

  test('#58 => sub1 state is active', () => {
    expect(sub1.state).toBe('active');
  });

  test('#59 => emit value 6 after reSubscribe', () => subject$.next(6));
  test('#60 => close  sub1', sub1.close);
  test('#61 => open  sub1', sub1.open);

  test('#62 => fn1 was called 5 times', () => {
    expect(fn1).toHaveBeenCalledTimes(5);
  });

  test('#63 => fn1 last returned 12', () => {
    expect(fn1).toHaveLastReturnedWith(12);
  });

  test('#64 => fn2 was called 6 times', () => {
    expect(fn2).toHaveBeenCalledTimes(6);
  });

  test('#65 => fn2 last returned 16', () => {
    expect(fn2).toHaveLastReturnedWith(16);
  });

  test('#66 => unsubscribe sub1', sub1.unsubscribe);
  test('#67 => dispose sub1', sub1.dispose);

  test('#68 => sub1 state is disposed', () => {
    expect(sub1.state).toBe('disposed');
  });

  test('#69 => reSubscribe disposed sub1 returns disposed', () => {
    expect(sub1.reSubscribe()).toBe('disposed');
  });

  test('#70 => sub1 subscribable is undefined', () => {
    expect(sub1.subscribable).toBeUndefined();
  });

  test('#71 => sub1 isNotInactive is false', () => {
    expect(sub1.isNotInactive).toBe(false);
  });

  test('#72 => sub1 equals is undefined', () => {
    expect(sub1.equals).toBeUndefined();
  });

  test('#73 => dispose sub2', sub2[Symbol.dispose]);

  test('#74 => sub2 state is disposed', () => {
    expect(sub2.state).toBe('disposed');
  });

  test('#75 => sub2 subscribable is undefined', () => {
    expect(sub2.subscribable).toBeUndefined();
  });

  test('#76 => sub2 isNotInactive is false', () => {
    expect(sub2.isNotInactive).toBe(false);
  });

  test('#77 => sub2 equals is undefined', () => {
    expect(sub2.equals).toBeUndefined();
  });

  test('#78 => dispose sub3', sub3[Symbol.asyncDispose]);

  test('#79 => sub3 state is disposed', () => {
    expect(sub3.state).toBe('disposed');
  });

  test('#80 => sub3 subscribable is undefined', () => {
    expect(sub3.subscribable).toBeUndefined();
  });

  test('#81 => sub3 isNotInactive is false', () => {
    expect(sub3.isNotInactive).toBe(false);
  });

  test('#82 => sub3 equals is undefined', () => {
    expect(sub3.equals).toBeUndefined();
  });

  test('#83 => emit value 7 after dispose', () => subject$.next(7));

  test('#84 => fn1 call count remains 5', () => {
    expect(fn1).toHaveBeenCalledTimes(5);
  });

  test('#85 => fn2 call count remains 6', () => {
    expect(fn2).toHaveBeenCalledTimes(6);
  });

  test('#86 => fn3 call count remains 1', () => {
    expect(fn3).toHaveBeenCalledTimes(1);
  });

  test('#87 => subject$ is still open', () => {
    expect(subject$.closed).toBe(false);
  });
});
