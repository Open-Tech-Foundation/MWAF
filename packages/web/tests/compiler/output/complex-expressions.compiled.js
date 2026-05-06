import { signal as _signal, effect as _effect, setProperty as _setProperty, renderDynamic as _renderDynamic, createPropsProxy as _createPropsProxy, _clearChildren, withInstance as _withInstance } from "@opentf/web";
class ComplexExpressionsElement extends HTMLElement {
  static observedAttributes = ["theme", "color", "loading", "title", "logMessage"];
  set theme(_val) {
    if (!this._propsSignals["theme"]) this._propsSignals["theme"] = _signal(_val);
    this._propsSignals["theme"].value = _val;
  }
  set color(_val) {
    if (!this._propsSignals["color"]) this._propsSignals["color"] = _signal(_val);
    this._propsSignals["color"].value = _val;
  }
  set loading(_val) {
    if (!this._propsSignals["loading"]) this._propsSignals["loading"] = _signal(_val);
    this._propsSignals["loading"].value = _val;
  }
  set title(_val) {
    if (!this._propsSignals["title"]) this._propsSignals["title"] = _signal(_val);
    this._propsSignals["title"].value = _val;
  }
  set logMessage(_val) {
    if (!this._propsSignals["logMessage"]) this._propsSignals["logMessage"] = _signal(_val);
    this._propsSignals["logMessage"].value = _val;
  }
  get theme() {
    const _sig = this._propsSignals["theme"];
    return _sig ? _sig.value : undefined;
  }
  get color() {
    const _sig = this._propsSignals["color"];
    return _sig ? _sig.value : undefined;
  }
  get loading() {
    const _sig = this._propsSignals["loading"];
    return _sig ? _sig.value : undefined;
  }
  get title() {
    const _sig = this._propsSignals["title"];
    return _sig ? _sig.value : undefined;
  }
  get logMessage() {
    const _sig = this._propsSignals["logMessage"];
    return _sig ? _sig.value : undefined;
  }
  constructor() {
    super();
    Object.defineProperty(this, "_propsSignals", {
      value: {
        theme: _signal(null),
        color: _signal(null),
        loading: _signal(null),
        title: _signal(null),
        logMessage: _signal(null)
      },
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
      const props = _waf_props;
      let count = _signal(0);
      const el0 = document.createElement("div");
      _effect(() => _setProperty(el0, "className", props.theme.value, false));
      _effect(() => Object.assign(el0.style, {
        color: props.color.value,
        opacity: count.value > 5 ? 1 : 0.5
      }));
      _renderDynamic(el0, () => props.loading.value ? (() => {
        const el0 = document.createElement("span");
        const text1 = document.createTextNode("Loading...");
        el0.appendChild(text1);
        return el0;
      })() : (() => {
        const el0 = document.createElement("div");
        const el1 = document.createElement("h1");
        _renderDynamic(el1, () => props.title.value);
        el0.appendChild(el1);
        const el2 = document.createElement("button");
        el2.onclick = () => console.log(props.logMessage.value);
        const text3 = document.createTextNode(" Log ");
        el2.appendChild(text3);
        _renderDynamic(el2, () => count.value);
        el0.appendChild(el2);
        return el0;
      })());
      const rootElement = el0;
      this.appendChild(rootElement);
    });
    this._onMounts.forEach(fn => fn());
  }
  disconnectedCallback() {
    this._onCleanups.forEach(fn => fn());
  }
}
customElements.define("web-complexexpressions", ComplexExpressionsElement);
export default ComplexExpressionsElement;