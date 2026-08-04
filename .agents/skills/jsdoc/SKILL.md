---
name: jsdoc
description:
  Enforce comprehensive JSDoc documentation standards across TypeScript
  files. Use when adding or refactoring JSDoc comments for methods,
  properties, classes, types, and functions.
---

# JSDoc Guidelines

Enforce complete, rich, and clean JSDoc documentation across TypeScript
source files.

## Rules

### 1. Complete Coverage

- Add JSDoc comments for **all** methods, getters, setters, functions, and
  constructors.
- Add JSDoc comments for **all** class variables and properties (including
  `private` and `protected`).

### 2. Access Modifiers & Naming

- Use TypeScript access modifiers (`private`, `protected`, `public`)
  instead of JavaScript hash `#` private field syntax.
- Maintain consistent property naming conventions (e.g. `__field`).

### 3. Rich `{@linkcode}` References & Categorization

- Use `{@linkcode SymbolName}` to reference class names, method names,
  property names, types, parameters, and return types inside JSDoc
  descriptions, `@param`, `@returns`, and `@see`.
- When referencing a top-level **type**, **interface**, or **class** with
  `{@linkcode ...}`:
  - Prefix with `-- type`, `-- class`, or `-- interface` before the
    `{@linkcode ...}` reference.
  - Example: type {@linkcode Error}
  - Example: class {@linkcode CommonScheduler}
  - Example: interface {@linkcode SchedulerConfig}
- **Property/Method Exception:** If the `{@linkcode ...}` reference points
  to a property or method of a class, interface, or type (e.g.
  `CommonScheduler.stop`), **do NOT prefix with `-- type`, `-- class`, or
  `-- interface`**.

### 4. `@see` Reference Deduplication

- **Do NOT list a token in `@see` if it is already mentioned in the JSDoc
  body description, `@param`, or `@returns`.**
- Only include tokens under `@see` if they provide useful context and are
  **NOT** referenced elsewhere in that same JSDoc block.
- Omit the `@see` tag entirely if all relevant symbols are already linked
  in the description or parameter/return tags.

### 5. `@see` Formatting Rules

- **Only one `@see` tag per JSDoc block.** Combine multiple references into
  a single `@see` tag line.
- Example: `@see -- type {@linkcode Error}`
- Example: `@see {@linkcode CommonScheduler.stop}` (no `-- class` prefix
  because `.stop` is a property/method).
- When referencing a top-level **type**, **interface**, or **class** with
  `{@linkcode ...}`:
  - Prefix with `-- type`, `-- class`, or `-- interface` before the
    `{@linkcode ...}` reference.
  - Example: -- type {@linkcode Error}
  - Example: -- class {@linkcode CommonScheduler}
  - Example: -- interface {@linkcode SchedulerConfig}

## 6. Others

Add also jsdoc to type definitions, even if they are alias

so this :

```ts
//before
//****
export type SubscriberBuilder<T, R = T> = SubscriberBuilderClass<T, R>;

//after
//****
/**
 * Type alias for -- class SubscriberBuilderClass<T, R>.
 *
 * @template {unknown} T - The type of the stream to subscribe to.
 * @template {unknown} R - The result type of the operator, defaults to T.
 */

export type SubscriberBuilder<T, R = T> = SubscriberBuilderClass<T, R>;
```
