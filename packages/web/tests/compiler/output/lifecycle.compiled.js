import { onMount as _onMount, onCleanup as _onCleanup, signal as _signal, createPropsProxy as _createPropsProxy, _clearChildren, withInstance as _withInstance } from "@opentf/web";
class LifecycleElement extends HTMLElement {
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
      _onMount(() => {
        console.log("mounted");
      });
      _onCleanup(() => {
        console.log("cleaned up");
      });
      const rootElement = (() => {
        const el0 = document.createElement("div");
        const text1 = document.createTextNode("Lifecycle");
        el0.appendChild(text1);
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
customElements.define("web-lifecycle", LifecycleElement);
export default LifecycleElement;