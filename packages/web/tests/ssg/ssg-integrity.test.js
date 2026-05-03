import { expect, test, describe, beforeAll, afterAll } from "bun:test";
import { renderPage, createServerDOM } from "../../ssg/render.js";
import { signal, effect, onMount, onCleanup } from "../../index.js";

describe("SSG Integrity Suite", () => {
  test("Basic SSR Rendering", () => {
    const page = {
      render: (root, props) => {
        const el = document.createElement("div");
        el.textContent = "Hello " + props.params.name;
        root.appendChild(el);
      }
    };
    
    const html = renderPage(page, { params: { name: "World" } });
    expect(html).toContain("<div>Hello World</div>");
  });

  test("Reactive Signal Rendering (Single Run)", () => {
    const page = {
      render: (root) => {
        const count = signal(100);
        const el = document.createElement("div");
        effect(() => {
          el.textContent = "Count: " + count.value;
        });
        root.appendChild(el);
      }
    };
    
    const html = renderPage(page);
    expect(html).toContain("<div>Count: 100</div>");
  });

  test("onMount and onCleanup Guards", () => {
    let mountCalled = false;
    let cleanupCalled = false;

    // Register it
    const { window, cleanup } = createServerDOM();
    try {
      // Define inside to use the correct HTMLElement
      class TestComp extends window.HTMLElement {
        connectedCallback() {
          const { withInstance } = require("../../runtime/lifecycle.js");
          const { isSSG } = require("../../index.js");
          
          this._onMounts = [];
          this._onCleanups = [];
          
          withInstance(this, () => {
            onMount(() => { mountCalled = true; });
            onCleanup(() => { cleanupCalled = true; });
            
            const el = window.document.createElement("div");
            el.textContent = "SSG Content";
            this.appendChild(el);
          });

          if (!isSSG) {
             this._onMounts.forEach(fn => fn());
          }
        }
      }

      window.customElements.define("web-test-ssg", TestComp);
      const el = window.document.createElement("web-test-ssg");
      window.document.body.appendChild(el);
      
      // upgradeCustomElements is called inside renderPage, 
      // but here we are testing the logic manually
      const { upgradeCustomElements } = require("../../ssg/render.js");
      upgradeCustomElements(el);

      expect(mountCalled).toBe(false);
      expect(cleanupCalled).toBe(false);
      expect(el.innerHTML).toContain("SSG Content");
    } finally {
      cleanup();
    }
  });

  test("Complex Nested Rendering (Layouts + Pages)", () => {
    const layout = {
      render: (root, { children }) => {
        const nav = document.createElement("nav");
        nav.textContent = "Navbar";
        root.appendChild(nav);
        const main = document.createElement("main");
        main.appendChild(children);
        root.appendChild(main);
      }
    };

    const page = {
      render: (root) => {
        const h1 = document.createElement("h1");
        h1.textContent = "Page Title";
        root.appendChild(h1);
      }
    };

    const html = renderPage(page, { layoutModules: [layout] });
    expect(html).toContain("<nav>Navbar</nav>");
    expect(html).toContain("<main><h1>Page Title</h1></main>");
  });
});
