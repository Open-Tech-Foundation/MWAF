import Link from "../../framework/router/Link.wc.jsx";

export default function WebsiteLayout(props) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="w-8 h-8" />
          <span className="font-bold tracking-tight text-lg">WAF</span>
        </div>
        
        <nav className="flex gap-8 text-sm font-medium text-slate-500">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <Link href="/docs" className="hover:text-black transition-colors">Docs</Link>
          <a href="https://github.com/Open-Tech-Foundation" target="_blank" className="hover:text-black transition-colors">GitHub</a>
        </nav>
      </header>

      <main className="flex-1 flex flex-col">
        {props.children}
      </main>

      <footer className="py-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center px-8 text-xs text-slate-400 bg-slate-50 mt-auto">
        <div>© 2026 Open-Tech-Foundation. Experimental.</div>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-black">Twitter</a>
          <a href="#" className="hover:text-black">Discord</a>
        </div>
      </footer>
    </div>
  );
}
