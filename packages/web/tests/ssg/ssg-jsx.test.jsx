import { expect, test, describe } from "bun:test";
import { renderPage } from "../../ssg/render.js";
import * as SSGTestPage from "./SSGTestPage.page.jsx";
import * as SSGLayout from "./SSGLayout.layout.jsx";

describe("SSG JSX Rendering", () => {
  test("renders a JSX page to static HTML", () => {
    const html = renderPage(SSGTestPage, { 
      params: { name: "Antigravity" } 
    });
    
    expect(html).toContain('<div class="ssg-container">');
    expect(html).toContain('<h1 id="title">SSG Test</h1>');
    expect(html).toContain('<p id="msg">Hello Antigravity</p>');
    expect(html).toContain('<span id="initial">Initial</span>');
    expect(html).toContain('<li class="item">1</li>');
    expect(html).toContain('<li class="item">2</li>');
    expect(html).toContain('<li class="item">3</li>');
  });

  test("renders a JSX page with a JSX layout", () => {
    const html = renderPage(SSGTestPage, {
      params: { name: "Monorepo" },
      layoutModules: [SSGLayout]
    });

    expect(html).toContain('<div id="layout-root">');
    expect(html).toContain('<header>Global Header</header>');
    expect(html).toContain('<main id="slot">');
    expect(html).toContain('<div class="ssg-container">');
    expect(html).toContain('<p id="msg">Hello Monorepo</p>');
    expect(html).toContain('<footer>Global Footer</footer>');
  });
});
