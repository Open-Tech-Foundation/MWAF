import { effect as _effect, renderDynamic as _renderDynamic, signal as _signal, createPropsProxy as _createPropsProxy, withInstance as _withInstance } from "@opentf/web";
class MultipleComponentsElement extends HTMLElement {
  static observedAttributes = ["a", "b"];
  set a(val) {
    this._propsSignals["a"].value = val;
  }
  set b(val) {
    this._propsSignals["b"].value = val;
  }
  get a() {
    return this._propsSignals["a"].value;
  }
  get b() {
    return this._propsSignals["b"].value;
  }
  constructor() {
    super();
    this._propsSignals = {
      a: _signal(null),
      b: _signal(null)
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
        const el0 = document.createElement("div");
        const el1 = document.createElement("web-a");
        _effect(() => el1.val = props.a);
        el0.appendChild(el1);
        const el2 = document.createElement("web-b");
        _effect(() => el2.val = props.b);
        el0.appendChild(el2);
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
customElements.define("web-multiplecomponents", MultipleComponentsElement);
export default MultipleComponentsElement;
class AElement extends HTMLElement {
  static observedAttributes = ["val"];
  set val(val) {
    this._propsSignals["val"].value = val;
  }
  get val() {
    return this._propsSignals["val"].value;
  }
  constructor() {
    super();
    this._propsSignals = {
      val: _signal(null)
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
        const el0 = document.createElement("div");
        _renderDynamic(el0, () => props.val);
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
customElements.define("web-a", AElement);
class BElement extends HTMLElement {
  static observedAttributes = ["val"];
  set val(val) {
    this._propsSignals["val"].value = val;
  }
  get val() {
    return this._propsSignals["val"].value;
  }
  constructor() {
    super();
    this._propsSignals = {
      val: _signal(null)
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
        const el0 = document.createElement("div");
        _renderDynamic(el0, () => props.val);
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
customElements.define("web-b", BElement);