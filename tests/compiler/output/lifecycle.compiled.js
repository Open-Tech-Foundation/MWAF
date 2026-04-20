import { withInstance as _withInstance } from "/framework/runtime/lifecycle.js";
import { createPropsProxy as _createPropsProxy } from "/framework/runtime/props.js";
import { signal as _signal } from "@preact/signals";
import { onMount as _onMount, onCleanup as _onCleanup } from "/framework/runtime/lifecycle.js";
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
    _withInstance(this, () => {
      _onMount(() => {
        console.log("mounted");
      });
      _onCleanup(() => {
        console.log("cleaned up");
      });
      const el0 = document.createElement("div");
      const text1 = document.createTextNode("Lifecycle");
      el0.appendChild(text1);
      while (this.firstChild) el0.appendChild(this.firstChild);
      this.appendChild(el0);
    });
    this._onMounts.forEach(fn => fn());
  }
  disconnectedCallback() {
    this._onCleanups.forEach(fn => fn());
  }
}
customElements.define("waf-lifecycle", LifecycleElement);
export default LifecycleElement;