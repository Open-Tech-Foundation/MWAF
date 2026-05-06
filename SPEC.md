# Web App Framework (Fullstack) Specification

## 1. Philosophy
WAF is a **native-first, fullstack** framework for building modern web applications.
- **Fullstack**: Integrated routing and Static Site Generation (SSG) for high-performance delivery.
- **Zero-VDOM**: No virtual DOM diffing. JSX is compiled directly to imperative DOM operations.
- **Native-first**: UI components are standard Custom Elements (`HTMLElement`).
- **Signal-based**: Fine-grained reactivity powered by `@preact/signals-core`.

### 1.1 Single Source of Reactivity
To prevent reactivity loss caused by multiple instances of the reactivity engine (e.g., version mismatches or duplicate bundling), WAF enforces a **Single Source of Truth**:
- **Central Export**: All reactive primitives (`signal`, `computed`, `effect`) MUST be imported from `@opentf/web` (which re-exports from `core/signals.js`).
- **Global Guard**: The runtime includes a global guard that warns if multiple instances of the signals library are loaded.
- **Strict Checks**: Internal runtime helpers (`createPropsProxy`, `setProperty`) use strict identity checks (`instanceof Signal`) and a framework-defined `brand` (`Symbol.for("preact-signals")`) to validate reactive objects.

### 1.2 TypeScript & JSX Configuration
WAF uses a custom JSX compilation pipeline. To use TypeScript or language server features, configure your `tsconfig.json` or `jsconfig.json` as follows:
```json
{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "@opentf/web",
    "jsxFactory": "h",
    "jsxFragmentFactory": "f"
  }
}
```

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
    - **Initialization**: Signals are lazily created during the first property access via `createPropsProxy`.
    - **Initial Value Chain**: The framework resolves values in this order: `Property Value` → `Attribute Value (string)` → `undefined`.
- `_onMounts`: An array of functions to run on `connectedCallback`.
- `_onCleanups`: An array of functions to run on `disconnectedCallback`.
- `_children`: An array storing the original `childNodes` of the element.
    - **Population**: Captured in `connectedCallback` using `Array.from(this.childNodes)` *before* the compiler clears the element for rendering.
- `_mounted`: A boolean flag tracking the component's connection status.

---

### 2.4 Fragments
JSX Fragments (`<>...</>`) are transformed into `DocumentFragment` objects.
- **Root Return**: If a component returns a fragment, the fragment's children are appended directly to the component's root (or the provided `root` node in page renders).
- **Identity**: Fragments do not have a DOM identity; they only serve as a container during the initial append operation.

### 2.5 Props vs. Attributes
The framework provides a unified interface for both DOM Attributes and JS Properties:
- **Attributes**: String-based values defined in HTML. Synced via `observedAttributes` and `attributeChangedCallback`.
- **Properties (Props)**: Rich data types (Objects, Arrays, Functions) passed via JS assignment.
- **Unification**: Both update the same signal in `_propsSignals`, allowing the component logic to remain agnostic of the data source.

### 2.6 Component Return Patterns
WAF component functions are **executed once** during initialization. This "Init-Once" model impacts how return statements are processed.

#### 2.6.1 Static vs. Reactive Conditionals
Top-level `if` statements and ternaries are **static**. They are evaluated only once at mount.
- **Static Pattern**: `if (!user) return <Login />` will never switch to the main layout even if `user` becomes truthy later.
- **Reactive Pattern**: To switch layouts reactively, return a stable root and use inline conditionals: `return <div>{user ? <Main /> : <Login />}</div>`.

#### 2.6.2 Variable Declarations
Returning a variable containing a JSX element is fully supported.
**JSX**:
```javascript
const layout = <div><Header />{children}</div>;
return layout;
```
**Output**: The compiler treats the variable assignment as the primary DOM construction block and appends it to the component root.

#### 2.6.3 Multi-Return Support
The compiler supports multiple return paths (e.g., inside `if/else` blocks), but again, these are determined at the moment of component instantiation.

### 2.7 Destructured Props
Destructuring props in the component signature is a first-class pattern in WAF. 

- **Automatic Observation**: Keys extracted via destructuring (e.g., `function Comp({ name })`) are automatically added to the `observedAttributes` of the Custom Element.
- **Reactive Rewriting**: The compiler rewrites all usages of destructured variables in the component body to access the `_waf_props` proxy directly. This ensures that even though the variable looks like a static constant, its usage in JSX remains reactive.
- **Renaming & Defaults**: Patterns like `{ name: n = "Guest" }` are supported. The compiler tracks the alias `n` and maps it back to the `name` signal on the proxy.
- **Rest Pattern**: `{ title, ...others }` is supported. While `title` remains reactive, the `others` object is a static snapshot of the remaining props at the time of access.

### 2.8 Direct Props Access
Using the `props` object directly (e.g., `function Comp(props)` or `function Comp(p)`) is supported with the following behavior:

- **JSX Discovery**: The compiler tracks the actual parameter identifier. It scans JSX expressions for `[identifier].key` access and automatically adds those keys to the `observedAttributes` list.
- **Reactive JSX**: Accesses like `{props.name}` are rewritten to `_waf_props.name.value` and are fully reactive.
- **Static Body Access**: Accessing `props.name` in the component body (outside of JSX) returns a **static snapshot** of the prop value at the time of component initialization. To maintain reactivity in the body, destructuring or `$derived` is required.

### 2.9 Nested Props in JSX
Deep path access on the `props` object follows the **First-Access Rule**: the compiler unwraps the property immediately following `props`.

- **Transformation**: `<div>{props.user.name}</div>` → `_effect(() => el.textContent = _waf_props.user.value.name)`
- **Behavior**: This pattern assumes that `user` is the Signal and `name` is a plain property of the object contained within that signal.
- **Lists**: For arrays, `props.items.map(...)` transforms to `props.items.value.map(...)`, which is then optimized via `_mapped()` at runtime.

### 2.10 Default Props
Default values in the component signature are supported and maintained reactively by the compiler.

- **Automatic Fallback**: If a default value is provided (e.g., `{ name = "World" }`), the compiler uses it as a fallback during reactive unwrapping.
- **Strict JS Parity**: To match standard JavaScript destructuring behavior, the fallback is applied strictly using an `!== undefined` check, ensuring that an explicit `null` value is preserved.
- **Transformation**: `<div>{name}</div>` → `_effect(() => el.textContent = (_waf_props.name.value !== undefined ? _waf_props.name.value : "World"))`
- **Dynamic Compatibility**: This ensures that if a prop is initially missing but is provided later (e.g., via `setAttribute`), the component will transition from the default value to the new reactive value seamlessly.

## 3. Reactivity & Macros

### 3.1 Signals
WAF uses `@preact/signals-core`. The compiler automatically manages `.value` access.
- **Microtask Batching**: Multiple synchronous signal updates are automatically batched by the core engine into a single microtask. This guarantees that `_effect` closures (and DOM updates) only run once per synchronous execution block, delivering maximum performance with zero manual `batch()` boilerplate.

### 3.2 Compiler Macros
Macros are special function calls that the compiler transforms:
- `$state(init)`: Transforms to `signal(init)`.
- `$derived(expression)`: Transforms into a Signal-based computed value.
    - **Auto-wrapping**: If a raw expression or a function call is passed (e.g., `$derived(a + b)` or `$derived(compute())`), the compiler automatically wraps it in an arrow function (`() => a + b` or `() => compute()`).
    - **Function Pass-through**: If a function literal (arrow function or anonymous function) is passed (e.g., `$derived(() => count * 2)`), it is used directly without additional wrapping.
- `$effect(callback)`: Standard runtime hook for reactive side effects. 
    - **SSG Guard**: The compiler automatically wraps `$effect()` calls in an `if (!isSSG)` check to prevent build-time execution of client-side logic.
- `$ref()`: Transforms to `signal(null)`. Used in JSX: `<div ref={myRef}>`.
- `$expose(obj)`: Transforms to `Object.assign(this, obj)` within the component class.
    - **Scoping**: The compiler rewrites the target of `Object.assign` to the component instance (`this`), exposing the object's properties as public properties of the Custom Element.

### 3.3 Auto-unwrapping (.value Injection)
The compiler injects `.value` access for variables identified as signals (`$state`, `$derived`, `$ref`) and for `props` access.
- **Rule**: If a variable `v` is a signal, `v` becomes `v.value` in expressions.
- **Exceptions**: `v` remains `v` when:
    - Passed to the `ref` attribute.
    - Used in an assignment (e.g., `v = 10` becomes `v.value = 10`).
    - Used in an update expression (e.g., `v++` becomes `v.value++`).
    - It is the `children` property of the `props` object (e.g., `props.children` remains `props.children`).

### 3.4 Forbidden Patterns
To maintain reactivity integrity and compiler predictability, the following patterns are explicitly forbidden and will trigger a compiler error:
1.  **Manual `.value` Access**: Accessing `.value` on variables declared with `$state`, `$derived`, or `$ref` is prohibited. The compiler handles all unwrapping.
2.  **Conditional Macros**: Using `$state`, `$derived`, or `$effect` inside `if` statements or loops. Macros must be defined at the top level of the component function.
3.  **Late Assignment to Props**: Re-assigning the `props` object itself is forbidden.
4.  **Macro Interaction**: Nesting macros as direct arguments (e.g., using `$derived($signal(...))`) is forbidden. However, passing a function that evaluates a macro (e.g., `$derived(() => form.values.members)`) is perfectly valid because the arrow function isolates the expression.
5.  **Async Components**: `async function MyComp() { ... }` is forbidden. Components must execute synchronously. Use the Resource Pattern (Section 7.4) for async data.
6.  **Generator Functions**: `function* MyComp() { ... }` is unsupported.
7.  **Class Components**: `class MyComp extends HTMLElement { ... }` is explicitly unsupported in the compiler pipeline. Use functional components.
8.  **Dynamic Imports in Body**: `await import(...)` inside the component body breaks synchronous execution and is forbidden.

### 3.5 $signal() Macro
`$signal()` is the **explicit bridge** between external reactive objects and the WAF compiler. It tells the compiler: *"this object contains signals — track its reactive properties in JSX."* 

#### 3.5.1 Syntax & Compilation
```javascript
const x = $signal(externalReactiveObject)
```
- **Declaration**: `const x = externalReactiveObject` (zero runtime cost).
- **The First-Access Rule**: The compiler automatically injects `.value` **only on the first property access** following a `$signal` variable.
  - **Logic**: This "unlocks" the reactive container, exposing the plain data inside.
  - **Example**: `<span>{x.user.name}</span>` → `_effect(() => el.textContent = x.user.value.name)`
- **Destructuring**: Destructuring a `$signal` variable is supported. The compiler tracks the resulting variables as signals.
  - **JSX**: `const { count } = $signal(store); <div>{count}</div>`
  - **Output**: `_effect(() => el.textContent = count.value)`

#### 3.5.2 Hybrid Reactivity (Lists)
When combined with `_mapped()`, `$signal` allows for deep reactivity without deep signals in the data source.
**Input**:
```jsx
const form = $signal(createForm({ members: [{ name: "Alice" }] }))
return (
  <ul>
    {form.members.map(m => <li>{m.name}</li>)}
  </ul>
)
```
**Output**:
```javascript
_mapped(
  () => form.members.value, // Level 1 unwrap via First-Access Rule
  (m) => {
    // m is "reified" into a signal by _mapped at runtime
    const el = document.createElement("li")
    _effect(() => el.textContent = m.value.name)
    return el
  }
)
```

#### 3.5.3 Rules
- **Component Top Level**: MUST be declared at the component top level.
- **Object Only**: MUST wrap a plain object containing reactive state.
- **No Explicit Typing**: The compiler uses a single-level unwrap heuristic (the First-Access Rule) rather than relying on TypeScript or JSDoc. It blindly unwraps the first property access on a `$signal` variable.
- **No Manual .value**: `.value` is FORBIDDEN on `$signal()` variables or their destructured children in component code.
- **Priority Detection**:
  1. Local Macros (`$state`, `$derived`, `$ref`)
  2. Variables from `$signal()` (including destructured ones)
  3. Static values


---

## 4. Component Transformation
This section shows how the compiler progressively builds the Web Component class based on the features used in the JSX function.

### 4.0 Component Naming (Namespacing)
To prevent tag name collisions across different folders, the framework uses **Deterministic Path-Based Namespacing**.
- **Rule**: Tag names are prefixed with `web-` followed by the kebab-cased relative path from the project root.
- **Example**: `app/admin/Profile.jsx` → `web-app-admin-profile`.
- **Index Files**: `app/Button/index.jsx` omits `index` → `web-app-button`.
- **Collisions**: If two identical names resolve from different paths, the first one registered wins.
- **Max Length**: Tag names are capped at 255 characters to comply with browser Custom Element limits.

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

### 4.2.5 Level 2.5: Component with Property Syncing (Setters/Getters)
When props are used, the compiler generates JS getters and setters to sync property assignments directly to internal signals.
**Output (Partial)**:
```javascript
class GreetElement extends HTMLElement {
  static observedAttributes = ["name"];

  // Generated setter for property access: el.name = "..."
  set name(_val) {
    if (!this._propsSignals["name"]) {
      this._propsSignals["name"] = signal(_val);
    }
    this._propsSignals["name"].value = _val;
  }

  // Generated getter for property access: console.log(el.name)
  get name() {
    const _sig = this._propsSignals["name"];
    return _sig ? _sig.value : undefined;
  }

  constructor() {
    super();
    defineInternalProp(this, "_propsSignals", { name: signal(null) });
    defineInternalProp(this, "_mounted", false);
  }
  // ...
}
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

### 4.5 Component Children (`_children`)
When a component receives children in JSX, they are captured during initialization.
**Input**:
```jsx
export function Wrapper({ children }) {
  return <div class="box">{children}</div>;
}

// Parent usage:
// <Wrapper><span>Child</span></Wrapper>
```
**Output (Partial)**:
```javascript
// Inside WrapperElement's connectedCallback:
// _children array is populated automatically by the base class constructor
// from `Array.from(this.childNodes)` before rendering.
const _waf_props = createPropsProxy(this);
// The proxy exposes `children` which resolves to `this._children`.

const el0 = document.createElement("div");
el0.setAttribute("class", "box");

// children are appended dynamically
_renderDynamic(el0, () => _waf_props.children.value);
```

### 4.6 Exposed Properties (`$expose`)
Components can expose methods and state to their parent via `$expose`.
**Input**:
```jsx
export function Modal() {
  let open = $state(false);
  $expose({ show: () => open = true });
  return open ? <dialog>...</dialog> : null;
}
```
**Output**:
```javascript
class ModalElement extends HTMLElement {
  connectedCallback() {
    // ...
    let open = signal(false);
    
    // Transformed $expose macro:
    Object.assign(this, {
      show: () => open.value = true
    });
    // Now `el.show()` is callable from the outside.
  }
}
```

## 5. JSX Transformation Patterns
This section defines how various JSX patterns are transformed into imperative DOM operations by the compiler.

### 5.1 Static Elements
**JSX**: `<div>Hello</div>`
**Output**:
```javascript
const el0 = document.createElement("div");
el0.appendChild(document.createTextNode("Hello"));
```

### 5.2 Attribute Patterns
The compiler transforms JSX attributes into imperative DOM operations, distinguishing between static literals and dynamic expressions.

#### 5.2.1 Static Literals
Static literals are applied once during element creation.
- **String**: `<div class="foo" />` → `el.setAttribute("class", "foo")`
- **Number**: `<input tabIndex={0} />` → `el.setAttribute("tabIndex", "0")`
- **Boolean**: `<input disabled={true} />` → `el.setAttribute("disabled", "")` (Attributes are removed if the literal is `false`).

#### 5.2.2 Dynamic Expressions
Expressions are wrapped in `_effect()` to ensure fine-grained reactivity.
- **Simple Identifier**: `<div class={cls} />` → `_effect(() => _setProperty(el, "class", cls.value))`
- **Ternary**: `<div class={isActive ? "on" : "off"} />` → `_effect(() => _setProperty(el, "class", isActive.value ? "on" : "off"))`
- **Logical AND**: `<div class={isActive && "active"} />` → `_effect(() => _setProperty(el, "class", isActive.value && "active"))`
- **Template Literal**: ``<div class={`btn ${variant}`} />`` → ``_effect(() => _setProperty(el, "class", `btn ${variant.value}`))``

#### 5.2.3 Special Attributes & Values
- **Style Object**: `<div style={{ color: "red", fontSize: 14 }} />` → `Object.assign(el.style, { color: "red", fontSize: 14 })`
- **Data & Aria Attributes**: `data-*` and `aria-*` attributes are treated as standard attributes and applied via `setAttribute`.
- **Null/Undefined Handling**:
    - **Native Elements**: If an expression evaluates to `null` or `undefined`, the attribute is removed: `el.removeAttribute(key)`.
    - **WAF Components**: If a prop is set to `null` or `undefined`, the value is **preserved** and updated in the underlying signal (`propSignal.value = null`), allowing the component to react to the empty state.

#### 5.2.4 Spread Attributes (Order Matters)
Spread attributes are applied via `_applySpread()`. The order of attributes in JSX is preserved in the output, meaning later attributes can override earlier ones.
- **Static Override**: `<div {...props} class="override" />`
  - The compiler generates the spread effect followed by the static `setAttribute("class", "override")`.
- **Dynamic Override**: `<div class="base" {...props} />`
  - The static attribute is set first, but the spread effect may later override it if `props` contains a `class` key.
- **Runtime Event Normalization**: The `_applySpread` runtime helper MUST replicate the compiler's event normalization rules (see Section 5.3). When spreading an object containing `{ onClick: fn }`, it must be applied as `.onclick` to native elements and `.onClick` to components.

### 5.3 Event Handlers

#### 5.3.1 Normalization Rule
The compiler applies different case normalization based on whether the target element is a native HTML element or a WAF Component.
- **Native Elements**: Attributes starting with `on` are normalized to **lowercase** property assignments.
- **Component Elements**: Attributes starting with `on` preserve their **original case** (typically camelCase) for property assignment.

| Target Type | JSX Pattern | Compiled Output |
| :--- | :--- | :--- |
| **Native** | `<button onClick={fn} />` | `el.onclick = fn;` |
| **Native** | `<input onKeyDown={fn} />` | `el.onkeydown = fn;` |
| **Component** | `<MyComp onDataLoad={fn} />` | `el.onDataLoad = fn;` |
| **Component** | `<MyComp onClick={fn} />` | `el.onClick = fn;` |

#### 5.3.2 Inline Handlers (No Hoisting Required)
Unlike VDOM frameworks where inline handlers are re-created on every render, WAF component functions follow the **Init-Once** model. 
- **Setup Only**: The component body is executed exactly once during `connectedCallback`.
- **Zero Overhead**: Inline arrow functions in event handlers are created only once per component instance.
- **Output**: The compiler simply assigns the inline function directly to the property without any need for hoisting or `useCallback` equivalents.

**JSX**: `<button onclick={() => count++} />`
**Output**:
```javascript
el.onclick = () => count.value++;
```

#### 5.3.3 Detection Logic
The compiler determines the normalization strategy using the following tag-name rules:
- **Native**: Tag is all lowercase or is a known HTML tag.
- **Component**: Tag is PascalCase or contains a hyphen (`-`).

#### 5.3.4 Explicit Constraints
- **`on` Prefix Required**: Any attribute intended as an event handler MUST start with `on`. Without this prefix, it is treated as a standard attribute or property.
- **No Automatic Cleanup**: WAF does not automatically detach event handlers assigned via properties. Developer-owned lifecycle management is expected for complex cleanup scenarios.
- **No `addEventListener`**: The compiler always emits property assignments (`el.onclick = ...`) and never emits `addEventListener` calls.
- **Dynamic Events Prohibited**: Dynamic event names (e.g., `<div {name}={fn} />` or `<div on={name} />`) are not supported.

### 5.4 Children Patterns
WAF handles various children types through a combination of static creation and dynamic rendering helpers.

#### 5.4.1 Static Children
Static children are created and appended once during element initialization.
- **Text**: `<div>Hello</div>` → `el.appendChild(document.createTextNode("Hello"))`
- **Nested Elements**: `<div><span>text</span></div>` → Nested `createElement` and `appendChild`.
- **Multiple Static Children**: `<div><A /><B /></div>` → Sequential creation and appending.
- **Mixed Content**: `<div>Hello <strong>{name}</strong>!</div>` → Mix of static text nodes and dynamic segments.
- **HTML Entities**: Standard HTML entities (e.g., `&copy;`, `&amp;`, `&lt;`) are supported. The compiler transforms them into their corresponding Unicode characters within the generated text nodes.
  - **JSX**: `<div>&copy; 2024</div>` → `el.appendChild(document.createTextNode("\u00A9 2024"))`
- **JSX Comments**: Comments within JSX braces (`{/* comment */}`) are stripped by the compiler and result in no output in the final DOM.
- **Whitespace & Multiline Text**: Standard JSX whitespace rules apply. Leading and trailing whitespace on newlines is stripped, and internal newlines/multiple spaces are collapsed into a single space in the resulting text node.

#### 5.4.2 Fragments
Fragments are transformed into `DocumentFragment` for batch appending. They provide a grouping mechanism without adding extra nodes to the DOM.
**JSX**: `<><A /><B /></>` → `const frag0 = document.createDocumentFragment(); ...; parent.appendChild(frag0)`

#### 5.4.3 Dynamic Expressions
Any non-literal children (expressions, variables, or function calls) are wrapped in `_renderDynamic()` to ensure reactivity.
- **Identifiers**: `<div>{name}</div>` → `_renderDynamic(el, () => name.value)`
- **Numbers**: `<div>{count}</div>` → Stringified and rendered as a text node within the effect.
- **Conditionals**: 
  - **Logical AND**: `{show && <p>hi</p>}`
  - **Ternary**: `{show ? <A /> : <B />}`
  - **Logical OR / Nullish**: `{value || "default"}`, ``{value ?? "fallback"}``
  - **Nested Conditionals**: `{a ? (b ? <X /> : <Y />) : <Z />}`
- **Empty Values**: `null`, `undefined`, and `false` result in no DOM nodes being rendered.

#### 5.4.4 List Rendering
Arrays and `.map()` operations are transformed into `_mapped()` calls for optimized reconciliation with item identity tracking.
- **Simple Map**: `<ul>{items.map(i => <li>{i}</li>)}</ul>`
- **Keyed List**: `<ul>{items.map(i => <li key={i.id}>{i.name}</li>)}</ul>`
- **Nested Maps**: `<ul>{sections.map(s => s.items.map(i => <li>{i}</li>))}</ul>` (Transformed into nested `_mapped` vectors).

##### Key Prop Behavior
The `key` prop is crucial for `_mapped` optimization:
- **Type**: Must be a `string` or `number`.
- **Fallback**: If `key` is missing, `_mapped` falls back to the array `index`.
- **Duplicates**: If keys duplicate, the framework logs a warning in development mode, and the last rendered item for that key overwrites previous cache entries (last-wins).
- **Non-list elements**: Applying a `key` prop to elements outside of a `.map()` callback is ignored by the framework.

##### Reactivity Boundary Rule
Because of the Hybrid Reactivity model, there is a strict boundary between plain data operations and reified reactive signals during list rendering.

**JSX Input:**
```javascript
{items.filter(i => i.active).map(i => <li>{i.name}</li>)}
```

**Compiled Output:**
```javascript
const _mapped0 = _mapped(
  () => items.value.filter(i => i.active),  // sourceFn — plain data
  (i) => {                                  // mapFn — i is Signal
    const el = document.createElement("li")
    _effect(() => el.textContent = i.value.name)
    return el
  }
)
_renderDynamic(el, () => _mapped0())
```

**The Rule:**
- **Methods chained BEFORE `.map()`** (e.g., `.filter()`, `.sort()`) operate on **plain data**. They re-run *only* when the parent signal reference changes. An immutable update (e.g., `items.value = [...items.value]`) is required to trigger a re-filter or re-sort.
- **Methods inside `.map()` callback** receive **Signals**. These bindings result in fine-grained DOM updates per item, without requiring list reconciliation.

##### List Reactivity Matrix

| Pattern | Valid | Trigger |
|---|---|---|
| `items.map(...)` | ✅ | items signal changes |
| `items.filter().map(...)` | ✅ | items signal changes |
| `items.sort().map(...)` | ✅ | items signal changes |
| `items.reduce(...)` | ✅ | items signal changes (no `_mapped` optimization) |
| mutate `items[0].active` directly | ❌ | won't re-filter or re-render |
| `items.value = [...items.value]` | ✅ | triggers re-filter and reconciliation |

### 5.5 Component Usage
**JSX**: `<MyComponent title={myTitle} />`
**Output**:
```javascript
const el0 = document.createElement("web-mycomponent");
_effect(() => _setProperty(el0, "title", myTitle));
```

### 5.6 Ref Attribute
**JSX**: `<div ref={myRef}></div>`
**Output**:
```javascript
const el0 = document.createElement("div");
myRef.value = el0; // Ref signal updated directly
```

### 5.7 Void Elements
Void elements are elements that cannot have children (e.g., `<input />`, `<br />`, `<img />`). They are transformed like standard elements but without an `appendChild` call for children.
**JSX**: `<input type="text" />`
**Output**:
```javascript
const el0 = document.createElement("input");
el0.setAttribute("type", "text");
```

### 5.8 SVG Elements
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

### 6.1 `createPropsProxy(el)`
The `createPropsProxy(el)` function bridges the Web Component's attributes and properties with the functional component's expected `props` object.

- **Lazy Signal Creation**: It lazily initializes `_propsSignals` on the element. Signals are only created when a property is first accessed or set.
- **Unified Access**: It resolves values by checking JS properties first, then falling back to DOM attributes.
- **Reactive Synchronization**: 
    - **Incoming Signals**: If a signal is passed as a prop, the proxy subscribes to it and synchronizes its value to an internal signal. This maintains the identity of the prop signal within the component even if the parent passes a different signal reference later.
    - **Raw Values**: If a raw value is set, the internal signal is updated directly.
- **Identity Preservation**: By using a proxy to manage `_propsSignals`, component logic can safely destructure `props` at the top level while maintaining reactivity via the underlying signal references.
- **Brand Validation**: Uses `PREACT_SIGNALS_BRAND` to ensure only legitimate signals are processed, preventing errors with plain objects that might mimic the signal API.

### 6.2 `setProperty(el, key, value)`
A central helper for assigning values to elements. It follows this decision tree:

| Type | Key Pattern | Action |
| :--- | :--- | :--- |
| **Style** | `key === "style"` | `Object.assign(el.style, value)` |
| **Event (Native)** | `key.startsWith("on")` & `!isComponent` | `el[key.toLowerCase()] = value` |
| **Event (Comp)** | `key.startsWith("on")` & `isComponent` | `el[key] = value` |
| **Property** | `key` in `IS_PROPERTY` list | `el[key] = value` |
| **Attribute** | Default | `el.setAttribute(key, value)` (removes if null/false) |

- **`isComponent` Flag**: To accurately apply event casing (preserving camelCase for components, lowercasing for native), the compiler passes an `isComponent` boolean flag to the `setProperty` runtime helper.

- **Reactivity**: If `value` is a signal, `setProperty` automatically unwraps it via `value.value`.
- **WAF Sync**: If `el` is a WAF component, `setProperty` updates the internal `el._propsSignals[key]` to propagate reactivity.

### 6.3 `renderDynamic(parent, fn)`
Handles conditional and dynamic JSX rendering via an effect-based reconciliation strategy.
- **Anchor Node**: Creates a "bookmark" (empty TextNode) in the `parent` to track the insertion point.
- **Effect-based Tracking**: Runs `fn` inside an `effect`. Whenever any signals accessed in `fn` change, the reconciliation logic is triggered.
- **Security (XSS Safe)**: By default, string and number primitives are converted to DOM nodes exclusively via `document.createTextNode()`. The framework **never** uses `innerHTML` for dynamic rendering, making it inherently safe from Cross-Site Scripting (XSS) attacks.
- **Reconciliation**:
    - If `fn` returns a DOM node: It is inserted/moved before the anchor.
    - If `fn` returns `null/false/undefined`: Any previously rendered dynamic content is removed.
    - If `fn` returns a primitive: It is converted to a `TextNode` and rendered.

### 6.4 `_mapped(sourceFn, mapFn)`
The primary helper for reactive list rendering. 
- **Array Tracking**: Subscribes to the array returned by `sourceFn()`.
- **Item Reification**: To support deep reactivity without nested signals in the data source, `_mapped` internally **wraps each array item in a `Signal`** before passing it to `mapFn(item, index)`.
- **Optimization**: Uses an internal `Map` to cache nodes based on a `key` property (or index), ensuring that only changed or new items are rendered/updated.

### 6.5 `withInstance(inst, fn)`
A scoping helper used during component initialization.
- Sets a global `currentInstance` variable to `inst`.
- Executes `fn()`.
- Resets `currentInstance` to its previous value in a `finally` block.
- This allows `onMount` and `onCleanup` to correctly identify the active component instance during its synchronous setup.

---

## 7. Lifecycle & Environment

### 7.1 Lifecycle Hooks
- `onMount(cb)`: Associates `cb` with the current component instance. Executed once in `connectedCallback`.
- `onCleanup(cb)`: Associates `cb` with the current component instance. Executed once in `disconnectedCallback`.
- **Execution Order**: Multiple hooks of the same type within a component are executed in **FIFO (First-In, First-Out)** order.
- **Mechanism**: These hooks rely on `getCurrentInstance()` (set via `withInstance`) to find the active component.
- **Synchronous Constraint**: WAF component functions MUST be strictly synchronous. Using `async/await` in the component body breaks the `withInstance` context, causing lifecycle hooks called after an `await` to silently fail. Async logic should be placed inside `onMount` or `$effect` instead.

### 7.2 Environment
- `isSSG`: A boolean flag. When `true`, `$effect` macros are ignored, and certain DOM operations (like `_clearChildren`) are skipped to allow for hydration-friendly output.

### 7.3 Error Handling & Boundaries
WAF does **not** use VDOM-style Error Boundaries (`<ErrorBoundary>`). Instead, it relies on a **Fine-Grained Failure** model:
- **Mount Errors**: An error thrown directly inside the component body or `connectedCallback` stops the component from mounting, bubbling up to the global error handler (`window.onerror`).
- **Effect Errors**: An error thrown inside an `_effect` kills *only that specific DOM binding's reactivity*. The rest of the component remains perfectly functional.
- **Global Handler**: The framework provides `WAF.setErrorHandler((error, context) => {...})` to globally catch uncaught effect failures.
- **Local Recovery**: Developers can use the `$onError(err => {...})` macro (transformed to a try/catch inside effects) to gracefully catch local effect failures without crashing the application.

### 7.4 Async Data Loading (Resource Pattern)
Because component functions must be strictly synchronous, top-level `await` is forbidden. The official pattern for data fetching is the **Resource Pattern**:
1. Initialize a `$state` signal for the data (e.g., `let data = $state(null)`).
2. Trigger the async operation inside an `$effect` or directly in the component body (without `await`).
3. Render conditionally based on the signal value.

**Example**:
```jsx
export function UserProfile({ id }) {
  let user = $state(null);
  let error = $state(null);

  // Fire and forget
  fetch(`/api/users/${id}`)
    .then(res => res.json())
    .then(data => user.value = data)
    .catch(err => error.value = err.message);

  return (
    <div>
      {error ? <p>Error: {error}</p> : 
       user ? <h1>{user.name}</h1> : 
       <p>Loading...</p>}
    </div>
  );
}
```

---

## 8. Fullstack Routing

WAF uses a file-based router that supports layouts, dynamic segments, and client-side guards.

### 8.1 Directory Structure
- `app/`: The root of the routing system.
- `page.jsx`: Defines a route.
- `layout.jsx`: Defines a persistent wrapper for all routes in its directory and subdirectories.
- `404.jsx`: A global fallback page displayed when no other route matches the current pathname.

### 8.2 Dynamic Segments
- **Static**: `app/about/page.jsx` -> `/about`
- **Dynamic**: `app/posts/[id]/page.jsx` -> `/posts/:id`
- **Catch-all**: `app/docs/[...slug]/page.jsx` -> `/docs/*`

### 8.3 Layout Nesting
Layouts are recursively applied from the root `app/` directory down to the leaf `page.jsx`.
- Each layout receives a `children` prop containing the nested content (page or sub-layout).

---

## 9. Static Site Generation (SSG)

WAF is designed for high-performance static rendering, allowing the entire app to be pre-rendered into HTML at build time.

### 9.1 Build-time Rendering
The framework uses `linkedom` to provide a lightweight server-side DOM environment.
- **Shredding**: During SSG, the framework instantiates Web Components in the server DOM and manually triggers their `connectedCallback` to populate the HTML.
- **Data Reflection**: Properties set on components during SSG are reflected as attributes in the final HTML to ensure consistency.

### 9.2 Hydration
- **data-ssg="true"**: The root element is marked with this attribute if it was pre-rendered.
- **Client-side Pickup**: On the client, the framework detects `data-ssg` and skips initial rendering of static content.
- **Signal Hydration**: The framework identifies static content and skips the initial execution of effects that would otherwise re-render the pre-populated DOM.

### 9.3 Macro Behavior in SSG
- **`$effect()`**: The `$effect` macro is **never** executed during SSG to prevent client-only logic (like `fetch` or `localStorage`) from breaking the build.
- **`effect()` (Internal)**: To populate the DOM initially during the server build, `core/signals.js` intercepts internal `effect()` calls. During SSG, it executes the provided function *once* synchronously to trigger DOM bindings, and then returns a no-op dispose function, bypassing the reactivity engine.


---

---

## 10. Global State Management

WAF enables a "zero-boilerplate" store pattern using plain JS modules and signals, eliminating the need for complex state management libraries.

### 10.1 Philosophy: The Plain Object Store
A store in WAF is simply a plain JavaScript object that exposes signals as properties. Because WAF has no Virtual DOM and no component re-renders, it does not need selectors or complex subscription logic.

#### Definition Example
```javascript
// stores/counter.js
import { signal, computed } from "@opentf/web";

const _count = signal(0);

export const counterStore = {
  // Reactive properties (Signals)
  count: _count,
  double: computed(() => _count.value * 2),

  // Actions (Plain functions)
  increment: () => _count.value++,
  decrement: () => _count.value--
};
```

### 10.2 The Library Author Contract
To participate in the WAF reactive ecosystem, library authors (Forms, Query, Auth) should follow this simplified contract:
1. **Top-Level Signals**: Expose reactive state as top-level properties of a plain object, wrapped in `signal()`.
2. **Standard Data Structures**: Nested data (arrays of objects, etc.) should be kept as plain JS structures. WAF's `_mapped` helper will handle item-level reactivity.
3. **No Explicit Typing**: Because the compiler uses the single-level unwrap heuristic (the First-Access Rule), no `Signal<T>` typing or JSDoc is required. The compiler blindly unwraps the first property access, so the library author simply needs to structure the store such that those top-level accessed properties are the actual signals.
4. **Plain Actions**: Expose mutation methods as plain functions, not signals.

### 10.3 Comparison with VDOM Frameworks

| Aspect | Zustand / Redux | WAF |
|---|---|---|
| **Read State** | `useStore(selector)` | `$signal(store)` |
| **Write State** | `dispatch(action)` | Direct call: `store.action()` |
| **Derived State** | `useMemo` / `createSelector` | `computed()` in store |
| **Boilerplate** | High to Very High | Zero |
| **Re-render Scope** | Component-level | DOM-node level (Fine-grained) |
| **Provider Needed** | Yes | No |

### 10.4 Why Selectors are Irrelevant
In VDOM frameworks, selectors are used to prevent unnecessary component re-renders. In WAF, **components never re-render**. Instead, each DOM binding is its own fine-grained subscription:
- `_effect(() => el.textContent = app.count.value)` only updates that specific text node.
- Changing `app.user` will not affect the `app.count` binding, even if they are in the same component.
- **DOM granularity makes selective subscription irrelevant.**

---

## 11. API Routes

WAF provides a lightweight, standards-compliant server-side routing system for building APIs and backend logic.

### 11.1 Standard Web APIs
WAF strictly adheres to the standard **Fetch API** for server-side handlers. This ensures that API routes are portable across modern JS runtimes (Bun, Node 20+, Cloudflare Workers, Deno).

- **Input**: The handler receives a standard `Request` object.
- **Output**: The handler MUST return a standard `Response` object.

### 11.2 File-Based Dispatching
API routes are defined within the `app/api/` directory. The framework uses a file-based routing system mapped to the `/api/*` prefix.

- **Static Routes**: `app/api/status.js` → `/api/status`
- **Dynamic Routes**: `app/api/users/[id].js` → `/api/users/:id`

### 11.3 Method-Based Handlers
Routes are defined by exporting named functions corresponding to HTTP methods.

```javascript
// app/api/users.js

export async function GET(request) {
  // Use standard Request methods
  const { searchParams } = new URL(request.url);
  const users = await db.users.list();
  
  return Response.json(users);
}

// Example: Creating a new user
export async function POST(request) {
  const data = await request.json();
  const user = await db.users.create(data);
  
  return Response.json(user, { status: 201 });
}
```

### 11.4 WAF Regex Router & Runtime Adapters
WAF provides its own high-performance **Regex Router** to ensure consistent routing behavior across all deployment targets.

- **Internal Router**: The framework-provided router matches incoming URLs against compiled regex patterns and dispatches them to the appropriate named exports (`GET`, `POST`, etc.).
- **Platform-Agnostic**: Because the router is built into the WAF runtime, routing logic remains identical whether running on Bun, Node.js, or Edge workers.
- **HTTP Server Utilization**: WAF utilizes the native HTTP server of the underlying runtime (e.g., `Bun.serve` or Node's `http` module) via specialized **Adapters**. These adapters translate the platform's native request/response into the standard `Request`/`Response` objects used by WAF handlers.

## 12. DevTools & Debugging
Because WAF compiles components to standard Custom Elements, you can use native browser developer tools to inspect and debug your application.

### 12.1 Inspecting Reactive State
If you select a WAF component in the Elements panel, it is available as `$0` in the Console.
You can inspect the component's reactive state by accessing its internal signals:
```javascript
// View the actual signal objects holding the prop values
console.log($0._propsSignals);

// Read the current value of the 'name' prop
console.log($0._propsSignals.name.value);

// Force an update to the component manually
$0._propsSignals.name.value = "New Name";
```

This makes debugging fine-grained reactivity straightforward without needing specialized browser extensions.
