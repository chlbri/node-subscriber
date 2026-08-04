import { createSignal, onCleanup } from 'solid-js';
import {
  createSubscriber as createSubscriberDep,
  normalEquals,
  defaultSelector,
} from '@bemedev/subscriber';
import type { Accessor } from 'solid-js';
import type {
  Equals_F,
  Selector_F,
  Subscribable,
} from '@bemedev/subscriber';

/**
 * SolidJS primitive that subscribes to a type {@linkcode Subscribable} source
 * and returns a reactive signal type {@linkcode Accessor}, returning `undefined`
 * prior to emitting a value unless a `defaultValue` is provided.
 *
 * @template T - Type emitted by the subscribable source.
 * @template R - Type of the selected value, defaulting to `T`.
 *
 * @param subscribable - Source subscribable of type {@linkcode Subscribable}.
 * @param options - Configuration options.
 * @param options.selector - Optional selector function of type {@linkcode Selector_F}.
 * @param options.equals - Optional equality comparator function of type {@linkcode Equals_F}.
 *
 * @returns A reactive signal type {@linkcode Accessor} containing `R | undefined`.
 */
export function createSubscriber<T, R = T>(
  subscribable: Subscribable<T>,
  options?: { selector?: Selector_F<T, R>; equals?: Equals_F<NoInfer<R>> },
): Accessor<R | undefined>;

/**
 * SolidJS primitive that subscribes to a type {@linkcode Subscribable} source
 * and returns a reactive signal type {@linkcode Accessor} initialized with `defaultValue`.
 *
 * @template T - Type emitted by the subscribable source.
 * @template R - Type of the selected value, defaulting to `T`.
 *
 * @param subscribable - Source subscribable of type {@linkcode Subscribable}.
 * @param options - Configuration options including mandatory `defaultValue`.
 * @param options.selector - Optional selector function of type {@linkcode Selector_F}.
 * @param options.equals - Optional equality comparator function of type {@linkcode Equals_F}.
 * @param options.defaultValue - Initial value for the signal of type `R`.
 *
 * @returns A reactive signal type {@linkcode Accessor} containing `R`.
 */
export function createSubscriber<T, R = T>(
  subscribable: Subscribable<T>,
  options: {
    selector?: Selector_F<T, R>;
    equals?: Equals_F<NoInfer<R>>;
    defaultValue: R;
  },
): Accessor<R>;

export function createSubscriber<T, R = T>(
  subscribable: Subscribable<T>,
  options: {
    selector?: Selector_F<T, R>;
    equals?: Equals_F<NoInfer<R>>;
    defaultValue?: R;
  } = {},
): Accessor<R | undefined> {
  const {
    selector = defaultSelector,
    equals = normalEquals,
    defaultValue,
  } = options;

  const [value, setValue] = createSignal<R | undefined>(defaultValue, {
    equals: equals as any,
  });

  const builder = createSubscriberDep(subscribable).select(selector);

  const sub = builder.subscribe(
    raw => setValue(() => selector(raw)),
    equals,
  );

  onCleanup(sub.dispose);

  return value as any;
}
