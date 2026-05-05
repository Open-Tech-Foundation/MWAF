# Web App Framework (Fullstack) Specification

## 1. Philosophy
WAF is a **native-first, fullstack** framework for building modern web applications.
- **Fullstack**: Integrated routing and Static Site Generation (SSG) for high-performance delivery.
- **Zero-VDOM**: No virtual DOM diffing. JSX is compiled directly to imperative DOM operations.
- **Native-first**: UI components are standard Custom Elements (`HTMLElement`).
- **Signal-based**: Fine-grained reactivity powered by `@preact/signals-core`.

---

## 2. Component Model

### 2.1 Component Functions
- **Trigger**: A function is treated as a component **only if it contains JSX**.
- **Transformation**: Functions containing JSX (and following PascalCase naming for UI components) are compiled into a subclass of `HTMLElement` (Custom Element).
- **Pure JS**: Functions without JSX remain standard JavaScript functions.

### 2.2 Page Render Functions
- Defined as the `export default` function in a routing file: **specifically** `page.jsx`, `layout.jsx`, or `404.jsx`.
- **Transformation**: Compiled into a named `render(root, props)` function.
- **Usage**: Used as the entry point for a route by the framework's router.

### 2.3 Internal State Properties
The following properties are defined on every component instance in the `constructor`. They are defined using `Object.defineProperty` with `enumerable: false` to ensure they remain hidden from iteration (e.g., `Object.keys`), serialization (e.g., `JSON.stringify`), and to maintain a clean "native-like" appearance in developer tools.
- `_propsSignals`: A dictionary object used as the reactive backing store for component props.
    - **Purpose**: Stores the actual `signal` objects for each prop/attribute to enable fine-grained reactivity.
    - **Initialization**: Defined in the `constructor` as a non-enumerable property.
    - **Behavior**: Signals are lazily created upon first access. It is updated by `attributeChangedCallback` and property setters.
    - **Rationale**: Acts as a unified reactive bridge between DOM attributes and JS properties. Storing the signals ensures reference stability (the same `props.foo` access always returns the same signal) and enables fine-grained updates without re-rendering the entire component.
- `_onMounts`: An array of functions to run on `connectedCallback`.
- `_onCleanups`: An array of functions to run on `disconnectedCallback`.
- `_children`: An array storing the original `childNodes` passed to the component (for slot-like behavior).
- `_mounted`: A boolean flag tracking the component's connection status.
    - **Purpose**: Prevents the component's initialization logic (in `connectedCallback`) from running more than once.
    - **Rationale**: In the Web Component lifecycle, `connectedCallback` can fire multiple times (e.g., when moving an element). The `_mounted` flag ensures that state and DOM setup are preserved and not duplicated during reconnections.

---

## 3. Reactivity & Macros

### 3.1 Signals
WAF uses `@preact/signals-core`. The compiler automatically manages `.value` access.

### 3.2 Compiler Macros
Macros are special function calls that the compiler transforms:
- `$state(init)`: Transforms to `signal(init)`.
- `$derived(expression)`: Transforms into a Signal-based computed value.
    - **Auto-wrapping**: If a raw expression is passed (e.g., `$derived(a + b)`), the compiler automatically wraps it in an arrow function (`() => a + b`).
- `$effect(callback)`: Runs a side effect whenever its reactive dependencies change. Transforms to `effect(callback)`, wrapped in a `!isSSG` check to prevent execution during static generation.
- `$ref()`: Transforms to `signal(null)`. Used in JSX: `<div ref={myRef}>`.
- `$expose(obj)`: Transforms to `Object.assign(this, obj)`. Exposes internal state/methods to the component instance.

### 3.3 Auto-unwrapping (.value Injection)
The compiler injects `.value` access for variables identified as signals (`$state`, `$derived`, `$ref`) and for `props` access.
- **Rule**: If a variable `v` is a signal, `v` becomes `v.value` in expressions.
- **Exceptions**: `v` remains `v` when:
    - Passed to the `ref` attribute.
    - Used in an assignment (e.g., `v = 10` becomes `v.value = 10`).
    - Used in an update expression (e.g., `v++` becomes `v.value++`).
    - It is the `children` property of the `props` object (e.g., `props.children` remains `props.children`).
    - Accessed via `.value` manually (forbidden/throws error to enforce consistency).

#### Props vs. Attributes
The framework provides a unified interface for both DOM Attributes and JS Properties:
- **Attributes**: String-based values defined in HTML. Synced via `observedAttributes` and `attributeChangedCallback`.
- **Properties (Props)**: Rich data types (Objects, Arrays, Functions) passed via JS assignment.
- **Setters**: The compiler generates JS setters for each prop to sync property assignments directly to the internal signals, bypassing the string-only limitation of DOM attributes.
- **Unification**: Both update the same signal in `_propsSignals`, allowing the component logic to remain agnostic of the data source.

---

## 4. Component Transformation

This section shows how the compiler progressively builds the Web Component class based on the features used in the JSX function.

### 4.1 Level 1: Static Component
**Input**:
```jsx
export function Static() {
  return <div>Hello</div>;
}
```
**Output**:
```javascript
// Helper for non-enumerable properties
function defineInternalProp(target, key, value) {
  Object.defineProperty(target, key, {
    value,
    enumerable: false,
    writable: true,
    configurable: true
  });
}

class StaticElement extends HTMLElement {
  constructor() {
    super();
    defineInternalProp(this, "_mounted", false);
  }

  connectedCallback() {
    if (this._mounted) return;
    this._mounted = true;
    
    const el0 = document.createElement("div");
    el0.appendChild(document.createTextNode("Hello"));
    this.appendChild(el0);
  }
}
customElements.define("web-static", StaticElement);
```

### 4.2 Level 2: Component with Props
**Input**:
```jsx
export function Greet({ name }) {
  return <div>Hello {name}</div>;
}
```
**Output**:
```javascript
class GreetElement extends HTMLElement {
  static observedAttributes = ["name"];

  constructor() {
    super();
    defineInternalProp(this, "_propsSignals", { name: signal(null) });
    defineInternalProp(this, "_mounted", false);
  }

  attributeChangedCallback(name, old, val) {
    if (this._propsSignals[name]) this._propsSignals[name].value = val;
  }

  connectedCallback() {
    if (this._mounted) return;
    this._mounted = true;

    const _waf_props = createPropsProxy(this);
    const { name } = _waf_props;

    const el0 = document.createElement("div");
    el0.appendChild(document.createTextNode("Hello "));
    
    const text0 = document.createTextNode("");
    _effect(() => text0.textContent = name.value);
    el0.appendChild(text0);
    
    this.appendChild(el0);
  }
}
customElements.define("web-greet", GreetElement);
```

### 4.3 Level 3: Component with State and Events
**Input**:
```jsx
export function Counter() {
  let count = $state(0);
  return <button onclick={() => count++}>{count}</button>;
}
```
**Output**:
```javascript
class CounterElement extends HTMLElement {
  constructor() {
    super();
    defineInternalProp(this, "_mounted", false);
  }

  connectedCallback() {
    if (this._mounted) return;
    this._mounted = true;

    let count = signal(0);

    const el0 = document.createElement("button");
    el0.onclick = () => count.value++;
    
    const text0 = document.createTextNode("");
    _effect(() => text0.textContent = count.value);
    el0.appendChild(text0);

    this.appendChild(el0);
  }
}
customElements.define("web-counter", CounterElement);
```

### 4.4 Prop Update Vectors
Component props can be updated from the outside via several vectors, all of which are synchronized to the internal signal:
1.  **Attribute Change**: `el.setAttribute('key', 'val')` triggers `attributeChangedCallback`.
2.  **Property Assignment**: `el.key = 'val'` triggers a generated setter on the class.
3.  **Parent Reactivity**: JSX assignments like `<Comp key={sig} />` are wrapped in an `effect` that calls `setProperty`.
4.  **DevTools**: Manual edits to attributes in the browser inspector are treated as attribute changes.

This section defines how various JSX patterns are transformed into imperative DOM operations by the compiler.

### 5.1 Static Elements
**JSX**: `<div>Hello</div>`
**Output**:
```javascript
const el0 = document.createElement("div");
el0.appendChild(document.createTextNode("Hello"));
```

### 5.2 Static Attributes
**JSX**: `<div class="container" id="main"></div>`
**Output**:
```javascript
const el0 = document.createElement("div");
el0.setAttribute("class", "container");
el0.setAttribute("id", "main");
```

### 5.3 Dynamic Attributes
**JSX**: `<div className={isActive ? "active" : ""} disabled={true}></div>`
**Output**:
```javascript
const el0 = document.createElement("div");
// Dynamic expression: Wrapped in effect
_effect(() => _setProperty(el0, "className", isActive ? "active" : ""));
// Static literal: Set once
el0.setAttribute("disabled", "");
```
> [!NOTE]
> The compiler distinguishes between **literals** (strings, numbers, booleans) and **expressions**. Literals are applied once as static attributes, while expressions are wrapped in `_effect` for reactivity.

### 5.4 Event Handlers
**JSX**: `<button onclick={handleClick}></button>`
**Output**:
```javascript
const el0 = document.createElement("button");
el0.onclick = handleClick;
```

### 5.5 Nested Elements
**JSX**: `<div><span>Text</span></div>`
**Output**:
```javascript
const el0 = document.createElement("div");
const el1 = document.createElement("span");
el1.appendChild(document.createTextNode("Text"));
el0.appendChild(el1);
```

### 5.6 Fragments
**JSX**: `<><span>A</span><span>B</span></>`
**Output**:
```javascript
const frag0 = document.createDocumentFragment();
const el0 = document.createElement("span");
el0.appendChild(document.createTextNode("A"));
frag0.appendChild(el0);
const el1 = document.createElement("span");
el1.appendChild(document.createTextNode("B"));
frag0.appendChild(el1);
```

### 5.7 Dynamic Content (Conditionals)
**JSX**: `<div>{show && <p>Visible</p>}</div>`
**Output**:
```javascript
const el0 = document.createElement("div");
_renderDynamic(el0, () => show && (() => {
  const el1 = document.createElement("p");
  el1.appendChild(document.createTextNode("Visible"));
  return el1;
})());
```

### 5.8 List Rendering
**JSX**: `<ul>{items.map(item => <li key={item.id}>{item.name}</li>)}</ul>`
**Output**:
```javascript
const el0 = document.createElement("ul");
el0.appendChild(_mapped(() => items, (item, index) => {
  const el1 = document.createElement("li");
  _effect(() => el1.textContent = item.value.name);
  return el1;
})());
```

### 5.9 Component Usage
**JSX**: `<MyComponent title={myTitle} />`
**Output**:
```javascript
const el0 = document.createElement("web-mycomponent");
_effect(() => _setProperty(el0, "title", myTitle));
```

### 5.10 Ref Attribute
**JSX**: `<div ref={myRef}></div>`
**Output**:
```javascript
const el0 = document.createElement("div");
myRef.value = el0; // Ref signal updated directly
```

### 5.11 Spread Attributes
**JSX**: `<div {...props}></div>`
**Output**:
```javascript
const el0 = document.createElement("div");
_effect(() => _applySpread(el0, props));
```

### 5.12 SVG Elements
**JSX**: `<svg><circle cx="50" /></svg>`
**Output**:
```javascript
const el0 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
const el1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
el1.setAttribute("cx", "50");
el0.appendChild(el1);
```

---

## 6. Runtime Helpers (Implementation Details)

### 5.1 `createPropsProxy(el)`
Creates a Proxy to manage component props.
- **GET**: 
    - `children`: Returns `el._children`.
    - `key`: If a signal exists in `el._propsSignals[key]`, returns the signal.
    - If no signal exists, creates one lazily from the attribute or property.
- **SET**:
    - If `value` is a signal, it subscribes to it and updates the internal `_propsSignals[key]`.
    - If `value` is a primitive, it updates the internal signal's value.
- **ownKeys**: Returns the union of defined props and observed attributes.

### 5.2 `setProperty(el, key, value)`
A robust helper for setting DOM properties/attributes.
- **Reactivity**: If `value` is a signal, it uses `value.value`.
- **Special Cases**:
    - `style`: Uses `Object.assign(el.style, value)`.
    - Events (`on*`): Sets the property (e.g., `el.onclick = value`).
    - Boolean attributes: Removes attribute if `false`, `null`, or `undefined`.
- **Sync**: If `el` is a WAF component, it updates `el._propsSignals[key]` to ensure internal reactivity.

### 5.3 `renderDynamic(parent, fn)`
Handles conditional and dynamic JSX rendering via an effect-based reconciliation strategy.
- **Anchor Node**: Creates a "bookmark" (empty TextNode) in the `parent` to track the insertion point.
- **Effect-based Tracking**: Runs `fn` inside an `effect`. Whenever any signals accessed in `fn` change, the reconciliation logic is triggered.
- **Reconciliation**:
    - If `fn` returns a DOM node: It is inserted/moved before the anchor.
    - If `fn` returns `null/false/undefined`: Any previously rendered dynamic content is removed.
    - If `fn` returns a primitive (string/number): It is converted to a TextNode and rendered.

### 5.4 `_mapped(sourceFn, mapFn)`
Optimized list rendering (Keyed).
- `sourceFn`: Returns the array of data.
- `mapFn`: The function to render each item.
- **Mechanism**:
    - Uses a `cache` (Map) to store rendered nodes by key (or index).
    - Each item is wrapped in a signal, so updates to an item's data don't re-run the `mapFn`.
    - Performs minimal DOM movements when the array order changes.

### 5.5 `withInstance(inst, fn)`
A scoping helper used during component initialization.
- Sets a global `currentInstance` variable to `inst`.
- Executes `fn()`.
- Resets `currentInstance` to its previous value in a `finally` block.
- This allows `onMount` and `onCleanup` to correctly identify the active component instance during its synchronous setup.

---

## 6. Lifecycle & Environment

### 6.1 Lifecycle Hooks
- `onMount(cb)`: Associates `cb` with the current component instance. Executed once in `connectedCallback`.
- `onCleanup(cb)`: Associates `cb` with the current component instance. Executed once in `disconnectedCallback`.
- **Mechanism**: These hooks rely on `getCurrentInstance()` (set via `withInstance`) to find the active component.

### 6.2 Environment
- `isSSG`: A boolean flag. When `true`, `$effect` macros are ignored, and certain DOM operations (like `_clearChildren`) are skipped to allow for hydration-friendly output.

---

## 7. Fullstack Routing

WAF uses a file-based router that supports layouts, dynamic segments, and client-side guards.

### 7.1 Directory Structure
- `app/`: The root of the routing system.
- `page.jsx`: Defines a route.
- `layout.jsx`: Defines a persistent wrapper for all routes in its directory and subdirectories.
- `404.jsx`: A global fallback page displayed when no other route matches the current pathname.

### 7.2 Dynamic Segments
- **Static**: `app/about/page.jsx` -> `/about`
- **Dynamic**: `app/posts/[id]/page.jsx` -> `/posts/:id`
- **Catch-all**: `app/docs/[...slug]/page.jsx` -> `/docs/*`

### 7.3 Layout Nesting
Layouts are recursively applied from the root `app/` directory down to the leaf `page.jsx`.
- Each layout receives a `children` prop containing the nested content (page or sub-layout).

---

## 8. Static Site Generation (SSG)

WAF is designed for high-performance static rendering, allowing the entire app to be pre-rendered into HTML at build time.

### 8.1 Build-time Rendering
The framework uses `linkedom` to provide a lightweight server-side DOM environment.
- **Shredding**: During SSG, the framework instantiates Web Components in the server DOM and manually triggers their `connectedCallback` to populate the HTML.
- **Data Reflection**: Properties set on components during SSG are reflected as attributes in the final HTML to ensure consistency.

### 8.2 Hydration
- **data-ssg="true"**: The root element is marked with this attribute if it was pre-rendered.
- **Client-side Pickup**: On the client, the framework detects `data-ssg` and skips initial rendering of static content, only initializing the reactive logic.

### 8.3 Macro Behavior in SSG
- `$effect()` macros are **never** executed during SSG. This prevents client-only logic (like `fetch` or `localStorage`) from breaking the build.


---
