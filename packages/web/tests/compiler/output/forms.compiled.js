import { _element, _text, _svg, _fragment, hookEffect as _hookEffect, applySpread as _applySpread, renderDynamic as _renderDynamic, signal as _signal, createPropsProxy as _createPropsProxy, _initInternalState, _reconnectWafComponent, _clearChildren, withInstance as _withInstance, _disconnectWafComponent } from "@opentf/web";
import { createForm } from "@opentf/web-form";
class FormCaseElement extends HTMLElement {
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
      const form = createForm({
        initialValues: {
          name: "Alice"
        }
      });
      const el0 = _element("div");
      const el1 = _element("input");
      _hookEffect(() => _applySpread(el1, form.register('name'), false));
      el0.appendChild(el1);
      const el2 = _element("p");
      const text3 = _text("Hello, ");
      el2.appendChild(text3);
      _renderDynamic(el2, () => form.values.name);
      el0.appendChild(el2);
      const el4 = _element("button");
      el4.onclick = form.handleSubmit(v => console.log(v));
      const text5 = _text(" Submit ");
      el4.appendChild(text5);
      el0.appendChild(el4);
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
customElements.define("web-formcase", FormCaseElement);
export default FormCaseElement;