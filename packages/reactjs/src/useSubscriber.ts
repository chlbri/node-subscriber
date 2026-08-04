import { useCallback, useRef } from 'react';
import { useSync } from '@bemedev/react-sync';
import {
  createSubscriber,
  normalEquals,
  defaultSelector,
} from '@bemedev/subscriber';
import type {
  Equals_F,
  Selector_F,
  Subscribable,
} from '@bemedev/subscriber';

/**
 * React hook that subscribes to any type {@linkcode Subscribable} source and
 * returns a reactive selected value, re-rendering only when the selected
 * slice changes.
 *
 * Internally delegates to {@linkcode useSync} from `@bemedev/react-sync`,
 * which wraps `useSyncExternalStore` with a memoized selector and equality
 * check — making it safe for React concurrent mode.
 *
 * @template T - Type emitted by the subscribable source.
 * @template R - Type of the selected value, defaults to `T`.
 *
 * @param subscribable - Source subscribable of type {@linkcode Subscribable}.
 * @param options - Configuration options.
 * @param options.selector - Optional selector function of type {@linkcode Selector_F}.
 * @param options.equals - Optional equality comparator function of type {@linkcode Equals_F}.
 *
 * @returns The current selected value of type `R | undefined`.
 *
 * @example
 * ```tsx
 * import { BehaviorSubject } from 'rxjs';
 * import { useSubscriber } from '@bemedev/react-subscriber';
 *
 * const counter$ = new BehaviorSubject(0);
 *
 * function Counter() {
 *   const count = useSubscriber(counter$);
 *   return <span>{count}</span>;
 * }
 * ```
 *
 * @see {@linkcode defaultSelector}, {@linkcode normalEquals}, {@linkcode createSubscriber}, {@linkcode useRef}, {@linkcode useCallback}
 */
export function useSubscriber<T, R = T>(
  subscribable: Subscribable<T>,
  options?: { selector?: Selector_F<T, R>; equals?: Equals_F<NoInfer<R>> },
): R | undefined;

/**
 * React hook that subscribes to any type {@linkcode Subscribable} source and
 * returns a reactive selected value of type `R`, initialized with `defaultValue`.
 *
 * @template T - Type emitted by the subscribable source.
 * @template R - Type of the selected value, defaults to `T`.
 *
 * @param subscribable - Source subscribable of type {@linkcode Subscribable}.
 * @param options - Configuration options including mandatory `defaultValue`.
 * @param options.selector - Optional selector function of type {@linkcode Selector_F}.
 * @param options.equals - Optional equality comparator function of type {@linkcode Equals_F}.
 * @param options.defaultValue - Initial value for the subscriber of type `R`.
 *
 * @returns The current selected value of type `R`.
 *
 * @see {@linkcode useSync}, {@linkcode defaultSelector}, {@linkcode normalEquals}, {@linkcode createSubscriber}, {@linkcode useRef}, {@linkcode useCallback}
 */
export function useSubscriber<T, R = T>(
  subscribable: Subscribable<T>,
  options: {
    selector?: Selector_F<T, R>;
    equals?: Equals_F<NoInfer<R>>;
    defaultValue: R;
  },
): R;

export function useSubscriber<T, R = T>(
  subscribable: Subscribable<T>,
  options: {
    selector?: Selector_F<T, R>;
    equals?: Equals_F<NoInfer<R>>;
    defaultValue?: R;
  } = {},
): R | undefined {
  const {
    selector = defaultSelector,
    equals = normalEquals,
    defaultValue,
  } = options;

  // Stable ref to always-latest emitted value (snapshot storage)
  const latestRef = useRef<R | undefined>(defaultValue);

  // Stable subscribe function for useSyncExternalStore contract:
  // receives a notify callback, subscribes, returns unsubscribe fn
  const subscribe = useCallback((notify: () => void) => {
    const sub = createSubscriber(subscribable)
      .select(selector)
      .subscribe(value => {
        latestRef.current = selector(value);
        notify();
      }, equals);

    return () => {
      sub.dispose();
    };
  }, []);

  // Snapshot reader — returns raw latest value; selector applied by useSync
  const getSnapshot = useCallback((): R => {
    return latestRef.current as R;
  }, []);

  return useSync(
    subscribe,
    getSnapshot,
    null,
    defaultSelector,
    equals,
  ) as any;
}
