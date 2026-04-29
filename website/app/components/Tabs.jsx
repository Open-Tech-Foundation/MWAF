export default function Tabs(props) {
  let activeTab = $state(0);

  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm border-t-2 border-t-accent">
      <div className="flex border-b border-slate-100 bg-slate-50/50 p-1.5 gap-1.5">
        {props.tabs.map((tab, index) => (
          <button
            onclick={() => activeTab = index}
            className={`
              px-4 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer
              ${activeTab === index 
                ? 'bg-white text-accent shadow-sm border border-slate-100' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'}
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-0">
        {props.tabs.map((tab, index) => (
          <div className={activeTab === index ? 'block' : 'hidden'}>
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}
