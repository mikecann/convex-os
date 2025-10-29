# Local ESLint Plugin

This directory contains custom ESLint rules specific to this project.

## Rules

### `no-hoisted-single-use-handlers`

**Type:** Suggestion  
**Level:** Warning

Discourages hoisting event handlers that are only used once in JSX. Instead, prefer inlining them directly where they're used.

#### ❌ Incorrect

```tsx
export function MyComponent() {
  const handleClick = () => {
    console.log("clicked");
  };

  return <button onClick={handleClick}>Click me</button>;
}
```

#### ✅ Correct

```tsx
export function MyComponent() {
  return <button onClick={() => console.log("clicked")}>Click me</button>;
}
```

#### Exception

If a handler is used multiple times, hoisting is appropriate:

```tsx
export function MyComponent() {
  const handleClick = () => {
    console.log("clicked");
  };

  return (
    <div>
      <button onClick={handleClick}>First</button>
      <button onClick={handleClick}>Second</button>
    </div>
  );
}
```

This won't trigger the warning because the handler is reused.

## Project Structure

```
eslint-plugin-local/
├── index.js                                    # Plugin entry point
├── lib/
│   └── rules/
│       └── no-hoisted-single-use-handlers.js  # Rule implementation
└── README.md                                   # This file
```
