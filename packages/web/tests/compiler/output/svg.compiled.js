import { signal as _signal, effect as _effect, createPropsProxy as _createPropsProxy, _initWafComponent, _clearChildren, withInstance as _withInstance } from "@opentf/web";
class SvgTestElement extends HTMLElement {
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
      let strokeWidth = _signal(2);
      const el0 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      el0.setAttribute("width", "100");
      el0.setAttribute("height", "100");
      el0.setAttribute("viewBox", "0 0 100 100");
      const el1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      el1.setAttribute("cx", "50");
      el1.setAttribute("cy", "50");
      el1.setAttribute("r", "40");
      el1.setAttribute("stroke", "red");
      _effect(() => el1.setAttribute("strokeWidth", strokeWidth.value));
      el1.setAttribute("fill", "transparent");
      el0.appendChild(el1);
      const el2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
      el2.setAttribute("d", "M 10 10 L 90 90");
      el2.setAttribute("stroke", "blue");
      el2.setAttribute("strokeLinecap", "round");
      el0.appendChild(el2);
      const rootElement = el0;
      this.appendChild(rootElement);
    });
    this._onMounts.forEach(fn => fn());
  }
  disconnectedCallback() {
    this._onCleanups.forEach(fn => fn());
  }
}
customElements.define("web-svgtest", SvgTestElement);
export default SvgTestElement;