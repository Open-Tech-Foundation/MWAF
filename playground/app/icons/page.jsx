/** SVG Icon Gallery - Zero VDOM Framework */
export default function IconsPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-white tracking-tight">SVG Icon Gallery</h1>
        <p className="text-slate-400 mt-3 text-lg">
          Zero-VDOM, compiler-driven SVG rendering. 
          Copy raw JSX from any library and it just works.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Section: Lucide Style */}
        <section className="p-8 bg-slate-800/50 rounded-3xl border border-slate-700 backdrop-blur-sm shadow-xl">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-3 text-white">
            <LucideCamera className="text-indigo-400" /> Lucide Style
          </h2>
          <div className="flex flex-wrap gap-8 items-center justify-center py-4">
            <LucideCamera size={56} className="text-blue-400" />
            <LucideHeart size={56} className="text-rose-400 fill-rose-500/20" />
            <LucideZap size={56} className="text-amber-400 fill-amber-500/20" />
          </div>
          <div className="mt-8 pt-6 border-t border-slate-700/50">
            <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
              Source: Raw JSX from Lucide
            </p>
          </div>
        </section>

        {/* Section: Heroicons Style */}
        <section className="p-8 bg-slate-800/50 rounded-3xl border border-slate-700 backdrop-blur-sm shadow-xl">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-3 text-white">
            <HeroUser className="text-indigo-400" /> Heroicons Style
          </h2>
          <div className="flex flex-wrap gap-8 items-center justify-center py-4">
            <HeroUser className="w-14 h-14 text-indigo-400" />
            <HeroCheck className="w-14 h-14 text-emerald-400" />
            <HeroBell className="w-14 h-14 text-orange-400" />
          </div>
          <div className="mt-8 pt-6 border-t border-slate-700/50">
            <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
              Source: Raw JSX from Heroicons
            </p>
          </div>
        </section>
      </div>

      <div className="mt-12 p-8 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
        <h3 className="text-lg font-semibold text-indigo-300 mb-3 flex items-center gap-2">
          ✨ Try it yourself!
        </h3>
        <p className="text-slate-300 leading-relaxed mb-6">
          Go to <a href="https://lucide.dev" target="_blank" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4 decoration-indigo-500/30">lucide.dev</a>, click any icon, select "Copy JSX", and paste it below. 
        </p>
        
        <LiveSandbox />
      </div>
    </div>
  );
}

function LiveSandbox() {
  let input = $state(`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-arrow-up-right"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>`);

  const previewRef = $ref();

  $effect(() => {
    if (!previewRef) return;
    
    // Clean up input: remove newlines and potential component wrappers
    let raw = input.trim();
    
    // Simple heuristic to extract the <svg> part if wrapped in a function
    const svgMatch = raw.match(/<svg[\s\S]*<\/svg>/);
    if (svgMatch) {
      raw = svgMatch[0];
    }

    // Convert JSX-style attributes to standard SVG attributes
    const attributeMap = {
      'strokeWidth': 'stroke-width',
      'strokeLinecap': 'stroke-linecap',
      'strokeLinejoin': 'stroke-linejoin',
      'fillOpacity': 'fill-opacity',
      'strokeOpacity': 'stroke-opacity',
      'stopColor': 'stop-color',
      'stopOpacity': 'stop-opacity',
      'clipPath': 'clip-path',
      'fontSize': 'font-size',
      'fontWeight': 'font-weight',
      'textAnchor': 'text-anchor',
      'dominantBaseline': 'dominant-baseline'
    };

    let processed = raw;
    Object.entries(attributeMap).forEach(([jsx, svg]) => {
      processed = processed.replace(new RegExp(jsx, 'g'), svg);
    });

    // Remove any JSX braces like width={size} or stroke={color}
    // and replace them with the inner value if it's a number/string literal,
    // or a default if it's a variable reference.
    processed = processed.replace(/=\{([^}]+)\}/g, (match, p1) => {
      // If it's a number or a quoted string, use it.
      if (!isNaN(p1) || p1.startsWith('"') || p1.startsWith("'")) {
        return `="${p1.replace(/['"]/g, '')}"`;
      }
      // Otherwise, it's likely a variable like {size}, use a fallback.
      return '="currentColor"';
    });

    previewRef.innerHTML = processed;
  });

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1">
        <textarea
          value={input}
          onInput={(e) => input = e.target.value}
          placeholder="Paste JSX SVG here..."
          className="w-full h-48 p-4 bg-slate-900 text-indigo-300 font-mono text-sm rounded-xl border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-none"
        />
      </div>
      
      <div className="w-full lg:w-48 h-48 flex items-center justify-center bg-slate-900/50 rounded-xl border border-slate-700 overflow-hidden">
        <div ref={previewRef} className="text-white scale-150" />
      </div>
    </div>
  );
}

// --- Raw JSX Icon Sources ---

function LucideCamera({ size = 24, className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}

function LucideHeart({ size = 24, className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function LucideZap({ size = 24, className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 14.71 13.09 3 11.23 11h8.77L10.91 21 12.77 13H4z" />
    </svg>
  );
}

function HeroUser({ className = "w-6 h-6" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  );
}

function HeroCheck({ className = "w-6 h-6" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  );
}

function HeroBell({ className = "w-6 h-6" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
    </svg>
  );
}
