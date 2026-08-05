import type { Fn } from '#bemedev/globals/types';
import { normalEquals } from './helpers';
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
 * @template T - Type of data emitted by the source subscribable.
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
   * @param selector - Selector function mapping current selected value of type `R` to `RNext`.
   *
   * @returns A new instance of class {@linkcode SubscriberBuilderClass} for type `RNext`.
   */
  select<RNext>(
    selector: Selector_F<R, RNext>,
  ): SubscriberBuilderClass<T, RNext> {
    const currentSelector = this.__selector;
    const combinedSelector: Selector_F<T, RNext> = currentSelector
      ? (val: T) => selector(currentSelector(val))
      : (selector as any);

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
  ): SubscriberClass<T, R> {
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
 * @template T - Type of data emitted by the source subscribable.
 * @template R - Type of selected value derived from state, defaulting to `T`.
 */
class SubscriberClass<T, R = T> implements Disposable, AsyncDisposable {
  /**
   * Current lifecycle state of the subscriber.
   */
  private __state: SubscriberState = 'active';

  /**
   * Active subscription handle connected to the source subscribable.
   */
  private __subscription?: Unsubscribable;

  /**
   * Getter for the equality comparator function.
   *
   * @returns type {@linkcode Equals_F} comparator function or `undefined` if disposed.
   */
  get equals(): Equals_F<R> {
    return this.__equals;
  }

  /**
   * Getter for the selector function.
   *
   * @returns type {@linkcode Selector_F} selector function or `undefined`.
   */
  get selector(): Selector_F<T, R> | undefined {
    return this.__selector;
  }

  /**
   * Previous value processed by the subscriber.
   */
  private __previousValue?: T;

  /**
   * Current value processed by the subscriber.
   */
  private __currenValue!: T;

  /**
   * Creates an active instance of class {@linkcode SubscriberClass}.
   *
   * @param __subscribable - Source subscribable of type {@linkcode Subscribable}.
   * @param __subscriber - Subscriber callback function of type {@linkcode Subscriber_F}.
   * @param __selector - Optional selector function of type {@linkcode Selector_F}.
   * @param __equals - Optional equality comparator function of type {@linkcode Equals_F}.
   *
   * @see {@linkcode normalEquals}
   */
  constructor(
    private __subscribable: Subscribable<T>,
    private __subscriber: Subscriber_F<T>,
    private __selector?: Selector_F<T, R>,
    private __equals: Equals_F<R> = normalEquals as unknown as Equals_F<R>,
  ) {
    this.__state = 'active';
    this.__subscription = this.__subscribable.subscribe(this.__fn);
  }

  /**
   * Private getter indicating whether the subscriber is prevented from performing actions.
   *
   * @returns type {@linkcode boolean} indicating if state is not `'active'`.
   */
  private get __cannotPerform() {
    return !(this.__state === 'active');
  }

  /**
   * Flag indicating whether the subscriber is executing for the first time.
   */
  private __firstTime = true;

  /**
   * Function handling state changes and notifying subscribers if states differ.
   *
   * @param currenValue - Next state value.
   */
  private __fn: Fn<[T], void> = currenValue => {
    this.__previousValue = this.__currenValue;
    this.__currenValue = currenValue;
    if (!this.__firstTime && this.__cannotPerform) return;

    const _equals = !this.__firstTime
      ? this.__selector
        ? this.__equals(
            this.__selector(this.__previousValue!),
            this.__selector(this.__currenValue),
          )
        : (this.__equals as unknown as Equals_F<T>)(
            this.__previousValue,
            this.__currenValue,
          )
      : false;

    if (_equals) return;
    this.__firstTime = false;
    return this.__subscriber(this.__currenValue);
  };

  /**
   * Getter for the current subscriber state.
   *
   * @returns type {@linkcode SubscriberState} current lifecycle state.
   */
  get state() {
    return this.__state;
  }

  /**
   * Getter checking if subscriber is not disposed or inactive.
   *
   * @returns type {@linkcode boolean} indicating if state is not `'disposed'` or `'inactive'`.
   */
  get isNotInactive() {
    return this.state !== 'disposed' && this.state !== 'inactive';
  }

  /**
   * Pauses the subscriber by transitioning state to `'paused'`.
   *
   * @returns type {@linkcode SubscriberState} updated state.
   */
  close = (): SubscriberState => {
    if (this.isNotInactive) {
      this.__previousValue = this.__currenValue;
      return (this.__state = 'paused');
    }
    return this.__state;
  };

  /**
   * Activates the subscriber by transitioning state to `'active'`.
   *
   * @returns type {@linkcode SubscriberState} updated state.
   */
  open = (): SubscriberState => {
    if (this.__state === 'paused') {
      if (this.__previousValue !== this.__currenValue) {
        this.__subscriber(this.__currenValue);
      }
      return (this.__state = 'active');
    }
    return this.__state;
  };

  /**
   * Unsubscribes by setting state to `'inactive'` and terminating the underlying subscription.
   *
   * @returns type {@linkcode SubscriberState} updated state.
   */
  unsubscribe = (): SubscriberState => {
    this.close();
    this.__subscription?.unsubscribe();
    this.__subscription = undefined;
    this.__state = 'inactive';
    return this.__state;
  };

  /**
   * Re-subscribes to the source subscribable if currently inactive.
   *
   * @returns type {@linkcode SubscriberState} updated state.
   */
  reSubscribe = (): SubscriberState => {
    if (this.state !== 'inactive') return this.__state;
    this.__subscription = this.__subscribable.subscribe(this.__fn);
    this.__state = 'active';
    this.__firstTime = true;
    return this.__state;
  };

  /**
   * Disposes subscriber resources and cleans up internal references.
   *
   * @returns type {@linkcode SubscriberState} updated state.
   */
  dispose = (): SubscriberState => {
    this.unsubscribe();
    (this.__subscriber as any) = undefined;
    (this.__subscribable as any) = undefined;
    (this.__equals as any) = undefined;
    (this.__selector as any) = undefined;
    return (this.__state = 'disposed');
  };

  /**
   * Resource management disposal handler (`Symbol.dispose`).
   *
   * @returns type {@linkcode SubscriberState} updated state.
   */
  [Symbol.dispose] = () => {
    this.dispose();
  };

  /**
   * Asynchronous resource management disposal handler (`Symbol.asyncDispose`).
   *
   * @returns type {@linkcode Promise} resolving to type {@linkcode SubscriberState}.
   */
  [Symbol.asyncDispose] = async () => {
    this[Symbol.dispose]();
  };

  /**
   * Getter for the active subscribable source attached to this subscriber instance.
   *
   * @returns type {@linkcode Subscribable} source object or `undefined` if disposed.
   */
  get subscribable(): Subscribable<T> {
    return this.__subscribable;
  }
}

/**
 * Type alias for class {@linkcode SubscriberBuilderClass}.
 *
 * @template {unknown} T - The type of the stream to subscribe to.
 * @template {unknown} R - The result type of the operator, defaults to `T`.
 */
export type SubscriberBuilder<T, R = T> = SubscriberBuilderClass<T, R>;

/**
 * Type alias for class {@linkcode SubscriberClass}.
 *
 * @template {unknown} T - The type of the stream to subscribe to.
 * @template {unknown} R - The result type of the operator, defaults to `T`.
 */
export type Subscriber<T, R = T> = SubscriberClass<T, R>;

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
export function createSubscriber<T>(
  subscribable: Subscribable<T>,
): SubscriberBuilderClass<T, T> {
  return new SubscriberBuilderClass<T, T>(subscribable);
}
