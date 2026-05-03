import * as Signals from "@preact/signals-core";

// ─── SSG Detection ───
export let isSSG = false;
try {
  isSSG = typeof globalThis !== 'undefined' && globalThis.__WAF_SSG__ === true;
} catch (e) {}

export function _setSSG(val) { isSSG = val; }

// ─── Framework Reactive Core ───
export const signal = (val) => {
  if (isSSG) {
    return {
      _v: val,
      get value() { return this._v; },
      set value(v) { this._v = v; },
      peek: () => val,
      subscribe: () => () => {}
    };
  }
  return Signals.signal(val);
};

export const computed = (fn) => {
  if (isSSG) {
    return {
      get value() { return fn(); },
      peek: () => fn(),
      subscribe: () => () => {}
    };
  }
  return Signals.computed(fn);
};

export const effect = (fn) => {
  if (isSSG) {
    try { fn(); } catch (e) {}
    return () => {};
  }
  return Signals.effect(fn);
};

export const batch = (fn) => Signals.batch(fn);
export const untracked = (fn) => Signals.untracked(fn);

export const Signal = Signals.Signal;
export const Computed = Signals.Computed;
export const Effect = Signals.Effect;
export const action = Signals.action;
export const createModel = Signals.createModel;
