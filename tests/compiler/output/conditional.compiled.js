import { createPropsProxy as _createPropsProxy, withInstance as _withInstance } from "@opentf/web";
import { signal as _signal } from "@preact/signals-core";
import { renderDynamic as _renderDynamic } from "@opentf/web";
class ItemElement extends HTMLElement {
  static observedAttributes = ["name", "isPacked"];
  set name(val) {
    this._propsSignals["name"].value = val;
  }
  set isPacked(val) {
    this._propsSignals["isPacked"].value = val;
  }
  get name() {
    return this._propsSignals["name"].value;
  }
  get isPacked() {
    return this._propsSignals["isPacked"].value;
  }
  constructor() {
    super();
    this._propsSignals = {
      name: _signal(null),
      isPacked: _signal(null)
    };
  }
  attributeChangedCallback(name, _, value) {
    this._propsSignals[name].value = value;
  }
  connectedCallback() {
    this._onMounts = [];
    this._onCleanups = [];
    const props = _createPropsProxy(this);
    this._children = Array.from(this.childNodes);
    while (this.firstChild) this.removeChild(this.firstChild);
    _withInstance(this, () => {
      const rootElement = (() => {
        const el0 = document.createElement("li");
        el0.className = "item";
        _renderDynamic(el0, () => props.isPacked ? (() => {
          const el0 = document.createElement("del");
          _renderDynamic(el0, () => props.name + ' ✅');
          return el0;
        })() : props.name);
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
customElements.define("web-item", ItemElement);
export default ItemElement;