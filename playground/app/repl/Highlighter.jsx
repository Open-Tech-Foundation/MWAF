import { onMount, $ref, hookEffect, signal } from "@opentf/web";
import "prismjs/themes/prism-tomorrow.css";

export default function CodeHighlighter({ code, language = "javascript" }) {
  const preRef = $ref();
  const Prism = signal(null);
  onMount(async () => {
    if (typeof window !== "undefined") {
      const mod = await import("prismjs");
      await import("prismjs/components/prism-javascript");
      Prism.value = mod.default;
      window.Prism = Prism.value;
    }
  });

  hookEffect(() => {
    const prismInst = Prism.value;
    if (preRef && prismInst && code) {
      const html = prismInst.highlight(code, prismInst.languages[language] || prismInst.languages.javascript, language);
      preRef.innerHTML = html;
    }
  });

  return (
    <div style="height: 100%; overflow: auto; background: #1d1f21; color: #c5c8c6; border-radius: 8px;">
      <pre 
        className={`language-${language}`}
        style="margin: 0; padding: 16px; font-family: 'JetBrains Mono', monospace; font-size: 13px; line-height: 1.5;"
      >
        <code ref={preRef} className={`language-${language}`}></code>
      </pre>
    </div>
  );
}
