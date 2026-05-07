import { computed as _computed, _element, _text, _svg, _fragment, hookEffect as _hookEffect, setProperty as _setProperty, renderDynamic as _renderDynamic, signal as _signal, createPropsProxy as _createPropsProxy, _initInternalState, _reconnectWafComponent, _clearChildren, withInstance as _withInstance, _disconnectWafComponent } from "@opentf/web";
import { createForm } from "@opentf/web-form";
export class BasicForm extends HTMLElement {
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
          username: ""
        }
      });
      const isValid = _computed(() => form.isValid);
      const isSubmitting = _computed(() => form.isSubmitting);
      const canSubmit = _computed(() => isValid.value && !isSubmitting.value);
      const el0 = _element("section");
      const el1 = _element("button");
      el1.setAttribute("type", "submit");
      _hookEffect(() => _setProperty(el1, "disabled", (() => !canSubmit.value)(), false));
      _renderDynamic(el1, () => isSubmitting.value ? "Processing..." : "Save Changes");
      el0.appendChild(el1);
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
customElements.define("web-basicform", BasicForm);