import type { Fn } from '#bemedev/globals/types';

export type NextObserver<T> = {
  closed?: boolean;
  next: (value: T) => void;
  error?: (err: any) => void;
  complete?: () => void;
};

export type ErrorObserver<T> = {
  closed?: boolean;
  next?: (value: T) => void;
  error: (err: any) => void;
  complete?: () => void;
};

export type CompletionObserver<T> = {
  closed?: boolean;
  next?: (value: T) => void;
  error?: (err: any) => void;
  complete: () => void;
};

export type PartialObserver<T> =
  | NextObserver<T>
  | ErrorObserver<T>
  | CompletionObserver<T>;

export type Unsubscribable = { unsubscribe: Fn<[], void> };

/**
 * An object interface that defines a set of callback functions a user can use to get
 * notified of any set of {@link Observable}
 *
 */
export type Observer<T> = {
  /**
   * A callback function that gets called by the producer during the subscription when
   * the producer "has" the `value`. It won't be called if `error` or `complete` callback
   * functions have been called, nor after the consumer has unsubscribed.
   *
   */
  next: Subscriber_F<T>;

  /**
   * A callback function that gets called by the producer if and when it encountered a
   * problem of any kind. The errored value will be provided through the `err` parameter.
   * This callback can't be called more than one time, it can't be called if the
   * `complete` callback function have been called previously, nor it can't be called if
   * the consumer has unsubscribed.
   *
   */
  error: Fn<[err: any], void>;

  /**
   * A callback function that gets called by the producer if and when it has no more
   * values to provide (by calling `next` callback function). This means that no error
   * has happened. This callback can't be called more than one time, it can't be called
   * if the `error` callback function have been called previously, nor it can't be called
   * if the consumer has unsubscribed.
   *
   */
  complete: Fn<[], void>;
};

/**
 * Represents the lifecycle state of a subscriber node.
 */
export type SubscriberState =
  | 'idle'
  | 'paused'
  | 'active'
  | 'disposed'
  | 'inactive';

/**
 * Function signature for a subscriber callback receiving state updates of type `T`.
 *
 * @template T - Type of data passed to the subscriber.
 */
export type Subscriber_F<T> = Fn<[T], void>;

/**
 * Function signature for comparing two values of type `T` for equality.
 *
 * @template T - Type of values compared.
 *
 * @param a - First value to compare.
 * @param b - Second value to compare.
 *
 * @returns `-- type {@linkcode boolean}` indicating whether `a` and `b` are equal.
 */
export type Equals_F<T> = Fn<[T, T], boolean>;

export type Subscribable<T> = {
  subscribe: Fn<
    [observerOrNext?: PartialObserver<T> | Subscriber_F<T>],
    Unsubscribable
  >;
};
