import { setProperty as _setProperty, renderDynamic as _renderDynamic, signal as _signal, createPropsProxy as _createPropsProxy, _initWafComponent, _clearChildren, withInstance as _withInstance } from "@opentf/web";
class ItemElement extends HTMLElement {
  static observedAttributes = ["name", "isPacked"];
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
      const {
        name,
        isPacked
      } = _waf_props;
      const el0 = document.createElement("li");
      _setProperty(el0, "className", "item", false);
      _renderDynamic(el0, () => _waf_props.isPacked.value ? (() => {
        const el0 = document.createElement("del");
        _renderDynamic(el0, () => _waf_props.name.value + ' ✅');
        return el0;
      })() : _waf_props.name.value);
      const rootElement = el0;
      this.appendChild(rootElement);
    });
    this._onMounts.forEach(fn => fn());
  }
  disconnectedCallback() {
    this._onCleanups.forEach(fn => fn());
  }
}
customElements.define("web-item", ItemElement);
export default ItemElement;