import { createPropsProxy as _createPropsProxy, withInstance as _withInstance } from "@opentf/web";
import { signal as _signal } from "@preact/signals-core";
import { onMount as _onMount, onCleanup as _onCleanup } from "@opentf/web";
class LifecycleElement extends HTMLElement {
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