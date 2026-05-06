import { setProperty as _setProperty, signal as _signal, createPropsProxy as _createPropsProxy, _initWafComponent, _clearChildren, withInstance as _withInstance } from "@opentf/web";
class WrapperElement extends HTMLElement {
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
      const props = _waf_props;
      const el0 = document.createElement("div");
      _setProperty(el0, "className", "wrapper", false);
      const el1 = document.createElement("header");
      const text2 = document.createTextNode("Header");
      el1.appendChild(text2);
      el0.appendChild(el1);
      const el3 = document.createElement("main");
      el0.appendChild(el3);
      const el4 = document.createElement("footer");
      const text5 = document.createTextNode("Footer");
      el4.appendChild(text5);
      el0.appendChild(el4);
      const rootElement = el0;
      this.appendChild(rootElement);
    });
    this._onMounts.forEach(fn => fn());
  }
  disconnectedCallback() {
    this._onCleanups.forEach(fn => fn());
  }
}
customElements.define("web-wrapper", WrapperElement);
export default WrapperElement;