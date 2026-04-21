import Link from "../../framework/router/Link.wc.jsx";

export default function HomePage() {
  const counterCode = `export default function Counter() {
  const count = $state(0);
  return (
    <div className="flex gap-4 items-center">
      <button onclick={() => count--} className="btn">-</button>
      <span className="text-2xl font-bold w-12 text-center">{count}</span>
      <button onclick={() => count++} className="btn">+</button>
    </div>
  );
}`;

  const todoCode = `export default function TodoList() {
  const todos = $state([{ id: 1, text: "Learn WAF", done: false }]);
  
  const toggle = (id) => {
    todos = todos.map(t => t.id === id ? { ...t, done: !t.done } : t);
  };
  
  return (
    <ul className="space-y-2">
      {todos.map(todo => (
        <li key={todo.id} className="flex gap-2">
          <input 
            type="checkbox" 
            checked={todo.done} 
            onchange={() => toggle(todo.id)} 
          />
          <span className={todo.done ? "line-through" : ""}>
            {todo.text}
          </span>
        </li>
      ))}
    </ul>
  );
}`;

  const count = $state(0);
  const todos = $state([{ id: 1, text: "Learn WAF", done: true }, { id: 2, text: "Build an App", done: false }]);

  const toggleTodo = (id) => {
    todos = todos.map(t => t.id === id ? { ...t, done: !t.done } : t);
  };

  const addTodo = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      todos = [...todos, { id: Date.now(), text: e.target.value.trim(), done: false }];
      e.target.value = '';
    }
  };

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
          The minimal framework for <br />
          <span className="text-accent">modern web apps.</span>
        </h1>
        
        <p className="text-xl text-slate-500 leading-relaxed">
          WAF is a high-performance, zero-VDOM framework that compiles JSX to native DOM. 
          Built with signals and standard Web Components.
        </p>

        <div className="flex justify-center gap-4 pt-4">
          <Link href="/docs" className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-slate-800 transition-all shadow-lg">
            Get Started
          </Link>
          <a href="https://github.com/Open-Tech-Foundation" className="bg-white text-slate-900 border border-slate-200 px-8 py-3 rounded-lg font-bold hover:bg-slate-50 transition-all">
            View on GitHub
          </a>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
          <div className="text-3xl">⚡️</div>
          <h3 className="font-bold text-slate-900">Zero VDOM</h3>
          <p className="text-sm text-slate-500">Eliminate diffing overhead. WAF maps state changes directly to the DOM for unmatched runtime performance.</p>
        </div>
        
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
          <div className="text-3xl">🧩</div>
          <h3 className="font-bold text-slate-900">Native Components</h3>
          <p className="text-sm text-slate-500">Interoperate with the entire web ecosystem. Every WAF component is a standard Web Component.</p>
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

      {/* Demos Section */}
      <section className="py-24 space-y-24">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">Built for developers.</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">See how easy it is to build reactive applications with WAF. No boilerplate, just standard JavaScript and JSX.</p>
        </div>

        {/* Counter Demo */}
        <div className="grid md:grid-cols-2 gap-8 items-center bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-12 border-b md:border-b-0 md:border-r border-slate-200 bg-slate-50 flex flex-col items-center justify-center min-h-[300px]">
            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Live Preview</div>
            <div className="flex gap-4 items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
              <button onclick={() => count--} className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-xl transition-colors">-</button>
              <span className="text-4xl font-bold w-16 text-center text-accent">{count}</span>
              <button onclick={() => count++} className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-xl transition-colors">+</button>
            </div>
          </div>
          <div className="p-8">
            <pre className="text-sm font-mono text-slate-800 overflow-x-auto">
              <code>{counterCode}</code>
            </pre>
          </div>
        </div>

        {/* Todo List Demo */}
        <div className="grid md:grid-cols-2 gap-8 items-center bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-8 order-2 md:order-1">
            <pre className="text-sm font-mono text-slate-800 overflow-x-auto">
              <code>{todoCode}</code>
            </pre>
          </div>
          <div className="p-12 border-t md:border-t-0 md:border-l border-slate-200 bg-slate-50 flex flex-col items-center justify-center min-h-[400px] order-1 md:order-2">
            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Live Preview</div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 w-full max-w-sm">
              <input 
                type="text" 
                placeholder="What needs to be done?" 
                onkeyup={addTodo}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 mb-4 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              />
              <ul className="space-y-3">
                {todos.map(todo => (
                  <li key={todo.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors">
                    <input 
                      type="checkbox" 
                      checked={todo.done} 
                      onchange={() => toggleTodo(todo.id)} 
                      className="w-5 h-5 accent-[#ff851b] rounded cursor-pointer"
                    />
                    <span className={todo.done ? "line-through text-slate-400" : "text-slate-700 font-medium"}>
                      {todo.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
