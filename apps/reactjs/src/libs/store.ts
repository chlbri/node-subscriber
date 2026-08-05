import { BehaviorSubject } from 'rxjs';

export type CounterState = {
  count: number;
  step: number;
};

const initialState: CounterState = { count: 0, step: 1 };

/**
 * RxJS BehaviorSubject acting as the reactive state source.
 * It implements the Subscribable<T> interface natively.
 */
export const counter$ = new BehaviorSubject<CounterState>(initialState);

export const counterActions = {
  increment: () =>
    counter$.next({
      ...counter$.value,
      count: counter$.value.count + counter$.value.step,
    }),
  decrement: () =>
    counter$.next({
      ...counter$.value,
      count: counter$.value.count - counter$.value.step,
    }),
  reset: () => counter$.next(initialState),
  setStep: (step: number) =>
    counter$.next({ ...counter$.value, step }),
};
