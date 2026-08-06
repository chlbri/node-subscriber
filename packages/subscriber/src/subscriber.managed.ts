import { SubscriberBaseClass } from './subscriber.base';
import type {
  Equals_F,
  Selector_F,
  // oxlint-disable-next-line no-unused-vars
  Subscribable,
  Subscriber_F,
  // oxlint-disable-next-line no-unused-vars
  SubscriberState,
  SusbscriberOptions,
} from './types';

/**
 * Class representing a managed active subscriber node that manages subscription state,
 * equality checking, child subscriber notifications, and explicit disposal.
 *
 * Extends class {@linkcode SubscriberBaseClass}.
 *
 * @template T - Type of data emitted by the source of type {@linkcode Subscribable}.
 * @template R - Type of selected value derived from state, defaulting to `T`.
 */
class ManagedSubscriberClass<T, R = T> extends SubscriberBaseClass<T, R> {
  /**
   * Creates an active instance of class {@linkcode ManagedSubscriberClass}.
   *
   * @param subscriber - Subscriber callback function of type {@linkcode Subscriber_F}.
   * @param selector - Optional selector function of type {@linkcode Selector_F}.
   * @param equals - Optional equality comparator function of type {@linkcode Equals_F}.
   *
   * @see {@linkcode normalEquals}
   */
  constructor(
    subscriber: Subscriber_F<T>,
    selector?: Selector_F<T, R>,
    equals?: Equals_F<R>,
  ) {
    super(subscriber, selector, equals);
  }

  /**
   * Unsubscribes and transitions state to `'inactive'`.
   *
   * @returns type {@linkcode SubscriberState} updated state.
   */
  unsubscribe = this._unsubscribe;

  /**
   * Disposes subscriber resources and transitions state to `'disposed'`.
   *
   * @returns type {@linkcode SubscriberState} updated state.
   */
  dispose = this._dispose;
}

/**
 * Type alias for class {@linkcode ManagedSubscriberClass}.
 *
 * @template T - The type of data emitted by the source.
 * @template R - The selected value type, defaults to `T`.
 */
export type ManagedSusbcriber<T, R = T> = ManagedSubscriberClass<T, R>;

/**
 * Type alias for type {@linkcode ManagedSusbcriber}.
 *
 * @template T - The type of data emitted by the source.
 * @template R - The selected value type, defaults to `T`.
 */
export type Susbcriber<T, R = T> = ManagedSusbcriber<T, R>;

/**
 * Factory function signature for creating a managed subscriber node of type {@linkcode ManagedSusbcriber}.
 *
 * @template T - Type of data emitted by the source.
 * @template R - Type of selected value, defaults to `T`.
 *
 * @param subscriber - Subscriber callback function of type {@linkcode Subscriber_F}.
 * @param options - Optional configuration options of type {@linkcode SusbscriberOptions}.
 *
 * @returns A new instance of class {@linkcode ManagedSubscriberClass}.
 */
export type CreateManagedSubscriber_F = <T, R = T>(
  subscriber: Subscriber_F<T>,
  options?: SusbscriberOptions<T, R>,
) => ManagedSusbcriber<T, R>;

/**
 * Type alias for type {@linkcode CreateManagedSubscriber_F}.
 */
export type CreateSubscriber_F = CreateManagedSubscriber_F;

/**
 * Creates an active managed subscriber node of class {@linkcode ManagedSubscriberClass}.
 *
 * @template T - Type of data emitted by the source.
 * @template R - Type of selected value, defaults to `T`.
 *
 * @param subscriber - Subscriber callback function of type {@linkcode Subscriber_F}.
 * @param options - Optional configuration options of type {@linkcode SusbscriberOptions}.
 *
 * @returns A new instance of class {@linkcode ManagedSubscriberClass}.
 */
export const createManagedSubcriber: CreateManagedSubscriber_F = (
  subscriber,
  options = {},
) => {
  const { equals, selector } = options;
  const _subscriber = new ManagedSubscriberClass(
    subscriber,
    selector,
    equals,
  );
  return _subscriber;
};

/**
 * Alias for {@linkcode createManagedSubcriber}.
 */
export const createSubscriber = createManagedSubcriber;
