import { signal as _signal, renderDynamic as _renderDynamic, createPropsProxy as _createPropsProxy, _clearChildren, withInstance as _withInstance } from "@opentf/web";
class NestedFragmentsElement extends HTMLElement {
  static observedAttributes = [];
  constructor() {
    super();
    Object.defineProperty(this, "_propsSignals", {
      value: {},
      enumerable: false,
      writable: true,
      configurable: true
    });
    Object.defineProperty(this, "_onMounts", {
      value: [],
      enumerable: false,
      writable: true,
      configurable: true
    });
    Object.defineProperty(this, "_onCleanups", {
      value: [],
      enumerable: false,
      writable: true,
      configurable: true
    });
    Object.defineProperty(this, "_children", {
      value: [],
      enumerable: false,
      writable: true,
      configurable: true
    });
    Object.defineProperty(this, "_mounted", {
      value: false,
      enumerable: false,
      writable: true,
      configurable: true
    });
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
      let show = _signal(true);
      const el0 = document.createElement("div");
      _renderDynamic(el0, () => show.value && (() => {
        const frag0 = document.createDocumentFragment();
        const el1 = document.createElement("span");
        const text2 = document.createTextNode("A");
        el1.appendChild(text2);
        frag0.appendChild(el1);
        const frag3 = document.createDocumentFragment();
        const el4 = document.createElement("span");
        const text5 = document.createTextNode("B");
        el4.appendChild(text5);
        frag3.appendChild(el4);
        const el6 = document.createElement("span");
        const text7 = document.createTextNode("C");
        el6.appendChild(text7);
        frag3.appendChild(el6);
        frag0.appendChild(frag3);
        return frag0;
      })());
      const rootElement = el0;
      this.appendChild(rootElement);
    });
    this._onMounts.forEach(fn => fn());
  }
  disconnectedCallback() {
    this._onCleanups.forEach(fn => fn());
  }
}
customElements.define("web-nestedfragments", NestedFragmentsElement);
export default NestedFragmentsElement;