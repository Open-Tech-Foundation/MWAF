import { router, $state, $effect } from "@opentf/web";

export default function CompilerOutput() {
  const code = $state("");
  const isOpen = $state(false);
  const loading = $state(false);

  $effect(() => {
    if (isOpen && router.currentPage?.sourceFile) {
      loading = true;
      const file = router.currentPage.sourceFile;
      
      // Fetch the RAW source instead of ?compiled
      fetch(file)
        .then(res => res.text())
        .then(source => {
          if (!window.Babel) {
            code = "// Babel not loaded yet...";
            return;
          }

          try {
            const isPage = file.endsWith("page.jsx") || file.endsWith("layout.jsx") || file.endsWith("404.jsx");
            const filename = isPage ? file.replace(".jsx", ".page.jsx") : file;

            const result = window.Babel.transform(source, {
              filename: filename,
              plugins: [
                ["opentf-web", { runtimeSource: "/standalone/web.js" }]
              ],
              presets: [],
              parserOpts: {
                plugins: ["jsx", "typescript"]
              }
            });
            code = result.code;
          } catch (err) {
            code = "Compilation Error:\n" + err.message;
          }
          loading = false;
        })
        .catch(err => {
          code = "Error loading source: " + err.message;
          loading = false;
        });
    }
  });

  return (
    <div className={`fixed bottom-0 right-0 w-full md:w-[600px] bg-slate-950 border-t md:border-l border-slate-700 shadow-2xl transition-all duration-300 z-[1000] ${isOpen ? 'h-[500px]' : 'h-10'}`}>
      <div 
        className="h-10 px-4 flex items-center justify-between cursor-pointer hover:bg-slate-900 transition-colors"
        onclick={() => isOpen = !isOpen}
      >
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${loading ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`}></div>
          <span className="text-xs font-mono font-bold text-slate-400">COMPILER OUTPUT</span>
          {router.currentPage?.sourceFile && (
            <span className="text-[10px] text-slate-500 truncate max-w-[200px]">
              {router.currentPage.sourceFile}
            </span>
          )}
        </div>
        <div className="text-slate-500 text-xs">
          {isOpen ? 'Collapse' : 'Expand'}
        </div>
      </div>
      
      {isOpen && (
        <div className="p-4 h-[460px] overflow-auto custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center h-full text-slate-500 animate-pulse font-mono text-sm">
              Compiling...
            </div>
          ) : (
            <pre className="text-xs font-mono text-emerald-300 leading-relaxed">
              <code>{code}</code>
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
