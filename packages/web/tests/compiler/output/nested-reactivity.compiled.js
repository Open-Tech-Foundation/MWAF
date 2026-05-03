import { signal as _signal, effect as _effect, setProperty as _setProperty, renderDynamic as _renderDynamic, createPropsProxy as _createPropsProxy, _clearChildren, withInstance as _withInstance } from "@opentf/web";
class NestedReactivityElement extends HTMLElement {
  static observedAttributes = ["title"];
  set title(val) {
    if (!this._propsSignals["title"]) this._propsSignals["title"] = _signal(val);
    this._propsSignals["title"].value = val;
  }
  get title() {
    const _sig = this._propsSignals["title"];
    return _sig ? _sig.value : undefined;
  }
  constructor() {
    super();
    Object.defineProperty(this, "_propsSignals", {
      value: {
        title: _signal(null)
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
    const props = _createPropsProxy(this);
    this._children = Array.from(this.childNodes);
    _clearChildren(this);
    _withInstance(this, () => {
      let show = _signal(true);
      const rootElement = (() => {
        const el0 = document.createElement("div");
        _renderDynamic(el0, () => show.value && (() => {
          const el0 = document.createElement("span");
          _effect(() => _setProperty(el0, "title", props.title));
          const text1 = document.createTextNode("Hello");
          el0.appendChild(text1);
          return el0;
        })());
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
customElements.define("web-nestedreactivity", NestedReactivityElement);
export default NestedReactivityElement;