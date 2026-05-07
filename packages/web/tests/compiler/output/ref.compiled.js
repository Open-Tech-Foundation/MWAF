import { signal as _signal, onMount as _onMount, _element, _text, _svg, _fragment, createPropsProxy as _createPropsProxy, _initInternalState, _reconnectWafComponent, _clearChildren, withInstance as _withInstance, _disconnectWafComponent, hookEffect as _hookEffect } from "@opentf/web";
class CustomInputElement extends HTMLElement {
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
      const input = _signal();
      const focus = () => input.value.focus();
      Object.assign(this, {
        focus
      });
      const el0 = _element("input");
      input.value = el0;
      el0.setAttribute("type", "text");
      el0.setAttribute("placeholder", "Custom Input");
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
customElements.define("web-custominput", CustomInputElement);
class RefTestElement extends HTMLElement {
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
      const myDiv = _signal();
      const myInput = _signal();
      let color = _signal("red");
      _onMount(() => {
        myDiv.value.style.backgroundColor = "lightgray";
        myInput.value.focus();
      });
      const el0 = _element("div");
      myDiv.value = el0;
      _hookEffect(() => Object.assign(el0.style, {
        padding: "20px"
      }));
      const el1 = _element("h1");
      _hookEffect(() => Object.assign(el1.style, {
        color: color.value
      }));
      const text2 = _text("Ref Test");
      el1.appendChild(text2);
      el0.appendChild(el1);
      const el3 = _element("web-custominput");
      myInput.value = el3;
      el0.appendChild(el3);
      const el4 = _element("button");
      el4.onclick = () => color.value = "blue";
      const text5 = _text("Change Color");
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
customElements.define("web-reftest", RefTestElement);
export default RefTestElement;