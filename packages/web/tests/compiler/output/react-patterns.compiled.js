import { _element, _text, _svg, _fragment, setProperty as _setProperty, hookEffect as _hookEffect, renderDynamic as _renderDynamic, applySpread as _applySpread, signal as _signal, createPropsProxy as _createPropsProxy, _initInternalState, _reconnectWafComponent, _clearChildren, withInstance as _withInstance, _disconnectWafComponent } from "@opentf/web";
import { UI } from './ui-lib';
class ReactPatternsElement extends HTMLElement {
  static observedAttributes = ["user", "notifications"];
  set user(_val) {
    if (!this._propsSignals["user"]) this._propsSignals["user"] = _signal(_val);
    this._propsSignals["user"].value = _val;
  }
  set notifications(_val) {
    if (!this._propsSignals["notifications"]) this._propsSignals["notifications"] = _signal(_val);
    this._propsSignals["notifications"].value = _val;
  }
  get user() {
    const _sig = this._propsSignals["user"];
    return _sig ? _sig.value : undefined;
  }
  get notifications() {
    const _sig = this._propsSignals["notifications"];
    return _sig ? _sig.value : undefined;
  }
  constructor() {
    super();
    _initInternalState(this, {
      user: _signal(null),
      notifications: _signal(null)
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
      const Tag = props.isHeader.value ? 'h1' : 'h2';
      const items = ['A', 'B'];
      const el0 = _element("div");
      _setProperty(el0, "className", "container", false);
      el0.setAttribute("data-testid", "main-div");
      const el1 = _element("input");
      _setProperty(el1, "disabled", true, false);
      _hookEffect(() => el1.setAttribute("tab-index", -1));
      _hookEffect(() => el1.setAttribute("max-length", 5));
      el0.appendChild(el1);
      const el2 = _element(Tag);
      const text3 = _text("Dynamic Heading");
      el2.appendChild(text3);
      el0.appendChild(el2);
      const el4 = _element("web-ui-button");
      _setProperty(el4, "variant", "primary", true);
      const text5 = _text("Click Me");
      el4.appendChild(text5);
      el0.appendChild(el4);
      const el6 = _element("p");
      const text7 = _text(" Welcome, ");
      el6.appendChild(text7);
      const el8 = _element("strong");
      _renderDynamic(el8, () => props.user.value.name);
      el6.appendChild(el8);
      const text9 = _text("!  You have ");
      el6.appendChild(text9);
      _renderDynamic(el6, () => props.notifications.value.length);
      const text10 = _text(" new messages. ");
      el6.appendChild(text10);
      el0.appendChild(el6);
      const el11 = _element("div");
      _hookEffect(() => _applySpread(el11, props.extra.value, false));
      _setProperty(el11, "className", "override", false);
      _setProperty(el11, "id", "constant", false);
      const text12 = _text(" Spread Test ");
      el11.appendChild(text12);
      el0.appendChild(el11);
      const el13 = _element("ul");
      _renderDynamic(el13, () => [() => {
        const el0 = _element("li");
        _setProperty(el0, "_key", "1", false);
        const text1 = _text("One");
        el0.appendChild(text1);
        return el0;
      }, () => {
        const el0 = _element("li");
        _setProperty(el0, "_key", "2", false);
        const text1 = _text("Two");
        el0.appendChild(text1);
        return el0;
      }]);
      el0.appendChild(el13);
      const el14 = _element("web-dataprovider");
      _renderDynamic(el14, data => (() => {
        const el0 = _element("div");
        const text1 = _text("Data: ");
        el0.appendChild(text1);
        _renderDynamic(el0, () => data.value);
        return el0;
      })());
      el0.appendChild(el14);
      const el15 = _svg("svg");
      el15.setAttribute("viewBox", "0 0 100 100");
      el15.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      const el16 = _svg("circle");
      el16.setAttribute("cx", "50");
      el16.setAttribute("cy", "50");
      el16.setAttribute("r", "40");
      el16.setAttribute("strokeWidth", "2");
      el16.setAttribute("fill", "red");
      el15.appendChild(el16);
      el0.appendChild(el15);
      const el17 = _element("web-customcomponent");
      el0.appendChild(el17);
      const el18 = _element("br");
      el0.appendChild(el18);
      const el19 = _element("hr");
      el0.appendChild(el19);
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
customElements.define("web-reactpatterns", ReactPatternsElement);
export default ReactPatternsElement;
function DataProvider({
  children
}) {
  const data = {
    value: 'Secret'
  };
  return typeof children === 'function' ? children(data) : children;
}
class CustomComponentElement extends HTMLElement {
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
      const el0 = _element("div");
      const text1 = _text("Custom");
      el0.appendChild(text1);
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
customElements.define("web-customcomponent", CustomComponentElement);