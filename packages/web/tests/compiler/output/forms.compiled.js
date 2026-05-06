import { effect as _effect, applySpread as _applySpread, renderDynamic as _renderDynamic, signal as _signal, createPropsProxy as _createPropsProxy, _clearChildren, withInstance as _withInstance } from "@opentf/web";
import { createForm } from "@opentf/web-form";
class FormCaseElement extends HTMLElement {
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
      const form = createForm({
        initialValues: {
          name: "Alice"
        }
      });
      const el0 = document.createElement("div");
      const el1 = document.createElement("input");
      _effect(() => _applySpread(el1, form.register('name'), false));
      el0.appendChild(el1);
      const el2 = document.createElement("p");
      const text3 = document.createTextNode("Hello, ");
      el2.appendChild(text3);
      _renderDynamic(el2, () => form.values.name);
      el0.appendChild(el2);
      const el4 = document.createElement("button");
      el4.onclick = form.handleSubmit(v => console.log(v));
      const text5 = document.createTextNode(" Submit ");
      el4.appendChild(text5);
      el0.appendChild(el4);
      const rootElement = el0;
      this.appendChild(rootElement);
    });
    this._onMounts.forEach(fn => fn());
  }
  disconnectedCallback() {
    this._onCleanups.forEach(fn => fn());
  }
}
customElements.define("web-formcase", FormCaseElement);
export default FormCaseElement;