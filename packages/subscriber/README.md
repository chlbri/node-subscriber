# @bemedev/subscriber

A feature-rich, lifecycle-aware subscription manager supporting RxJS /
`Subscribable` interoperability, fluent selector chaining, custom equality
comparators, state control, and explicit resource disposal (`Disposable`).

<br/>

## Features

- ⚡ **RxJS / Observable Integration**: Subscribe seamlessly to any
  `Subscribable` source (RxJS Observables, Subjects, BehaviorSubjects, or
  custom emitters).
- 🔗 **Fluent Builder & Selector Chaining**: Chain nested state selectors
  using `.select(selector)` to compute derived state and only react to
  specific sub-state changes.
- 🔍 **Custom Equality Comparators**: Prevent redundant subscriber
  notifications by comparing previous and current values using custom
  comparator functions or strict equality (`normalEquals`).
- ⏸ **Lifecycle Control**: Granular state management across lifecycle
  states (`active`, `paused`, `inactive`, `disposed`) using `open()`,
  `close()`, `unsubscribe()`, and `dispose()`.
- 🧹 **Explicit Resource Disposal**: Native support for
  JavaScript/TypeScript `Disposable` (`Symbol.dispose` and
  `Symbol.asyncDispose`) for use with `using` declarations.

<br/>

## Installation

```bash
npm install @bemedev/subscriber
# or
pnpm add @bemedev/subscriber
# or
yarn add @bemedev/subscriber
```

<br/>

## Usage

### Basic Usage with RxJS Subject

```ts
import { createSubscriber } from '@bemedev/subscriber';
import { Subject } from 'rxjs';

// Create a subject source
const source$ = new Subject<number>();

// Create a subscriber node from source
const subscriber = createSubscriber(source$).subscribe(val => {
  console.log(`Received value: ${val}`);
});

// Emit values from source
source$.next(1); // Logs: "Received value: 1"
source$.next(1); // Skipped due to equality check (default normalEquals)
source$.next(2); // Logs: "Received value: 2"
```

### Selector Chaining

```ts
import { createSubscriber } from '@bemedev/subscriber';
import { BehaviorSubject } from 'rxjs';

type State = { user: { name: string; age: number } };
const state$ = new BehaviorSubject<State>({
  user: { name: 'Alice', age: 30 },
});

// Chain selectors to transform emission values
const subscriber = createSubscriber(state$)
  .select(state => state.user)
  .select(user => user.name)
  .subscribe(name => console.log(`Name: ${name}`));

state$.next({ user: { name: 'Alice', age: 31 } }); // Skipped (selected name unchanged)
state$.next({ user: { name: 'Bob', age: 31 } }); // Logs: "Name: Bob"
```

### Custom Equality Comparator

```ts
import { createSubscriber } from '@bemedev/subscriber';
import { Subject } from 'rxjs';

type User = { id: string; name: string };
const source$ = new Subject<User>();

// Ignore notifications if user ID hasn't changed
const subscriber = createSubscriber(source$).subscribe(
  user => console.log(`User updated: ${user.name}`),
  (prev, curr) => prev?.id === curr?.id,
);

source$.next({ id: '1', name: 'Alice' }); // Logs: "User updated: Alice"
source$.next({ id: '1', name: 'Alice Smith' }); // Skipped (same ID)
```

### Lifecycle Control

```ts
import { createSubscriber } from '@bemedev/subscriber';

const subscriber = createSubscriber(source$).subscribe(val =>
  console.log(val),
);

// Pause notifications
subscriber.close(); // state becomes 'paused'

// Resume notifications
subscriber.open(); // state becomes 'active'

// Deactivate subscriber
subscriber.unsubscribe(); // state becomes 'inactive'

// Re-subscribe when inactive
subscriber.reSubscribe(); // state becomes 'active'

// Permanently dispose subscriber resources
subscriber.dispose(); // state becomes 'disposed'
```

### Explicit Resource Management (`using`)

```ts
import { createSubscriber } from '@bemedev/subscriber';

function run() {
  using subscriber = createSubscriber(source$).subscribe(val =>
    console.log(val),
  );
  // subscriber automatically disposes when scope exits via Symbol.dispose
}
```

<br/>

## API Reference

### `createSubscriber(subscribable)`

Factory function to create a new `SubscriberBuilderClass` instance attached
to a subscribable source.

- **`subscribable`**: `Subscribable<T>` — Source subscribable object.
- **Returns**: `SubscriberBuilderClass<T, T>`

### `defaultSelector(a)`

Identity selector function that returns the input value unchanged.

- **`a`**: `T` — Input value.
- **Returns**: `R` — Input value cast to output type `R`.

### `normalEquals(a, b)`

Strict equality (`===`) comparator function used as default equality
checker.

- **`a`**: `T` — First value to compare.
- **`b`**: `T` — Second value to compare.
- **Returns**: `boolean` — `true` if `a === b`, otherwise `false`.

### `SubscriberBuilderClass<T, R>`

Builder class used to chain selector transformations and create active
subscribers.

| Method / Property                | Type / Return                      | Description                                                                            |
| -------------------------------- | ---------------------------------- | -------------------------------------------------------------------------------------- |
| `subscribable`                   | `Subscribable<T>`                  | Returns attached source subscribable object                                            |
| `select(selector)`               | `SubscriberBuilderClass<T, RNext>` | Creates a new subscriber builder with a nested selector transformer                    |
| `subscribe(subscriber, equals?)` | `Subscriber<T, R>`                 | Subscribes callback to state updates with optional equality comparator and starts node |

### `Subscriber<T, R>`

Main class representing an active subscriber node.

| Method / Property         | Type / Return                   | Description                                                                |
| ------------------------- | ------------------------------- | -------------------------------------------------------------------------- |
| `state`                   | `SubscriberState`               | Returns current state (`'active'`, `'paused'`, `'inactive'`, `'disposed'`) |
| `equals`                  | `Equals_F<R>`                   | Returns equality comparator function                                       |
| `selector`                | `Selector_F<T, R> \| undefined` | Returns selector function or `undefined`                                   |
| `subscribable`            | `Subscribable<T> \| undefined`  | Returns source subscribable object or `undefined` if disposed              |
| `isNotInactive`           | `boolean`                       | `true` if state is neither `'disposed'` nor `'inactive'`                   |
| `close()`                 | `SubscriberState`               | Pauses subscriber notifications (`'paused'`)                               |
| `open()`                  | `SubscriberState`               | Resumes subscriber notifications (`'active'`)                              |
| `unsubscribe()`           | `SubscriberState`               | Unsubscribes subscriber (`'inactive'`)                                     |
| `reSubscribe()`           | `SubscriberState`               | Re-subscribes to source subscribable if inactive (`'active'`)              |
| `dispose()`               | `SubscriberState`               | Cleans up subscriber references and sets state to `'disposed'`             |
| `[Symbol.dispose]()`      | `SubscriberState`               | Standard synchronous disposal                                              |
| `[Symbol.asyncDispose]()` | `Promise<SubscriberState>`      | Standard asynchronous disposal                                             |

<br/>

## License

MIT

<br/>

## CHANGELOG

Read [CHANGELOG.md](CHANGELOG.md) for more details about the changes.

<br/>

## Author

chlbri (bri_lvi@icloud.com)

[My GitHub](https://github.com/chlbri?tab=repositories)

[<svg width="98" height="96" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" fill="#24292f"/></svg>](https://github.com/chlbri?tab=repositories)

<br/>

## Links

- [Documentation](https://github.com/chlbri/node-subscriber/tree/main/packages/subscriber)
