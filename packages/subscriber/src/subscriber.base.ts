import type { Fn } from '#bemedev/globals/types';
import { normalEquals } from './helpers';
import type {
  Equals_F,
  Selector_F,
  Subscriber_F,
  SubscriberState,
} from './types';

/**
 * Base class representing an active subscriber node that manages subscription state,
 * equality checking, child subscriber notifications, and explicit disposal.
 *
 * Serves as the common parent class for class {@linkcode SubscriberClass} and class {@linkcode ManagedSubscriberClass}.
 *
 * @template T - Type of data emitted by the source.
 * @template R - Type of selected value derived from state, defaulting to `T`.
 */
export class SubscriberBaseClass<T, R = T>
  implements Disposable, AsyncDisposable
{
  /**
   * Current lifecycle state of the subscriber of type {@linkcode SubscriberState}.
   */
  protected __state: SubscriberState = 'active';

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
  protected __previousValue?: T;

  /**
   * Current value processed by the subscriber.
   */
  protected __currenValue!: T;

  /**
   * Creates an active instance of class {@linkcode SubscriberBaseClass}.
   *
   * @param __subscriber - Subscriber callback function of type {@linkcode Subscriber_F}.
   * @param __selector - Optional selector function of type {@linkcode Selector_F}.
   * @param __equals - Optional equality comparator function of type {@linkcode Equals_F}.
   *
   * @see {@linkcode normalEquals}
   */
  constructor(
    protected __subscriber: Subscriber_F<T>,
    protected __selector?: Selector_F<T, R>,
    protected __equals: Equals_F<R> = normalEquals as unknown as Equals_F<R>,
  ) {}

  /**
   * Protected getter indicating whether the subscriber is prevented from performing actions.
   *
   * @returns type {@linkcode boolean} indicating if state is not `'active'`.
   */
  protected get __cannotPerform() {
    return !(this.__state === 'active');
  }

  /**
   * Flag indicating whether the subscriber is executing for the first time.
   */
  protected __firstTime = true;

  /**
   * Function handling state changes and notifying subscribers if states differ.
   * This will be called by the source subscribable or manually by managed subscribers.
   *
   * @param currenValue - Next state value.
   */
  fn: Fn<[T], void> = currenValue => {
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
   * Internal implementation for unsubscribing.
   *
   * @returns type {@linkcode SubscriberState} updated state.
   */
  protected _unsubscribe = (): SubscriberState => {
    this.close();
    this.__state = 'inactive';
    return this.__state;
  };

  /**
   * Internal implementation for disposing subscriber resources.
   *
   * @returns type {@linkcode SubscriberState} updated state.
   */
  protected _dispose = (): SubscriberState => {
    this._unsubscribe();
    (this.__subscriber as any) = undefined;
    (this.__equals as any) = undefined;
    (this.__selector as any) = undefined;
    return (this.__state = 'disposed');
  };

  /**
   * Resource management disposal handler (`Symbol.dispose`).
   *
   * @returns type {@linkcode SubscriberState} updated state.
   */
  [Symbol.dispose] = this._dispose;

  /**
   * Asynchronous resource management disposal handler (`Symbol.asyncDispose`).
   *
   * @returns type {@linkcode Promise} resolving to type {@linkcode SubscriberState}.
   */
  [Symbol.asyncDispose] = async () => {
    this[Symbol.dispose]();
  };
}

/**
 * Type alias for class {@linkcode SubscriberBaseClass}.
 *
 * @template T - The type of the stream to subscribe to.
 * @template R - The result type of the operator, defaults to `T`.
 */
export type SubscriberBase<T, R = T> = SubscriberBaseClass<T, R>;
