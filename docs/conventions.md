# File Conventions

## File Types

### `.jsx` / `.tsx`
* **Compiles to**: Either a `render()` function (for pages) or a Web Component (for components).
* **Page Convention**: Files named `page.jsx` or `page.tsx` act as route entry points. Their default export is transformed into a `render(root)` function.
* **Component Convention**: Any other `.jsx` or `.tsx` file is automatically transformed into a reusable Web Component (Custom Element).

### Reusable UI Components
* **Auto-Registration**: Any PascalCase function (e.g., `function Button()`) that is not the default export of a page file is automatically registered as a Web Component.
* **Naming**: Registered with the `waf-` prefix (e.g., `LoginForm.jsx` -> `<waf-loginform>`).
* **Usage**: Can be imported and used as standard HTML tags in any JSX file.

---

## Reactivity & Global Macros

WAF provides global "macros" for reactivity that do not require imports. The compiler automatically transforms these and injects the necessary imports:

*   **`$state(initialValue)`**: Creates a reactive signal. Use `.value` to read or write.
*   **`$effect(() => { ... })`**: Automatically tracks any signals accessed inside and re-runs when they change.
*   **`$derived(() => expression)`**: Creates a memoized reactive value based on other signals.

### Reactive Props (Destructuring)
WAF supports standard React-style destructuring in component parameters. The compiler automatically ensures these stay reactive by transforming them into property accesses on the internal proxy.

```jsx
// This works reactively!
export default function Greet({ name }) {
  return <h1>Hello {name}</h1>;
}
```

---

## Lifecycle Hooks

Components support global lifecycle hooks that do not require imports:

*   **`onMount(() => { ... })`**: Runs when the component is added to the DOM.
*   **`onCleanup(() => { ... })`**: Runs when the component is removed from the DOM.

These hooks can be used anywhere, including inside your own custom utility functions or "hooks."

---

## Styling

WAF supports multiple styling approaches:
1.  **Global CSS**: Standard `.css` files imported in `index.html`.
2.  **CSS Modules**: Files named `*.module.css` provide class name isolation.
3.  **Inline Styles**: Supports React-style style objects: `style={{ display: 'flex', color: color.value }}`.

---

## Rules
*   All `.jsx` files MUST export a default function.
*   Components MUST follow PascalCase naming (e.g., `UserProfile`).
*   **File-based Routing**: Only files named `page.jsx` or `page.tsx` can be targeted by the router.
*   **No Manual Imports**: You do NOT need to import `signal`, `effect`, `onMount`, etc. from the framework; the compiler handles this automatically.
