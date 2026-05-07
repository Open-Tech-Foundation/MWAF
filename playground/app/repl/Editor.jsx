import { onMount, onCleanup, $ref, hookEffect } from "@opentf/web";
import loader from "@monaco-editor/loader";

export default function MonacoEditor({ value, language = "javascript", readOnly = false, onUpdate }) {
  const containerRef = $ref();
  let editor = null;

  onMount(async () => {
    try {
      // Use a fixed version and reliable CDN
      loader.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs' } });
      const monaco = await loader.init();
      
      if (!containerRef) return;

      editor = monaco.editor.create(containerRef, {
        value: value || "",
        language: language,
        theme: "vs-dark",
        readOnly: readOnly,
        automaticLayout: true,
        minimap: { enabled: false },
        fontSize: 14,
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        padding: { top: 16 },
        scrollBeyondLastLine: false,
        roundedSelection: true,
        scrollbar: {
          verticalScrollbarSize: 10,
          horizontalScrollbarSize: 10
        },
        lineNumbers: readOnly ? "off" : "on",
        glyphMargin: !readOnly,
        folding: true
      });

      if (onUpdate) {
        editor.onDidChangeModelContent(() => {
          const val = editor.getValue();
          if (val !== value) {
            onUpdate(val);
          }
        });
      }
    } catch (err) {
      console.error("Monaco Load Error:", err);
    }
  });

  hookEffect(() => {
    if (editor && value !== undefined && editor.getValue() !== value) {
      editor.setValue(value);
    }
  });

  onCleanup(() => {
    if (editor) {
      editor.dispose();
    }
  });

  return (
    <div 
      ref={containerRef} 
      style="width: 100%; height: 100%;" 
    />
  );
}
