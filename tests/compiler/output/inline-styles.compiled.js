import { signal as _signal, effect as _effect, createPropsProxy as _createPropsProxy, withInstance as _withInstance } from "@opentf/web";
class StyleTestElement extends HTMLElement {
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
      let color = _signal("red");
      const rootElement = (() => {
        const el0 = document.createElement("div");
        _effect(() => Object.assign(el0.style, {
          display: "flex",
          gap: "10px"
        }));
        const el1 = document.createElement("span");
        _effect(() => Object.assign(el1.style, {
          color: color.value
        }));
        const text2 = document.createTextNode("Reactive Style");
        el1.appendChild(text2);
        el0.appendChild(el1);
        const el3 = document.createElement("div");
        el3.style = "font-weight: bold;";
        const text4 = document.createTextNode("Static Style String");
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
customElements.define("web-styletest", StyleTestElement);
export default StyleTestElement;