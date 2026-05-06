import { computed as _computed, effect as _effect, setProperty as _setProperty, renderDynamic as _renderDynamic, signal as _signal, createPropsProxy as _createPropsProxy, _initWafComponent, _clearChildren, withInstance as _withInstance } from "@opentf/web";
import { createForm } from "@opentf/web-form";
export class BasicForm extends HTMLElement {
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
      const form = createForm({
        initialValues: {
          username: ""
        }
      });
      const isValid = _computed(() => form.isValid);
      const isSubmitting = _computed(() => form.isSubmitting);
      const canSubmit = _computed(() => isValid.value && !isSubmitting.value);
      const el0 = document.createElement("section");
      const el1 = document.createElement("button");
      el1.setAttribute("type", "submit");
      _effect(() => _setProperty(el1, "disabled", (() => !canSubmit.value)(), false));
      _renderDynamic(el1, () => isSubmitting.value ? "Processing..." : "Save Changes");
      el0.appendChild(el1);
      const rootElement = el0;
      this.appendChild(rootElement);
    });
    this._onMounts.forEach(fn => fn());
  }
  disconnectedCallback() {
    this._onCleanups.forEach(fn => fn());
  }
}
customElements.define("web-basicform", BasicForm);