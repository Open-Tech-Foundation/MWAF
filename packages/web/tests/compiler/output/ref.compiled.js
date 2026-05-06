import { signal as _signal, onMount as _onMount, createPropsProxy as _createPropsProxy, _clearChildren, withInstance as _withInstance, effect as _effect } from "@opentf/web";
class CustomInputElement extends HTMLElement {
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
      const input = _signal();
      const focus = () => input.value.focus();
      Object.assign(this, {
        focus
      });
      const el0 = document.createElement("input");
      input.value = el0;
      el0.setAttribute("type", "text");
      el0.setAttribute("placeholder", "Custom Input");
      const rootElement = el0;
      this.appendChild(rootElement);
    });
    this._onMounts.forEach(fn => fn());
  }
  disconnectedCallback() {
    this._onCleanups.forEach(fn => fn());
  }
}
customElements.define("web-custominput", CustomInputElement);
class RefTestElement extends HTMLElement {
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
      const myDiv = _signal();
      const myInput = _signal();
      let color = _signal("red");
      _onMount(() => {
        myDiv.value.style.backgroundColor = "lightgray";
        myInput.value.focus();
      });
      const el0 = document.createElement("div");
      myDiv.value = el0;
      _effect(() => Object.assign(el0.style, {
        padding: "20px"
      }));
      const el1 = document.createElement("h1");
      _effect(() => Object.assign(el1.style, {
        color: color.value
      }));
      const text2 = document.createTextNode("Ref Test");
      el1.appendChild(text2);
      el0.appendChild(el1);
      const el3 = document.createElement("web-custominput");
      myInput.value = el3;
      el0.appendChild(el3);
      const el4 = document.createElement("button");
      el4.onclick = () => color.value = "blue";
      const text5 = document.createTextNode("Change Color");
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
customElements.define("web-reftest", RefTestElement);
export default RefTestElement;