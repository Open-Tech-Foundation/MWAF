import { signal as _signal, effect as _effect, setProperty as _setProperty, renderDynamic as _renderDynamic, createPropsProxy as _createPropsProxy, _initWafComponent, _clearChildren, withInstance as _withInstance } from "@opentf/web";
import { signal } from "@preact/signals";
class ReactivityElement extends HTMLElement {
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
      const props = _waf_props;
      let count = _signal(0);
      const el0 = document.createElement("div");
      _effect(() => _setProperty(el0, "title", props.title.value, false));
      const el1 = document.createElement("span");
      _renderDynamic(el1, () => count.value);
      el0.appendChild(el1);
      const el2 = document.createElement("button");
      el2.onclick = () => count.value++;
      const text3 = document.createTextNode("Add");
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
customElements.define("web-reactivity", ReactivityElement);
export default ReactivityElement;