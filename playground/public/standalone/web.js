// core/signals.js
import * as Signals from "@preact/signals-core";
if (typeof globalThis !== "undefined") {
  if (globalThis.__WAF_SIGNALS_LOADED__) {
    console.warn("@opentf/web: Multiple instances of signals detected! This may cause reactivity loss.");
  }
  globalThis.__WAF_SIGNALS_LOADED__ = true;
}
var PREACT_SIGNALS_BRAND = /* @__PURE__ */ Symbol.for("preact-signals");
var isSSG = false;
try {
  isSSG = typeof globalThis !== "undefined" && globalThis.__WAF_SSG__ === true;
} catch (e) {
}
function _setSSG(val) {
  isSSG = val;
}
var signal2 = (val) => {
  if (isSSG) {
    return {
      brand: /* @__PURE__ */ Symbol.for("preact-signals"),
      _v: val,
      get value() {
        return this._v;
      },
      set value(v) {
        this._v = v;
      },
      peek: () => val,
      subscribe: () => () => {
      }
    };
  }
  return Signals.signal(val);
};
var computed2 = (fn) => {
  if (isSSG) {
    return {
      brand: /* @__PURE__ */ Symbol.for("preact-signals"),
      get value() {
        return fn();
      },
      peek: () => fn(),
      subscribe: () => () => {
      }
    };
  }
  return Signals.computed(fn);
};
var effect2 = (fn) => {
  if (isSSG) {
    try {
      fn();
    } catch (e) {
    }
    return () => {
    };
  }
  return Signals.effect(fn);
};
var batch2 = (fn) => Signals.batch(fn);
var untracked2 = (fn) => Signals.untracked(fn);
var Signal2 = Signals.Signal;
var Computed2 = Signals.Computed;
var Effect2 = Signals.Effect;

// runtime/props.js
var PROPS_SET = /* @__PURE__ */ new WeakMap();
var PROPS_SUBS = /* @__PURE__ */ new WeakMap();
function createPropsProxy(el) {
  if (!el._propsSignals) {
    Object.defineProperty(el, "_propsSignals", { value: {}, enumerable: false, writable: true, configurable: true });
  }
  if (!PROPS_SET.has(el)) {
    PROPS_SET.set(el, /* @__PURE__ */ new Set());
  }
  const propsSet = PROPS_SET.get(el);
  const target = { _el: el };
  return new Proxy(target, {
    get: (t, key) => {
      if (key === "__signals") return el._propsSignals;
      if (key in t && typeof t[key] === "function") return t[key];
      if (key === "children") {
        const sig2 = el._propsSignals?.children;
        if (sig2 && typeof sig2 === "object" && "value" in sig2) return sig2.value;
        return el._children;
      }
      if (typeof key === "symbol" || key.startsWith("_")) return el[key];
      if (key === "then") return void 0;
      propsSet.add(key);
      const sig = el._propsSignals ? el._propsSignals[key] : void 0;
      if (sig) return sig;
      const val = el[key] !== void 0 ? el[key] : typeof el.getAttribute === "function" ? el.getAttribute(key) : void 0;
      if (typeof val === "function" || key.startsWith("on")) {
        t[key] = val;
        return val;
      }
      el._propsSignals[key] = signal2(val);
      return el._propsSignals[key];
    },
    set: (t, key, value) => {
      t[key] = value;
      if (typeof key === "symbol" || key.startsWith("_") || key.startsWith("on")) {
        propsSet.add(key);
        if (key.startsWith("on")) console.log(`@opentf/web: Proxy SET event ${key} on`, el.tagName);
        el[key] = value;
        return true;
      }
      const isSignal = value && typeof value === "object" && (value instanceof Signal2 || value.brand === PREACT_SIGNALS_BRAND || PREACT_SIGNALS_BRAND in value);
      untracked2(() => {
        propsSet.add(key);
        if (!el._propsSignals) {
          Object.defineProperty(el, "_propsSignals", { value: {}, enumerable: false, writable: true, configurable: true });
        }
        if (!el._propsSignals[key]) {
          el._propsSignals[key] = isSignal ? value : signal2(value);
        }
        const sig = el._propsSignals[key];
        let subs = PROPS_SUBS.get(el);
        if (!subs) {
          subs = {};
          PROPS_SUBS.set(el, subs);
        }
        if (subs[key]) {
          subs[key]();
          delete subs[key];
        }
        if (isSignal) {
          subs[key] = value.subscribe((v) => {
            if (!el._propsSignals[key]) {
              el._propsSignals[key] = signal2(v);
            } else if (el._propsSignals[key].value !== v) {
              el._propsSignals[key].value = v;
            }
          });
        } else {
          if (!el._propsSignals[key]) {
            el._propsSignals[key] = signal2(value);
          } else if (el._propsSignals[key].value !== value) {
            el._propsSignals[key].value = value;
          }
        }
        if (key === "children") {
          el._children = isSignal ? value.peek() : value;
        }
      });
      return true;
    },
    ownKeys: (t) => {
      const keys = new Set(propsSet);
      keys.add("children");
      const observed = el.constructor?.observedAttributes;
      if (Array.isArray(observed)) {
        observed.forEach((k) => keys.add(k));
      }
      return Array.from(keys);
    },
    getOwnPropertyDescriptor: (t, key) => {
      if (propsSet.has(key) || key === "children" || Array.isArray(el.constructor?.observedAttributes) && el.constructor.observedAttributes.includes(key)) {
        return { enumerable: true, configurable: true, writable: true };
      }
      return void 0;
    }
  });
}
function _syncPropGet(el, key) {
  if (!el._propsSignals) return void 0;
  const sig = el._propsSignals[key];
  return sig ? sig.value : void 0;
}
function _syncPropSet(el, key, val) {
  if (!el._propsSignals) {
    Object.defineProperty(el, "_propsSignals", { value: {}, enumerable: false, writable: true, configurable: true });
  }
  if (!el._propsSignals[key]) {
    el._propsSignals[key] = signal2(val);
  }
  el._propsSignals[key].value = val;
}
function _defineWafProps(ctor) {
  const attrs = ctor.observedAttributes;
  if (!attrs) return;
  attrs.forEach((attr) => {
    if (attr in ctor.prototype) return;
    Object.defineProperty(ctor.prototype, attr, {
      get() {
        return _syncPropGet(this, attr);
      },
      set(val) {
        _syncPropSet(this, attr, val);
      },
      enumerable: true,
      configurable: true
    });
  });
}

// runtime/lifecycle.js
var currentInstance = null;
function withInstance(inst, fn) {
  const prev = currentInstance;
  currentInstance = inst;
  let prevWalker = null;
  if (inst && typeof inst.hasAttribute === "function") {
    prevWalker = inst._walker;
    if (inst.hasAttribute("data-ssg") && !inst._walker) {
      inst._walker = document.createTreeWalker(inst, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
      inst._walker.nextNode();
    }
  }
  try {
    return fn();
  } finally {
    currentInstance = prev;
    if (inst) inst._walker = prevWalker;
  }
}
function getCurrentInstance() {
  return currentInstance;
}
function onMount(fn) {
  if (isSSG) return;
  if (currentInstance) {
    if (!currentInstance._onMounts) {
      Object.defineProperty(currentInstance, "_onMounts", { value: [], enumerable: false, writable: true, configurable: true });
    }
    currentInstance._onMounts.push(fn);
  }
}
function onUnmount(fn) {
  if (isSSG) return;
  if (currentInstance) {
    if (!currentInstance._onCleanups) {
      Object.defineProperty(currentInstance, "_onCleanups", { value: [], enumerable: false, writable: true, configurable: true });
    }
    currentInstance._onCleanups.push(fn);
  }
}
function onCleanup(fn) {
  return onUnmount(fn);
}
function hookEffect(fn) {
  const disposer = effect2(fn);
  if (currentInstance) {
    if (!currentInstance._effectFactories) {
      Object.defineProperty(currentInstance, "_effectFactories", { value: [], enumerable: false, writable: true, configurable: true });
    }
    currentInstance._effectFactories.push(fn);
    onUnmount(disposer);
  }
  return disposer;
}
function _disconnectWafComponent(el) {
  if (el._onCleanups) {
    el._onCleanups.forEach((fn) => {
      try {
        fn();
      } catch (e) {
      }
    });
    el._onCleanups = [];
  }
}
function _reconnectWafComponent(el) {
  if (el._mounted) {
    withInstance(el, () => {
      if (el._effectFactories) {
        el._effectFactories.forEach((fn) => {
          const disposer = effect2(fn);
          onUnmount(disposer);
        });
      }
      if (el._children) {
        el._children.forEach((child) => {
          if (!el.contains(child)) el.appendChild(child);
        });
      }
      if (el._onMounts) {
        el._onMounts.forEach((fn) => fn());
      }
    });
  }
}
function _initInternalState(el, propsSignals) {
  Object.defineProperties(el, {
    _propsSignals: { value: propsSignals || {}, enumerable: false, writable: true, configurable: true },
    _onMounts: { value: [], enumerable: false, writable: true, configurable: true },
    _onCleanups: { value: [], enumerable: false, writable: true, configurable: true },
    _children: { value: [], enumerable: false, writable: true, configurable: true },
    _mounted: { value: false, enumerable: false, writable: true, configurable: true }
  });
}
function _initWafComponent(el) {
  _initInternalState(el, el._propsSignals);
  _defineWafProps(el.constructor);
  return el;
}

// router/index.js
import { signal as signal3 } from "@preact/signals-core";
var routes = {
  pages: {},
  layouts: {},
  notFound: null
};
var isBrowser = typeof window !== "undefined";
var routerSignals = {
  pathname: signal3(isBrowser ? window.location.pathname : "/"),
  searchParams: signal3(new URLSearchParams(isBrowser ? window.location.search : "")),
  hash: signal3(isBrowser ? window.location.hash : ""),
  isGuarding: signal3(false),
  guard: null,
  currentPage: signal3(null),
  config: signal3({
    navigation: "spa"
  })
};
var router = new Proxy(routerSignals, {
  get: (target, key) => {
    if (key === "push") return (path) => navigate(path);
    if (key === "replace") return (path) => navigate(path, void 0, true);
    if (key === "config") return target.config.value;
    const s = target[key];
    if (s && typeof s === "object" && "value" in s && typeof s.subscribe === "function") {
      return s.value;
    }
    return s;
  },
  set: (target, key, val) => {
    const s = target[key];
    if (s && typeof s === "object" && "value" in s && typeof s.subscribe === "function") {
      s.value = val;
    } else {
      target[key] = val;
    }
    return true;
  }
});
var currentPageInstance = null;
var _routerRoot = null;
function setRouterConfig(config) {
  routerSignals.config.value = { ...routerSignals.config.value, ...config };
}
function registerRoutes(pages) {
  for (const path in pages) {
    const isLayout = path.endsWith("layout.jsx") || path.endsWith("layout.tsx");
    const isNotFound = path.endsWith("404.jsx") || path.endsWith("404.tsx");
    let route = path.replace(/^.*\/app/, "").replace(/\/(page|layout|404)\.(jsx|tsx)$/, "");
    if (route === "") route = "/";
    if (isNotFound) {
      routes.notFound = { module: pages[path], sourceFile: path };
    } else if (isLayout) {
      routes.layouts[route] = { module: pages[path], sourceFile: path };
    } else {
      routes.pages[route] = { module: pages[path], sourceFile: path };
    }
  }
}
function matchRoute(path) {
  for (const route in routes.pages) {
    const pattern = route.replace(/\[\.\.\.([^\]]+)\]/g, "(?<$1>.+)").replace(/\[([^\]]+)\]/g, "(?<$1>[^/]+)");
    const regex = new RegExp(`^${pattern}/?$`);
    const match = path.match(regex);
    if (match) {
      const params = { ...match.groups || {} };
      for (const key in params) {
        if (route.includes(`[...${key}]`)) {
          params[key] = params[key].split("/");
        }
      }
      return {
        page: routes.pages[route].module,
        params,
        route,
        sourceFile: routes.pages[route].sourceFile
      };
    }
  }
  return null;
}
function scrollToHash(hash) {
  if (!hash) return;
  const id = hash.replace("#", "");
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}
async function navigate(path, root, replace = false, isPopState = false) {
  if (!path) return;
  if (root) _routerRoot = root;
  const targetRoot = _routerRoot || (typeof document !== "undefined" ? document.getElementById("app") : null);
  if (typeof window !== "undefined" && window.navigation && !isPopState) {
    const url2 = new URL(path, window.location.origin);
    if (url2.pathname + url2.search + url2.hash !== window.location.pathname + window.location.search + window.location.hash) {
      return window.navigation.navigate(path, { history: replace ? "replace" : "push" });
    }
  }
  const url = new URL(path, window.location.origin);
  const pathname = url.pathname;
  const oldPathname = window.location.pathname;
  const oldSearch = window.location.search;
  const oldHash = window.location.hash;
  if (router.guard) {
    const match2 = matchRoute(pathname);
    const to = {
      path: pathname,
      fullPath: pathname + url.search + url.hash,
      params: match2?.params || {},
      query: Object.fromEntries(new URLSearchParams(url.search))
    };
    routerSignals.isGuarding.value = true;
    try {
      await new Promise((resolve, reject) => {
        const tools = {
          next: () => resolve(),
          redirect: (p) => {
            navigate(p, root, false);
            reject("redirected");
          },
          replace: (p) => {
            navigate(p, root, true);
            reject("redirected");
          }
        };
        Promise.resolve(routerSignals.guard(to, tools)).catch(reject);
      });
    } catch (e) {
      routerSignals.isGuarding.value = false;
      if (e === "redirected") return;
      console.error("Route Guard Error:", e);
      return;
    }
    routerSignals.isGuarding.value = false;
  }
  if (!isPopState) {
    routerSignals.pathname.value = pathname;
    routerSignals.searchParams.value = new URLSearchParams(url.search);
    routerSignals.hash.value = url.hash;
  }
  if (pathname === oldPathname && url.search === oldSearch && url.hash !== oldHash) {
    if (!isPopState) {
      if (replace) window.history.replaceState({}, "", path);
      else window.history.pushState({}, "", path);
    }
    scrollToHash(url.hash);
    return;
  }
  const match = matchRoute(pathname) || (routes.notFound ? { page: routes.notFound.module, params: {}, route: null, sourceFile: routes.notFound.sourceFile } : null);
  if (match) {
    const { page, params, route, sourceFile } = match;
    routerSignals.currentPage.value = { route, sourceFile };
    if (currentPageInstance && currentPageInstance._onCleanups) {
      currentPageInstance._onCleanups.forEach((fn) => fn());
    }
    const instance = { _onMounts: [], _onCleanups: [] };
    currentPageInstance = instance;
    const layoutChain = [];
    if (route) {
      let currentPath = route;
      while (true) {
        if (routes.layouts[currentPath]) {
          layoutChain.unshift(routes.layouts[currentPath].module);
        }
        if (currentPath === "/") break;
        currentPath = currentPath.substring(0, currentPath.lastIndexOf("/")) || "/";
      }
    }
    let content = document.createDocumentFragment();
    withInstance(instance, () => {
      page.render(content, { params });
      for (let i = layoutChain.length - 1; i >= 0; i--) {
        const layout = layoutChain[i];
        const nextContent = document.createDocumentFragment();
        layout.render(nextContent, { children: content, params });
        content = nextContent;
      }
    });
    if (targetRoot) {
      if (typeof window !== "undefined") {
        targetRoot.innerHTML = "";
        targetRoot.appendChild(content);
      }
    }
    if (instance._onMounts) {
      instance._onMounts.forEach((fn) => fn());
    }
    if (!isPopState) {
      if (replace) window.history.replaceState({}, "", path);
      else window.history.pushState({}, "", path);
    }
    setTimeout(() => scrollToHash(url.hash), 100);
  } else {
    if (root) root.innerHTML = "<h1>404 Not Found</h1>";
  }
}
if (typeof window !== "undefined") {
  if (window.navigation) {
    window.navigation.addEventListener("navigate", (event) => {
      if (!event.canIntercept || event.hashChange || event.downloadRequest || event.formData) {
        return;
      }
      const url = new URL(event.destination.url);
      if (url.origin !== window.location.origin) return;
      event.intercept({
        async handler() {
          const fullPath = url.pathname + url.search + url.hash;
          routerSignals.pathname.value = url.pathname;
          routerSignals.searchParams.value = new URLSearchParams(url.search);
          routerSignals.hash.value = url.hash;
          await navigate(fullPath, _routerRoot, false, true);
        }
      });
    });
  } else {
    window.addEventListener("popstate", () => {
      const fullPath = window.location.pathname + window.location.search + window.location.hash;
      routerSignals.pathname.value = window.location.pathname;
      routerSignals.searchParams.value = new URLSearchParams(window.location.search);
      routerSignals.hash.value = window.location.hash;
      navigate(fullPath, _routerRoot, false, true);
    });
    window.addEventListener("hashchange", () => {
      routerSignals.hash.value = window.location.hash;
      scrollToHash(window.location.hash);
    });
  }
}

// core/mount.js
function mountApp({ pages, guard, targetId = "app", config = {} } = {}) {
  const finalConfig = {
    ...typeof window !== "undefined" ? window.__WAF_CONFIG__ : {},
    ...config
  };
  if (finalConfig) {
    setRouterConfig(finalConfig);
  }
  console.log("\u{1F680} Web App Framework Bootstrapping...");
  const root = document.getElementById(targetId);
  if (pages) {
    console.log("\u{1F4D1} Registering routes...");
    registerRoutes(pages);
  }
  if (guard) {
    console.log("\u{1F6E1}\uFE0F Activating route guard...");
    router.guard = guard;
  }
  const initialPath = window.location.pathname + window.location.search + window.location.hash;
  console.log("\u{1F4CD} Navigating to:", initialPath);
  navigate(initialPath, root);
  window.onpopstate = () => {
    navigate(window.location.pathname + window.location.search + window.location.hash, root);
  };
}

// core/constants.js
var IS_PROPERTY = [
  "className",
  "style",
  "value",
  "checked",
  "id",
  "title",
  "href",
  "src",
  "key",
  "disabled",
  "readOnly"
];

// runtime/dom.js
function _element(tag) {
  const inst = getCurrentInstance();
  if (inst && inst._walker) {
    const node = inst._walker.currentNode;
    inst._walker.nextNode();
    return node;
  }
  return document.createElement(tag);
}
function _text(content) {
  const inst = getCurrentInstance();
  if (inst && inst._walker) {
    const node = inst._walker.currentNode;
    inst._walker.nextNode();
    return node;
  }
  return document.createTextNode(content);
}
function _svg(tag) {
  const inst = getCurrentInstance();
  if (inst && inst._walker) {
    const node = inst._walker.currentNode;
    inst._walker.nextNode();
    return node;
  }
  return document.createElementNS("http://www.w3.org/2000/svg", tag);
}
function _fragment() {
  return document.createDocumentFragment();
}
console.log("@opentf/web: dom.js loaded");
var ELEMENT_PROPS = /* @__PURE__ */ new WeakMap();
function applySpread(el, props, isComponent) {
  if (!props || typeof props !== "object") return;
  const keys = Object.keys(props);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    let value = props[key];
    if (value && typeof value === "object" && (value instanceof Signal2 || value.brand === PREACT_SIGNALS_BRAND || PREACT_SIGNALS_BRAND in value)) {
      value = value.value;
    }
    setProperty(el, key, value, isComponent);
  }
}
function getWafProps(el) {
  return ELEMENT_PROPS.get(el);
}
function _clearChildren(el) {
  if (isSSG) return;
  while (el.firstChild) el.removeChild(el.firstChild);
}
function setProperty(el, key, value, isComponent) {
  if (value && typeof value === "object" && (value instanceof Signal2 || value.brand === PREACT_SIGNALS_BRAND || PREACT_SIGNALS_BRAND in value)) {
    value = value.value;
  }
  if (key === "style" && typeof value === "object") {
    Object.assign(el.style, value);
  } else if (key.startsWith("on") && typeof value === "function") {
    el[isComponent ? key : key.toLowerCase()] = value;
  } else if (IS_PROPERTY.includes(key)) {
    el[key] = value;
  } else {
    if (value === false || value === null || value === void 0) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, value);
    }
  }
  if (el._propsSignals && !key.startsWith("on")) {
    untracked2(() => {
      const sig = el._propsSignals[key];
      if (!sig) {
        el._propsSignals[key] = signal2(value);
      } else if (sig && typeof sig === "object" && "value" in sig && sig.peek() !== value) {
        sig.value = value;
      }
    });
  }
}
function renderDynamic(parent, fn) {
  const anchor = document.createTextNode("");
  parent.appendChild(anchor);
  let currentNodes = [];
  hookEffect(() => {
    let value = fn();
    if (value === void 0 || value === null) value = [];
    const newNodes = (Array.isArray(value) ? value : [value]).map((node) => {
      if (node === null || node === void 0 || typeof node === "boolean") return null;
      if (typeof node === "function") node = node();
      if (node instanceof Node) return node;
      return document.createTextNode(String(node));
    }).filter((n) => n !== null);
    for (const node of currentNodes) {
      if (!newNodes.includes(node)) {
        if (node.parentNode) node.parentNode.removeChild(node);
      }
    }
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
function _mapped(sourceFn, mapFn) {
  const cache = /* @__PURE__ */ new Map();
  const result = signal2([]);
  hookEffect(() => {
    const source = sourceFn();
    const data = Array.isArray(source) ? source : [];
    const newKeys = /* @__PURE__ */ new Set();
    const newItems = data.map((item, index) => {
      const key = item && typeof item === "object" && item.id !== void 0 ? item.id : index;
      newKeys.add(key);
      if (cache.has(key)) {
        const entry = cache.get(key);
        entry.sig.value = item;
        return entry.res;
      }
      const sig = signal2(item);
      const res = mapFn(sig, index);
      cache.set(key, { sig, res });
      return res;
    });
    for (const key of cache.keys()) {
      if (!newKeys.has(key)) cache.delete(key);
    }
    result.value = newItems;
  });
  return () => result.value;
}

// router/Link.jsx
var LinkElement = class extends HTMLElement {
  static observedAttributes = ["href", "className", "style"];
  set href(_val) {
    if (!this._propsSignals["href"]) this._propsSignals["href"] = signal2(_val);
    this._propsSignals["href"].value = _val;
  }
  set className(_val) {
    if (!this._propsSignals["className"]) this._propsSignals["className"] = signal2(_val);
    this._propsSignals["className"].value = _val;
  }
  set style(_val) {
    if (!this._propsSignals["style"]) this._propsSignals["style"] = signal2(_val);
    this._propsSignals["style"].value = _val;
  }
  get href() {
    const _sig = this._propsSignals["href"];
    return _sig ? _sig.value : void 0;
  }
  get className() {
    const _sig = this._propsSignals["className"];
    return _sig ? _sig.value : void 0;
  }
  get style() {
    const _sig = this._propsSignals["style"];
    return _sig ? _sig.value : void 0;
  }
  constructor() {
    super();
    _initInternalState(this, {
      href: signal2(null),
      className: signal2(null),
      style: signal2(null)
    });
  }
  attributeChangedCallback(name, _, value) {
    if (this._propsSignals[name]) this._propsSignals[name].value = value;
  }
  connectedCallback() {
    if (this._mounted) {
      _reconnectWafComponent(this);
      return;
    }
    this._mounted = true;
    const _waf_props = createPropsProxy(this);
    const _isHydrating = this.hasAttribute("data-ssg");
    if (!_isHydrating) {
      this._children = Array.from(this.childNodes);
      _clearChildren(this);
    }
    withInstance(this, () => {
      const props = _waf_props;
      const el0 = _element("a");
      hookEffect(() => setProperty(el0, "href", props.href.value, false));
      hookEffect(() => setProperty(el0, "className", props.className.value, false));
      hookEffect(() => Object.assign(el0.style, props.style.value));
      el0.onclick = (e) => {
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        if (!window.navigation) {
          e.preventDefault();
          navigate(props.href.value);
        }
        window.scrollTo(0, 0);
      };
      renderDynamic(el0, () => props.children);
      const rootElement = el0;
      if (!_isHydrating) this.appendChild(rootElement);
    });
    withInstance(this, () => {
      this._onMounts.forEach((fn) => fn());
    });
  }
  disconnectedCallback() {
    _disconnectWafComponent(this);
  }
};
if (!customElements.get("web-link")) customElements.define("web-link", LinkElement);
var Link_default = LinkElement;
export {
  Computed2 as Computed,
  Effect2 as Effect,
  IS_PROPERTY,
  Link_default as Link,
  PREACT_SIGNALS_BRAND,
  Signal2 as Signal,
  _clearChildren,
  _defineWafProps,
  _disconnectWafComponent,
  _element,
  _fragment,
  _initInternalState,
  _initWafComponent,
  _mapped,
  _reconnectWafComponent,
  _setSSG,
  _svg,
  _syncPropGet,
  _syncPropSet,
  _text,
  applySpread,
  batch2 as batch,
  computed2 as computed,
  createPropsProxy,
  effect2 as effect,
  getCurrentInstance,
  getWafProps,
  hookEffect,
  isSSG,
  mountApp,
  navigate,
  onCleanup,
  onMount,
  onUnmount,
  registerRoutes,
  renderDynamic,
  router,
  routes,
  setProperty,
  setRouterConfig,
  signal2 as signal,
  untracked2 as untracked,
  withInstance
};
if (typeof module !== "undefined" && module.exports && module.exports.default) module.exports = module.exports.default;
