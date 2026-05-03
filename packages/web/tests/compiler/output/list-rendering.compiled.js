import { signal as _signal, _mapped, renderDynamic as _renderDynamic, createPropsProxy as _createPropsProxy, _clearChildren, withInstance as _withInstance } from "@opentf/web";
class ListRenderingElement extends HTMLElement {
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
    const props = _createPropsProxy(this);
    this._children = Array.from(this.childNodes);
    _clearChildren(this);
    _withInstance(this, () => {
      let items = _signal(['A', 'B', 'C']);
      const rootElement = (() => {
        const el0 = document.createElement("div");
        const el1 = document.createElement("ul");
        const mapped2 = _mapped(() => items.value, item => (() => {
          const el0 = document.createElement("li");
          const text1 = document.createTextNode("Item ");
          el0.appendChild(text1);
          _renderDynamic(el0, () => item.value);
          return el0;
        })());
        _renderDynamic(el1, () => mapped2());
        el0.appendChild(el1);
        const el3 = document.createElement("button");
        el3.onclick = () => items.value = [...items.value, 'D'];
        const text4 = document.createTextNode(" Add ");
        el3.appendChild(text4);
        el0.appendChild(el3);
        return el0;
      })();
      this.appendChild(rootElement);
    });
    this._onMounts.forEach(fn => fn());
  }
  disconnectedCallback() {
    this._onCleanups.forEach(fn => fn());
  }
}
customElements.define("web-listrendering", ListRenderingElement);
export default ListRenderingElement;