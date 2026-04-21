import Link from "../framework/router/Link.wc.jsx";

export default function GlobalLayout(props) {
  return (
    <div className="min-h-screen bg-slate-900 p-8 text-slate-100">
      <nav className="mb-8 flex gap-4 bg-slate-800 p-4 rounded shadow border border-slate-700">
        <Link href="/">Home</Link>
        <Link href="/login" className="hover:text-red-400">Login</Link>
        <Link href="/counter">Counter</Link>
        <Link href="/about">About</Link>
        <Link href="/post/1">Post 1</Link>
        <Link href="/post/2">Post 2</Link>
      </nav>
      <main className="bg-slate-800 p-8 rounded shadow border border-slate-700">
        {props.children}
      </main>
    </div>
  );
}
