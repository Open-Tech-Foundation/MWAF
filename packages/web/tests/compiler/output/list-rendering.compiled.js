import { signal as _signal, _element, _text, _svg, _fragment, _mapped, renderDynamic as _renderDynamic, createPropsProxy as _createPropsProxy, _initInternalState, _reconnectWafComponent, _clearChildren, withInstance as _withInstance, _disconnectWafComponent } from "@opentf/web";
class ListRenderingElement extends HTMLElement {
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
      const props = _waf_props;
      let items = _signal(['A', 'B', 'C']);
      const el0 = _element("div");
      const el1 = _element("ul");
      const mapped2 = _mapped(() => items.value, item => (() => {
        const el0 = _element("li");
        const text1 = _text("Item ");
        el0.appendChild(text1);
        _renderDynamic(el0, () => item.value);
        return el0;
      })());
      _renderDynamic(el1, () => mapped2());
      el0.appendChild(el1);
      const el3 = _element("button");
      el3.onclick = () => items.value = [...items.value, 'D'];
      const text4 = _text(" Add ");
      el3.appendChild(text4);
      el0.appendChild(el3);
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
customElements.define("web-listrendering", ListRenderingElement);
export default ListRenderingElement;