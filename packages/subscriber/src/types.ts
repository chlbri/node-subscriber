import type { Fn } from '#bemedev/globals/types';

/**
 * An observer that handles next notifications.
 *
 * @template T - Type of data emitted by the source.
 */
export type NextObserver<T> = {
  /**
   * Optional flag indicating if observer is closed.
   */
  closed?: boolean;
  /**
   * Callback handling next value emission.
   *
   * @param value - Emitted value of type `T`.
   */
  next: (value: T) => void;
  /**
   * Callback handling error notification.
   *
   * @param err - Error payload.
   */
  error?: (err: any) => void;
  /**
   * Callback handling completion notification.
   */
  complete?: () => void;
};

/**
 * An observer that handles error notifications.
 *
 * @template T - Type of data emitted by the source.
 */
export type ErrorObserver<T> = {
  /**
   * Optional flag indicating if observer is closed.
   */
  closed?: boolean;
  /**
   * Callback handling next value emission.
   *
   * @param value - Emitted value of type `T`.
   */
  next?: (value: T) => void;
  /**
   * Callback handling error notification.
   *
   * @param err - Error payload.
   */
  error: (err: any) => void;
  /**
   * Callback handling completion notification.
   */
  complete?: () => void;
};

/**
 * An observer that handles completion notifications.
 *
 * @template T - Type of data emitted by the source.
 */
export type CompletionObserver<T> = {
  /**
   * Optional flag indicating if observer is closed.
   */
  closed?: boolean;
  /**
   * Callback handling next value emission.
   *
   * @param value - Emitted value of type `T`.
   */
  next?: (value: T) => void;
  /**
   * Callback handling error notification.
   *
   * @param err - Error payload.
   */
  error?: (err: any) => void;
  /**
   * Callback handling completion notification.
   */
  complete: () => void;
};

/**
 * Union type of observer configurations requiring at least one notification handler.
 *
 * @template T - Type of data emitted by the source.
 */
export type PartialObserver<T> =
  | NextObserver<T>
  | ErrorObserver<T>
  | CompletionObserver<T>;

/**
 * Represents a subscription handle that can be unsubscribed.
 */
export type Unsubscribable = {
  /**
   * Function to terminate the subscription.
   */
  unsubscribe: Fn<[], void>;
};

/**
 * An object interface that defines a set of callback functions a user can use to get
 * notified of any set of observables.
 *
 * @template T - Type of data emitted by the source.
 */
export type Observer<T> = {
  /**
   * Callback function called when the producer emits a value of type `T`.
   */
  next: Subscriber_F<T>;

  /**
   * Callback function called when the producer encounters an error.
   */
  error: Fn<[err: any], void>;

  /**
   * Callback function called when the producer completes.
   */
  complete: Fn<[], void>;
};

/**
 * Represents the lifecycle state of a subscriber node.
 */
export type SubscriberState =
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
 * @returns type {@linkcode boolean} indicating whether `a` and `b` are equal.
 */
export type Equals_F<T> = Fn<[T, T], boolean>;

/**
 * Function signature for a selector function mapping state of type `T` to selected value `R`.
 *
 * @template T - Type of input state.
 * @template R - Type of selected value.
 *
 * @param val - Input state value of type `T`.
 *
 * @returns Selected value of type `R`.
 */
export type Selector_F<T, R = any> = Fn<[T], R>;

/**
 * Interface for subscribable objects emitting values of type `T`.
 *
 * @template T - Type of data emitted by the subscribable source.
 */
export type Subscribable<T> = {
  /**
   * Subscribes to emissions using an observer or next callback.
   *
   * @param observerOrNext - Optional partial observer or next callback function.
   *
   * @returns Subscription handle of type {@linkcode Unsubscribable}.
   */
  subscribe: Fn<
    [observerOrNext?: PartialObserver<T> | Subscriber_F<T>],
    Unsubscribable
  >;
};
