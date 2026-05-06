import { signal as _signal, effect as _effect, setProperty as _setProperty, renderDynamic as _renderDynamic, createPropsProxy as _createPropsProxy, _initWafComponent, _clearChildren, withInstance as _withInstance } from "@opentf/web";
class ComplexExpressionsElement extends HTMLElement {
  static observedAttributes = ["theme", "color", "loading", "title", "logMessage"];
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