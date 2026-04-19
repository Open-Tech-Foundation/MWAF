# Compiler Specification (Babel Plugin)

## Transformation Rules

### 1. Element Creation
* Lowercase tags (`div`, `span`) -> `document.createElement("tag")`.
* Uppercase tags (`Button`) -> `document.createElement("waf-button")`.

### 2. Reactivity
* Expressions in text nodes (`{count.value}`) -> `createTextNode("")` + `effect(() => textNode.textContent = expr)`.
* Expressions in attributes (`value={val.value}`) -> `effect(() => el.value = expr)`.

### 3. Events
* Attributes starting with `on` (e.g., `onclick`) are assigned directly as properties: `el.onclick = value`.

### 4. Components (.wc.jsx)
* Transformed into a class extending `HTMLElement`.
* `props` are proxied to `observedAttributes` and signals.
* Default export is the class itself.
* `customElements.define("waf-name", Class)` is called automatically.

### 5. Pages (.jsx)
* Transformed into a `render(root)` function.
* Appends the root JSX element to the passed element.
