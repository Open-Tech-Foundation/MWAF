import { setProperty as _setProperty, renderDynamic as _renderDynamic, signal as _signal, createPropsProxy as _createPropsProxy, _clearChildren, withInstance as _withInstance } from "@opentf/web";
class ItemElement extends HTMLElement {
  static observedAttributes = ["name", "isPacked"];
  set name(val) {
    if (!this._propsSignals["name"]) this._propsSignals["name"] = _signal(val);
    this._propsSignals["name"].value = val;
  }
  set isPacked(val) {
    if (!this._propsSignals["isPacked"]) this._propsSignals["isPacked"] = _signal(val);
    this._propsSignals["isPacked"].value = val;
  }
  get name() {
    const _sig = this._propsSignals["name"];
    return _sig ? _sig.value : undefined;
  }
  get isPacked() {
    const _sig = this._propsSignals["isPacked"];
    return _sig ? _sig.value : undefined;
  }
  constructor() {
    super();
    Object.defineProperty(this, "_propsSignals", {
      value: {
        name: _signal(null),
        isPacked: _signal(null)
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
        const el0 = document.createElement("li");
        _setProperty(el0, "className", "item");
        _renderDynamic(el0, () => props.isPacked ? (() => {
          const el0 = document.createElement("del");
          _renderDynamic(el0, () => props.name + ' ✅');
          return el0;
        })() : props.name);
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
customElements.define("web-item", ItemElement);
export default ItemElement;