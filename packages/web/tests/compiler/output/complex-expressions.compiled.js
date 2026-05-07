import { signal as _signal, _element, _text, _svg, _fragment, hookEffect as _hookEffect, setProperty as _setProperty, renderDynamic as _renderDynamic, createPropsProxy as _createPropsProxy, _initInternalState, _reconnectWafComponent, _clearChildren, withInstance as _withInstance, _disconnectWafComponent } from "@opentf/web";
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
    _initInternalState(this, {
      theme: _signal(null),
      color: _signal(null),
      loading: _signal(null),
      title: _signal(null),
      logMessage: _signal(null)
    });
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
      const props = _waf_props;
      let count = _signal(0);
      const el0 = _element("div");
      _hookEffect(() => _setProperty(el0, "className", props.theme.value, false));
      _hookEffect(() => Object.assign(el0.style, {
        color: props.color.value,
        opacity: count.value > 5 ? 1 : 0.5
      }));
      _renderDynamic(el0, () => props.loading.value ? (() => {
        const el0 = _element("span");
        const text1 = _text("Loading...");
        el0.appendChild(text1);
        return el0;
      })() : (() => {
        const el0 = _element("div");
        const el1 = _element("h1");
        _renderDynamic(el1, () => props.title.value);
        el0.appendChild(el1);
        const el2 = _element("button");
        el2.onclick = () => console.log(props.logMessage.value);
        const text3 = _text(" Log ");
        el2.appendChild(text3);
        _renderDynamic(el2, () => count.value);
        el0.appendChild(el2);
        return el0;
      })());
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
customElements.define("web-complexexpressions", ComplexExpressionsElement);
export default ComplexExpressionsElement;