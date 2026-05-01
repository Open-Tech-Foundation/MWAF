import { onMount } from "@opentf/web";

export default function ThemeToggle() {
  const theme = $state("light");

  onMount(() => {
    const savedTheme = localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    theme = savedTheme;
    document.documentElement.setAttribute("data-theme", theme);
  });

  const toggle = () => {
    theme = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  };

  return (
    <button 
      onclick={toggle}
      className="p-2 rounded-xl bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-accent transition-all border border-[var(--border)] shadow-sm"
      aria-label="Toggle theme"
    >
      {() => theme === "light" ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z"></path></svg>
      )}
    </button>
  );
}
