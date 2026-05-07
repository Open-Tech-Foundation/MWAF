import { signal as _signal, computed as _computed, hookEffect as _hookEffect, isSSG as _isSSG, _element, _text, _svg, _fragment, renderDynamic as _renderDynamic, createPropsProxy as _createPropsProxy, _initInternalState, _reconnectWafComponent, _clearChildren, withInstance as _withInstance, _disconnectWafComponent } from "@opentf/web";
class MacroTestElement extends HTMLElement {
  static observedAttributes = [];
  constructor() {
    super();
    _initInternalState(this, {});
  }
  attributeChangedCallback(name, _, value) {
    if (this._propsSignals[name]) this._propsSignals[name].value = value;
  }
  connectedCallback() {
    if (this._mounted) {
      _reconnectWafComponent(this);
      return;
    }
    this._mounted = true;
    const _waf_props = _createPropsProxy(this);
    const _isHydrating = this.hasAttribute("data-ssg");
    if (!_isHydrating) {
      this._children = Array.from(this.childNodes);
      _clearChildren(this);
    }
    _withInstance(this, () => {
      let count = _signal(0);
      const doubled = _computed(() => count.value * 2);
      if (!_isSSG) _hookEffect(() => {
        console.log("Count changed:", count.value);
      });
      const el0 = _element("div");
      const el1 = _element("p");
      const text2 = _text("Count: ");
      el1.appendChild(text2);
      _renderDynamic(el1, () => count.value);
      el0.appendChild(el1);
      const el3 = _element("p");
      const text4 = _text("Doubled: ");
      el3.appendChild(text4);
      _renderDynamic(el3, () => doubled.value);
      el0.appendChild(el3);
      const el5 = _element("button");
      el5.onclick = () => count.value++;
      const text6 = _text("Increment");
      el5.appendChild(text6);
      el0.appendChild(el5);
      const rootElement = el0;
      if (!_isHydrating) this.appendChild(rootElement);
    });
    _withInstance(this, () => {
      this._onMounts.forEach(fn => fn());
    });
  }
  disconnectedCallback() {
    _disconnectWafComponent(this);
  }
}
customElements.define("web-macrotest", MacroTestElement);
export default MacroTestElement;