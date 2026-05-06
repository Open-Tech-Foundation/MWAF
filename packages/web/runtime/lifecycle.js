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
    if (!currentInstance._effectFactories) {
      Object.defineProperty(currentInstance, "_effectFactories", { value: [], enumerable: false, writable: true, configurable: true });
    }
    currentInstance._effectFactories.push(fn);
    onUnmount(disposer);
  }
  return disposer;
}

export function _disconnectWafComponent(el) {
  if (el._onCleanups) {
    el._onCleanups.forEach(fn => {
      try {
        fn();
      } catch (e) {}
    });
    el._onCleanups = [];
  }
}

export function _reconnectWafComponent(el) {
  if (el._mounted) {
    withInstance(el, () => {
      if (el._effectFactories) {
        el._effectFactories.forEach(fn => {
          const disposer = effect(fn);
          onUnmount(disposer);
        });
      }
      if (el._children) {
        el._children.forEach(child => {
          if (!el.contains(child)) el.appendChild(child);
        });
      }
      if (el._onMounts) {
        el._onMounts.forEach(fn => fn());
      }
    });
  }
}

import { _defineWafProps } from "./props.js";

// Metadata initializer for Web Components
export function _initWafComponent(el) {
  if (!el._propsSignals) {
    Object.defineProperty(el, "_propsSignals", { value: {}, enumerable: false, writable: true, configurable: true });
  }
  if (!el._onMounts) {
    Object.defineProperty(el, "_onMounts", { value: [], enumerable: false, writable: true, configurable: true });
  }
  if (!el._onCleanups) {
    Object.defineProperty(el, "_onCleanups", { value: [], enumerable: false, writable: true, configurable: true });
  }
  if (!el._children) {
    Object.defineProperty(el, "_children", { value: [], enumerable: false, writable: true, configurable: true });
  }
  if (!("_mounted" in el)) {
    Object.defineProperty(el, "_mounted", { value: false, enumerable: false, writable: true, configurable: true });
  }

  _defineWafProps(el.constructor);

  return el;
}
