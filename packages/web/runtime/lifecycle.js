import { effect, isSSG } from "../core/signals.js";

let currentInstance = null;

export function withInstance(inst, fn) {
  const prev = currentInstance;
  currentInstance = inst;
  try {
    return fn();
  } finally {
    currentInstance = prev;
  }
}

export function getCurrentInstance() {
  return currentInstance;
}

export function onMount(fn) {
  if (isSSG) return;
  if (currentInstance) {
    if (!currentInstance._onMounts) {
       Object.defineProperty(currentInstance, "_onMounts", { value: [], enumerable: false, writable: true, configurable: true });
    }
    currentInstance._onMounts.push(fn);
  }
}

export function onUnmount(fn) {
  if (isSSG) return;
  if (currentInstance) {
    if (!currentInstance._onCleanups) {
       Object.defineProperty(currentInstance, "_onCleanups", { value: [], enumerable: false, writable: true, configurable: true });
    }
    currentInstance._onCleanups.push(fn);
  }
}

export function onCleanup(fn) {
  return onUnmount(fn);
}

export function hookEffect(fn) {
  const disposer = effect(fn);
  if (currentInstance) {
    onUnmount(disposer);
  }
  return disposer;
}


import { _defineWafProps } from "./props.js";

// Metadata initializer for Web Components
export function _initWafComponent(el) {
  const props = {
    _propsSignals: {},
    _onMounts: [],
    _onCleanups: [],
    _children: [],
    _mounted: false
  };
  
  for (const key in props) {
    if (!(key in el)) {
      Object.defineProperty(el, key, {
        value: props[key],
        enumerable: false,
        writable: true,
        configurable: true
      });
    }
  }

  _defineWafProps(el.constructor);

  return el;
}
