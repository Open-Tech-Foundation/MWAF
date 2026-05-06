import { signal as _signal, effect as _effect, setProperty as _setProperty, createPropsProxy as _createPropsProxy, _initWafComponent, _clearChildren, withInstance as _withInstance } from "@opentf/web";
class StyleTestElement extends HTMLElement {
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
      let color = _signal("red");
      const el0 = document.createElement("div");
      _effect(() => Object.assign(el0.style, {
        display: "flex",
        gap: "10px"
      }));
      const el1 = document.createElement("span");
      _effect(() => Object.assign(el1.style, {
        color: color.value
      }));
      const text2 = document.createTextNode(" Reactive Style ");
      el1.appendChild(text2);
      el0.appendChild(el1);
      const el3 = document.createElement("div");
      _setProperty(el3, "style", "font-weight: bold;", false);
      const text4 = document.createTextNode(" Static Style String ");
      el3.appendChild(text4);
      el0.appendChild(el3);
      const rootElement = el0;
      this.appendChild(rootElement);
    });
    this._onMounts.forEach(fn => fn());
  }
  disconnectedCallback() {
    this._onCleanups.forEach(fn => fn());
  }
}
customElements.define("web-styletest", StyleTestElement);
export default StyleTestElement;