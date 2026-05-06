import { effect as _effect, applySpread as _applySpread, signal as _signal, createPropsProxy as _createPropsProxy, _initWafComponent, _clearChildren, withInstance as _withInstance } from "@opentf/web";
class SpreadTestElement extends HTMLElement {
  static observedAttributes = [];
  constructor() {
    super();
    _initWafComponent(this);
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
      const props = {
        id: "test",
        className: "foo",
        "data-custom": "bar"
      };
      const el0 = document.createElement("div");
      _effect(() => _applySpread(el0, props, false));
      const el1 = document.createElement("span");
      _effect(() => _applySpread(el1, {
        style: {
          color: "red"
        }
      }, false));
      const text2 = document.createTextNode("Hello");
      el1.appendChild(text2);
      el0.appendChild(el1);
      const rootElement = el0;
      this.appendChild(rootElement);
    });
    this._onMounts.forEach(fn => fn());
  }
  disconnectedCallback() {
    this._onCleanups.forEach(fn => fn());
  }
}
customElements.define("web-spreadtest", SpreadTestElement);
export default SpreadTestElement;