import { signal } from "@preact/signals";
import { mapped } from "../../framework/runtime/dom";

export default function ProductsPage() {
  const initialData = Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
    price: Math.floor(Math.random() * 1000)
  }));

  const productsNaive = signal([...initialData]);
  const productsOptimized = signal([...initialData]);

  const naiveTime = signal(0);
  const optimizedTime = signal(0);

  const shuffle = () => {
    const newOrder = [...productsOptimized.value].sort(() => Math.random() - 0.5);
    
    // 1. Measure Naive Update
    const s1 = performance.now();
    productsNaive.value = newOrder;
    naiveTime.value = (performance.now() - s1).toFixed(2);
    
    // 2. Measure Optimized Update
    const s2 = performance.now();
    productsOptimized.value = newOrder;
    optimizedTime.value = (performance.now() - s2).toFixed(2);
  };

  const OptimizedList = mapped(productsOptimized, (p) => (
    <div key={p.id} className="p-2 bg-slate-900 border border-slate-800 rounded flex justify-between items-center">
      <span className="text-white text-xs">{p.name}</span>
      <input placeholder="State test" className="w-20 bg-slate-950 border border-slate-800 rounded px-1 text-[10px] text-slate-500 focus:border-emerald-500/50" />
    </div>
  ));

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-slate-800 p-6 rounded-xl border border-slate-700">
        <div>
          <h1 className="text-3xl font-black text-white">Performance Lab</h1>
          <p className="text-slate-400 mt-1">Comparing Reconciliation vs. Full Re-render (1000 items)</p>
        </div>
        <button onclick={shuffle} className="bg-indigo-600 px-8 py-4 rounded-xl text-white font-bold hover:bg-indigo-500 active:scale-95 transition-all shadow-lg shadow-indigo-500/20">
          Shuffle Both Lists
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Naive List */}
        <div className="space-y-4">
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex justify-between items-center">
            <div>
              <h2 className="text-red-400 font-bold uppercase tracking-widest text-xs">Naive Rendering (.map)</h2>
              <p className="text-slate-400 text-sm mt-1">Wipes and recreates everything.</p>
            </div>
            <div className="text-red-400 font-mono font-bold text-lg">{naiveTime.value}ms</div>
          </div>
          <div className="grid grid-cols-3 gap-1 h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {productsNaive.value.map(p => (
              <div key={p.id} className="p-2 bg-slate-900 border border-slate-800 rounded flex justify-between items-center">
                <span className="text-white text-xs">{p.name}</span>
                <input placeholder="State test" className="w-20 bg-slate-950 border border-slate-800 rounded px-1 text-[10px] text-slate-500 focus:border-red-500/50" />
              </div>
            ))}
          </div>
        </div>

        {/* Optimized List */}
        <div className="space-y-4">
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex justify-between items-center">
            <div>
              <h2 className="text-emerald-400 font-bold uppercase tracking-widest text-xs">Optimized Rendering (mapped)</h2>
              <p className="text-slate-400 text-sm mt-1">Keyed reconciliation (moves nodes).</p>
            </div>
            <div className="text-emerald-400 font-mono font-bold text-lg">{optimizedTime.value}ms</div>
          </div>
          <div className="grid grid-cols-3 gap-1 h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {OptimizedList}
          </div>
        </div>
      </div>
    </div>
  );
}
