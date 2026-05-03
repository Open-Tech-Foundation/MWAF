export const targets = [
  { id: 'js', label: 'JavaScript', color: '#f7df1e', textColor: '#000' },
  { id: 'python', label: 'Python', color: '#3776ab', textColor: '#fff' },
  { id: 'go', label: 'Go', color: '#00add8', textColor: '#fff' },
  { id: 'java', label: 'Java', color: '#ed8b00', textColor: '#fff' },
  { id: 'ruby', label: 'Ruby', color: '#cc342d', textColor: '#fff' },
  { id: 'csharp', label: 'C#', color: '#239120', textColor: '#fff' },
  { id: 'php', label: 'PHP', color: '#777bb3', textColor: '#fff' },
  { id: 'cplusplus', label: 'C++', color: '#00599c', textColor: '#fff' },
];

const JavaScriptIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" fill="#F7DF1E" />
    <path d="M18.1797 15.545C17.9057 16.606 17.3647 17.394 16.5567 18C15.7497 18.605 14.6817 18.907 13.3527 18.907C12.0587 18.907 10.9567 18.605 10.0477 18C9.13966 17.395 8.49466 16.566 8.11366 15.513C7.73166 14.461 7.54066 13.294 7.54066 12.013C7.54066 10.713 7.73166 9.533 8.11366 8.473C8.49566 7.413 9.13966 6.571 10.0477 5.947C10.9567 5.323 12.0337 5.011 13.2787 5.011C14.4797 5.011 15.5047 5.299 16.3527 5.875C17.2007 6.451 17.8277 7.283 18.2337 8.371L16.0257 9.195C15.7557 8.591 15.3417 8.125 14.7837 7.797C14.2257 7.469 13.5787 7.305 12.8447 7.305C11.9347 7.305 11.1737 7.571 10.5617 8.103C9.95066 8.635 9.52566 9.395 9.28766 10.383C9.04866 11.371 8.92966 12.495 8.92966 13.755C8.92966 15.015 9.04866 16.139 9.28766 17.127C9.52566 18.115 10.0137 18.875 10.7517 19.407C11.4897 19.939 12.4147 20.205 13.5267 20.205C14.3477 20.205 15.0797 20.059 15.7237 19.767C16.3677 19.475 16.8617 19.065 17.2057 18.537C17.5497 18.009 17.7437 17.403 17.7877 16.719L15.3677 16.719L15.3677 15.545H18.1797Z" fill="black" />
    <path d="M15.3677 8.371V9.545H18.1797V8.371H15.3677Z" fill="black" />
  </svg>
);

const PythonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M12 2C10.897 2 10 2.897 10 4V6H8C6.897 6 6 6.897 6 8V12C6 13.103 6.897 14 8 14H10V16C10 17.103 10.897 18 12 18H14V20C14 21.103 14.897 22 16 22H20C21.103 22 22 21.103 22 20V16C22 14.897 21.103 14 20 14H16V12C16 10.897 15.103 10 14 10H12V8C12 6.897 11.103 6 10 6H8V4C8 2.897 8.897 2 10 2H12Z" fill="#3776AB" />
    <path d="M12 3C11.448 3 11 3.448 11 4V6.5H9C8.448 6.5 8 6.948 8 7.5V11C8 11.552 8.448 12 9 12H11V14C11 15.104 11.896 16 13 16H15V18C15 19.104 15.896 20 17 20H19C20.104 20 21 19.104 21 18V14C21 12.896 20.104 12 19 12H17V10C17 8.896 16.104 8 15 8H13V6C13 4.896 12.104 4 11 4H9V3H12Z" fill="#FFDE57" />
    <path d="M12 4.5C11.724 4.5 11.5 4.724 11.5 5V6.5H10.5C10.224 6.5 10 6.724 10 7.5V10C10 10.276 10.224 10.5 10.5 10.5H11.5V12.5C11.5 13.604 12.396 14.5 13.5 14.5H14.5V16.5C14.5 17.604 15.396 18.5 16.5 18.5H18.5C19.604 18.5 20.5 17.604 20.5 16.5V13C20.5 11.896 19.604 11 18.5 11H16.5V9.5C16.5 8.396 15.604 7.5 14.5 7.5H13.5V5.5C13.5 4.724 12.724 4.5 12 4.5Z" fill="#3776AB" />
  </svg>
);

const GoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2Z" fill="#00ADD8" />
    <path d="M8.5 15.5C8.5 14.672 9.5 13.5 12 13.5C14.5 13.5 15.5 14.672 15.5 15.5C15.5 16.328 14.5 17.5 12 17.5C9.5 17.5 8.5 16.328 8.5 15.5Z" fill="white" />
    <path d="M15.5 8.5C15.5 9.328 14.5 10.5 12 10.5C9.5 10.5 8.5 9.328 8.5 8.5C8.5 7.672 9.5 6.5 12 6.5C14.5 6.5 15.5 7.672 15.5 8.5Z" fill="white" />
    <path d="M12 2L17 5.5V8.5L12 12L7 8.5V5.5L12 2Z" fill="white" opacity="0.7" />
  </svg>
);

const JavaIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2Z" fill="#ED8B00" />
    <path d="M12 5C8.5 5 6 6.5 6 8.5V15.5C6 17.5 8.5 19 12 19C15.5 19 18 17.5 18 15.5V8.5C18 6.5 15.5 5 12 5Z" fill="white" />
    <rect x="10" y="7" width="4" height="8" rx="1" fill="#ED8B00" />
  </svg>
);

const RubyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2Z" fill="#CC342D" />
    <circle cx="12" cy="10" r="3" fill="white" />
    <path d="M12 14C9.5 14 7.5 15.5 7.5 17.5C7.5 19.5 9.5 21 12 21C14.5 21 16.5 19.5 16.5 17.5C16.5 15.5 14.5 14 12 14Z" fill="white" />
  </svg>
);

const CSharpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2Z" fill="#239120" />
    <path d="M8 7L16 12L8 17V7Z" fill="white" />
    <path d="M8 12L16 17V7L8 12Z" fill="white" opacity="0.5" />
  </svg>
);

const PHPIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2Z" fill="#777BB3" />
    <path d="M8 8H10C11.105 8 12 8.895 12 10V14C12 15.105 11.105 16 10 16H8V8Z" fill="white" />
    <circle cx="15" cy="10" r="1" fill="white" />
    <circle cx="17" cy="10" r="1" fill="white" />
  </svg>
);

const CPlusPlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2Z" fill="#00599C" />
    <path d="M8 8V16H10V14H12V16H14V14H16V12H14V10H16V8H14V10H12V8H10V10H8V8Z" fill="white" />
    <path d="M10 12H12V14H10V12Z" fill="#00599C" />
  </svg>
);

const iconMap = {
  js: <JavaScriptIcon />,
  python: <PythonIcon />,
  go: <GoIcon />,
  java: <JavaIcon />,
  ruby: <RubyIcon />,
  csharp: <CSharpIcon />,
  php: <PHPIcon />,
  cplusplus: <CPlusPlusIcon />,
};

export function TargetSelector({ selectedTarget, onTargetChange }) {
  let isOpen = $state(false);

  const selectedTargetInfo = $derived(targets.find((t) => t.id === selectedTarget) || targets[0]);

  const handleSelect = (targetId) => {
    onTargetChange(targetId);
    isOpen = false;
  };

  return (
    <div className="relative">
      <button
        onclick={() => (isOpen = !isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-[#27272a] rounded-lg hover:border-zinc-700 transition-all text-[10px] font-bold uppercase tracking-wider text-zinc-100 cursor-pointer"
      >
        {iconMap[selectedTarget] || iconMap.js}
        <span>{selectedTargetInfo.label}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 bg-zinc-900 border border-[#27272a] rounded-lg shadow-lg overflow-hidden z-50 min-w-[160px]">
          {targets.map((target) => (
            <button
              onclick={() => handleSelect(target.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 hover:bg-zinc-800 transition-all text-left cursor-pointer ${selectedTarget === target.id ? 'bg-zinc-800' : ''
                }`}
            >
              <div
                className="w-6 h-6 flex items-center justify-center rounded shrink-0"
                style={{ backgroundColor: target.color }}
              >
                {iconMap[target.id]}
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-100">
                {target.label}
              </span>
              {selectedTarget === target.id && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="ml-auto text-blue-400"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onclick={() => (isOpen = false)}
        ></div>
      )}
    </div>
  );
}

export default function Home() {
  let selectedTarget = $state('js');

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-12 flex flex-col items-center justify-center gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-black tracking-tight mb-2 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          Compiler Target Selector
        </h1>
        <p className="text-zinc-400 text-sm">Testing JSX transformation and reactivity patterns</p>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col gap-4 items-center">
          <TargetSelector
            selectedTarget={selectedTarget}
            onTargetChange={(id) => selectedTarget = id}
          />

          <div className="mt-4 flex items-center gap-3 px-4 py-2 bg-zinc-800/50 rounded-full border border-zinc-700/50">
            <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Active:</span>
            <span className="text-sm font-mono text-blue-400">{selectedTarget}</span>
          </div>
        </div>
      </div>
    </div>
  );
}