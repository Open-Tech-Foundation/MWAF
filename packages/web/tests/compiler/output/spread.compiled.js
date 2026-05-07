import { _element, _text, _svg, _fragment, hookEffect as _hookEffect, applySpread as _applySpread, signal as _signal, createPropsProxy as _createPropsProxy, _initInternalState, _reconnectWafComponent, _clearChildren, withInstance as _withInstance, _disconnectWafComponent } from "@opentf/web";
class SpreadTestElement extends HTMLElement {
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
      const props = {
        id: "test",
        className: "foo",
        "data-custom": "bar"
      };
      const el0 = _element("div");
      _hookEffect(() => _applySpread(el0, props, false));
      const el1 = _element("span");
      _hookEffect(() => _applySpread(el1, {
        style: {
          color: "red"
        }
      }, false));
      const text2 = _text("Hello");
      el1.appendChild(text2);
      el0.appendChild(el1);
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
customElements.define("web-spreadtest", SpreadTestElement);
export default SpreadTestElement;