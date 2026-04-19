# File Conventions

## File Types

### `.jsx` / `.tsx`
* **Compiles to**: Imperative DOM render function.
* **Used for**: Pages (entry points for routes).
* **Restrictions**: Cannot be used as JSX components; MUST export a default function.

### `.wc.jsx` / `.wc.tsx`
* **Compiles to**: Web Component (Custom Element).
* **Used for**: Reusable UI components.
* **Compatibility**: Can be imported and used as tags in both `.jsx` and `.wc.jsx` files.
* **Naming**: Will be automatically registered with the `waf-` prefix (e.g., `Button.wc.jsx` -> `<waf-button>`).

### `.js` / `.ts`
* **Used for**: Utilities, business logic, signals, and shared state.

## Rules
* All components MUST export a default function.
* Components MUST follow PascalCase naming (e.g., `Counter`).
* Tag usage of a `.jsx` file as a component is strictly forbidden and will throw a compiler error.
