import { computed as _computed, signal as _signal, setProperty as _setProperty, renderDynamic as _renderDynamic, effect as _effect, applySpread as _applySpread, createPropsProxy as _createPropsProxy, _clearChildren, withInstance as _withInstance, _mapped } from "@opentf/web";
import { z } from "zod";
import { createForm } from "@opentf/web-form";
import { zodResolver } from "./zodResolver.js";

/**
 * A custom form field component that works with 'register' props.
 */
export class FormField extends HTMLElement {
  static observedAttributes = ["label", "error", "isTouched", "value"];
  set label(_val) {
    if (!this._propsSignals["label"]) this._propsSignals["label"] = _signal(_val);
    this._propsSignals["label"].value = _val;
  }
  set error(_val) {
    if (!this._propsSignals["error"]) this._propsSignals["error"] = _signal(_val);
    this._propsSignals["error"].value = _val;
  }
  set isTouched(_val) {
    if (!this._propsSignals["isTouched"]) this._propsSignals["isTouched"] = _signal(_val);
    this._propsSignals["isTouched"].value = _val;
  }
  set value(_val) {
    if (!this._propsSignals["value"]) this._propsSignals["value"] = _signal(_val);
    this._propsSignals["value"].value = _val;
  }
  get label() {
    const _sig = this._propsSignals["label"];
    return _sig ? _sig.value : undefined;
  }
  get error() {
    const _sig = this._propsSignals["error"];
    return _sig ? _sig.value : undefined;
  }
  get isTouched() {
    const _sig = this._propsSignals["isTouched"];
    return _sig ? _sig.value : undefined;
  }
  get value() {
    const _sig = this._propsSignals["value"];
    return _sig ? _sig.value : undefined;
  }
  constructor() {
    super();
    Object.defineProperty(this, "_propsSignals", {
      value: {
        label: _signal(null),
        error: _signal(null),
        isTouched: _signal(null),
        value: _signal(null)
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
      const {
        label,
        error,
        isTouched,
        value
      } = props;
      const fieldError = _computed(() => _waf_props.error.value && _waf_props.isTouched.value ? _waf_props.error.value : null);
      const el0 = document.createElement("div");
      _setProperty(el0, "className", "flex flex-col gap-1.5 mb-5 group");
      const el1 = document.createElement("label");
      _setProperty(el1, "className", "text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 group-focus-within:text-blue-400 transition-colors");
      _renderDynamic(el1, () => _waf_props.label.value);
      el0.appendChild(el1);
      const el2 = document.createElement("input");
      _effect(() => _applySpread(el2, props));
      _effect(() => _setProperty(el2, "value", _waf_props.value.value));
      _effect(() => _setProperty(el2, "checked", _waf_props.value.value));
      _effect(() => _setProperty(el2, "className", fieldError.value ? 'px-4 py-3 rounded-xl border transition-all duration-300 outline-none bg-red-500/5 border-red-500/50 text-white placeholder-slate-500 backdrop-blur-sm shadow-[0_0_15px_-3px_rgba(239,68,68,0.2)]' : 'px-4 py-3 rounded-xl border transition-all duration-300 outline-none bg-slate-900/50 border-slate-700/50 text-white placeholder-slate-500 backdrop-blur-sm focus:border-blue-500/50 focus:bg-slate-900/80 focus:shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)]'));
      el0.appendChild(el2);
      const el3 = document.createElement("div");
      _setProperty(el3, "className", "h-4 ml-1");
      _renderDynamic(el3, () => fieldError.value && (() => {
        const el0 = document.createElement("span");
        _setProperty(el0, "className", "text-[10px] text-red-400 font-bold flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200");
        const el1 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        el1.setAttribute("class", "w-3 h-3");
        el1.setAttribute("fill", "currentColor");
        el1.setAttribute("viewBox", "0 0 20 20");
        const el2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        el2.setAttribute("fill-rule", "evenodd");
        el2.setAttribute("d", "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z");
        el2.setAttribute("clip-rule", "evenodd");
        el1.appendChild(el2);
        el0.appendChild(el1);
        _renderDynamic(el0, () => fieldError.value);
        return el0;
      })());
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
/**
 * A custom toggle/checkbox component.
 */
customElements.define("web-formfield", FormField);
export class CustomToggle extends HTMLElement {
  static observedAttributes = ["label", "value"];
  set label(_val) {
    if (!this._propsSignals["label"]) this._propsSignals["label"] = _signal(_val);
    this._propsSignals["label"].value = _val;
  }
  set value(_val) {
    if (!this._propsSignals["value"]) this._propsSignals["value"] = _signal(_val);
    this._propsSignals["value"].value = _val;
  }
  get label() {
    const _sig = this._propsSignals["label"];
    return _sig ? _sig.value : undefined;
  }
  get value() {
    const _sig = this._propsSignals["value"];
    return _sig ? _sig.value : undefined;
  }
  constructor() {
    super();
    Object.defineProperty(this, "_propsSignals", {
      value: {
        label: _signal(null),
        value: _signal(null)
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
      const {
        label,
        value,
        oninput
      } = props;
      const toggle = () => _waf_props.oninput({
        target: {
          checked: !_waf_props.value.value,
          type: 'checkbox'
        }
      });
      const el0 = document.createElement("div");
      _setProperty(el0, "className", "flex items-center justify-between p-4 rounded-xl border border-slate-700/30 bg-slate-900/20 mb-6 cursor-pointer hover:bg-slate-900/40 transition-all group");
      el0.onclick = toggle;
      const el1 = document.createElement("span");
      _setProperty(el1, "className", "text-sm font-medium text-slate-300 group-hover:text-white transition-colors");
      _renderDynamic(el1, () => _waf_props.label.value);
      el0.appendChild(el1);
      const el2 = document.createElement("div");
      _effect(() => _setProperty(el2, "className", _waf_props.value.value ? 'w-12 h-6 rounded-full transition-all duration-500 relative p-1 bg-emerald-500 shadow-[0_0_15px_-3px_rgba(16,185,129,0.5)]' : 'w-12 h-6 rounded-full transition-all duration-500 relative p-1 bg-slate-700'));
      const el3 = document.createElement("div");
      _effect(() => _setProperty(el3, "className", _waf_props.value.value ? 'w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-lg transform translate-x-6' : 'w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-lg transform translate-x-0'));
      el2.appendChild(el3);
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
customElements.define("web-customtoggle", CustomToggle);
export class FormStatus extends HTMLElement {
  static observedAttributes = ["form"];
  set form(_val) {
    if (!this._propsSignals["form"]) this._propsSignals["form"] = _signal(_val);
    this._propsSignals["form"].value = _val;
  }
  get form() {
    const _sig = this._propsSignals["form"];
    return _sig ? _sig.value : undefined;
  }
  constructor() {
    super();
    Object.defineProperty(this, "_propsSignals", {
      value: {
        form: _signal(null)
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
      const {
        form
      } = _waf_props;
      const isValid = _computed(() => _waf_props.form.value.isValid);
      const isChanged = _computed(() => _waf_props.form.value.isChanged);
      const isTouched = _computed(() => _waf_props.form.value.isTouched);
      const isSubmitting = _computed(() => _waf_props.form.value.isSubmitting);
      const el0 = document.createElement("div");
      _setProperty(el0, "className", "grid grid-cols-2 md:grid-cols-4 gap-3 mb-8");
      const el1 = document.createElement("div");
      _effect(() => _setProperty(el1, "className", isValid.value ? 'flex items-center justify-center gap-2 p-2.5 rounded-xl border transition-all duration-500 bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_-5px_rgba(16,185,129,0.3)]' : 'flex items-center justify-center gap-2 p-2.5 rounded-xl border transition-all duration-500 bg-slate-800/20 border-slate-700/30 text-slate-500'));
      const el2 = document.createElement("span");
      _setProperty(el2, "className", "text-[10px] font-black uppercase tracking-widest");
      _renderDynamic(el2, () => isValid.value ? "Valid" : "Invalid");
      el1.appendChild(el2);
      el0.appendChild(el1);
      const el3 = document.createElement("div");
      _effect(() => _setProperty(el3, "className", isChanged.value ? 'flex items-center justify-center gap-2 p-2.5 rounded-xl border transition-all duration-500 bg-blue-500/10 border-blue-500/30 text-blue-400 shadow-[0_0_15px_-5px_rgba(59,130,246,0.3)]' : 'flex items-center justify-center gap-2 p-2.5 rounded-xl border transition-all duration-500 bg-slate-800/20 border-slate-700/30 text-slate-500'));
      const el4 = document.createElement("span");
      _setProperty(el4, "className", "text-[10px] font-black uppercase tracking-widest");
      _renderDynamic(el4, () => isChanged.value ? "Changed" : "Clean");
      el3.appendChild(el4);
      el0.appendChild(el3);
      const el5 = document.createElement("div");
      _effect(() => _setProperty(el5, "className", isTouched.value ? 'flex items-center justify-center gap-2 p-2.5 rounded-xl border transition-all duration-500 bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-[0_0_15px_-5px_rgba(245,158,11,0.3)]' : 'flex items-center justify-center gap-2 p-2.5 rounded-xl border transition-all duration-500 bg-slate-800/20 border-slate-700/30 text-slate-500'));
      const el6 = document.createElement("span");
      _setProperty(el6, "className", "text-[10px] font-black uppercase tracking-widest");
      _renderDynamic(el6, () => isTouched.value ? "Touched" : "Untouched");
      el5.appendChild(el6);
      el0.appendChild(el5);
      const el7 = document.createElement("div");
      _effect(() => _setProperty(el7, "className", isSubmitting.value ? 'flex items-center justify-center gap-2 p-2.5 rounded-xl border transition-all duration-500 bg-purple-500/10 border-purple-500/30 text-purple-400 shadow-[0_0_15px_-5px_rgba(168,85,247,0.3)]' : 'flex items-center justify-center gap-2 p-2.5 rounded-xl border transition-all duration-500 bg-slate-800/20 border-slate-700/30 text-slate-500'));
      const el8 = document.createElement("span");
      _setProperty(el8, "className", "text-[10px] font-black uppercase tracking-widest");
      _renderDynamic(el8, () => isSubmitting.value ? "Saving" : "Idle");
      el7.appendChild(el8);
      el0.appendChild(el7);
      const rootElement = el0;
      this.appendChild(rootElement);
    });
    this._onMounts.forEach(fn => fn());
  }
  disconnectedCallback() {
    this._onCleanups.forEach(fn => fn());
  }
}
customElements.define("web-formstatus", FormStatus);
export class ModeSelector extends HTMLElement {
  static observedAttributes = ["label", "value", "options"];
  set label(_val) {
    if (!this._propsSignals["label"]) this._propsSignals["label"] = _signal(_val);
    this._propsSignals["label"].value = _val;
  }
  set value(_val) {
    if (!this._propsSignals["value"]) this._propsSignals["value"] = _signal(_val);
    this._propsSignals["value"].value = _val;
  }
  set options(_val) {
    if (!this._propsSignals["options"]) this._propsSignals["options"] = _signal(_val);
    this._propsSignals["options"].value = _val;
  }
  get label() {
    const _sig = this._propsSignals["label"];
    return _sig ? _sig.value : undefined;
  }
  get value() {
    const _sig = this._propsSignals["value"];
    return _sig ? _sig.value : undefined;
  }
  get options() {
    const _sig = this._propsSignals["options"];
    return _sig ? _sig.value : undefined;
  }
  constructor() {
    super();
    Object.defineProperty(this, "_propsSignals", {
      value: {
        label: _signal(null),
        value: _signal(null),
        options: _signal(null)
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
      const {
        label,
        value,
        options,
        onchange
      } = _waf_props;
      const el0 = document.createElement("div");
      _setProperty(el0, "className", "flex flex-col gap-1.5 min-w-[100px]");
      const el1 = document.createElement("label");
      _setProperty(el1, "className", "text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1");
      _renderDynamic(el1, () => _waf_props.label.value);
      el0.appendChild(el1);
      const el2 = document.createElement("div");
      _setProperty(el2, "className", "relative group");
      const el3 = document.createElement("select");
      _effect(() => _setProperty(el3, "value", _waf_props.value.value));
      el3.onchange = e => _waf_props.onchange(e.target.value);
      _setProperty(el3, "className", "appearance-none w-full bg-slate-900/80 border border-slate-700/50 text-slate-200 text-[11px] font-bold rounded-lg px-3 py-1.5 outline-none focus:border-blue-500/50 transition-all cursor-pointer pr-8");
      const mapped4 = _mapped(() => _waf_props.options.value, opt => (() => {
        const el0 = document.createElement("option");
        _effect(() => _setProperty(el0, "value", opt.value));
        _effect(() => el0.setAttribute("selected", _waf_props.value.value === opt.value));
        _renderDynamic(el0, () => opt.value);
        return el0;
      })());
      _renderDynamic(el3, () => mapped4());
      el2.appendChild(el3);
      const el5 = document.createElement("div");
      _setProperty(el5, "className", "absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-500 group-hover:text-blue-400 transition-colors");
      const el6 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      el6.setAttribute("class", "w-4 h-4");
      el6.setAttribute("fill", "currentColor");
      el6.setAttribute("viewBox", "0 0 20 20");
      const el7 = document.createElementNS("http://www.w3.org/2000/svg", "path");
      el7.setAttribute("fill-rule", "evenodd");
      el7.setAttribute("d", "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z");
      el7.setAttribute("clip-rule", "evenodd");
      el6.appendChild(el7);
      el5.appendChild(el6);
      el2.appendChild(el5);
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
customElements.define("web-modeselector", ModeSelector);
export class StatePreview extends HTMLElement {
  static observedAttributes = ["form"];
  set form(_val) {
    if (!this._propsSignals["form"]) this._propsSignals["form"] = _signal(_val);
    this._propsSignals["form"].value = _val;
  }
  get form() {
    const _sig = this._propsSignals["form"];
    return _sig ? _sig.value : undefined;
  }
  constructor() {
    super();
    Object.defineProperty(this, "_propsSignals", {
      value: {
        form: _signal(null)
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
      const {
        form
      } = _waf_props;
      const el0 = document.createElement("div");
      _setProperty(el0, "className", "flex flex-col gap-6 sticky top-8");
      const el1 = document.createElement("div");
      const el2 = document.createElement("div");
      _setProperty(el2, "className", "flex items-center gap-2 mb-3 ml-1");
      const el3 = document.createElement("div");
      _setProperty(el3, "className", "w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]");
      el2.appendChild(el3);
      const el4 = document.createElement("p");
      _setProperty(el4, "className", "text-[10px] font-black uppercase tracking-widest text-slate-500");
      const text5 = document.createTextNode("Live Values");
      el4.appendChild(text5);
      el2.appendChild(el4);
      el1.appendChild(el2);
      const el6 = document.createElement("pre");
      _setProperty(el6, "className", "text-[11px] font-mono bg-slate-950/80 p-5 rounded-2xl border border-slate-800/50 text-blue-300/80 overflow-auto max-h-[300px] leading-relaxed shadow-inner backdrop-blur-md");
      _renderDynamic(el6, () => JSON.stringify(_waf_props.form.value.values, null, 2));
      el1.appendChild(el6);
      el0.appendChild(el1);
      const el7 = document.createElement("div");
      const el8 = document.createElement("div");
      _setProperty(el8, "className", "flex items-center gap-2 mb-3 ml-1");
      const el9 = document.createElement("div");
      _setProperty(el9, "className", "w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]");
      el8.appendChild(el9);
      const el10 = document.createElement("p");
      _setProperty(el10, "className", "text-[10px] font-black uppercase tracking-widest text-slate-500");
      const text11 = document.createTextNode("Validation State");
      el10.appendChild(text11);
      el8.appendChild(el10);
      el7.appendChild(el8);
      const el12 = document.createElement("pre");
      _setProperty(el12, "className", "text-[11px] font-mono bg-slate-950/80 p-5 rounded-2xl border border-slate-800/50 text-amber-300/80 overflow-auto max-h-[300px] leading-relaxed shadow-inner backdrop-blur-md");
      _renderDynamic(el12, () => JSON.stringify({
        errors: _waf_props.form.value.errors,
        touched: _waf_props.form.value.touched
      }, null, 2));
      el7.appendChild(el12);
      el0.appendChild(el7);
      const el13 = document.createElement("div");
      _setProperty(el13, "className", "p-4 rounded-2xl bg-slate-900/40 border border-slate-800/50");
      const el14 = document.createElement("p");
      _setProperty(el14, "className", "text-[10px] font-medium text-slate-500 leading-tight");
      const text15 = document.createTextNode(" Identity Check: ");
      el14.appendChild(text15);
      const el16 = document.createElement("code");
      _setProperty(el16, "className", "text-emerald-400");
      _renderDynamic(el16, () => _waf_props.form.value.values === _waf_props.form.value.values ? '✓ Stable' : '✗ Unstable');
      el14.appendChild(el16);
      el13.appendChild(el14);
      el0.appendChild(el13);
      const rootElement = el0;
      this.appendChild(rootElement);
    });
    this._onMounts.forEach(fn => fn());
  }
  disconnectedCallback() {
    this._onCleanups.forEach(fn => fn());
  }
}
customElements.define("web-statepreview", StatePreview);
export class BasicForm extends HTMLElement {
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
      let mode = _signal("onBlur");
      let reValidateMode = _signal("onChange");
      const schema = z.object({
        username: z.string().min(3, "Username must be at least 3 chars"),
        email: z.string().email("Invalid email address")
      });
      const form = createForm({
        initialValues: {
          username: "",
          email: ""
        },
        validator: zodResolver(schema),
        mode: mode.value,
        reValidateMode: reValidateMode.value
      });
      const isValid = _computed(() => form.isValid);
      const isChanged = _computed(() => form.isChanged);
      const isSubmitting = _computed(() => form.isSubmitting);
      const isSubmitted = _computed(() => form.isSubmitted);
      const canSubmit = _computed(() => isValid.value && !isSubmitting.value);
      const el0 = document.createElement("div");
      _setProperty(el0, "className", "grid lg:grid-cols-[1fr_350px] gap-12 items-start");
      const el1 = document.createElement("section");
      _setProperty(el1, "className", "bg-slate-800/20 backdrop-blur-2xl p-8 rounded-3xl border border-slate-700/50 shadow-2xl");
      const el2 = document.createElement("div");
      _setProperty(el2, "className", "flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10");
      const el3 = document.createElement("div");
      _setProperty(el3, "className", "flex items-center gap-4");
      const el4 = document.createElement("div");
      _setProperty(el4, "className", "p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/10");
      const el5 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      el5.setAttribute("class", "w-7 h-7");
      el5.setAttribute("fill", "none");
      el5.setAttribute("stroke", "currentColor");
      el5.setAttribute("viewBox", "0 0 24 24");
      const el6 = document.createElementNS("http://www.w3.org/2000/svg", "path");
      el6.setAttribute("stroke-linecap", "round");
      el6.setAttribute("stroke-linejoin", "round");
      el6.setAttribute("stroke-width", "2");
      el6.setAttribute("d", "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z");
      el5.appendChild(el6);
      el4.appendChild(el5);
      el3.appendChild(el4);
      const el7 = document.createElement("div");
      const el8 = document.createElement("h2");
      _setProperty(el8, "className", "text-2xl font-black text-white tracking-tight leading-tight");
      const text9 = document.createTextNode("Basic Account");
      el8.appendChild(text9);
      el7.appendChild(el8);
      const el10 = document.createElement("p");
      _setProperty(el10, "className", "text-slate-500 text-xs font-medium tracking-wide");
      const text11 = document.createTextNode("Enter your core credentials");
      el10.appendChild(text11);
      el7.appendChild(el10);
      el3.appendChild(el7);
      el2.appendChild(el3);
      const el12 = document.createElement("div");
      _setProperty(el12, "className", "flex gap-3 bg-slate-950/40 p-2 rounded-2xl border border-slate-800/50");
      const el13 = document.createElement("web-modeselector");
      _setProperty(el13, "label", "Mode");
      _effect(() => _setProperty(el13, "value", mode.value));
      _effect(() => _setProperty(el13, "options", ["onBlur", "onChange", "onTouched", "onSubmit"]));
      _effect(() => _setProperty(el13, "onchange", v => mode.value = v));
      el12.appendChild(el13);
      const el14 = document.createElement("web-modeselector");
      _setProperty(el14, "label", "Re-Validate");
      _effect(() => _setProperty(el14, "value", reValidateMode.value));
      _effect(() => _setProperty(el14, "options", ["onChange", "onBlur", "onSubmit"]));
      _effect(() => _setProperty(el14, "onchange", v => reValidateMode.value = v));
      el12.appendChild(el14);
      el2.appendChild(el12);
      el1.appendChild(el2);
      const el15 = document.createElement("web-formstatus");
      _effect(() => _setProperty(el15, "form", form));
      el1.appendChild(el15);
      const el16 = document.createElement("form");
      el16.onsubmit = form.handleSubmit(async v => {
        await new Promise(r => setTimeout(r, 1500));
        console.log('Submitted:', v);
      });
      const el17 = document.createElement("web-formfield");
      _setProperty(el17, "label", "Username");
      _effect(() => _applySpread(el17, form.register('username')));
      el16.appendChild(el17);
      const el18 = document.createElement("web-formfield");
      _setProperty(el18, "label", "Email");
      _effect(() => _applySpread(el18, form.register('email')));
      el16.appendChild(el18);
      const el19 = document.createElement("div");
      _setProperty(el19, "className", "flex gap-4 mt-8");
      const el20 = document.createElement("button");
      el20.setAttribute("type", "button");
      el20.onclick = () => form.reset();
      _setProperty(el20, "className", "flex-1 py-3.5 border border-slate-700 text-slate-400 rounded-xl hover:bg-slate-700/30 hover:text-white transition-all font-bold tracking-wide uppercase text-[11px]");
      const text21 = document.createTextNode("Reset");
      el20.appendChild(text21);
      el19.appendChild(el20);
      const el22 = document.createElement("button");
      el22.setAttribute("type", "submit");
      _effect(() => _setProperty(el22, "disabled", !canSubmit.value));
      _effect(() => _setProperty(el22, "className", canSubmit.value ? 'flex-[2] py-3.5 text-white rounded-xl transition-all duration-500 font-bold tracking-wide uppercase text-[11px] shadow-xl bg-blue-600 hover:bg-blue-500 shadow-blue-600/20 scale-100 hover:scale-[1.02] active:scale-[0.98]' : 'flex-[2] py-3.5 text-white rounded-xl transition-all duration-500 font-bold tracking-wide uppercase text-[11px] shadow-xl bg-slate-700 text-slate-500 opacity-50 cursor-not-allowed grayscale'));
      _renderDynamic(el22, () => isSubmitting.value ? "Processing..." : "Save Changes");
      el19.appendChild(el22);
      el16.appendChild(el19);
      _renderDynamic(el16, () => isSubmitted.value && (() => {
        const el0 = document.createElement("div");
        _setProperty(el0, "className", "mt-6 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center text-xs font-bold text-emerald-400 animate-in fade-in zoom-in duration-300");
        const text1 = document.createTextNode(" \u2728 Changes saved successfully! ");
        el0.appendChild(text1);
        return el0;
      })());
      el1.appendChild(el16);
      el0.appendChild(el1);
      const el23 = document.createElement("web-statepreview");
      _effect(() => _setProperty(el23, "form", form));
      el0.appendChild(el23);
      const rootElement = el0;
      this.appendChild(rootElement);
    });
    this._onMounts.forEach(fn => fn());
  }
  disconnectedCallback() {
    this._onCleanups.forEach(fn => fn());
  }
}
customElements.define("web-basicform", BasicForm);
export class ComplexForm extends HTMLElement {
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
      let mode = _signal("onBlur");
      let reValidateMode = _signal("onChange");
      const schema = z.object({
        profile: z.object({
          firstName: z.string().min(1, "First name is required"),
          lastName: z.string().min(1, "Last name is required")
        }),
        skills: z.array(z.string().min(1, "Skill name required")).min(1, "At least one skill required"),
        preferences: z.object({
          newsletter: z.boolean()
        })
      });
      const form = createForm({
        initialValues: {
          profile: {
            firstName: "",
            lastName: ""
          },
          skills: ["JavaScript"],
          preferences: {
            newsletter: true
          }
        },
        validator: zodResolver(schema),
        mode: mode.value,
        reValidateMode: reValidateMode.value
      });
      const isValid = _computed(() => form.isValid);
      const isChanged = _computed(() => form.isChanged);
      const isSubmitting = _computed(() => form.isSubmitting);
      const isSubmitted = _computed(() => form.isSubmitted);
      const canSubmit = _computed(() => isValid.value && !isSubmitting.value);
      const addSkill = () => form.values.skills.push("");
      const removeSkill = index => form.values.skills.splice(index, 1);
      const el0 = document.createElement("div");
      _setProperty(el0, "className", "grid lg:grid-cols-[1fr_350px] gap-12 items-start");
      const el1 = document.createElement("section");
      _setProperty(el1, "className", "bg-slate-800/20 backdrop-blur-2xl p-8 rounded-3xl border border-slate-700/50 shadow-2xl");
      const el2 = document.createElement("div");
      _setProperty(el2, "className", "flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10");
      const el3 = document.createElement("div");
      _setProperty(el3, "className", "flex items-center gap-4");
      const el4 = document.createElement("div");
      _setProperty(el4, "className", "p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/20 text-purple-400 shadow-lg shadow-purple-500/10");
      const el5 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      el5.setAttribute("class", "w-7 h-7");
      el5.setAttribute("fill", "none");
      el5.setAttribute("stroke", "currentColor");
      el5.setAttribute("viewBox", "0 0 24 24");
      const el6 = document.createElementNS("http://www.w3.org/2000/svg", "path");
      el6.setAttribute("stroke-linecap", "round");
      el6.setAttribute("stroke-linejoin", "round");
      el6.setAttribute("stroke-width", "2");
      el6.setAttribute("d", "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4");
      el5.appendChild(el6);
      el4.appendChild(el5);
      el3.appendChild(el4);
      const el7 = document.createElement("div");
      const el8 = document.createElement("h2");
      _setProperty(el8, "className", "text-2xl font-black text-white tracking-tight leading-tight");
      const text9 = document.createTextNode("Advanced Profile");
      el8.appendChild(text9);
      el7.appendChild(el8);
      const el10 = document.createElement("p");
      _setProperty(el10, "className", "text-slate-500 text-xs font-medium tracking-wide");
      const text11 = document.createTextNode("Nested data & preferences");
      el10.appendChild(text11);
      el7.appendChild(el10);
      el3.appendChild(el7);
      el2.appendChild(el3);
      const el12 = document.createElement("div");
      _setProperty(el12, "className", "flex gap-3 bg-slate-950/40 p-2 rounded-2xl border border-slate-800/50");
      const el13 = document.createElement("web-modeselector");
      _setProperty(el13, "label", "Mode");
      _effect(() => _setProperty(el13, "value", mode.value));
      _effect(() => _setProperty(el13, "options", ["onBlur", "onChange", "onTouched", "onSubmit"]));
      _effect(() => _setProperty(el13, "onchange", v => mode.value = v));
      el12.appendChild(el13);
      const el14 = document.createElement("web-modeselector");
      _setProperty(el14, "label", "Re-Validate");
      _effect(() => _setProperty(el14, "value", reValidateMode.value));
      _effect(() => _setProperty(el14, "options", ["onChange", "onBlur", "onSubmit"]));
      _effect(() => _setProperty(el14, "onchange", v => reValidateMode.value = v));
      el12.appendChild(el14);
      el2.appendChild(el12);
      el1.appendChild(el2);
      const el15 = document.createElement("web-formstatus");
      _effect(() => _setProperty(el15, "form", form));
      el1.appendChild(el15);
      const el16 = document.createElement("form");
      el16.onsubmit = form.handleSubmit(async v => {
        await new Promise(r => setTimeout(r, 1500));
        console.log('Submitted Profile:', v);
      });
      const el17 = document.createElement("div");
      _setProperty(el17, "className", "grid grid-cols-1 md:grid-cols-2 gap-4");
      const el18 = document.createElement("web-formfield");
      _setProperty(el18, "label", "First Name");
      _effect(() => _applySpread(el18, form.register('profile.firstName')));
      el17.appendChild(el18);
      const el19 = document.createElement("web-formfield");
      _setProperty(el19, "label", "Last Name");
      _effect(() => _applySpread(el19, form.register('profile.lastName')));
      el17.appendChild(el19);
      el16.appendChild(el17);
      const el20 = document.createElement("div");
      _setProperty(el20, "className", "mb-8");
      const el21 = document.createElement("div");
      _setProperty(el21, "className", "flex items-center justify-between mb-4");
      const el22 = document.createElement("label");
      _setProperty(el22, "className", "text-xs font-bold text-slate-400 uppercase tracking-wider ml-1");
      const text23 = document.createTextNode("Skills & Expertise");
      el22.appendChild(text23);
      el21.appendChild(el22);
      const el24 = document.createElement("button");
      el24.setAttribute("type", "button");
      el24.onclick = addSkill;
      _setProperty(el24, "className", "text-[10px] font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors");
      const el25 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      el25.setAttribute("class", "w-3.5 h-3.5");
      el25.setAttribute("fill", "none");
      el25.setAttribute("stroke", "currentColor");
      el25.setAttribute("viewBox", "0 0 24 24");
      const el26 = document.createElementNS("http://www.w3.org/2000/svg", "path");
      el26.setAttribute("stroke-linecap", "round");
      el26.setAttribute("stroke-linejoin", "round");
      el26.setAttribute("stroke-width", "2");
      el26.setAttribute("d", "M12 4v16m8-8H4");
      el25.appendChild(el26);
      el24.appendChild(el25);
      const text27 = document.createTextNode(" Add Skill ");
      el24.appendChild(text27);
      el21.appendChild(el24);
      el20.appendChild(el21);
      const el28 = document.createElement("div");
      _setProperty(el28, "className", "space-y-3");
      const mapped29 = _mapped(() => form.values.skills, (_, index) => (() => {
        const el0 = document.createElement("div");
        _setProperty(el0, "className", "flex gap-2 animate-in fade-in slide-in-from-left-2 duration-300");
        const el1 = document.createElement("div");
        _setProperty(el1, "className", "flex-1");
        const el2 = document.createElement("input");
        _effect(() => _applySpread(el2, form.register(`skills.${index}`)));
        el2.setAttribute("placeholder", "Skill name...");
        _effect(() => _setProperty(el2, "className", form.errors.skills?.[index.value] ? "w-full px-4 py-2.5 rounded-xl border bg-red-500/5 border-red-500/50 text-white text-sm outline-none" : "w-full px-4 py-2.5 rounded-xl border bg-slate-900/50 border-slate-700/50 text-white text-sm outline-none focus:border-purple-500/50 transition-all"));
        el1.appendChild(el2);
        el0.appendChild(el1);
        const el3 = document.createElement("button");
        el3.setAttribute("type", "button");
        el3.onclick = () => removeSkill(index);
        _setProperty(el3, "className", "p-2.5 rounded-xl border border-slate-700/50 text-slate-500 hover:text-red-400 hover:bg-red-400/5 transition-all");
        const el4 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        el4.setAttribute("class", "w-4 h-4");
        el4.setAttribute("fill", "none");
        el4.setAttribute("stroke", "currentColor");
        el4.setAttribute("viewBox", "0 0 24 24");
        const el5 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        el5.setAttribute("stroke-linecap", "round");
        el5.setAttribute("stroke-linejoin", "round");
        el5.setAttribute("stroke-width", "2");
        el5.setAttribute("d", "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16");
        el4.appendChild(el5);
        el3.appendChild(el4);
        el0.appendChild(el3);
        return el0;
      })());
      _renderDynamic(el28, () => mapped29());
      el20.appendChild(el28);
      _renderDynamic(el20, () => form.errors.skills && typeof form.errors.skills === 'string' && (() => {
        const el0 = document.createElement("p");
        _setProperty(el0, "className", "text-[10px] text-red-400 font-bold mt-2 ml-1");
        _renderDynamic(el0, () => form.errors.skills);
        return el0;
      })());
      el16.appendChild(el20);
      const el30 = document.createElement("web-customtoggle");
      _setProperty(el30, "label", "Subscribe to developer updates");
      _effect(() => _applySpread(el30, form.register("preferences.newsletter")));
      el16.appendChild(el30);
      const el31 = document.createElement("div");
      _setProperty(el31, "className", "flex gap-4 mt-8");
      const el32 = document.createElement("button");
      el32.setAttribute("type", "button");
      el32.onclick = () => form.reset();
      _setProperty(el32, "className", "flex-1 py-3.5 border border-slate-700 text-slate-400 rounded-xl hover:bg-slate-700/30 hover:text-white transition-all font-bold tracking-wide uppercase text-[11px]");
      const text33 = document.createTextNode("Reset");
      el32.appendChild(text33);
      el31.appendChild(el32);
      const el34 = document.createElement("button");
      el34.setAttribute("type", "submit");
      _effect(() => _setProperty(el34, "disabled", !canSubmit.value));
      _effect(() => _setProperty(el34, "className", canSubmit.value ? 'flex-[2] py-3.5 text-white rounded-xl transition-all duration-500 font-bold tracking-wide uppercase text-[11px] shadow-xl bg-purple-600 hover:bg-purple-700 shadow-purple-600/20 scale-100 hover:scale-[1.02] active:scale-[0.98]' : 'flex-[2] py-3.5 text-white rounded-xl transition-all duration-500 font-bold tracking-wide uppercase text-[11px] shadow-xl bg-slate-700 text-slate-500 opacity-50 cursor-not-allowed grayscale'));
      _renderDynamic(el34, () => isSubmitting.value ? "Processing..." : "Submit Profile");
      el31.appendChild(el34);
      el16.appendChild(el31);
      _renderDynamic(el16, () => isSubmitted.value && (() => {
        const el0 = document.createElement("div");
        _setProperty(el0, "className", "mt-6 p-3 rounded-xl bg-purple-500/10 border border-emerald-500/20 text-center text-xs font-bold text-purple-400 animate-in fade-in zoom-in duration-300");
        const text1 = document.createTextNode(" \u2728 Profile updated successfully! ");
        el0.appendChild(text1);
        return el0;
      })());
      el1.appendChild(el16);
      el0.appendChild(el1);
      const el35 = document.createElement("web-statepreview");
      _effect(() => _setProperty(el35, "form", form));
      el0.appendChild(el35);
      const rootElement = el0;
      this.appendChild(rootElement);
    });
    this._onMounts.forEach(fn => fn());
  }
  disconnectedCallback() {
    this._onCleanups.forEach(fn => fn());
  }
}
customElements.define("web-complexform", ComplexForm);