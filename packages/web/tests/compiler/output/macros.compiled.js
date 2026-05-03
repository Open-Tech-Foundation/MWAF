import { signal as _signal, computed as _computed, effect as _effect, isSSG as _isSSG, renderDynamic as _renderDynamic, createPropsProxy as _createPropsProxy, _clearChildren, withInstance as _withInstance } from "@opentf/web";
class MacroTestElement extends HTMLElement {
  static observedAttributes = [];
  constructor() {
    super();
    Object.defineProperty(this, "_propsSignals", {
      value: {},
      enumerable: false,
      writable: true,
      configurable: true
    });
    Object.defineProperty(this, "_onMounts", {
      value: [],
      enumerable: false,
      writable: true,
      configurable: true
    });
    Object.defineProperty(this, "_onCleanups", {
      value: [],
      enumerable: false,
      writable: true,
      configurable: true
    });
    Object.defineProperty(this, "_children", {
      value: [],
      enumerable: false,
      writable: true,
      configurable: true
    });
    Object.defineProperty(this, "_mounted", {
      value: false,
      enumerable: false,
      writable: true,
      configurable: true
    });
  }
  attributeChangedCallback(name, _, value) {
    if (this._propsSignals[name]) this._propsSignals[name].value = value;
  }
  connectedCallback() {
    if (this._mounted) return;
    this._mounted = true;
    const props = _createPropsProxy(this);
    this._children = Array.from(this.childNodes);
    _clearChildren(this);
    _withInstance(this, () => {
      let count = _signal(0);
      const doubled = _computed(() => count.value * 2);
      if (!_isSSG) _effect(() => {
        console.log("Count changed:", count.value);
      });
      const rootElement = (() => {
        const el0 = document.createElement("div");
        const el1 = document.createElement("p");
        const text2 = document.createTextNode("Count: ");
        el1.appendChild(text2);
        _renderDynamic(el1, () => count.value);
        el0.appendChild(el1);
        const el3 = document.createElement("p");
        const text4 = document.createTextNode("Doubled: ");
        el3.appendChild(text4);
        _renderDynamic(el3, () => doubled.value);
        el0.appendChild(el3);
        const el5 = document.createElement("button");
        el5.onclick = () => count.value++;
        const text6 = document.createTextNode("Increment");
        el5.appendChild(text6);
        el0.appendChild(el5);
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
customElements.define("web-macrotest", MacroTestElement);
export default MacroTestElement;