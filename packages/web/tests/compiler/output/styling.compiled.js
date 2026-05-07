import { signal as _signal, _element, _text, _svg, _fragment, setProperty as _setProperty, hookEffect as _hookEffect, createPropsProxy as _createPropsProxy, _initInternalState, _reconnectWafComponent, _clearChildren, withInstance as _withInstance, _disconnectWafComponent } from "@opentf/web";
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
    _initInternalState(this, {
      theme: _signal(null)
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
    const _isHydrating = this.hasAttribute("data-ssg");
    if (!_isHydrating) {
      this._children = Array.from(this.childNodes);
      _clearChildren(this);
    }
    _withInstance(this, () => {
      const props = _waf_props;
      let active = _signal(true);
      const el0 = _element("div");
      _setProperty(el0, "className", "static-class", false);
      _setProperty(el0, "className", "static-classname", false);
      const el1 = _element("span");
      _hookEffect(() => _setProperty(el1, "className", active.value ? "active" : "inactive", false));
      const text2 = _text(" Reactive Class ");
      el1.appendChild(text2);
      el0.appendChild(el1);
      const el3 = _element("button");
      _hookEffect(() => _setProperty(el3, "className", props.theme.value, false));
      const text4 = _text(" Reactive ClassName from Props ");
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
customElements.define("web-stylingtest", StylingTestElement);
export default StylingTestElement;