export default function DocsPage() {
  return (
    <div className="space-y-24 pb-24">
      
      {/* 1. GETTING STARTED */}
      <section className="space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Documentation</h1>
          <p className="text-xl text-slate-500">Everything you need to know to build high-performance web apps with WAF.</p>
        </div>

        <div id="introduction" className="space-y-4 scroll-mt-24">
          <h2 className="text-2xl font-bold border-b border-slate-100 pb-2">Introduction</h2>
          <p className="text-slate-600 leading-relaxed">
            WAF (Web Application Framework) is a revolutionary approach to building web applications. 
            Unlike React or Vue, it completely eliminates the Virtual DOM. Instead, it compiles your JSX directly into highly optimized, imperative native DOM operations. 
            Under the hood, every component is compiled into a standard Web Component, ensuring perfect interoperability with the web ecosystem.
          </p>
        </div>

        <div id="installation" className="space-y-4 scroll-mt-24">
          <h2 className="text-2xl font-bold border-b border-slate-100 pb-2">Installation</h2>
          <p className="text-slate-600">Currently, WAF is in an experimental phase. You can start a new project by cloning the core repository:</p>
          <pre className="bg-slate-50 p-4 rounded-xl border border-slate-100 font-mono text-sm overflow-x-auto text-slate-800">
            git clone https://github.com/Open-Tech-Foundation/waf-core my-app{"\n"}
            cd my-app{"\n"}
            bun install{"\n"}
            bun dev
          </pre>
        </div>
      </section>

      {/* 2. CORE CONCEPTS */}
      <section className="space-y-12">
        <div id="zero-vdom" className="space-y-4 scroll-mt-24">
          <h2 className="text-2xl font-bold border-b border-slate-100 pb-2">Zero-VDOM Architecture</h2>
          <p className="text-slate-600 leading-relaxed">
            When you write JSX in WAF, it is not transformed into `React.createElement` calls. 
            Instead, our compiler statically analyzes your templates and converts them into `document.createElement`, `appendChild`, and direct attribute assignments. 
            When state changes, only the specific DOM node bound to that state is updated. No diffing, no reconciliation loop.
          </p>
        </div>

        <div id="web-components" className="space-y-4 scroll-mt-24">
          <h2 className="text-2xl font-bold border-b border-slate-100 pb-2">Web Components Under the Hood</h2>
          <p className="text-slate-600 leading-relaxed">
            Every capitalized function in WAF that contains JSX syntax (e.g., `function Button()`) is automatically compiled into a native custom element (`{"<waf-button>"}`). 
            Regular capitalized utility functions that do not return JSX are left untouched.
            This means you get style encapsulation and native lifecycle management for free on your UI components.
          </p>
          <pre className="bg-slate-50 p-4 rounded-xl border border-slate-100 font-mono text-sm overflow-x-auto text-slate-800">
            <span className="text-slate-400">// This WAF component:</span>{"\n"}
            <span className="text-indigo-600">export function</span> UserCard() {"{ return <div>User</div>; }"}{"\n\n"}
            <span className="text-slate-400">// Compiles to:</span>{"\n"}
            <span className="text-indigo-600">class</span> UserCardElement <span className="text-indigo-600">extends</span> HTMLElement {"{ ... }"}{"\n"}
            customElements.define("waf-usercard", UserCardElement);
          </pre>
        </div>

        <div id="props" className="space-y-4 scroll-mt-24">
          <h2 className="text-2xl font-bold border-b border-slate-100 pb-2">Component Props</h2>
          <p className="text-slate-600 leading-relaxed">
            Props are passed down just like in React, but they are fully reactive. If a parent updates a prop, the child component automatically updates without re-rendering the entire component.
          </p>
          <pre className="bg-slate-50 p-4 rounded-xl border border-slate-100 font-mono text-sm overflow-x-auto text-slate-800">
            <span className="text-indigo-600">export function</span> Greeting(props) {"{"}{"\n"}
            {"  "}<span className="text-slate-400">// props.name is reactive!</span>{"\n"}
            {"  "}<span className="text-indigo-600">return</span> <h1>Hello, {"{props.name}"}!</h1>;{"\n"}
            {"}"}
          </pre>
        </div>
      </section>

      {/* 3. REACTIVITY */}
      <section className="space-y-12">
        <div id="state" className="space-y-4 scroll-mt-24">
          <h2 className="text-2xl font-bold border-b border-slate-100 pb-2">The $state Macro</h2>
          <p className="text-slate-600 leading-relaxed">
            State management in WAF is powered by signals, but you never have to deal with `.value`. The compiler automatically tracks variables declared with `$state()` and injects reactivity seamlessly.
          </p>
          <pre className="bg-slate-50 p-4 rounded-xl border border-slate-100 font-mono text-sm overflow-x-auto text-slate-800">
            <span className="text-indigo-600">const</span> count = <span className="text-[#ff851b]">$state</span>(0);{"\n\n"}
            <span className="text-slate-400">// Just reassign or mutate directly</span>{"\n"}
            count++;{"\n"}
            count = 10;
          </pre>
        </div>

        <div id="derived" className="space-y-4 scroll-mt-24">
          <h2 className="text-2xl font-bold border-b border-slate-100 pb-2">The $derived Macro</h2>
          <p className="text-slate-600 leading-relaxed">
            Use `$derived` to create computed values that automatically update whenever their dependencies change. These are cached and only re-evaluate when necessary.
          </p>
          <pre className="bg-slate-50 p-4 rounded-xl border border-slate-100 font-mono text-sm overflow-x-auto text-slate-800">
            <span className="text-indigo-600">const</span> count = <span className="text-[#ff851b]">$state</span>(2);{"\n"}
            <span className="text-indigo-600">const</span> doubled = <span className="text-[#ff851b]">$derived</span>(() =&gt; count * 2);{"\n"}
            <span className="text-slate-400">// doubled is 4, automatically becomes 6 if count changes to 3</span>
          </pre>
        </div>

        <div id="effect" className="space-y-4 scroll-mt-24">
          <h2 className="text-2xl font-bold border-b border-slate-100 pb-2">The $effect Macro</h2>
          <p className="text-slate-600 leading-relaxed">
            To run side effects when state changes (like fetching data or logging), use `$effect`. It automatically tracks which states you read inside the function.
          </p>
          <pre className="bg-slate-50 p-4 rounded-xl border border-slate-100 font-mono text-sm overflow-x-auto text-slate-800">
            <span className="text-[#ff851b]">$effect</span>(() =&gt; {"{"}{"\n"}
            {"  "}console.log(`The count is now ${"{count}"}`);{"\n"}
            {"}"});
          </pre>
        </div>
      </section>

      {/* 4. ROUTING */}
      <section className="space-y-12">
        <div id="file-routing" className="space-y-4 scroll-mt-24">
          <h2 className="text-2xl font-bold border-b border-slate-100 pb-2">File-based Routing</h2>
          <p className="text-slate-600 leading-relaxed">
            WAF uses a file-system based router. Any file named `page.jsx` inside the `app/` directory becomes a route.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-600">
            <li><code className="text-sm bg-slate-100 px-1 rounded">app/page.jsx</code> → <code className="text-sm text-[#ff851b]">/</code></li>
            <li><code className="text-sm bg-slate-100 px-1 rounded">app/about/page.jsx</code> → <code className="text-sm text-[#ff851b]">/about</code></li>
            <li><code className="text-sm bg-slate-100 px-1 rounded">app/blog/[id]/page.jsx</code> → <code className="text-sm text-[#ff851b]">/blog/:id</code> (Dynamic Route)</li>
            <li><code className="text-sm bg-slate-100 px-1 rounded">app/docs/[...slug]/page.jsx</code> → <code className="text-sm text-[#ff851b]">/docs/*</code> (Catch-all Route)</li>
          </ul>
        </div>

        <div id="layouts" className="space-y-4 scroll-mt-24">
          <h2 className="text-2xl font-bold border-b border-slate-100 pb-2">Layouts</h2>
          <p className="text-slate-600 leading-relaxed">
            Use `layout.jsx` to wrap your pages with shared UI like navigation bars or sidebars. Layouts can be nested indefinitely. The matched child route is passed via `props.children`.
          </p>
          <pre className="bg-slate-50 p-4 rounded-xl border border-slate-100 font-mono text-sm overflow-x-auto text-slate-800">
            <span className="text-indigo-600">export default function</span> DashboardLayout(props) {"{"}{"\n"}
            {"  "}<span className="text-indigo-600">return</span> ({"\n"}
            {"    "}&lt;div className="dashboard"&gt;{"\n"}
            {"      "}&lt;Sidebar /&gt;{"\n"}
            {"      "}&lt;main&gt;{"{"}props.children{"}"}&lt;/main&gt;{"\n"}
            {"    "}&lt;/div&gt;{"\n"}
            {"  "});{"\n"}
            {"}"}
          </pre>
        </div>

        <div id="router-api" className="space-y-4 scroll-mt-24">
          <h2 className="text-2xl font-bold border-b border-slate-100 pb-2">Router API</h2>
          <p className="text-slate-600 leading-relaxed">
            The global `router` singleton gives you programmatic control over navigation and reactive access to URL state.
          </p>
          <pre className="bg-slate-50 p-4 rounded-xl border border-slate-100 font-mono text-sm overflow-x-auto text-slate-800">
            <span className="text-indigo-600">import</span> {"{ router }"} <span className="text-indigo-600">from</span> "@waf/router";{"\n\n"}
            <span className="text-slate-400">// Reactive signals</span>{"\n"}
            &lt;div&gt;Current Path: {"{"}router.pathname{"}"}&lt;/div&gt;{"\n"}
            &lt;div&gt;Search: {"{"}router.searchParams.get("q"){"}"}&lt;/div&gt;{"\n\n"}
            <span className="text-slate-400">// Navigation methods</span>{"\n"}
            {"<button onclick={() => router.push('/login')}>Login</button>\n"}
            {"<button onclick={() => router.replace('/home')}>Home</button>\n"}
          </pre>
        </div>
      </section>

      {/* 5. UI PATTERNS */}
      <section className="space-y-12">
        <div id="lists" className="space-y-4 scroll-mt-24">
          <h2 className="text-2xl font-bold border-b border-slate-100 pb-2">List Rendering</h2>
          <p className="text-slate-600 leading-relaxed">
            Use standard JavaScript `.map()` to render lists. WAF automatically wraps the mapping in a reactive execution context, meaning the list updates precisely when the array mutates.
          </p>
          <pre className="bg-slate-50 p-4 rounded-xl border border-slate-100 font-mono text-sm overflow-x-auto text-slate-800">
            <span className="text-indigo-600">const</span> users = <span className="text-[#ff851b]">$state</span>(["Alice", "Bob", "Charlie"]);{"\n\n"}
            <span className="text-indigo-600">return</span> ({"\n"}
            {"  <ul>\n"}
            {"    {users.map(u => <li>{u}</li>)}\n"}
            {"  </ul>\n"}
            );
          </pre>
        </div>

        <div id="conditionals" className="space-y-4 scroll-mt-24">
          <h2 className="text-2xl font-bold border-b border-slate-100 pb-2">Conditional Rendering</h2>
          <p className="text-slate-600 leading-relaxed">
            Use standard logical operators (`&&`) or ternary expressions (`? :`) for conditional UI. WAF will intelligently mount and unmount these DOM fragments dynamically.
          </p>
          <pre className="bg-slate-50 p-4 rounded-xl border border-slate-100 font-mono text-sm overflow-x-auto text-slate-800">
            <span className="text-indigo-600">const</span> isLoggedIn = <span className="text-[#ff851b]">$state</span>(false);{"\n\n"}
            <span className="text-indigo-600">return</span> ({"\n"}
            {"  "}&lt;div&gt;{"\n"}
            {"    "}{"{"}isLoggedIn ? &lt;Dashboard /&gt; : &lt;Login /&gt;{"}"}{"\n"}
            {"    "}{"{"}!isLoggedIn && &lt;span&gt;Please sign in&lt;/span&gt;{"}"}{"\n"}
            {"  "}&lt;/div&gt;{"\n"}
            );
          </pre>
        </div>

        <div id="lifecycle" className="space-y-4 scroll-mt-24">
          <h2 className="text-2xl font-bold border-b border-slate-100 pb-2">Lifecycle Hooks</h2>
          <p className="text-slate-600 leading-relaxed">
            If you need to interact with the DOM after the component mounts, or clean up intervals when it unmounts, use `onMount` and `onCleanup`.
          </p>
          <pre className="bg-slate-50 p-4 rounded-xl border border-slate-100 font-mono text-sm overflow-x-auto text-slate-800">
            <span className="text-indigo-600">import</span> {"{ onMount, onCleanup }"} <span className="text-indigo-600">from</span> "waf";{"\n\n"}
            <span className="text-indigo-600">export function</span> Timer() {"{"}{"\n"}
            {"  "}<span className="text-indigo-600">const</span> time = <span className="text-[#ff851b]">$state</span>(0);{"\n\n"}
            {"  "}onMount(() =&gt; {"{"}{"\n"}
            {"    "}<span className="text-indigo-600">const</span> timer = setInterval(() =&gt; time++, 1000);{"\n"}
            {"    "}onCleanup(() =&gt; clearInterval(timer));{"\n"}
            {"  "}{"});"}{"\n\n"}
            {"  "}<span className="text-indigo-600">return</span> &lt;div&gt;Time: {"{"}time{"}"}&lt;/div&gt;;{"\n"}
            {"}"}
          </pre>
        </div>
      </section>

    </div>
  );
}
