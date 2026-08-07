import { createSubscriber, normalEquals } from '@bemedev/subscriber';
import { Subject } from 'rxjs';
import { typeMock } from './fixtures';
import { SubscriberBaseClass } from '@bemedev/subscriber/base';

describe('Select options Tests', () => {
  const fn1 = vi.fn();
  const fn2 = vi.fn();
  const fn3 = vi.fn();
  const selectLen = (u: { text: string }) => u.text.length;
  const absDiffLess2 = (a: number, b: number) => Math.abs(a - b) < 2;
  const sameParity = (a: number, b: number) => a % 2 === b % 2;

  const subject1$ = new Subject<{ id: number; name: string }>();
  const subject2$ = new Subject<{ text: string }>();
  const subject3$ = new Subject<number>();

  const sub1 = createSubscriber(subject1$)
    .select(u => u.id)
    .subscribe(typeMock(fn1, u => u.id * 10));

  const sub2 = createSubscriber(subject2$)
    .select(selectLen)
    .subscribe(
      typeMock(fn2, u => u.text.length * 100),
      absDiffLess2,
    );

  const sub3 = createSubscriber(subject3$).subscribe(
    typeMock(fn3, n => n + 5),
    sameParity,
  );

  describe('#00 => all subs are instance of "SubscriberBaseClass"', () => {
    test('#01 => sub1', () => {
      expect(sub1).toBeInstanceOf(SubscriberBaseClass);
    });

    test('#02 => sub2', () => {
      expect(sub2).toBeInstanceOf(SubscriberBaseClass);
    });

    test('#03 => sub3', () => {
      expect(sub3).toBeInstanceOf(SubscriberBaseClass);
    });
  });

  test('#01 => sub1 selector is defined', () => {
    expect(sub1.selector).toBeDefined();
  });

  test('#02 => sub1 equals is normalEquals', () => {
    expect(sub1.equals).toBe(normalEquals);
  });

  test('#03 => sub2 selector is selectLen', () => {
    expect(sub2.selector).toBe(selectLen);
  });

  test('#04 => sub2 equals is absDiffLess2', () => {
    expect(sub2.equals).toBe(absDiffLess2);
  });

  test('#05 => sub3 selector is undefined', () => {
    expect(sub3.selector).toBeUndefined();
  });

  test('#06 => sub3 equals is sameParity', () => {
    expect(sub3.equals).toBe(sameParity);
  });

  test('#07 => emit object with id 1', () => {
    subject1$.next({ id: 1, name: 'A' });
  });

  test('#08 => fn1 was called 1 time', () => {
    expect(fn1).toHaveBeenCalledTimes(1);
  });

  test('#09 => fn1 last returned 10', () => {
    expect(fn1).toHaveLastReturnedWith(10);
  });

  test('#10 => emit object with same id 1', () => {
    subject1$.next({ id: 1, name: 'B' });
  });

  test('#11 => fn1 call count remains 1', () => {
    expect(fn1).toHaveBeenCalledTimes(1);
  });

  test('#12 => emit object with new id 2', () => {
    subject1$.next({ id: 2, name: 'B' });
  });

  test('#13 => fn1 was called 2 times', () => {
    expect(fn1).toHaveBeenCalledTimes(2);
  });

  test('#14 => fn1 last returned 20', () => {
    expect(fn1).toHaveLastReturnedWith(20);
  });

  test('#15 => emit text with length 1', () => {
    subject2$.next({ text: 'a' });
  });

  test('#16 => fn2 was called 1 time', () => {
    expect(fn2).toHaveBeenCalledTimes(1);
  });

  test('#17 => fn2 last returned 100', () => {
    expect(fn2).toHaveLastReturnedWith(100);
  });

  test('#18 => emit text with length 2', () => {
    subject2$.next({ text: 'ab' });
  });

  test('#19 => fn2 call count remains 1', () => {
    expect(fn2).toHaveBeenCalledTimes(1);
  });

  test('#20 => emit text with length 4', () => {
    subject2$.next({ text: 'abcd' });
  });

  test('#21 => fn2 was called 2 times', () => {
    expect(fn2).toHaveBeenCalledTimes(2);
  });

  test('#22 => fn2 last returned 400', () => {
    expect(fn2).toHaveLastReturnedWith(400);
  });

  test('#23 => emit number 1', () => subject3$.next(1));

  test('#24 => fn3 was called 1 time', () => {
    expect(fn3).toHaveBeenCalledTimes(1);
  });

  test('#25 => fn3 last returned 6', () => {
    expect(fn3).toHaveLastReturnedWith(6);
  });

  test('#26 => emit number 3 with same parity', () => subject3$.next(3));

  test('#27 => fn3 call count remains 1', () => {
    expect(fn3).toHaveBeenCalledTimes(1);
  });

  test('#28 => emit number 4 with different parity', () => {
    subject3$.next(4);
  });

  test('#29 => fn3 was called 2 times', () => {
    expect(fn3).toHaveBeenCalledTimes(2);
  });

  test('#30 => fn3 last returned 9', () => {
    expect(fn3).toHaveLastReturnedWith(9);
  });

  test('#31 => dispose sub1', sub1.dispose);

  test('#32 => sub1 selector is undefined after dispose', () => {
    expect(sub1.selector).toBeUndefined();
  });

  test('#33 => sub1 equals is undefined after dispose', () => {
    expect(sub1.equals).toBeUndefined();
  });

  test('#34 => sub1 subscribable is undefined after dispose', () => {
    expect(sub1.subscribable).toBeUndefined();
  });
});
