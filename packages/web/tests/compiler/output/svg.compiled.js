import { signal as _signal, _element, _text, _svg, _fragment, hookEffect as _hookEffect, createPropsProxy as _createPropsProxy, _initInternalState, _reconnectWafComponent, _clearChildren, withInstance as _withInstance, _disconnectWafComponent } from "@opentf/web";
class SvgTestElement extends HTMLElement {
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
      let strokeWidth = _signal(2);
      const el0 = _svg("svg");
      el0.setAttribute("width", "100");
      el0.setAttribute("height", "100");
      el0.setAttribute("viewBox", "0 0 100 100");
      const el1 = _svg("circle");
      el1.setAttribute("cx", "50");
      el1.setAttribute("cy", "50");
      el1.setAttribute("r", "40");
      el1.setAttribute("stroke", "red");
      _hookEffect(() => el1.setAttribute("strokeWidth", strokeWidth.value));
      el1.setAttribute("fill", "transparent");
      el0.appendChild(el1);
      const el2 = _svg("path");
      el2.setAttribute("d", "M 10 10 L 90 90");
      el2.setAttribute("stroke", "blue");
      el2.setAttribute("strokeLinecap", "round");
      el0.appendChild(el2);
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
customElements.define("web-svgtest", SvgTestElement);
export default SvgTestElement;