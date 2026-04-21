import Link from "../../../framework/router/Link.wc.jsx";

export default function DocsLayout(props) {
  return (
    <div className="flex-1 max-w-7xl mx-auto px-8 w-full flex gap-12 py-12">
      <aside className="w-64 shrink-0 hidden md:block">
        <div className="sticky top-24 space-y-8">
          
          <div>
            <h4 className="font-bold text-slate-900 mb-3 px-2">Getting Started</h4>
            <div className="flex flex-col space-y-1">
              <Link href="/docs#introduction" className="px-2 py-1.5 text-sm text-slate-500 hover:text-accent hover:bg-accent/5 rounded-md transition-colors">Introduction</Link>
              <Link href="/docs#installation" className="px-2 py-1.5 text-sm text-slate-500 hover:text-accent hover:bg-accent/5 rounded-md transition-colors">Installation</Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-3 px-2">Core Concepts</h4>
            <div className="flex flex-col space-y-1">
              <Link href="/docs#zero-vdom" className="px-2 py-1.5 text-sm text-slate-500 hover:text-accent hover:bg-accent/5 rounded-md transition-colors">Zero-VDOM</Link>
              <Link href="/docs#web-components" className="px-2 py-1.5 text-sm text-slate-500 hover:text-accent hover:bg-accent/5 rounded-md transition-colors">Web Components</Link>
              <Link href="/docs#props" className="px-2 py-1.5 text-sm text-slate-500 hover:text-accent hover:bg-accent/5 rounded-md transition-colors">Component Props</Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-3 px-2">Reactivity</h4>
            <div className="flex flex-col space-y-1">
              <Link href="/docs#state" className="px-2 py-1.5 text-sm text-slate-500 hover:text-accent hover:bg-accent/5 rounded-md transition-colors">$state Macro</Link>
              <Link href="/docs#derived" className="px-2 py-1.5 text-sm text-slate-500 hover:text-accent hover:bg-accent/5 rounded-md transition-colors">$derived Macro</Link>
              <Link href="/docs#effect" className="px-2 py-1.5 text-sm text-slate-500 hover:text-accent hover:bg-accent/5 rounded-md transition-colors">$effect Macro</Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-3 px-2">Routing</h4>
            <div className="flex flex-col space-y-1">
              <Link href="/docs#file-routing" className="px-2 py-1.5 text-sm text-slate-500 hover:text-accent hover:bg-accent/5 rounded-md transition-colors">File-based Routing</Link>
              <Link href="/docs#layouts" className="px-2 py-1.5 text-sm text-slate-500 hover:text-accent hover:bg-accent/5 rounded-md transition-colors">Layouts</Link>
              <Link href="/docs#router-api" className="px-2 py-1.5 text-sm text-slate-500 hover:text-accent hover:bg-accent/5 rounded-md transition-colors">Router API</Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-3 px-2">UI Patterns</h4>
            <div className="flex flex-col space-y-1">
              <Link href="/docs#lists" className="px-2 py-1.5 text-sm text-slate-500 hover:text-accent hover:bg-accent/5 rounded-md transition-colors">List Rendering</Link>
              <Link href="/docs#conditionals" className="px-2 py-1.5 text-sm text-slate-500 hover:text-accent hover:bg-accent/5 rounded-md transition-colors">Conditional Rendering</Link>
              <Link href="/docs#lifecycle" className="px-2 py-1.5 text-sm text-slate-500 hover:text-accent hover:bg-accent/5 rounded-md transition-colors">Lifecycle Hooks</Link>
              <Link href="/docs#refs" className="px-2 py-1.5 text-sm text-slate-500 hover:text-accent hover:bg-accent/5 rounded-md transition-colors">DOM References ($ref)</Link>
            </div>
          </div>

        </div>
      </aside>
      <main className="flex-1 min-w-0">
        {props.children}
      </main>
    </div>
  );
}
