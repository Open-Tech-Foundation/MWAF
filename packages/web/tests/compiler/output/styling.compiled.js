import { signal as _signal, setProperty as _setProperty, effect as _effect, createPropsProxy as _createPropsProxy, _clearChildren, withInstance as _withInstance } from "@opentf/web";
class StylingTestElement extends HTMLElement {
  static observedAttributes = ["theme"];
  set theme(_val) {
    if (!this._propsSignals["theme"]) this._propsSignals["theme"] = _signal(_val);
    this._propsSignals["theme"].value = _val;
  }
  get theme() {
    const _sig = this._propsSignals["theme"];
    return _sig ? _sig.value : undefined;
  }
  constructor() {
    super();
    Object.defineProperty(this, "_propsSignals", {
      value: {
        theme: _signal(null)
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
    const _waf_props = _createPropsProxy(this);
    this._children = Array.from(this.childNodes);
    _clearChildren(this);
    _withInstance(this, () => {
      const props = _waf_props;
      let active = _signal(true);
      const el0 = document.createElement("div");
      _setProperty(el0, "className", "static-class", false);
      _setProperty(el0, "className", "static-classname", false);
      const el1 = document.createElement("span");
      _effect(() => _setProperty(el1, "className", active.value ? "active" : "inactive", false));
      const text2 = document.createTextNode(" Reactive Class ");
      el1.appendChild(text2);
      el0.appendChild(el1);
      const el3 = document.createElement("button");
      _effect(() => _setProperty(el3, "className", props.theme.value, false));
      const text4 = document.createTextNode(" Reactive ClassName from Props ");
      el3.appendChild(text4);
      el0.appendChild(el3);
      const rootElement = el0;
      this.appendChild(rootElement);
    });
    this._onMounts.forEach(fn => fn());
  }
  disconnectedCallback() {
    this._onCleanups.forEach(fn => fn());
  }
}
customElements.define("web-stylingtest", StylingTestElement);
export default StylingTestElement;