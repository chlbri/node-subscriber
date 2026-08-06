import {
  createManagedSubcriber,
  createSubscriber,
  defaultSelector,
  normalEquals,
  type CreateManagedSubscriber_F,
  type CreateSubscriber_F,
  type ManagedSubscriber,
  type Subscriber,
  type SubscriberBuilder,
} from '@bemedev/subscriber';

import {
  SubscriberBaseClass,
  type SubscriberBase,
} from '@bemedev/subscriber/base';

import {
  defaultSelector as defaultSelectorHelpers,
  normalEquals as normalEqualsHelpers,
} from '@bemedev/subscriber/helpers';

import {
  createManagedSubscriber as createManagedSubcriberManaged,
  createSubscriber as createSubscriberManaged,
  type CreateManagedSubscriber_F as CreateManagedSubscriber_F_Managed,
  type CreateSubscriber_F as CreateSubscriber_F_Managed_Alias,
  type ManagedSubscriber as ManagedSusbcriberManaged,
} from '@bemedev/subscriber/managed';

import {
  createSubscriber as createSubscriberSub,
  type CreateSubscriber_F as CreateSubscriber_F_Sub,
  type Subscriber as SubscriberSub,
  type SubscriberBuilder as SubscriberBuilderSub,
} from '@bemedev/subscriber/subscriber';

import type {
  CompletionObserver,
  Equals_F,
  ErrorObserver,
  Fn,
  NextObserver,
  Observer,
  PartialObserver,
  Selector_F,
  Subscribable,
  Subscriber_F,
  SubscriberState,
  SusbscriberOptions,
  Unsubscribable,
} from '@bemedev/subscriber/types';

import { describe, expectTypeOf, test } from 'vitest';

describe('TESTS', () => {
  describe('#01 => Root exports (@bemedev/subscriber)', () => {
    test('#01 => CreateSubscriber_F', () => {
      expectTypeOf<CreateSubscriber_F>().toEqualTypeOf<
        <T>(subscribable: Subscribable<T>) => SubscriberBuilder<T, T>
      >();
    });

    test('#02 => ManagedSusbcriber', () => {
      expectTypeOf<ManagedSubscriber<number>>().toEqualTypeOf<
        ManagedSusbcriberManaged<number>
      >();
    });

    test('#03 => CreateManagedSubscriber_F', () => {
      expectTypeOf<CreateManagedSubscriber_F>().toEqualTypeOf<
        <T, R = T>(
          subscriber: Subscriber_F<T>,
          options?: SusbscriberOptions<T, R>,
        ) => ManagedSubscriber<T, R>
      >();
    });

    test('#04 => Subscriber', () => {
      expectTypeOf<Subscriber<number>>().toEqualTypeOf<
        SubscriberSub<number>
      >();
    });

    test('#05 => SubscriberBuilder', () => {
      expectTypeOf<SubscriberBuilder<number>>().toEqualTypeOf<
        SubscriberBuilderSub<number>
      >();
    });

    test('#06 => createSubscriber', () => {
      expectTypeOf(createSubscriber).toEqualTypeOf<CreateSubscriber_F>();
    });

    test('#07 => createManagedSubcriber', () => {
      expectTypeOf(
        createManagedSubcriber,
      ).toEqualTypeOf<CreateManagedSubscriber_F>();
    });

    test('#08 => defaultSelector', () => {
      expectTypeOf(defaultSelector).toEqualTypeOf<<T, R = T>(a: T) => R>();
    });

    test('#09 => normalEquals', () => {
      expectTypeOf(normalEquals).toEqualTypeOf<
        <T>(a: T, b: T) => boolean
      >();
    });
  });

  describe('#02 => Types exports (@bemedev/subscriber/types)', () => {
    test('#01 => NextObserver', () => {
      expectTypeOf<NextObserver<number>>().toEqualTypeOf<{
        closed?: boolean;
        next: (value: number) => void;
        error?: (err: any) => void;
        complete?: () => void;
      }>();
    });

    test('#02 => ErrorObserver', () => {
      expectTypeOf<ErrorObserver<number>>().toEqualTypeOf<{
        closed?: boolean;
        next?: (value: number) => void;
        error: (err: any) => void;
        complete?: () => void;
      }>();
    });

    test('#03 => CompletionObserver', () => {
      expectTypeOf<CompletionObserver<number>>().toEqualTypeOf<{
        closed?: boolean;
        next?: (value: number) => void;
        error?: (err: any) => void;
        complete: () => void;
      }>();
    });

    test('#04 => PartialObserver', () => {
      expectTypeOf<PartialObserver<number>>().toEqualTypeOf<
        | NextObserver<number>
        | ErrorObserver<number>
        | CompletionObserver<number>
      >();
    });

    test('#05 => Unsubscribable', () => {
      expectTypeOf<Unsubscribable>().toEqualTypeOf<{
        unsubscribe: () => void;
      }>();
    });

    test('#06 => Observer', () => {
      expectTypeOf<Observer<number>>().toEqualTypeOf<{
        next: (value: number) => void;
        error: (err: any) => void;
        complete: () => void;
      }>();
    });

    test('#07 => SubscriberState', () => {
      expectTypeOf<SubscriberState>().toEqualTypeOf<
        'paused' | 'active' | 'disposed' | 'inactive'
      >();
    });

    test('#08 => Subscriber_F', () => {
      expectTypeOf<Subscriber_F<number>>().toEqualTypeOf<
        (val: number) => void
      >();
    });

    test('#09 => Equals_F', () => {
      expectTypeOf<Equals_F<number>>().toEqualTypeOf<
        (a: number, b: number) => boolean
      >();
    });

    test('#10 => Selector_F', () => {
      expectTypeOf<Selector_F<number, string>>().toEqualTypeOf<
        (val: number) => string
      >();
    });

    test('#11 => Subscribable', () => {
      expectTypeOf<Subscribable<number>>().toEqualTypeOf<{
        subscribe: (
          observerOrNext?: PartialObserver<number> | Subscriber_F<number>,
        ) => Unsubscribable;
      }>();
    });

    test('#12 => SusbscriberOptions', () => {
      expectTypeOf<SusbscriberOptions<number>>().toEqualTypeOf<{
        selector?: Selector_F<number, number>;
        equals?: Equals_F<number>;
      }>();
    });

    test('#13 => Fn', () => {
      expectTypeOf<Fn<[number], string>>().toEqualTypeOf<
        (arg: number) => string
      >();
    });
  });

  describe('#03 => Helpers exports (@bemedev/subscriber/helpers)', () => {
    test('#01 => normalEquals', () => {
      expectTypeOf(normalEqualsHelpers).toEqualTypeOf<
        <T>(a: T, b: T) => boolean
      >();
    });

    test('#02 => defaultSelector', () => {
      expectTypeOf(defaultSelectorHelpers).toEqualTypeOf<
        <T, R = T>(a: T) => R
      >();
    });
  });

  describe('#04 => Subscriber exports (@bemedev/subscriber/subscriber)', () => {
    test('#01 => Subscriber', () => {
      expectTypeOf<SubscriberSub<number>>().toEqualTypeOf<
        Subscriber<number>
      >();
    });

    test('#02 => SubscriberBuilder', () => {
      expectTypeOf<SubscriberBuilderSub<number>>().toEqualTypeOf<
        SubscriberBuilder<number>
      >();
    });

    test('#03 => CreateSubscriber_F', () => {
      expectTypeOf<CreateSubscriber_F_Sub>().toEqualTypeOf<CreateSubscriber_F>();
    });

    test('#04 => createSubscriber', () => {
      expectTypeOf(
        createSubscriberSub,
      ).toEqualTypeOf<CreateSubscriber_F>();
    });
  });

  describe('#05 => Base exports (@bemedev/subscriber/base)', () => {
    test('#01 => SubscriberBaseClass', () => {
      expectTypeOf<SubscriberBaseClass<number>>().toEqualTypeOf<
        SubscriberBase<number>
      >();
    });

    test('#02 => SubscriberBase', () => {
      expectTypeOf<SubscriberBase<number>>().toEqualTypeOf<
        SubscriberBaseClass<number, number>
      >();
    });
  });

  describe('#06 => Managed exports (@bemedev/subscriber/managed)', () => {
    test('#01 => ManagedSusbcriber', () => {
      expectTypeOf<ManagedSusbcriberManaged<number>>().toEqualTypeOf<
        ManagedSubscriber<number>
      >();
    });

    test('#02 => CreateManagedSubscriber_F', () => {
      expectTypeOf<CreateManagedSubscriber_F_Managed>().toEqualTypeOf<CreateManagedSubscriber_F>();
    });

    test('#03 => CreateSubscriber_F', () => {
      expectTypeOf<CreateSubscriber_F_Managed_Alias>().toEqualTypeOf<CreateManagedSubscriber_F>();
    });

    test('#04 => createManagedSubcriber', () => {
      expectTypeOf(
        createManagedSubcriberManaged,
      ).toEqualTypeOf<CreateManagedSubscriber_F>();
    });

    test('#05 => createSubscriber', () => {
      expectTypeOf(
        createSubscriberManaged,
      ).toEqualTypeOf<CreateManagedSubscriber_F>();
    });
  });
});
