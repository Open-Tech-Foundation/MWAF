import { signal as _signal, createPropsProxy as _createPropsProxy, withInstance as _withInstance } from "@opentf/web";
class WrapperElement extends HTMLElement {
  static observedAttributes = [];
  constructor() {
    super();
    this._propsSignals = {};
  }
  attributeChangedCallback(name, _, value) {
    this._propsSignals[name].value = value;
  }
  connectedCallback() {
    this._onMounts = [];
    this._onCleanups = [];
    const props = _createPropsProxy(this);
    this._children = Array.from(this.childNodes);
    while (this.firstChild) this.removeChild(this.firstChild);
    _withInstance(this, () => {
      const rootElement = (() => {
        const el0 = document.createElement("div");
        el0.className = "wrapper";
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
        return el0;
      })();
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