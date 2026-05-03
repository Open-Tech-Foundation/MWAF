import { signal, effect, isSSG, untracked } from "../core/signals.js";
import { IS_PROPERTY } from "../core/constants.js";

const ELEMENT_PROPS = new WeakMap();

export function applySpread(el, props) {
  for (const key in props) {
    setProperty(el, key, props[key]);
  }
}

export function getWafProps(el) {
  return ELEMENT_PROPS.get(el);
}

export function _clearChildren(el) {
  if (isSSG) return;
  while (el.firstChild) el.removeChild(el.firstChild);
}

export function setProperty(el, key, value) {
  if (key === "style" && typeof value === "object") {
    Object.assign(el.style, value);
  } else if (key.startsWith("on") && typeof value === "function") {
    const name = key.toLowerCase();
    const isStandard = name in el || name in HTMLElement.prototype;
    el[isStandard ? name : key] = value;
  } else if (IS_PROPERTY.includes(key)) {
    el[key] = value;
  } else {
    if (value === false || value === null || value === undefined) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, value);
    }
  }

  // Update signals if this is a WAF component
  if (el._propsSignals) {
    untracked(() => {
      if (!el._propsSignals[key]) {
        el._propsSignals[key] = signal(value);
      } else if (el._propsSignals[key].peek() !== value) {
        el._propsSignals[key].value = value;
      }
    });
  }
}

export function renderDynamic(parent, fn) {
  const anchor = document.createTextNode("");
  parent.appendChild(anchor);

  let currentNodes = [];

  effect(() => {
    let value = fn();
    if (value === undefined || value === null) value = [];
    const newNodes = (Array.isArray(value) ? value : [value])
      .map(node => {
        if (node === null || node === undefined || typeof node === 'boolean') return null;
        if (node instanceof Node) return node;
        return document.createTextNode(String(node));
      })
      .filter(Boolean);
    
    // Remove nodes that are no longer present
    for (const node of currentNodes) {
      if (!newNodes.includes(node)) {
        if (node.parentNode) node.parentNode.removeChild(node);
      }
    }

    // Insert or move nodes (backwards to ensure nextNode is always in DOM)
    for (let i = newNodes.length - 1; i >= 0; i--) {
      const node = newNodes[i];
      const nextNode = newNodes[i + 1] || anchor;
      if (node.nextSibling !== nextNode) {
        parent.insertBefore(node, nextNode);
      }
    }

    currentNodes = newNodes;
  });
}

export function _mapped(sourceFn, mapFn) {
  const cache = new Map();
  const result = signal([]);

  effect(() => {
    const source = sourceFn();
    const data = Array.isArray(source) ? source : [];
    
    const newKeys = new Set();
    const newItems = data.map((item, index) => {
      const key = (item && typeof item === "object" && item.id !== undefined) ? item.id : index;
      newKeys.add(key);

      if (cache.has(key)) {
        const entry = cache.get(key);
        entry.sig.value = item;
        return entry.res;
      }

      const sig = signal(item);
      const res = mapFn(sig, index);
      cache.set(key, { sig, res });
      return res;
    });

    // Cleanup old cache entries
    for (const key of cache.keys()) {
      if (!newKeys.has(key)) cache.delete(key);
    }

    result.value = newItems;
  });

  return () => result.value;
}
