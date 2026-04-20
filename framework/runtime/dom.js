import { effect } from "@preact/signals";

export function renderDynamic(parent, fn) {
  const anchor = document.createComment("dynamic");
  parent.appendChild(anchor);
  
  let current = null;
  
  effect(() => {
    let value = fn();
    
    // Cleanup previous nodes
    if (current) {
      if (Array.isArray(current)) current.forEach(n => n.remove());
      else current.remove();
      current = null;
    }
    
    if (value === null || value === undefined || value === false) return;
    
    if (value instanceof Node) {
      anchor.parentNode.insertBefore(value, anchor);
      current = value;
    } else if (Array.isArray(value)) {
      const nodes = value.map(v => v instanceof Node ? v : document.createTextNode(String(v)));
      nodes.forEach(n => anchor.parentNode.insertBefore(n, anchor));
      current = nodes;
    } else {
      const text = document.createTextNode(String(value));
      anchor.parentNode.insertBefore(text, anchor);
      current = text;
    }
  });
}
