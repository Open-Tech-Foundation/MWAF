import { signal as _signal, _element, _text, _svg, _fragment, setProperty as _setProperty, hookEffect as _hookEffect, createPropsProxy as _createPropsProxy, _initInternalState, _reconnectWafComponent, _clearChildren, withInstance as _withInstance, _disconnectWafComponent, renderDynamic as _renderDynamic } from "@opentf/web";
class ParentElement extends HTMLElement {
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
      const el0 = _element("div");
      const el1 = _element("web-child");
      _hookEffect(() => _setProperty(el1, "val", count.value, true));
      el0.appendChild(el1);
      const el2 = _element("button");
      el2.onclick = () => count.value++;
      const text3 = _text("Inc");
      el2.appendChild(text3);
      el0.appendChild(el2);
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
customElements.define("web-parent", ParentElement);
export default ParentElement;
class ChildElement extends HTMLElement {
  static observedAttributes = ["val"];
  set val(_val) {
    if (!this._propsSignals["val"]) this._propsSignals["val"] = _signal(_val);
    this._propsSignals["val"].value = _val;
  }
  get val() {
    const _sig = this._propsSignals["val"];
    return _sig ? _sig.value : undefined;
  }
  constructor() {
    super();
    _initInternalState(this, {
      val: _signal(null)
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
      const {
        val
      } = _waf_props;
      const el0 = _element("div");
      _renderDynamic(el0, () => _waf_props.val.value);
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
customElements.define("web-child", ChildElement);