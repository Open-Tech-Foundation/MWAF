import { withInstance as _withInstance } from "/framework/runtime/lifecycle.js";
import { createPropsProxy as _createPropsProxy } from "/framework/runtime/props.js";
import { mapped as _mapped, renderDynamic as _renderDynamic } from "/framework/runtime/dom.js";
import { signal as _signal } from "@preact/signals-core";
class ListRenderingElement extends HTMLElement {
  static observedAttributes = [];
  constructor() {
    super();
    this._propsSignals = {};
  }
  attributeChangedCallback(name, _, value) {
    this._propsSignals[name].value = value;
  }
  connectedCallback() {
    this._onMounts = [];
    this._onCleanups = [];
    const props = _createPropsProxy(this);
    _withInstance(this, () => {
      let items = _signal(['A', 'B', 'C']);
      const rootElement = (() => {
        const el0 = document.createElement("div");
        const el1 = document.createElement("ul");
        const mapped2 = _mapped(() => items.value, item => (() => {
          const el0 = document.createElement("li");
          const text1 = document.createTextNode("Item ");
          el0.appendChild(text1);
          _renderDynamic(el0, () => item);
          return el0;
        })());
        _renderDynamic(el1, () => mapped2());
        el0.appendChild(el1);
        const el3 = document.createElement("button");
        el3.onclick = () => items.value = [...items.value, 'D'];
        const text4 = document.createTextNode("Add");
        el3.appendChild(text4);
        el0.appendChild(el3);
        return el0;
      })();
      this._children = Array.from(this.childNodes);
      while (this.firstChild) rootElement.appendChild(this.firstChild);
      this.appendChild(rootElement);
    });
    this._onMounts.forEach(fn => fn());
  }
  disconnectedCallback() {
    this._onCleanups.forEach(fn => fn());
  }
}
customElements.define("mwaf-listrendering", ListRenderingElement);
export default ListRenderingElement;