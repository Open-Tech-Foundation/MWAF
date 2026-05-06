import { onMount as _onMount, onCleanup as _onCleanup, signal as _signal, createPropsProxy as _createPropsProxy, _initWafComponent, _clearChildren, withInstance as _withInstance } from "@opentf/web";
class LifecycleElement extends HTMLElement {
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
      _onMount(() => {
        console.log("mounted");
      });
      _onCleanup(() => {
        console.log("cleaned up");
      });
      const el0 = document.createElement("div");
      const text1 = document.createTextNode("Lifecycle");
      el0.appendChild(text1);
      const rootElement = el0;
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