import { signal, untracked } from "../core/signals.js";

export function createPropsProxy(el) {
  if (!el._propsSignals) {
    Object.defineProperty(el, "_propsSignals", { value: {}, enumerable: false, writable: true });
  }
  
  return new Proxy(el, {
    get: (target, key) => {
      if (key === "__signals") return target._propsSignals;
      if (key === "children") return target._children;
      if (typeof key === "symbol" || key.startsWith("_")) return target[key];
      if (key === "then") return undefined; // Promise check
      
      const sig = target._propsSignals[key];
      if (sig) return sig.value;
      
      // Property/Attribute fallback (mostly for hydration)
      const val = (key in target && typeof target[key] !== "undefined")
        ? target[key]
        : target.getAttribute(key);
        
      if (typeof val === "function") return val;

      // Create signal lazily if not already there
      target._propsSignals[key] = signal(val);
      return target._propsSignals[key].value;
    },
    set: (target, key, value) => {
      if (typeof key === "symbol" || key.startsWith("_")) {
        target[key] = value;
        return true;
      }

      const isSignal = value && typeof value === "object" && "value" in value && typeof value.subscribe === "function";
      
      untracked(() => {
        if (!target._propsSignals[key]) {
          target._propsSignals[key] = signal(isSignal ? value.value : value);
        }

        if (target._propsSubscriptions?.[key]) {
          target._propsSubscriptions[key]();
          delete target._propsSubscriptions[key];
        }

        if (isSignal) {
          if (!target._propsSubscriptions) {
            Object.defineProperty(target, "_propsSubscriptions", { value: {}, enumerable: false, writable: true });
          }
          target._propsSubscriptions[key] = value.subscribe(v => {
            if (target._propsSignals[key].value !== v) {
              target._propsSignals[key].value = v;
            }
          });
        } else {
          if (target._propsSignals[key].value !== value) {
            target._propsSignals[key].value = value;
          }
        }
      });
      
      const observed = target.constructor?.observedAttributes;
      const isObserved = Array.isArray(observed) && observed.includes(key);
      if (!isObserved && target[key] !== value) {
        target[key] = value;
      }
      
      return true;
    },
    ownKeys: (target) => {
      return Reflect.ownKeys(target).filter(k => 
        typeof k !== "string" || (!k.startsWith("_") && k !== "observedAttributes")
      );
    },
    getOwnPropertyDescriptor: (target, key) => {
      if (typeof key === 'string' && key.startsWith('_')) return undefined;
      return Object.getOwnPropertyDescriptor(target, key);
    }
  });
}
