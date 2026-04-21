import { effect } from "@preact/signals-core";

export function renderDynamic(parent, fn) {
  const anchor = document.createComment("dynamic");
  parent.appendChild(anchor);
  
  let currentNodes = [];
  
  effect(() => {
    let value = fn();
    // If the value is a function (e.g., from mapped), execute it to get the nodes
    if (typeof value === "function") value = value();
    
    if (value === null || value === undefined || value === false) value = [];
    if (!Array.isArray(value)) value = [value];

    const nextNodes = value.map(v => {
      if (v instanceof Node) return v;
      return document.createTextNode(String(v));
    });

    reconcile(anchor.parentNode, anchor, currentNodes, nextNodes);
    currentNodes = nextNodes;
  });
}

export function mapped(signal, fn) {
  let cache = new Map(); // key -> { node, effect }
  
  return () => {
    const list = signal.value || [];
    const nextNodes = [];
    const nextCache = new Map();

    list.forEach((item, index) => {
      const key = item.key ?? item.id ?? index;
      let cached = cache.get(key);
      
      if (cached) {
        nextNodes.push(cached.node);
        nextCache.set(key, cached);
      } else {
        const node = fn(item, index);
        node._key = key;
        nextNodes.push(node);
        nextCache.set(key, { node });
      }
    });

    // Cleanup removed items
    cache.forEach((cached, key) => {
      if (!nextCache.has(key)) {
        if (cached.node.remove) cached.node.remove();
      }
    });

    cache = nextCache;
    return nextNodes;
  };
}

function reconcile(parent, anchor, oldNodes, nextNodes) {
  const oldMap = new Map();
  oldNodes.forEach(n => {
    if (n._key !== undefined) oldMap.set(n._key, n);
  });

  let nextSibling = anchor;
  for (let i = nextNodes.length - 1; i >= 0; i--) {
    const node = nextNodes[i];
    const key = node._key;
    const existing = key !== undefined ? oldMap.get(key) : null;

    if (existing) {
      if (existing !== nextSibling.previousSibling) {
        parent.insertBefore(existing, nextSibling);
      }
      oldMap.delete(key);
      nextNodes[i] = existing;
    } else {
      parent.insertBefore(node, nextSibling);
    }
    nextSibling = nextNodes[i];
  }

  oldNodes.forEach(n => {
    if (!nextNodes.includes(n)) n.remove();
  });
}
