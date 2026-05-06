import { signal as _signal, setProperty as _setProperty, effect as _effect, createPropsProxy as _createPropsProxy, _initWafComponent, _clearChildren, withInstance as _withInstance, renderDynamic as _renderDynamic } from "@opentf/web";
class ParentElement extends HTMLElement {
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
      let count = _signal(0);
      const el0 = document.createElement("div");
      const el1 = document.createElement("web-child");
      _effect(() => _setProperty(el1, "val", count.value, true));
      el0.appendChild(el1);
      const el2 = document.createElement("button");
      el2.onclick = () => count.value++;
      const text3 = document.createTextNode("Inc");
      el2.appendChild(text3);
      el0.appendChild(el2);
      const rootElement = el0;
      this.appendChild(rootElement);
    });
    this._onMounts.forEach(fn => fn());
  }
  disconnectedCallback() {
    this._onCleanups.forEach(fn => fn());
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
        val
      } = _waf_props;
      const el0 = document.createElement("div");
      _renderDynamic(el0, () => _waf_props.val.value);
      const rootElement = el0;
      this.appendChild(rootElement);
    });
    this._onMounts.forEach(fn => fn());
  }
  disconnectedCallback() {
    this._onCleanups.forEach(fn => fn());
  }
}
customElements.define("web-child", ChildElement);