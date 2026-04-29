---
"@opentf/web": minor
---

Here is a summary of the changes for your changelog:

### 🚀 Features
- **Compiler:** Added comprehensive support for **SVG camelCase attributes** (e.g., `viewBox`, `strokeWidth`, `strokeLinecap`). The compiler now preserves the original casing for these attributes, ensuring icons and SVGs render correctly in the browser.
- **Router:** Improved route matching to support **optional trailing slashes** (e.g., `/about` and `/about/` now match the same route).
- **Playground:** Added a new **SVG Icons Showcase** page to demonstrate seamless integration with icon libraries like Lucide and Heroicons.

### 🐞 Bug Fixes
- **Compiler:** Fixed a critical bug where **imported components** were incorrectly compiled as dynamic variables (e.g., `document.createElement(Link)`) instead of using their registered custom element tag names (e.g., `document.createElement("web-link")`).
- **Playground:** Resolved a build failure in the Icons page by correcting an illegal `const` reassignment of a reactive state variable.
- **Performance:** Reduced the simulated network delay in `routeGuard.js` from 800ms to 100ms for a snappier development experience.

### 🏠 Internal & Maintenance
- **Refactoring:** Optimized the Babel plugin by moving large static lists (SVG tags, properties, etc.) to the top-level scope, improving compilation speed.
- **Testing:** Expanded the test suite with new cases for **icon libraries** and **complex React patterns** (dynamic tags, render props, spread overrides).

---
