# File Conventions

## File Types

### `.jsx` / `.tsx`
* **Compiles to**: Either a `render()` function (for pages) or a Web Component (for components).
* **Page Convention**: Files named `page.jsx` or `page.tsx` act as route entry points. Their default export is transformed into a `render(root)` function.
* **Component Convention**: Any other `.jsx` or `.tsx` file is automatically transformed into a reusable Web Component (Custom Element).

### Reusable UI Components
* **Auto-Registration**: Any PascalCase function (e.g., `function Button()`) that is not the default export of a page file is automatically registered as a Web Component.
* **Naming**: Registered with the `web-` prefix (e.g., `LoginForm.jsx` -> `<web-loginform>`).
* **Usage**: Can be imported and used as standard HTML tags in any JSX file.

---

## Reactivity & Global Macros

Web App Framework provides global "macros" for reactivity that do not require imports. The compiler automatically transforms these and injects the necessary imports:

*   **`$state(initialValue)`**: Creates a reactive signal. Use `.value` to read or write.
*   **`$effect(() => { ... })`**: Automatically tracks any signals accessed inside and re-runs when they change.
*   **`$derived(() => expression)`**: Creates a memoized reactive value based on other signals.

### Reactive Props (Destructuring)
Web App Framework supports standard React-style destructuring in component parameters. The compiler automatically ensures these stay reactive by transforming them into property accesses on the internal proxy.

### Conditional Rendering & Dynamic Children
Web App Framework supports all standard JS conditional patterns (ternaries, `&&`, etc.) inside JSX. 
* **Mechanism**: The compiler wraps dynamic expressions in a `renderDynamic` call.
* **Anchor**: A hidden Comment node is used as an anchor to swap DOM nodes without re-rendering the entire parent.
* **Nested JSX**: JSX tags inside conditions are automatically compiled to imperative IIFEs.

```jsx
// This works perfectly and reactively
{isPacked ? <del>{name}</del> : <span>{name}</span>}
```

---

## Lifecycle Hooks

Components support global lifecycle hooks that do not require imports:

*   **`onMount(() => { ... })`**: Runs when the component is added to the DOM.
*   **`onCleanup(() => { ... })`**: Runs when the component is removed from the DOM.

These hooks can be used anywhere, including inside your own custom utility functions or "hooks."

---

## Styling

Web App Framework supports multiple styling approaches:
1.  **Global CSS**: Standard `.css` files imported in `index.html`.
2.  **CSS Modules**: Files named `*.module.css` provide class name isolation.
3.  **Inline Styles**: Supports React-style style objects: `style={{ display: 'flex', color: color.value }}`.

---

## Rules
*   All `.jsx` files MUST export a default function.
*   Components MUST follow PascalCase naming (e.g., `UserProfile`).
*   **File-based Routing**: Only files named `page.jsx` or `page.tsx` can be targeted by the router.
*   **No Manual Imports**: You do NOT need to import `signal`, `effect`, `onMount`, etc. from the framework; the compiler handles this automatically.

---

## Navigation & Security

### `app/routeGuard.js` (Convention)
Web App Framework supports a centralized, async navigation protection layer. If a file named `app/routeGuard.js` exists, it is automatically discovered and activated.

*   **Async Support**: Can perform session checks or data pre-fetching.
*   **Signature**: `async function routeGuard(to, { next, redirect, replace })`
*   **Redirects**: Use `router.redirect(path)` to halt navigation and move to a new URL.

### Reactive Router API
The global `router` object is a reactive Proxy that automatically unwraps its internal signals.

*   **Direct Access**: Access `router.pathname` or `router.isGuarding` directly without `.value`.
*   **Reactivity**: Wrap accesses in an arrow function `{() => ...}` to ensure the UI updates when navigation occurs.
*   **Methods**: `router.push(path)` and `router.replace(path)` for imperative navigation.

---

## Forms Engine

Web App Framework includes a path-based reactive forms library in `libs/forms`.

*   **`validator`**: The primary prop for schema-based validation (e.g., Zod).
*   **`register(path)`**: Provides a two-way binding for form inputs.
*   **Reactive Errors**: Errors are tracked automatically and reactively based on the validator results.
