import { createSubscriber } from '@bemedev/subscriber';
import { Subject } from 'rxjs';
import { typeMock } from './fixtures';

describe('Select parent of multiple subscribers Tests', () => {
  type Item = { category: string; value: number };

  const fnParent1 = vi.fn();
  const fnParent2 = vi.fn();
  const fnChild = vi.fn();

  const subject$ = new Subject<Item>();

  const parentSelectorBuilder = createSubscriber(subject$).select(
    i => i.category,
  );

  const subP1 = parentSelectorBuilder.subscribe(
    typeMock(fnParent1, v => v.value * 2),
  );
  const subP2 = parentSelectorBuilder.subscribe(
    typeMock(fnParent2, v => v.category.toUpperCase()),
  );

  const childBuilder = parentSelectorBuilder.select(cat => cat.length);

  const subChild = childBuilder.subscribe(
    typeMock(fnChild, v => v.value + 100),
  );

  test('#01 => subP1 subscribable is subject$', () => {
    expect(subP1.subscribable).toBe(subject$);
  });

  test('#02 => subP2 subscribable is subject$', () => {
    expect(subP2.subscribable).toBe(subject$);
  });

  test('#03 => subChild subscribable is subject$', () => {
    expect(subChild.subscribable).toBe(subject$);
  });

  test('#04 => emit fruit item with value 10', () => {
    subject$.next({ category: 'fruit', value: 10 });
  });

  test('#05 => fP1 was called 1 time', () => {
    expect(fnParent1).toHaveBeenCalledTimes(1);
  });

  test('#06 => fP1 last returned 20', () => {
    expect(fnParent1).toHaveLastReturnedWith(20);
  });

  test('#07 => fP2 was called 1 time', () => {
    expect(fnParent2).toHaveBeenCalledTimes(1);
  });

  test('#08 => fP2 last returned "FRUIT"', () =>
    expect(fnParent2).toHaveLastReturnedWith('FRUIT'));

  test('#09 => fChild was called 1 time', () => {
    expect(fnChild).toHaveBeenCalledTimes(1);
  });

  test('#10 => fChild last returned 110', () => {
    expect(fnChild).toHaveLastReturnedWith(110);
  });

  test('#11 => emit fruit item with value 20', () => {
    subject$.next({ category: 'fruit', value: 20 });
  });

  test('#12 => fP1 call count remains 1', () => {
    expect(fnParent1).toHaveBeenCalledTimes(1);
  });

  test('#13 => fP2 call count remains 1', () => {
    expect(fnParent2).toHaveBeenCalledTimes(1);
  });

  test('#14 => fChild call count remains 1', () => {
    expect(fnChild).toHaveBeenCalledTimes(1);
  });

  test('#15 => emit veggie item with value 30', () => {
    subject$.next({ category: 'veggie', value: 30 });
  });

  test('#16 => fP1 was called 2 times', () => {
    expect(fnParent1).toHaveBeenCalledTimes(2);
  });

  test('#17 => fP1 last returned 60', () => {
    expect(fnParent1).toHaveLastReturnedWith(60);
  });

  test('#18 => fP2 was called 2 times', () => {
    expect(fnParent2).toHaveBeenCalledTimes(2);
  });

  test('#19 => fP2 last returned "VEGGIE"', () =>
    expect(fnParent2).toHaveLastReturnedWith('VEGGIE'));

  test('#20 => fChild was called 2 times', () => {
    expect(fnChild).toHaveBeenCalledTimes(2);
  });

  test('#21 => fChild last returned 130', () => {
    expect(fnChild).toHaveLastReturnedWith(130);
  });

  test('#22 => unsubscribe subP1', subP1.unsubscribe);

  test('#23 => emit drink item with value 5', () => {
    subject$.next({ category: 'drink', value: 5 });
  });

  test('#24 => fP1 call count remains 2', () => {
    expect(fnParent1).toHaveBeenCalledTimes(2);
  });

  test('#25 => fP2 was called 3 times', () => {
    expect(fnParent2).toHaveBeenCalledTimes(3);
  });

  test('#26 => fP2 last returned "DRINK"', () =>
    expect(fnParent2).toHaveLastReturnedWith('DRINK'));

  test('#27 => fChild was called 3 times', () => {
    expect(fnChild).toHaveBeenCalledTimes(3);
  });

  test('#28 => fChild last returned 105', () => {
    expect(fnChild).toHaveLastReturnedWith(105);
  });
});
