import { SubscriberBaseClass } from './subscriber.base';
import type {
  Equals_F,
  Selector_F,
  Subscribable,
  Subscriber_F,
  SubscriberState,
  Unsubscribable,
} from './types';

/**
 * Class representing a builder node used to chain selector transformations
 * and create an active subscriber.
 *
 * @template T - Type of data emitted by the source of type {@linkcode Subscribable}.
 * @template R - Type of selected value derived from state, defaulting to `T`.
 */
class SubscriberBuilderClass<T, R = T> {
  /**
   * Creates an instance of class {@linkcode SubscriberBuilderClass}.
   *
   * @param __subscribable - Source subscribable of type {@linkcode Subscribable}.
   * @param __selector - Optional selector function of type {@linkcode Selector_F}.
   */
  constructor(
    private __subscribable: Subscribable<T>,
    private __selector?: Selector_F<T, R>,
  ) {}

  /**
   * Getter for the active subscribable source attached to this builder.
   *
   * @returns type {@linkcode Subscribable} source object.
   */
  get subscribable(): Subscribable<T> {
    return this.__subscribable;
  }

  /**
   * Creates a new subscriber builder with a nested selector transformer.
   *
   * @template RNext - Type of newly selected sub-state value.
   *
   * @param selector - Selector function of type {@linkcode Selector_F} mapping current selected value of type `R` to `RNext`.
   *
   * @returns A new instance of class {@linkcode SubscriberBuilderClass} for type `RNext`.
   */
  select<RNext>(
    selector: Selector_F<R, RNext>,
  ): SubscriberBuilderClass<T, RNext> {
    const currentSelector = this.__selector;

    const combinedSelector = (
      currentSelector
        ? (val: T) => selector(currentSelector(val))
        : selector
    ) as Selector_F<T, RNext>;

    return new SubscriberBuilderClass<T, RNext>(
      this.__subscribable,
      combinedSelector,
    );
  }

  /**
   * Subscribes to state updates using the provided subscriber callback function and optional equality comparator.
   *
   * @param subscriber - Subscriber callback function of type {@linkcode Subscriber_F}.
   * @param equals - Optional equality comparator function of type {@linkcode Equals_F}.
   *
   * @returns Active instance of class {@linkcode SubscriberClass} with state set to `'active'`.
   */
  subscribe(
    subscriber: Subscriber_F<T>,
    equals?: Equals_F<R>,
  ): Subscriber<T, R> {
    return new SubscriberClass<T, R>(
      this.__subscribable,
      subscriber,
      this.__selector,
      equals,
    );
  }
}

/**
 * Class representing an active subscriber node that manages subscription state,
 * equality checking, child subscriber notifications, and explicit disposal.
 *
 * Extends class {@linkcode SubscriberBaseClass}.
 *
 * @template T - Type of data emitted by the source of type {@linkcode Subscribable}.
 * @template R - Type of selected value derived from state, defaulting to `T`.
 */
class SubscriberClass<T, R = T> extends SubscriberBaseClass<T, R> {
  /**
   * Active subscription handle connected to the source of type {@linkcode Subscribable}.
   */
  private __subscription?: Unsubscribable;

  /**
   * Creates an active instance of class {@linkcode SubscriberClass}.
   *
   * @param __subscribable - Source subscribable of type {@linkcode Subscribable}.
   * @param subscriber - Subscriber callback function of type {@linkcode Subscriber_F}.
   * @param selector - Optional selector function of type {@linkcode Selector_F}.
   * @param equals - Optional equality comparator function of type {@linkcode Equals_F}.
   *
   * @see {@linkcode normalEquals}
   */
  constructor(
    private __subscribable: Subscribable<T>,
    subscriber: Subscriber_F<T>,
    selector?: Selector_F<T, R>,
    equals?: Equals_F<R>,
  ) {
    super(subscriber, selector, equals);
    this.__subscription = __subscribable.subscribe(this.fn);
  }

  /**
   * Internal implementation for unsubscribing.
   *
   * @returns type {@linkcode SubscriberState} updated state.
   */
  unsubscribe = (): SubscriberState => {
    this._unsubscribe();
    this.__subscription?.unsubscribe();
    this.__subscription = undefined;
    return this.__state;
  };

  /**
   * Re-subscribes to the source subscribable if currently inactive.
   *
   * @returns type {@linkcode SubscriberState} updated state.
   */
  reSubscribe = (): SubscriberState => {
    if (this.state !== 'inactive') return this.__state;
    this.__subscription = this.__subscribable.subscribe(this.fn);
    this.__state = 'active';
    this.__firstTime = true;
    return this.__state;
  };

  /**
   * Internal implementation for disposing subscriber resources.
   *
   * @returns type {@linkcode SubscriberState} updated state.
   */
  dispose = (): SubscriberState => {
    this._dispose();
    (this.__subscribable as any) = undefined;
    return this.__state;
  };

  /**
   * Getter for the active subscribable source attached to this subscriber instance.
   *
   * @returns type {@linkcode Subscribable} source object or `undefined` if disposed.
   */
  get subscribable(): Subscribable<T> {
    return this.__subscribable;
  }

  /**
   * Resource management disposal handler (`Symbol.dispose`).
   *
   * @returns type {@linkcode SubscriberState} updated state.
   */
  [Symbol.dispose] = this.dispose;
}

/**
 * Type alias for class {@linkcode SubscriberClass}.
 *
 * @template T - The type of the stream to subscribe to.
 * @template R - The result type of the operator, defaults to `T`.
 */
export type Subscriber<T, R = T> = SubscriberClass<T, R>;

/**
 * Type alias for class {@linkcode SubscriberBuilderClass}.
 *
 * @template T - The type of the stream to subscribe to.
 * @template R - The result type of the operator, defaults to `T`.
 */
export type SubscriberBuilder<T, R = T> = SubscriberBuilderClass<T, R>;

/**
 * Factory function signature for creating subscriber builder instances of class {@linkcode SubscriberBuilderClass}.
 *
 * @template T - Data type of subscriber state.
 *
 * @param subscribable - Source subscribable of type {@linkcode Subscribable}.
 *
 * @returns A new instance of class {@linkcode SubscriberBuilderClass}.
 */
export type CreateSubscriber_F = <T>(
  subscribable: Subscribable<T>,
) => SubscriberBuilderClass<T, T>;

/**
 * Creates a new instance of class {@linkcode SubscriberBuilderClass}.
 *
 * @template T - Data type of subscriber state.
 *
 * @param subscribable - Source subscribable of type {@linkcode Subscribable}.
 *
 * @returns A new instance of class {@linkcode SubscriberBuilderClass}.
 */
export const createSubscriber: CreateSubscriber_F = subscribable => {
  return new SubscriberBuilderClass(subscribable);
};
