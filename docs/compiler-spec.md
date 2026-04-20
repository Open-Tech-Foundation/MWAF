# Compiler Specification

## Transformation Rules

1. **JSX to Imperative DOM**: Every JSX element is transformed into a series of `document.createElement`, `setAttribute`, and `appendChild` calls.
2. **Reactivity Injection**: Attributes and text nodes containing JSX expressions are wrapped in `effect()` calls from `@preact/signals`.
3. **Dynamic Children**: JSX expression containers in child positions are transformed into `renderDynamic(parent, () => expression)` calls.
4. **Nested JSX Transformation**: JSX elements found inside expression containers (e.g. in ternaries) are recursively transformed into IIFEs that return imperative DOM nodes.
5. **Macro Transformation**: `$state`, `$effect`, and `$derived` are replaced with `@preact/signals` primitives (`signal`, `effect`, `computed`) and imports are automatically added.
6. **Lifecycle Transformation**: `onMount` and `onCleanup` are transformed into registrations that use the `withInstance` runtime wrapper.
7. **Prop Transformation**: Destructured parameters in components are converted to `props` object access (e.g. `name` -> `props.name`) to maintain reactivity.

## Component Architecture

### Web Components
* Each `.jsx` file (except `page.jsx`) is wrapped in a class extending `HTMLElement`.
* Props are mapped to `observedAttributes` and reactive setters.
* `connectedCallback` initializes the reactive setup.

### Pages
* `page.jsx` exports a `render(root)` function.
* The content is appended directly to the provided root element.
