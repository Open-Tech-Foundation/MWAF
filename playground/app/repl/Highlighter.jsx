import { onMount, $ref, hookEffect } from "@opentf/web";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-tomorrow.css";

// Ensure Prism is available globally for some components
if (typeof window !== "undefined") {
  window.Prism = Prism;
}

export default function CodeHighlighter({ code, language = "javascript" }) {
  const preRef = $ref();

  hookEffect(() => {
    if (preRef) {
      const html = Prism.highlight(code, Prism.languages[language] || Prism.languages.javascript, language);
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
