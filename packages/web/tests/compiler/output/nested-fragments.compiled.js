import { signal as _signal, _element, _text, _svg, _fragment, renderDynamic as _renderDynamic, createPropsProxy as _createPropsProxy, _initInternalState, _reconnectWafComponent, _clearChildren, withInstance as _withInstance, _disconnectWafComponent } from "@opentf/web";
class NestedFragmentsElement extends HTMLElement {
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
      let show = _signal(true);
      const el0 = _element("div");
      _renderDynamic(el0, () => show.value && (() => {
        const frag0 = _fragment();
        const el1 = _element("span");
        const text2 = _text("A");
        el1.appendChild(text2);
        frag0.appendChild(el1);
        const frag3 = _fragment();
        const el4 = _element("span");
        const text5 = _text("B");
        el4.appendChild(text5);
        frag3.appendChild(el4);
        const el6 = _element("span");
        const text7 = _text("C");
        el6.appendChild(text7);
        frag3.appendChild(el6);
        frag0.appendChild(frag3);
        return frag0;
      })());
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
customElements.define("web-nestedfragments", NestedFragmentsElement);
export default NestedFragmentsElement;