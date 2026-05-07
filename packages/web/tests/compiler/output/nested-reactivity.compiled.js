import { signal as _signal, _element, _text, _svg, _fragment, hookEffect as _hookEffect, setProperty as _setProperty, renderDynamic as _renderDynamic, createPropsProxy as _createPropsProxy, _initInternalState, _reconnectWafComponent, _clearChildren, withInstance as _withInstance, _disconnectWafComponent } from "@opentf/web";
class NestedReactivityElement extends HTMLElement {
  static observedAttributes = ["title"];
  set title(_val) {
    if (!this._propsSignals["title"]) this._propsSignals["title"] = _signal(_val);
    this._propsSignals["title"].value = _val;
  }
  get title() {
    const _sig = this._propsSignals["title"];
    return _sig ? _sig.value : undefined;
  }
  constructor() {
    super();
    _initInternalState(this, {
      title: _signal(null)
    });
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
      let show = _signal(true);
      const el0 = _element("div");
      _renderDynamic(el0, () => show.value && (() => {
        const el0 = _element("span");
        _hookEffect(() => _setProperty(el0, "title", props.title.value, false));
        const text1 = _text("Hello");
        el0.appendChild(text1);
        return el0;
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
customElements.define("web-nestedreactivity", NestedReactivityElement);
export default NestedReactivityElement;