export default function Tabs(props) {
  let activeTab = $state(0);

  return (
    <div className="border border-[var(--border)] rounded-2xl overflow-hidden bg-[var(--bg-main)] shadow-sm border-t-2 border-t-accent">
      <div className="flex border-b border-[var(--border)] bg-[var(--bg-surface)]/50 p-1.5 gap-1.5">
        {props.tabs.map((tab, index) => (
          <button
            onclick={() => activeTab = index}
            className={`
              px-4 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer
              ${activeTab === index 
                ? 'bg-[var(--bg-main)] text-accent shadow-sm border border-[var(--border)]' 
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)]/50'}
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
