import { setProperty as _setProperty, effect as _effect, signal as _signal, createPropsProxy as _createPropsProxy, _initWafComponent, _clearChildren, withInstance as _withInstance, applySpread as _applySpread } from "@opentf/web";
class IconGalleryElement extends HTMLElement {
  static observedAttributes = [];
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
      const el0 = document.createElement("div");
      _setProperty(el0, "className", "flex gap-4", false);
      const el1 = document.createElement("web-cameraicon");
      _effect(() => _setProperty(el1, "size", 32, true));
      _setProperty(el1, "color", "red", true);
      el0.appendChild(el1);
      const el2 = document.createElement("web-usericon");
      _effect(() => _setProperty(el2, "size", 24, true));
      _setProperty(el2, "className", "text-blue-500", true);
      el0.appendChild(el2);
      const el3 = document.createElement("web-settingsicon");
      _effect(() => _setProperty(el3, "strokeWidth", 3, true));
      el0.appendChild(el3);
      const rootElement = el0;
      this.appendChild(rootElement);
    });
    this._onMounts.forEach(fn => fn());
  }
  disconnectedCallback() {
    this._onCleanups.forEach(fn => fn());
  }
}
customElements.define("web-icongallery", IconGalleryElement);
export default IconGalleryElement;
class CameraIconElement extends HTMLElement {
  static observedAttributes = ["size", "color"];
  set size(_val) {
    if (!this._propsSignals["size"]) this._propsSignals["size"] = _signal(_val);
    this._propsSignals["size"].value = _val;
  }
  set color(_val) {
    if (!this._propsSignals["color"]) this._propsSignals["color"] = _signal(_val);
    this._propsSignals["color"].value = _val;
  }
  get size() {
    const _sig = this._propsSignals["size"];
    return _sig ? _sig.value : undefined;
  }
  get color() {
    const _sig = this._propsSignals["color"];
    return _sig ? _sig.value : undefined;
  }
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
      const {
        size = 24,
        color = "currentColor",
        ...props
      } = _waf_props;
      const el0 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      el0.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      _effect(() => el0.setAttribute("width", _waf_props.size.value));
      _effect(() => el0.setAttribute("height", _waf_props.size.value));
      el0.setAttribute("viewBox", "0 0 24 24");
      el0.setAttribute("fill", "none");
      _effect(() => el0.setAttribute("stroke", _waf_props.color.value));
      el0.setAttribute("strokeWidth", "2");
      el0.setAttribute("strokeLinecap", "round");
      el0.setAttribute("strokeLinejoin", "round");
      _effect(() => _applySpread(el0, props, false));
      const el1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
      el1.setAttribute("d", "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z");
      el0.appendChild(el1);
      const el2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      el2.setAttribute("cx", "12");
      el2.setAttribute("cy", "13");
      el2.setAttribute("r", "4");
      el0.appendChild(el2);
      const rootElement = el0;
      this.appendChild(rootElement);
    });
    this._onMounts.forEach(fn => fn());
  }
  disconnectedCallback() {
    this._onCleanups.forEach(fn => fn());
  }
}
customElements.define("web-cameraicon", CameraIconElement);
class UserIconElement extends HTMLElement {
  static observedAttributes = ["size"];
  set size(_val) {
    if (!this._propsSignals["size"]) this._propsSignals["size"] = _signal(_val);
    this._propsSignals["size"].value = _val;
  }
  get size() {
    const _sig = this._propsSignals["size"];
    return _sig ? _sig.value : undefined;
  }
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
      const {
        size = 24,
        ...props
      } = _waf_props;
      const el0 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      el0.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      _effect(() => el0.setAttribute("width", _waf_props.size.value));
      _effect(() => el0.setAttribute("height", _waf_props.size.value));
      el0.setAttribute("viewBox", "0 0 24 24");
      el0.setAttribute("fill", "none");
      el0.setAttribute("stroke", "currentColor");
      el0.setAttribute("strokeWidth", "2");
      el0.setAttribute("strokeLinecap", "round");
      el0.setAttribute("strokeLinejoin", "round");
      _effect(() => _applySpread(el0, props, false));
      const el1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
      el1.setAttribute("d", "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2");
      el0.appendChild(el1);
      const el2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      el2.setAttribute("cx", "12");
      el2.setAttribute("cy", "7");
      el2.setAttribute("r", "4");
      el0.appendChild(el2);
      const rootElement = el0;
      this.appendChild(rootElement);
    });
    this._onMounts.forEach(fn => fn());
  }
  disconnectedCallback() {
    this._onCleanups.forEach(fn => fn());
  }
}
customElements.define("web-usericon", UserIconElement);
class SettingsIconElement extends HTMLElement {
  static observedAttributes = ["strokeWidth"];
  set strokeWidth(_val) {
    if (!this._propsSignals["strokeWidth"]) this._propsSignals["strokeWidth"] = _signal(_val);
    this._propsSignals["strokeWidth"].value = _val;
  }
  get strokeWidth() {
    const _sig = this._propsSignals["strokeWidth"];
    return _sig ? _sig.value : undefined;
  }
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
      const {
        strokeWidth = 2,
        ...props
      } = _waf_props;
      const el0 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      el0.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      el0.setAttribute("width", "24");
      el0.setAttribute("height", "24");
      el0.setAttribute("viewBox", "0 0 24 24");
      el0.setAttribute("fill", "none");
      el0.setAttribute("stroke", "currentColor");
      _effect(() => el0.setAttribute("strokeWidth", _waf_props.strokeWidth.value));
      el0.setAttribute("strokeLinecap", "round");
      el0.setAttribute("strokeLinejoin", "round");
      _effect(() => _applySpread(el0, props, false));
      const el1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      el1.setAttribute("cx", "12");
      el1.setAttribute("cy", "12");
      el1.setAttribute("r", "3");
      el0.appendChild(el1);
      const el2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
      el2.setAttribute("d", "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z");
      el0.appendChild(el2);
      const rootElement = el0;
      this.appendChild(rootElement);
    });
    this._onMounts.forEach(fn => fn());
  }
  disconnectedCallback() {
    this._onCleanups.forEach(fn => fn());
  }
}
customElements.define("web-settingsicon", SettingsIconElement);