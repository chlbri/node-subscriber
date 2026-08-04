import type { Fn } from '#bemedev/globals/types';
import { normalEquals } from './helpers';
import type {
  Equals_F,
  Subscribable,
  Subscriber_F,
  SubscriberState,
} from './types';

/**
 * Class representing a subscriber node that manages subscription state,
 * equality checking, child subscribers, and disposal.
 *
 * @template T - Type of data passed to the subscriber.
 */
class SubscriberClass<T> implements Disposable {
  /**
   * Current lifecycle state of the subscriber.
   */
  private __state: SubscriberState = 'active';

  /**
   * Getter for the equality comparator function.
   *
   * @returns `-- type {@linkcode Equals_F}` comparator function.
   */
  get equals(): Equals_F<T> {
    return this.__equals;
  }

  private __previousValue?: T;
  private __currenValue!: T;

  /**
   * Creates an instance of `-- class {@linkcode SubscriberClass}`.
   *
   * @param subscriber - Subscriber callback function of `-- type {@linkcode Subscriber_F}`.
   * @param equals - Function to compare two values of type `T` for equality. Defaults to `{@linkcode normalEquals}`.
   * @param _id - Optional unique identifier for the subscriber.
   */
  constructor(
    private __subscriber: Subscriber_F<T>,
    private __equals: Equals_F<T> = normalEquals,
  ) {
    this.__state = 'idle';
  }

  /**
   * Private getter indicating whether the subscriber is prevented from performing actions.
   *
   * @returns `-- type {@linkcode boolean}` indicating if state is not `'active'`.
   */
  private get __cannotPerform() {
    return !(this.__state === 'active');
  }

  #firstTime = true;

  /**
   * Function handling state changes and notifying subscribers if states differ.
   *
   * @param previous - Previous state value.
   * @param next - Next state value.
   */
  private __fn: Fn<[T], void> = currenValue => {
    this.__previousValue = this.__currenValue;
    this.__currenValue = currenValue;
    if (!this.#firstTime && this.__cannotPerform) return;

    const _equals = this.__equals(
      this.__previousValue,
      this.__currenValue,
    );

    if (!this.#firstTime && _equals) return;
    this.#firstTime = false;
    return this.__subscriber(this.__currenValue);
  };

  /**
   * Getter for the current subscriber state.
   *
   * @returns `-- type {@linkcode SubscriberState}` current lifecycle state.
   */
  get state() {
    return this.__state;
  }

  /**
   * Getter checking if subscriber is not disposed or inactive.
   *
   * @returns `-- type {@linkcode boolean}` indicating if state is not `'disposed'` or `'inactive'`.
   */
  get isNotInactive() {
    return this.state !== 'disposed' && this.state !== 'inactive';
  }

  /**
   * Pauses the subscriber by transitioning state to `'paused'`.
   *
   * @returns `-- type {@linkcode SubscriberState}` updated state.
   */
  close = (): SubscriberState => {
    if (this.isNotInactive) return (this.__state = 'paused');
    return this.__state;
  };

  /**
   * Activates the subscriber by transitioning state to `'active'`.
   *
   * @returns `-- type {@linkcode SubscriberState}` updated state.
   */
  open = (): SubscriberState => {
    if (this.__state === 'paused') return (this.__state = 'active');
    return this.__state;
  };

  /**
   * Unsubscribes by setting state to `'inactive'`.
   *
   * @returns `-- type {@linkcode SubscriberState}` updated state.
   */
  unsubscribe = (): SubscriberState => {
    this.close();
    this.__state = 'inactive';
    return this.__state;
  };

  /**
   * Disposes subscriber resources and cleans up internal references.
   *
   * @returns `-- type {@linkcode SubscriberState}` updated state.
   */
  dispose = (): SubscriberState => {
    this.unsubscribe();
    (this.__subscriber as any) = undefined;
    (this.__equals as any) = undefined;
    return (this.__state = 'disposed');
  };

  /**
   * Re-creates a new subscriber instance using the same callback and equality function if not disposed.
   *
   * @returns A new `-- class {@linkcode SubscriberClass}` or `undefined` if state is `'disposed'`.
   */
  get renew(): SubscriberClass<T> | undefined {
    if (this.__state !== 'disposed') {
      const out = new SubscriberClass(this.__subscriber, this.__equals);
      const subi = this.__subscribable;
      if (subi) out.subscribe(subi);
      return out;
    }

    return undefined;
  }

  /**
   * Resource management disposal handler (`Symbol.dispose`).
   *
   * @returns `-- type {@linkcode SubscriberState}` updated state.
   */
  [Symbol.dispose] = this.dispose;

  /**
   * Asynchronous resource management disposal handler (`Symbol.asyncDispose`).
   *
   * @returns `-- type {@linkcode Promise}` resolving to `-- type {@linkcode SubscriberState}`.
   */
  [Symbol.asyncDispose] = async () => this.dispose();

  __subscribable?: Subscribable<T>;

  subscribe = (subscribable: Subscribable<T>) => {
    this.__subscribable = subscribable;
    this.__state = 'active';
    return this.__subscribable.subscribe(this.__fn);
  };
}

export type Subscriber<T> = SubscriberClass<T>;

/**
 * Factory function signature for creating subscriber instances.
 *
 * @template T - Data type of subscriber state.
 *
 * @param subscriber - Subscriber callback function of `-- type {@linkcode Subscriber_F}`.
 * @param options - Optional `-- type {@linkcode SubscriberOptions}` configuration.
 *
 * @returns `-- class {@linkcode SubscriberClass}` created subscriber instance.
 */
export type CreateSubscriber_F = <T>(
  subscriber: Subscriber_F<T>,
  /**
   * Optional equality comparator function of `-- type {@linkcode Equals_F}`.
   */
  equals?: Equals_F<T>,
) => Subscriber<T>;

/**
 * Creates a new instance of `-- class {@linkcode SubscriberClass}`.
 *
 * @template T - Data type of subscriber state.
 *
 * @param subscriber - Subscriber function called on state change of `-- type {@linkcode Subscriber_F}`.
 * @param options - Optional `-- type {@linkcode SubscriberOptions}` configuration.
 *
 * @returns A new instance of `-- class {@linkcode SubscriberClass}`.
 */
export const createSubscriber: CreateSubscriber_F = (
  subscriber,
  equals,
) => {
  return new SubscriberClass(subscriber, equals);
};
