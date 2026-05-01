import { Link } from "@opentf/web";
import CodeBlock from "./components/CodeBlock.jsx";
import Counter from "./components/Counter.jsx";
import TodoList from "./components/TodoList.jsx";

export default function HomePage() {
  const counterCode = `export default function Counter() {
  let count = $state(0);

  return (
    <div className="flex gap-4 items-center">
      <button onclick={() => count--}>-</button>
      <span className="text-2xl font-bold">{count}</span>
      <button onclick={() => count++}>+</button>
    </div>
  );
}`;

  const counterCompiled = `class CounterElement extends HTMLElement {
  connectedCallback() {
    let count = _signal(0);
    const rootElement = (() => {
      const el0 = document.createElement("div");
      const el1 = document.createElement("button");
      el1.onclick = () => count.value--;
      el1.textContent = "-";
      el0.appendChild(el1);
      
      const el3 = document.createElement("span");
      _renderDynamic(el3, () => count.value);
      el0.appendChild(el3);
      
      const el4 = document.createElement("button");
      el4.onclick = () => count.value++;
      el4.textContent = "+";
      el0.appendChild(el4);
      return el0;
    })();
    this.appendChild(rootElement);
  }
}
customElements.define("web-counter", CounterElement);`;

  const todoCode = `export default function TodoList() {
  let todos = $state([{ id: 1, text: "Learn Web App Framework", done: false }]);
  
  const toggle = (id) => {
    todos = todos.map(t => t.id === id ? { ...t, done: !t.done } : t);
  };
  
  return (
    <ul className="space-y-2">
      {todos.map(todo => (
        <li key={todo.id}>
          <input type="checkbox" checked={todo.done} onchange={() => toggle(todo.id)} />
          <span className={todo.done ? "line-through" : ""}>{todo.text}</span>
        </li>
      ))}
    </ul>
  );
}`;

  const todoCompiled = `class TodoListElement extends HTMLElement {
  connectedCallback() {
    let todos = _signal([{ id: 1, text: "Learn Web App Framework", done: false }]);
    const toggle = id => {
      todos.value = todos.value.map(t => t.id === id ? { ...t, done: !t.done } : t);
    };
    const rootElement = (() => {
      const el0 = document.createElement("ul");
      _renderDynamic(el0, () => todos.value.map(todo => (() => {
        const el0 = document.createElement("li");
        el0._key = todo.id;
        const el1 = document.createElement("input");
        el1.setAttribute("type", "checkbox");
        _effect(() => el1.checked = todo.done);
        el1.onchange = () => toggle(todo.id);
        el0.appendChild(el1);
        const el2 = document.createElement("span");
        _effect(() => el2.className = todo.done ? "line-through" : "");
        _renderDynamic(el2, () => todo.text);
        el0.appendChild(el2);
        return el0;
      })()));
      return el0;
    })();
    this.appendChild(rootElement);
  }
}
customElements.define("web-todolist", TodoListElement);`;

  return (
    <div className="flex-1 max-w-6xl mx-auto px-8 w-full pb-24">
      {/* Hero Section */}
      <section className="py-24 text-center max-w-3xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ff851b]/10 text-[#ff851b] border border-[#ff851b]/20 rounded-full text-[10px] font-bold uppercase tracking-wider">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff851b] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff851b]"></span>
          </span>
          Experimental
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]">
          The <span className="text-accent">native-first</span> framework for <br />
          modern web apps.
        </h1>

        <p className="text-xl text-slate-500 leading-relaxed">
          A high-performance, zero-VDOM framework that compiles JSX to native DOM.
          <br />
          Built with signals and standard Web Components.
        </p>

        <div className="flex justify-center gap-4 pt-4">
          <Link href="/docs" className="inline-flex items-center justify-center bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-md active:scale-95 gap-2">
            Get Started 🚀
          </Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
          <div className="text-3xl">⚡️</div>
          <h3 className="font-bold text-slate-900">Zero VDOM</h3>
          <p className="text-sm text-slate-500">Eliminate diffing overhead. Web App Framework maps state changes directly to the DOM for unmatched runtime performance.</p>
        </div>

        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
          <div className="text-3xl">🧩</div>
          <h3 className="font-bold text-slate-900">Native Components</h3>
          <p className="text-sm text-slate-500">Interoperate with the entire web ecosystem. Every Web App Framework component is a standard Web Component.</p>
        </div>

        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
          <div className="text-3xl">⚛️</div>
          <h3 className="font-bold text-slate-900">Atomic Reactivity</h3>
          <p className="text-sm text-slate-500">Powered by $state macro. Fine-grained updates ensure only the specific parts of the UI change when data does.</p>
        </div>

        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
          <div className="text-3xl">🛣️</div>
          <h3 className="font-bold text-slate-900">File-based Routing</h3>
          <p className="text-sm text-slate-500">A familiar, powerful routing system supporting nested layouts, dynamic segments, and catch-all paths.</p>
        </div>
      </section>
      {/* Capabilities Matrix */}
      <section className="py-24 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Capabilities & Roadmap</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">A transparent look at our current features and future direction.</p>
        </div>

        <div className="max-w-4xl mx-auto overflow-hidden bg-white border border-slate-200 rounded-3xl shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Feature</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-8 py-5 font-bold text-slate-900">CSR (Client Rendering)</td>
                  <td className="px-8 py-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                      Supported
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-500">High-performance SPA engine ready for production.</td>
                </tr>
                <tr>
                  <td className="px-8 py-5 font-bold text-slate-900">Zero-VDOM Updates</td>
                  <td className="px-8 py-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                      Supported
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-500">Standard JSX support, almost on par with industry leaders. Hardening with massive test coverage.</td>
                </tr>
                <tr>
                  <td className="px-8 py-5 font-bold text-slate-900">Reactive Macros</td>
                  <td className="px-8 py-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                      Supported
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-500">Boilerplate-free reactivity system ($state, $derived) built on fine-grained Signals.</td>
                </tr>
                <tr>
                  <td className="px-8 py-5 font-bold text-slate-900">Performance Defaults</td>
                  <td className="px-8 py-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                      Supported
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-500">Zero-VDOM and minimal core runtime for maximum speed.</td>
                </tr>
                <tr>
                  <td className="px-8 py-5 font-bold text-slate-900">Route-level Splitting</td>
                  <td className="px-8 py-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                      Supported
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-500">Automatic code splitting for every route segment.</td>
                </tr>
                <tr>
                  <td className="px-8 py-5 font-bold text-slate-900">Lazy Loading</td>
                  <td className="px-8 py-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-wider border border-amber-100">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      Planned
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-500 italic">Fine-grained component-level lazy loading and prefetching.</td>
                </tr>
                <tr>
                  <td className="px-8 py-5 font-bold text-slate-900">File-based Router</td>
                  <td className="px-8 py-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                      Supported
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-500">Next.js style directory routing with client-side navigation.</td>
                </tr>
                <tr>
                  <td className="px-8 py-5 font-bold text-slate-900">Nested Layouts</td>
                  <td className="px-8 py-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                      Supported
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-500">Hierarchical UI structures with persistent state across route changes.</td>
                </tr>
                <tr>
                  <td className="px-8 py-5 font-bold text-slate-900">Route Guards</td>
                  <td className="px-8 py-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                      Supported
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-500">Protect routes with custom logic and redirection.</td>
                </tr>
                <tr>
                  <td className="px-8 py-5 font-bold text-slate-900">Middleware</td>
                  <td className="px-8 py-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-wider border border-amber-100">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      Planned
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-500 italic">Advanced request processing and transformations.</td>
                </tr>
                <tr>
                  <td className="px-8 py-5 font-bold text-slate-900">Enterprise Forms</td>
                  <td className="px-8 py-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                      Supported
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-500">Deep-proxy reactive forms with async validation.</td>
                </tr>
                <tr>
                  <td className="px-8 py-5 font-bold text-slate-900">Testing Library</td>
                  <td className="px-8 py-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                      Supported
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-500">React Testing Library-equivalent utilities for native components.</td>
                </tr>
                <tr>
                  <td className="px-8 py-5 font-bold text-slate-900">CLI Scaffolding Tool</td>
                  <td className="px-8 py-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                      Supported
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-500">Get started instantly with our `create-web` project generator.</td>
                </tr>
                <tr>
                  <td className="px-8 py-5 font-bold text-slate-900">Security First</td>
                  <td className="px-8 py-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                      Supported
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-500">XSS-safe by default (no innerHTML) and built-in route protection.</td>
                </tr>
                <tr>
                  <td className="px-8 py-5 font-bold text-slate-900">SSR (Server Rendering)</td>
                  <td className="px-8 py-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-wider border border-amber-100">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      Planned
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-500 italic">Planned for unified full-stack support.</td>
                </tr>
                <tr>
                  <td className="px-8 py-5 font-bold text-slate-900">TypeScript Support</td>
                  <td className="px-8 py-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-wider border border-amber-100">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      Planned
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-500 italic">First-class type safety and TSX support across the ecosystem.</td>
                </tr>
                <tr>
                  <td className="px-8 py-5 font-bold text-slate-900">MDX Support</td>
                  <td className="px-8 py-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-wider border border-amber-100">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      Planned
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-500 italic">Integrated MDX engine for high-performance documentation and blogs.</td>
                </tr>
                <tr>
                  <td className="px-8 py-5 font-bold text-slate-900">Devtool Ecosystem</td>
                  <td className="px-8 py-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-wider border border-amber-100">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      Planned
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-500 italic">Browser extension with component, state, and network tracing capabilities.</td>
                </tr>
                <tr>
                  <td className="px-8 py-5 font-bold text-slate-900">Internationalization (i18n)</td>
                  <td className="px-8 py-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-wider border border-amber-100">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      Planned
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-500 italic">Routing-level i18n, translation loading, and locale-aware formatting.</td>
                </tr>
                <tr>
                  <td className="px-8 py-5 font-bold text-slate-900">Accessibility (a11y)</td>
                  <td className="px-8 py-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-wider border border-amber-100">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      Planned
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-500 italic">Built-in ARIA helpers, a11y checks, and keyboard navigation defaults.</td>
                </tr>
                <tr>
                  <td className="px-8 py-5 font-bold text-slate-900">Dev Error Overlay</td>
                  <td className="px-8 py-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-wider border border-amber-100">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      Planned
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-500 italic">Rich error details and interactive stack traces for a superior dev experience.</td>
                </tr>
                <tr>
                  <td className="px-8 py-5 font-bold text-slate-900">High-speed Compiler</td>
                  <td className="px-8 py-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-wider border border-amber-100">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      Planned
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-500 italic">Future migration to a low-level, ultra-fast compilation engine.</td>
                </tr>
                <tr>
                  <td className="px-8 py-5 font-bold text-slate-900">SSG (Static Generation)</td>
                  <td className="px-8 py-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-wider border border-amber-100">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      Planned
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-500 italic">High-performance static site engine.</td>
                </tr>
                <tr>
                  <td className="px-8 py-5 font-bold text-slate-900">API Routes</td>
                  <td className="px-8 py-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-wider border border-amber-100">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      Planned
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-500 italic">Integrated server-side API endpoints for a unified full-stack experience.</td>
                </tr>
                <tr>
                  <td className="px-8 py-5 font-bold text-slate-900">Data Fetching</td>
                  <td className="px-8 py-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-wider border border-amber-100">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      Planned
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-500 italic">Integrated client-side fetching with caching and sync.</td>
                </tr>
                <tr>
                  <td className="px-8 py-5 font-bold text-slate-900">HMR (Hot Reloading)</td>
                  <td className="px-8 py-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-wider border border-amber-100">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      Planned
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-500 italic">Real-time dev experience via Vite/Bun.</td>
                </tr>
                <tr>
                  <td className="px-8 py-5 font-bold text-slate-900">CSS Modules</td>
                  <td className="px-8 py-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                      Supported
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-500">Native support for scoped styling via Vite.</td>
                </tr>
                <tr>
                  <td className="px-8 py-5 font-bold text-slate-900">TailwindCSS</td>
                  <td className="px-8 py-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                      Supported
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-500">Seamless integration with Utility-first CSS via Vite.</td>
                </tr>
                <tr>
                  <td className="px-8 py-5 font-bold text-slate-900">Image Optimization</td>
                  <td className="px-8 py-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-wider border border-amber-100">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      Planned
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-500 italic">Automated image processing and lazy-loading.</td>
                </tr>
                <tr>
                  <td className="px-8 py-5 font-bold text-slate-900">Font Optimization</td>
                  <td className="px-8 py-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-wider border border-amber-100">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      Planned
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-500 italic">Zero-layout-shift font delivery.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Demos Section */}
      <section className="py-24 space-y-24">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">Built for developers.</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">See how easy it is to build reactive applications with Web App Framework. No boilerplate, just standard JavaScript and JSX.</p>
        </div>

        {/* Counter Demo */}
        <div className="grid md:grid-cols-2 gap-8 items-center bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-12 border-b md:border-b-0 md:border-r border-slate-200 bg-slate-50 flex flex-col items-center justify-center min-h-[300px]">
            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Live Preview</div>
            <Counter />
          </div>
          <div className="p-8">
            <CodeBlock code={counterCode} compiled={counterCompiled} />
          </div>
        </div>

        {/* Todo List Demo */}
        <div className="grid md:grid-cols-2 gap-8 items-center bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-8 order-2 md:order-1">
            <CodeBlock code={todoCode} compiled={todoCompiled} />
          </div>
          <div className="p-12 border-t md:border-t-0 md:border-l border-slate-200 bg-slate-50 flex flex-col items-center justify-center min-h-[400px] order-1 md:order-2">
            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Live Preview</div>
            <TodoList />
          </div>
        </div>
      </section>
    </div>
  );
}
