import { withInstance as _withInstance } from "/framework/runtime/lifecycle.js";
import { createPropsProxy as _createPropsProxy } from "/framework/runtime/props.js";
import { signal as _signal } from "@preact/signals";
import { renderDynamic as _renderDynamic } from "/framework/runtime/dom.js";
import { effect as _effect } from "@preact/signals";
import { navigate } from "./index";
class LinkElement extends HTMLElement {
  static observedAttributes = ["href", "className", "style", "children"];
  set href(val) {
    this._propsSignals["href"].value = val;
  }
  set className(val) {
    this._propsSignals["className"].value = val;
  }
  set style(val) {
    this._propsSignals["style"].value = val;
  }
  set children(val) {
    this._propsSignals["children"].value = val;
  }
  get href() {
    return this._propsSignals["href"].value;
  }
  get className() {
    return this._propsSignals["className"].value;
  }
  get style() {
    return this._propsSignals["style"].value;
  }
  get children() {
    return this._propsSignals["children"].value;
  }
  constructor() {
    super();
    this._propsSignals = {
      href: _signal(null),
      className: _signal(null),
      style: _signal(null),
      children: _signal(null)
    };
  }
  attributeChangedCallback(name, _, value) {
    this._propsSignals[name].value = value;
  }
  connectedCallback() {
    this._onMounts = [];
    this._onCleanups = [];
    const props = _createPropsProxy(this);
    _withInstance(this, () => {
      const rootElement = (() => {
        const el0 = document.createElement("a");
        _effect(() => el0.href = props.href);
        _effect(() => el0.className = props.className);
        _effect(() => Object.assign(el0.style, props.style));
        el0.onclick = e => {
          if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
          e.preventDefault();
          navigate(props.href);
        };
        _renderDynamic(el0, () => props.children);
        return el0;
      })();
      while (this.firstChild) rootElement.appendChild(this.firstChild);
      this.appendChild(rootElement);
    });
    this._onMounts.forEach(fn => fn());
  }
  disconnectedCallback() {
    this._onCleanups.forEach(fn => fn());
  }
}
customElements.define("waf-link", LinkElement);
export default LinkElement;