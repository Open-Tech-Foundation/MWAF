import { createPropsProxy as _createPropsProxy, withInstance as _withInstance } from "@opentf/web";
import { signal as _signal, effect as _effect } from "@preact/signals-core";
class StylingTestElement extends HTMLElement {
  static observedAttributes = ["theme"];
  set theme(val) {
    this._propsSignals["theme"].value = val;
  }
  get theme() {
    return this._propsSignals["theme"].value;
  }
  constructor() {
    super();
    this._propsSignals = {
      theme: _signal(null)
    };
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
      let active = _signal(true);
      const rootElement = (() => {
        const el0 = document.createElement("div");
        el0.className = "static-class";
        el0.className = "static-classname";
        const el1 = document.createElement("span");
        _effect(() => el1.className = active.value ? "active" : "inactive");
        const text2 = document.createTextNode("Reactive Class");
        el1.appendChild(text2);
        el0.appendChild(el1);
        const el3 = document.createElement("button");
        _effect(() => el3.className = props.theme);
        const text4 = document.createTextNode("Reactive ClassName from Props");
        el3.appendChild(text4);
        el0.appendChild(el3);
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
customElements.define("web-stylingtest", StylingTestElement);
export default StylingTestElement;