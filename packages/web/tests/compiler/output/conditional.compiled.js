import { setProperty as _setProperty, renderDynamic as _renderDynamic, signal as _signal, createPropsProxy as _createPropsProxy, _reconnectWafComponent, _clearChildren, withInstance as _withInstance, _disconnectWafComponent } from "@opentf/web";
class ItemElement extends HTMLElement {
  static observedAttributes = ["name", "isPacked"];
  set name(_val) {
    if (!this._propsSignals["name"]) this._propsSignals["name"] = _signal(_val);
    this._propsSignals["name"].value = _val;
  }
  set isPacked(_val) {
    if (!this._propsSignals["isPacked"]) this._propsSignals["isPacked"] = _signal(_val);
    this._propsSignals["isPacked"].value = _val;
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
    if (this._mounted) {
      _reconnectWafComponent(this);
      return;
    }
    this._mounted = true;
    const _waf_props = _createPropsProxy(this);
    this._children = Array.from(this.childNodes);
    _clearChildren(this);
    _withInstance(this, () => {
      const {
        name,
        isPacked
      } = _waf_props;
      const el0 = document.createElement("li");
      _setProperty(el0, "className", "item", false);
      _renderDynamic(el0, () => _waf_props.isPacked.value ? (() => {
        const el0 = document.createElement("del");
        _renderDynamic(el0, () => _waf_props.name.value + ' ✅');
        return el0;
      })() : _waf_props.name.value);
      const rootElement = el0;
      this.appendChild(rootElement);
    });
    _withInstance(this, () => {
      this._onMounts.forEach(fn => fn());
    });
  }
  disconnectedCallback() {
    _disconnectWafComponent(this);
  }
}
customElements.define("web-item", ItemElement);
export default ItemElement;