import { _element, _text, _svg, _fragment, setProperty as _setProperty, signal as _signal, createPropsProxy as _createPropsProxy, _initInternalState, _reconnectWafComponent, _clearChildren, withInstance as _withInstance, _disconnectWafComponent } from "@opentf/web";
class WrapperElement extends HTMLElement {
  static observedAttributes = [];
  constructor() {
    super();
    _initInternalState(this, {});
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
    const _isHydrating = this.hasAttribute("data-ssg");
    if (!_isHydrating) {
      this._children = Array.from(this.childNodes);
      _clearChildren(this);
    }
    _withInstance(this, () => {
      const props = _waf_props;
      const el0 = _element("div");
      _setProperty(el0, "className", "wrapper", false);
      const el1 = _element("header");
      const text2 = _text("Header");
      el1.appendChild(text2);
      el0.appendChild(el1);
      const el3 = _element("main");
      el0.appendChild(el3);
      const el4 = _element("footer");
      const text5 = _text("Footer");
      el4.appendChild(text5);
      el0.appendChild(el4);
      const rootElement = el0;
      if (!_isHydrating) this.appendChild(rootElement);
    });
    _withInstance(this, () => {
      this._onMounts.forEach(fn => fn());
    });
  }
  disconnectedCallback() {
    _disconnectWafComponent(this);
  }
}
customElements.define("web-wrapper", WrapperElement);
export default WrapperElement;