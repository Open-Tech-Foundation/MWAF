# Architecture Overview

## Data Flow
`JSX Source` -> `Babel Plugin` -> `Imperative DOM Operations`

## Lifecycle
1. **Build Time**: Babel transforms .jsx/.tsx files into browser-native code (Pages or Web Components).
2. **Mount Time**: `main.js` calls `mountApp()`.
3. **Routing**: `import.meta.glob` loads pages; the router renders the active page into `#app`.
4. **Hydration**: Web Components are automatically upgraded by the browser as they are appended to the DOM.
