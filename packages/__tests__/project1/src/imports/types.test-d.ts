import {
  createManagedSubcriber,
  createSubscriber,
  defaultSelector,
  normalEquals,
  type CreateManagedSubscriber_F,
  type CreateSubscriber_F,
  type ManagedSusbcriber,
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
  createManagedSubcriber as createManagedSubcriberManaged,
  createSubscriber as createSubscriberManaged,
  type CreateManagedSubscriber_F as CreateManagedSubscriber_F_Managed,
  type CreateSubscriber_F as CreateSubscriber_F_Managed_Alias,
  type ManagedSusbcriber as ManagedSusbcriberManaged,
  type Susbcriber as SusbcriberManaged,
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

describe('Root exports (@bemedev/subscriber)', () => {
  test('CreateSubscriber_F', () => {
    expectTypeOf<CreateSubscriber_F>().toEqualTypeOf<
      <T>(subscribable: Subscribable<T>) => SubscriberBuilder<T, T>
    >();
  });

  test('ManagedSusbcriber', () => {
    expectTypeOf<ManagedSusbcriber<number>>().toEqualTypeOf<
      ManagedSusbcriberManaged<number>
    >();
  });

  test('CreateManagedSubscriber_F', () => {
    expectTypeOf<CreateManagedSubscriber_F>().toEqualTypeOf<
      <T, R = T>(
        subscriber: Subscriber_F<T>,
        options?: SusbscriberOptions<T, R>,
      ) => ManagedSusbcriber<T, R>
    >();
  });

  test('Subscriber', () => {
    expectTypeOf<Subscriber<number>>().toEqualTypeOf<
      SubscriberSub<number>
    >();
  });

  test('SubscriberBuilder', () => {
    expectTypeOf<SubscriberBuilder<number>>().toEqualTypeOf<
      SubscriberBuilderSub<number>
    >();
  });

  test('createSubscriber', () => {
    expectTypeOf(createSubscriber).toEqualTypeOf<CreateSubscriber_F>();
  });

  test('createManagedSubcriber', () => {
    expectTypeOf(
      createManagedSubcriber,
    ).toEqualTypeOf<CreateManagedSubscriber_F>();
  });

  test('defaultSelector', () => {
    expectTypeOf(defaultSelector).toEqualTypeOf<<T, R = T>(a: T) => R>();
  });

  test('normalEquals', () => {
    expectTypeOf(normalEquals).toEqualTypeOf<<T>(a: T, b: T) => boolean>();
  });
});

describe('Types exports (@bemedev/subscriber/types)', () => {
  test('NextObserver', () => {
    expectTypeOf<NextObserver<number>>().toEqualTypeOf<{
      closed?: boolean;
      next: (value: number) => void;
      error?: (err: any) => void;
      complete?: () => void;
    }>();
  });

  test('ErrorObserver', () => {
    expectTypeOf<ErrorObserver<number>>().toEqualTypeOf<{
      closed?: boolean;
      next?: (value: number) => void;
      error: (err: any) => void;
      complete?: () => void;
    }>();
  });

  test('CompletionObserver', () => {
    expectTypeOf<CompletionObserver<number>>().toEqualTypeOf<{
      closed?: boolean;
      next?: (value: number) => void;
      error?: (err: any) => void;
      complete: () => void;
    }>();
  });

  test('PartialObserver', () => {
    expectTypeOf<PartialObserver<number>>().toEqualTypeOf<
      | NextObserver<number>
      | ErrorObserver<number>
      | CompletionObserver<number>
    >();
  });

  test('Unsubscribable', () => {
    expectTypeOf<Unsubscribable>().toEqualTypeOf<{
      unsubscribe: () => void;
    }>();
  });

  test('Observer', () => {
    expectTypeOf<Observer<number>>().toEqualTypeOf<{
      next: (value: number) => void;
      error: (err: any) => void;
      complete: () => void;
    }>();
  });

  test('SubscriberState', () => {
    expectTypeOf<SubscriberState>().toEqualTypeOf<
      'paused' | 'active' | 'disposed' | 'inactive'
    >();
  });

  test('Subscriber_F', () => {
    expectTypeOf<Subscriber_F<number>>().toEqualTypeOf<
      (val: number) => void
    >();
  });

  test('Equals_F', () => {
    expectTypeOf<Equals_F<number>>().toEqualTypeOf<
      (a: number, b: number) => boolean
    >();
  });

  test('Selector_F', () => {
    expectTypeOf<Selector_F<number, string>>().toEqualTypeOf<
      (val: number) => string
    >();
  });

  test('Subscribable', () => {
    expectTypeOf<Subscribable<number>>().toEqualTypeOf<{
      subscribe: (
        observerOrNext?: PartialObserver<number> | Subscriber_F<number>,
      ) => Unsubscribable;
    }>();
  });

  test('SusbscriberOptions', () => {
    expectTypeOf<SusbscriberOptions<number>>().toEqualTypeOf<{
      selector?: Selector_F<number, number>;
      equals?: Equals_F<number>;
    }>();
  });

  test('Fn', () => {
    expectTypeOf<Fn<[number], string>>().toEqualTypeOf<
      (arg: number) => string
    >();
  });
});

describe('Helpers exports (@bemedev/subscriber/helpers)', () => {
  test('normalEquals', () => {
    expectTypeOf(normalEqualsHelpers).toEqualTypeOf<
      <T>(a: T, b: T) => boolean
    >();
  });

  test('defaultSelector', () => {
    expectTypeOf(defaultSelectorHelpers).toEqualTypeOf<
      <T, R = T>(a: T) => R
    >();
  });
});

describe('Subscriber exports (@bemedev/subscriber/subscriber)', () => {
  test('Subscriber', () => {
    expectTypeOf<SubscriberSub<number>>().toEqualTypeOf<
      Subscriber<number>
    >();
  });

  test('SubscriberBuilder', () => {
    expectTypeOf<SubscriberBuilderSub<number>>().toEqualTypeOf<
      SubscriberBuilder<number>
    >();
  });

  test('CreateSubscriber_F', () => {
    expectTypeOf<CreateSubscriber_F_Sub>().toEqualTypeOf<CreateSubscriber_F>();
  });

  test('createSubscriber', () => {
    expectTypeOf(createSubscriberSub).toEqualTypeOf<CreateSubscriber_F>();
  });
});

describe('Base exports (@bemedev/subscriber/base)', () => {
  test('SubscriberBaseClass', () => {
    expectTypeOf<SubscriberBaseClass<number>>().toEqualTypeOf<
      SubscriberBase<number>
    >();
  });

  test('SubscriberBase', () => {
    expectTypeOf<SubscriberBase<number>>().toEqualTypeOf<
      SubscriberBaseClass<number, number>
    >();
  });
});

describe('Managed exports (@bemedev/subscriber/managed)', () => {
  test('ManagedSusbcriber', () => {
    expectTypeOf<ManagedSusbcriberManaged<number>>().toEqualTypeOf<
      ManagedSusbcriber<number>
    >();
  });

  test('Susbcriber', () => {
    expectTypeOf<SusbcriberManaged<number>>().toEqualTypeOf<
      ManagedSusbcriber<number>
    >();
  });

  test('CreateManagedSubscriber_F', () => {
    expectTypeOf<CreateManagedSubscriber_F_Managed>().toEqualTypeOf<CreateManagedSubscriber_F>();
  });

  test('CreateSubscriber_F', () => {
    expectTypeOf<CreateSubscriber_F_Managed_Alias>().toEqualTypeOf<CreateManagedSubscriber_F>();
  });

  test('createManagedSubcriber', () => {
    expectTypeOf(
      createManagedSubcriberManaged,
    ).toEqualTypeOf<CreateManagedSubscriber_F>();
  });

  test('createSubscriber', () => {
    expectTypeOf(
      createSubscriberManaged,
    ).toEqualTypeOf<CreateManagedSubscriber_F>();
  });
});
