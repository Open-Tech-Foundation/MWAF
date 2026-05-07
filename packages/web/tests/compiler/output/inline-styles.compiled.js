import { signal as _signal, _element, _text, _svg, _fragment, hookEffect as _hookEffect, setProperty as _setProperty, createPropsProxy as _createPropsProxy, _initInternalState, _reconnectWafComponent, _clearChildren, withInstance as _withInstance, _disconnectWafComponent } from "@opentf/web";
class StyleTestElement extends HTMLElement {
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
      let color = _signal("red");
      const el0 = _element("div");
      _hookEffect(() => Object.assign(el0.style, {
        display: "flex",
        gap: "10px"
      }));
      const el1 = _element("span");
      _hookEffect(() => Object.assign(el1.style, {
        color: color.value
      }));
      const text2 = _text(" Reactive Style ");
      el1.appendChild(text2);
      el0.appendChild(el1);
      const el3 = _element("div");
      _setProperty(el3, "style", "font-weight: bold;", false);
      const text4 = _text(" Static Style String ");
      el3.appendChild(text4);
      el0.appendChild(el3);
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
customElements.define("web-styletest", StyleTestElement);
export default StyleTestElement;