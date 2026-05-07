import { $state, $effect, onMount, $ref } from "@opentf/web";
import compilerPlugin from "../standalone/compiler.js";
import MonacoEditor from "./Editor.jsx";
import CodeHighlighter from "./Highlighter.jsx";

export default function ReplPage() {
  let input = $state(`export default function App() {
  return (
    <div style="padding: 24px; font-family: system-ui, sans-serif; text-align: center;">
      <h1 style="color: #6366f1; margin: 0; font-size: 2.5rem;">Hello World!</h1>
      <p style="color: #64748b; margin-top: 12px; font-size: 1.1rem;">
        Welcome to the OpenTF Playground.
      </p>
    </div>
  );
}`);
  let output = $state("");
  let error = $state("");
  let activeTab = $state("preview");
  let isSandboxReady = $state(false);
  let iframeRef = $ref();

  onMount(() => {
    if (window.Babel && !window.Babel.availablePlugins["opentf-web"]) {
      window.Babel.registerPlugin("opentf-web", compilerPlugin);
    }

    const handleMessage = (event) => {
      if (event.data.type === "SANDBOX_READY") {
        isSandboxReady = true;
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  });

  const compileInBrowser = (code) => {
    try {
      const result = window.Babel.transform(code, {
        filename: "repl.page.jsx",
        plugins: [["opentf-web", { runtimeSource: "@opentf/web", dev: true }]],
        presets: [],
        parserOpts: { plugins: ["jsx", "typescript"] }
      });


      return { code: result.code };
    } catch (err) {
      return { error: err.message };
    }
  };

  $effect(() => {
    const code = input;
    const timer = setTimeout(() => {
      const result = compileInBrowser(code);
      if (result.error) error = result.error;
      else {
        output = result.code;
        error = "";
      }
    }, 300);
    return () => clearTimeout(timer);
  });

  $effect(() => {
    const iframe = iframeRef; 
    if (iframe && isSandboxReady && output && activeTab === "preview") {
      iframe.contentWindow.postMessage({ type: "REPL_UPDATE", code: output }, "*");
    }
  });

  return (
    <div className="flex flex-col gap-6 font-sans">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white">Explorer</h1>
          <p className="text-slate-400 text-sm">Real-time reactive playground.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px] bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl">
        <div className="flex flex-col border-r border-slate-700">
          <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 font-bold text-[10px] text-slate-500 tracking-widest uppercase">Editor</div>
          <div className="flex-1">
            <MonacoEditor 
              value={input} 
              language="javascript"
              onUpdate={(v) => input = v} 
            />
          </div>
        </div>

        <div className="flex flex-col bg-slate-800">
          <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex gap-2">
            <button 
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'preview' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
              onclick={() => activeTab = 'preview'}
            >
              PREVIEW
            </button>
            <button 
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'output' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
              onclick={() => activeTab = 'output'}
            >
              COMPILED
            </button>
          </div>

          <div className="flex-1 relative overflow-hidden bg-slate-950">
            {error && <div className="absolute inset-x-4 top-4 z-20 bg-red-950/80 border border-red-500/30 p-4 rounded-xl text-red-400 font-mono text-xs shadow-2xl backdrop-blur-md">{error}</div>}
            
            <div className={`h-full ${activeTab === 'preview' ? 'block' : 'hidden'}`}>
              <iframe ref={iframeRef} src="/preview.html" className="w-full h-full border-none" />
            </div>
            
            {activeTab === 'output' && (
              <div className="h-full flex flex-col overflow-hidden">
                <div className="flex-1 overflow-hidden">
                  <MonacoEditor 
                    value={output} 
                    readOnly={true} 
                    language="javascript"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
