import { signal as _signal, computed as _computed, renderDynamic as _renderDynamic, createPropsProxy as _createPropsProxy, _initWafComponent, _reconnectWafComponent, _clearChildren, withInstance as _withInstance, _disconnectWafComponent, setProperty as _setProperty, hookEffect as _hookEffect } from "@opentf/web";
// Section 2.7, 2.10: Destructured Props with Defaults and Aliases
export class PropPatterns extends HTMLElement {
  static observedAttributes = ["name", "age"];
  constructor() {
    super();
    _initWafComponent(this);
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
    this._children = Array.from(this.childNodes);
    _clearChildren(this);
    _withInstance(this, () => {
      const {
        name = "Guest",
        age: years = 25,
        ...others
      } = _waf_props;
      const el0 = document.createElement("div");
      const el1 = document.createElement("p");
      const text2 = document.createTextNode("Name: ");
      el1.appendChild(text2);
      _renderDynamic(el1, () => _waf_props.name.value);
      el0.appendChild(el1);
      const el3 = document.createElement("p");
      const text4 = document.createTextNode("Age: ");
      el3.appendChild(text4);
      _renderDynamic(el3, () => _waf_props.age.value);
      el0.appendChild(el3);
      const el5 = document.createElement("p");
      const text6 = document.createTextNode("Other: ");
      el5.appendChild(text6);
      _renderDynamic(el5, () => others.role);
      el0.appendChild(el5);
      const rootElement = el0;
      this.appendChild(rootElement);
    });
    this._onMounts.forEach(fn => fn());
  }
  disconnectedCallback() {
    _disconnectWafComponent(this);
  }
} // Section 5.3.1: Event Normalization (Native vs Component)
customElements.define("web-proppatterns", PropPatterns);
export class EventPatterns extends HTMLElement {
  static observedAttributes = [];
  constructor() {
    super();
    _initWafComponent(this);
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
    this._children = Array.from(this.childNodes);
    _clearChildren(this);
    _withInstance(this, () => {
      const handleNative = () => console.log("native");
      const handleComp = () => console.log("comp");
      const el0 = document.createElement("div");
      el0.onclick = handleNative;
      const el1 = document.createElement("web-proppatterns");
      _hookEffect(() => _setProperty(el1, "onCustomEvent", handleComp, true));
      _hookEffect(() => _setProperty(el1, "onClick", handleComp, true));
      el0.appendChild(el1);
      const rootElement = el0;
      this.appendChild(rootElement);
    });
    this._onMounts.forEach(fn => fn());
  }
  disconnectedCallback() {
    _disconnectWafComponent(this);
  }
} // Section 5.2.1, 5.2.3: Special Attributes
customElements.define("web-eventpatterns", EventPatterns);
export class AttrPatterns extends HTMLElement {
  static observedAttributes = [];
  constructor() {
    super();
    _initWafComponent(this);
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
    this._children = Array.from(this.childNodes);
    _clearChildren(this);
    _withInstance(this, () => {
      let isTrue = true;
      let isNull = null;
      const el0 = document.createElement("div");
      _hookEffect(() => el0.setAttribute("tab-index", 0));
      _hookEffect(() => _setProperty(el0, "disabled", isTrue, false));
      _hookEffect(() => el0.setAttribute("hidden", false));
      el0.setAttribute("aria-label", "test");
      _hookEffect(() => el0.setAttribute("data-id", 123));
      _hookEffect(() => _setProperty(el0, "title", isNull, false));
      const text1 = document.createTextNode(" Content ");
      el0.appendChild(text1);
      const rootElement = el0;
      this.appendChild(rootElement);
    });
    this._onMounts.forEach(fn => fn());
  }
  disconnectedCallback() {
    _disconnectWafComponent(this);
  }
} // Section 5.4.1: HTML Entities
customElements.define("web-attrpatterns", AttrPatterns);
export class TextPatterns extends HTMLElement {
  static observedAttributes = [];
  constructor() {
    super();
    _initWafComponent(this);
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
    this._children = Array.from(this.childNodes);
    _clearChildren(this);
    _withInstance(this, () => {
      const el0 = document.createElement("div");
      const text1 = document.createTextNode(" \xA9 2024 WAF & Co. ");
      el0.appendChild(text1);
      const el2 = document.createElement("br");
      el0.appendChild(el2);
      const text3 = document.createTextNode(" Void element test: ");
      el0.appendChild(text3);
      const el4 = document.createElement("input");
      el0.appendChild(el4);
      const rootElement = el0;
      this.appendChild(rootElement);
    });
    this._onMounts.forEach(fn => fn());
  }
  disconnectedCallback() {
    _disconnectWafComponent(this);
  }
} // Section 3.2, 4.6: Macros ($derived expressions, $expose)
customElements.define("web-textpatterns", TextPatterns);
export class MacroPatterns extends HTMLElement {
  static observedAttributes = [];
  constructor() {
    super();
    _initWafComponent(this);
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
    this._children = Array.from(this.childNodes);
    _clearChildren(this);
    _withInstance(this, () => {
      let a = _signal(10);
      let b = _signal(20);
      // Auto-wrapping expression in computed
      let sum = _computed(() => a.value + b.value);
      Object.assign(this, {
        getSum: () => sum.value
      });
      const el0 = document.createElement("div");
      const text1 = document.createTextNode("Sum: ");
      el0.appendChild(text1);
      _renderDynamic(el0, () => sum.value);
      const rootElement = el0;
      this.appendChild(rootElement);
    });
    this._onMounts.forEach(fn => fn());
  }
  disconnectedCallback() {
    _disconnectWafComponent(this);
  }
} // Section 3.5: $signal() First-Access Rule
customElements.define("web-macropatterns", MacroPatterns);
export class SignalPatterns extends HTMLElement {
  static observedAttributes = [];
  constructor() {
    super();
    _initWafComponent(this);
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
    this._children = Array.from(this.childNodes);
    _clearChildren(this);
    _withInstance(this, () => {
      const store = $signal({
        user: {
          name: "Alice"
        },
        count: 0
      });
      const {
        count
      } = $signal({
        count: 100
      });
      const el0 = document.createElement("div");
      const el1 = document.createElement("p");
      const text2 = document.createTextNode("User: ");
      el1.appendChild(text2);
      _renderDynamic(el1, () => store.user.name);
      el0.appendChild(el1);
      const el3 = document.createElement("p");
      const text4 = document.createTextNode("Count: ");
      el3.appendChild(text4);
      _renderDynamic(el3, () => count);
      el0.appendChild(el3);
      const rootElement = el0;
      this.appendChild(rootElement);
    });
    this._onMounts.forEach(fn => fn());
  }
  disconnectedCallback() {
    _disconnectWafComponent(this);
  }
}
customElements.define("web-signalpatterns", SignalPatterns);