import { signal as _signal, _element, _text, _svg, _fragment, setProperty as _setProperty, _mapped, hookEffect as _hookEffect, renderDynamic as _renderDynamic, createPropsProxy as _createPropsProxy } from "@opentf/web";
export function render(root, _props) {
  const _holder = {
    _children: _props.children || []
  };
  const _waf_props = _createPropsProxy(_holder);
  Object.assign(_waf_props, _props);
  let products = _signal(Array.from({
    length: 1000
  }, (_, i) => ({
    id: i,
    name: `Product ${i}`,
    price: Math.floor(Math.random() * 1000)
  })));
  const shuffle = () => {
    const arr = [...products.value];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    products.value = arr;
  };
  const reverse = () => {
    products.value = [...products.value].reverse();
  };
  const el0 = _element("div");
  const el1 = _element("div");
  _setProperty(el1, "className", "flex justify-between items-center mb-6", false);
  const el2 = _element("h1");
  _setProperty(el2, "className", "text-2xl font-bold text-white", false);
  const text3 = _text("Products (1000 items)");
  el2.appendChild(text3);
  el1.appendChild(el2);
  const el4 = _element("div");
  _setProperty(el4, "className", "space-x-4", false);
  const el5 = _element("button");
  el5.onclick = shuffle;
  _setProperty(el5, "className", "bg-indigo-600 px-4 py-2 rounded text-white hover:bg-indigo-500 transition-colors", false);
  const text6 = _text(" Shuffle List ");
  el5.appendChild(text6);
  el4.appendChild(el5);
  const el7 = _element("button");
  el7.onclick = reverse;
  _setProperty(el7, "className", "bg-slate-700 px-4 py-2 rounded text-white hover:bg-slate-600 transition-colors", false);
  const text8 = _text(" Reverse List ");
  el7.appendChild(text8);
  el4.appendChild(el7);
  el1.appendChild(el4);
  el0.appendChild(el1);
  const el9 = _element("div");
  _setProperty(el9, "className", "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4", false);
  const mapped10 = _mapped(() => products.value, p => (() => {
    const el0 = _element("div");
    el0._key = p.value.id;
    _setProperty(el0, "className", "p-4 bg-slate-800 rounded border border-slate-700 hover:border-indigo-500 transition-all", false);
    const el1 = _element("div");
    _setProperty(el1, "className", "font-bold text-white", false);
    _renderDynamic(el1, () => p.value.name);
    el0.appendChild(el1);
    const el2 = _element("div");
    _setProperty(el2, "className", "text-slate-400 mt-1", false);
    const text3 = _text("$");
    el2.appendChild(text3);
    _renderDynamic(el2, () => p.value.price);
    el0.appendChild(el2);
    const el4 = _element("input");
    el4.setAttribute("placeholder", "Add note...");
    _setProperty(el4, "className", "mt-2 w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-slate-300 focus:outline-none focus:border-indigo-500", false);
    el0.appendChild(el4);
    return el0;
  })());
  _renderDynamic(el9, () => mapped10());
  el0.appendChild(el9);
  const rootElement = el0;
  root.appendChild(rootElement);
}