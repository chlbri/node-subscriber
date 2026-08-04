# @bemedev/subscriber

A feature-rich, lifecycle-aware subscription manager supporting RxJS /
`Subscribable` interoperability, custom equality comparators, state
control, and explicit resource disposal (`Disposable`).

<br/>

## Features

- ⚡ **RxJS / Observable Integration**: Subscribe seamlessly to any
  `Subscribable` source (RxJS Observables, Subjects, BehaviorSubjects, or
  custom emitters).
- 🔍 **Custom Equality Comparators**: Prevent redundant subscriber
  notifications by comparing previous and current values using custom
  comparator functions or strict equality (`normalEquals`).
- ⏸ **Lifecycle Control**: Granular state management across lifecycle
  states (`idle`, `active`, `paused`, `inactive`, `disposed`) using
  `open()`, `close()`, `unsubscribe()`, and `dispose()`.
- 🔁 **Instance Renewal**: Effortlessly re-create active subscriber
  instances with `.renew`.
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

// Create a subscriber node
const subscriber = createSubscriber<number>(val => {
  console.log(`Received value: ${val}`);
});

// Subscribe to the source
subscriber.subscribe(source$);

// Emit values from source
source$.next(1); // Logs: "Received value: 1"
source$.next(1); // Skipped due to equality check (default normalEquals)
source$.next(2); // Logs: "Received value: 2"
```

### Custom Equality Comparator

```ts
import { createSubscriber } from '@bemedev/subscriber';
import { Subject } from 'rxjs';

type User = { id: string; name: string };
const source$ = new Subject<User>();

// Ignore notifications if user ID hasn't changed
const subscriber = createSubscriber<User>(
  user => console.log(`User updated: ${user.name}`),
  (prev, curr) => prev?.id === curr?.id,
);

subscriber.subscribe(source$);

source$.next({ id: '1', name: 'Alice' }); // Logs: "User updated: Alice"
source$.next({ id: '1', name: 'Alice Smith' }); // Skipped (same ID)
```

### Lifecycle Control

```ts
import { createSubscriber } from '@bemedev/subscriber';

const subscriber = createSubscriber<number>(val => console.log(val));
subscriber.subscribe(source$);

// Pause notifications
subscriber.close(); // state becomes 'paused'

// Resume notifications
subscriber.open(); // state becomes 'active'

// Deactivate subscriber
subscriber.unsubscribe(); // state becomes 'inactive'

// Permanently dispose subscriber resources
subscriber.dispose(); // state becomes 'disposed'
```

### Explicit Resource Management (`using`)

```ts
import { createSubscriber } from '@bemedev/subscriber';

function run() {
  using subscriber = createSubscriber<number>(val => console.log(val));
  subscriber.subscribe(source$);
  // subscriber automatically disposes when scope exits via Symbol.dispose
}
```

<br/>

## API Reference

### `createSubscriber(subscriber, equals?)`

Factory function to create a new `SubscriberClass` instance.

- **`subscriber`**: `Subscriber_F<T>` — Callback invoked when new values
  pass equality check.
- **`equals`**: `Equals_F<T>` _(optional)_ — Custom equality comparator.
  Defaults to `normalEquals` (`a === b`).

### `SubscriberClass<T>`

Main class representing subscriber node.

| Method / Property         | Type / Return                     | Description                                                                          |
| ------------------------- | --------------------------------- | ------------------------------------------------------------------------------------ |
| `state`                   | `SubscriberState`                 | Returns current state (`'idle'`, `'active'`, `'paused'`, `'inactive'`, `'disposed'`) |
| `equals`                  | `Equals_F<T>`                     | Returns equality comparator function                                                 |
| `isNotInactive`           | `boolean`                         | `true` if state is neither `'disposed'` nor `'inactive'`                             |
| `subscribe(subscribable)` | `Unsubscribable`                  | Subscribes to a `Subscribable` source                                                |
| `close()`                 | `SubscriberState`                 | Pauses subscriber notifications (`'paused'`)                                         |
| `open()`                  | `SubscriberState`                 | Resumes subscriber notifications (`'active'`)                                        |
| `unsubscribe()`           | `SubscriberState`                 | Unsubscribes subscriber (`'inactive'`)                                               |
| `dispose()`               | `SubscriberState`                 | Clean up subscriber references and set state to `'disposed'`                         |
| `renew`                   | `SubscriberClass<T> \| undefined` | Spawns a new active subscriber instance                                              |
| `[Symbol.dispose]()`      | `SubscriberState`                 | Standard synchronous disposal                                                        |
| `[Symbol.asyncDispose]()` | `Promise<SubscriberState>`        | Standard asynchronous disposal                                                       |

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

- [Documentation](https://github.com/chlbri/node-subscriber)
