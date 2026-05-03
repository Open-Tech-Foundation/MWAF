import { setProperty as _setProperty, effect as _effect, renderDynamic as _renderDynamic, signal as _signal, createPropsProxy as _createPropsProxy, _clearChildren, withInstance as _withInstance } from "@opentf/web";
class MultipleComponentsElement extends HTMLElement {
  static observedAttributes = [];
  constructor() {
    super();
    Object.defineProperty(this, "_propsSignals", {
      value: {},
      enumerable: false,
      writable: true,
      configurable: true
    });
    Object.defineProperty(this, "_onMounts", {
      value: [],
      enumerable: false,
      writable: true,
      configurable: true
    });
    Object.defineProperty(this, "_onCleanups", {
      value: [],
      enumerable: false,
      writable: true,
      configurable: true
    });
    Object.defineProperty(this, "_children", {
      value: [],
      enumerable: false,
      writable: true,
      configurable: true
    });
    Object.defineProperty(this, "_mounted", {
      value: false,
      enumerable: false,
      writable: true,
      configurable: true
    });
  }
  attributeChangedCallback(name, _, value) {
    if (this._propsSignals[name]) this._propsSignals[name].value = value;
  }
  connectedCallback() {
    if (this._mounted) return;
    this._mounted = true;
    const props = _createPropsProxy(this);
    this._children = Array.from(this.childNodes);
    _clearChildren(this);
    _withInstance(this, () => {
      const rootElement = (() => {
        const el0 = document.createElement("div");
        const el1 = document.createElement("web-a");
        _effect(() => _setProperty(el1, "val", props.a));
        el0.appendChild(el1);
        const el2 = document.createElement("web-b");
        _effect(() => _setProperty(el2, "val", props.b));
        el0.appendChild(el2);
        return el0;
      })();
      this.appendChild(rootElement);
    });
    this._onMounts.forEach(fn => fn());
  }
  disconnectedCallback() {
    this._onCleanups.forEach(fn => fn());
  }
}
customElements.define("web-multiplecomponents", MultipleComponentsElement);
export default MultipleComponentsElement;
class AElement extends HTMLElement {
  static observedAttributes = ["val"];
  set val(val) {
    if (!this._propsSignals["val"]) this._propsSignals["val"] = _signal(val);
    this._propsSignals["val"].value = val;
  }
  get val() {
    const _sig = this._propsSignals["val"];
    return _sig ? _sig.value : undefined;
  }
  constructor() {
    super();
    Object.defineProperty(this, "_propsSignals", {
      value: {
        val: _signal(null)
      },
      enumerable: false,
      writable: true,
      configurable: true
    });
    Object.defineProperty(this, "_onMounts", {
      value: [],
      enumerable: false,
      writable: true,
      configurable: true
    });
    Object.defineProperty(this, "_onCleanups", {
      value: [],
      enumerable: false,
      writable: true,
      configurable: true
    });
    Object.defineProperty(this, "_children", {
      value: [],
      enumerable: false,
      writable: true,
      configurable: true
    });
    Object.defineProperty(this, "_mounted", {
      value: false,
      enumerable: false,
      writable: true,
      configurable: true
    });
  }
  attributeChangedCallback(name, _, value) {
    if (this._propsSignals[name]) this._propsSignals[name].value = value;
  }
  connectedCallback() {
    if (this._mounted) return;
    this._mounted = true;
    const props = _createPropsProxy(this);
    this._children = Array.from(this.childNodes);
    _clearChildren(this);
    _withInstance(this, () => {
      const rootElement = (() => {
        const el0 = document.createElement("div");
        _renderDynamic(el0, () => props.val);
        return el0;
      })();
      this.appendChild(rootElement);
    });
    this._onMounts.forEach(fn => fn());
  }
  disconnectedCallback() {
    this._onCleanups.forEach(fn => fn());
  }
}
customElements.define("web-a", AElement);
class BElement extends HTMLElement {
  static observedAttributes = ["val"];
  set val(val) {
    if (!this._propsSignals["val"]) this._propsSignals["val"] = _signal(val);
    this._propsSignals["val"].value = val;
  }
  get val() {
    const _sig = this._propsSignals["val"];
    return _sig ? _sig.value : undefined;
  }
  constructor() {
    super();
    Object.defineProperty(this, "_propsSignals", {
      value: {
        val: _signal(null)
      },
      enumerable: false,
      writable: true,
      configurable: true
    });
    Object.defineProperty(this, "_onMounts", {
      value: [],
      enumerable: false,
      writable: true,
      configurable: true
    });
    Object.defineProperty(this, "_onCleanups", {
      value: [],
      enumerable: false,
      writable: true,
      configurable: true
    });
    Object.defineProperty(this, "_children", {
      value: [],
      enumerable: false,
      writable: true,
      configurable: true
    });
    Object.defineProperty(this, "_mounted", {
      value: false,
      enumerable: false,
      writable: true,
      configurable: true
    });
  }
  attributeChangedCallback(name, _, value) {
    if (this._propsSignals[name]) this._propsSignals[name].value = value;
  }
  connectedCallback() {
    if (this._mounted) return;
    this._mounted = true;
    const props = _createPropsProxy(this);
    this._children = Array.from(this.childNodes);
    _clearChildren(this);
    _withInstance(this, () => {
      const rootElement = (() => {
        const el0 = document.createElement("div");
        _renderDynamic(el0, () => props.val);
        return el0;
      })();
      this.appendChild(rootElement);
    });
    this._onMounts.forEach(fn => fn());
  }
  disconnectedCallback() {
    this._onCleanups.forEach(fn => fn());
  }
}
customElements.define("web-b", BElement);