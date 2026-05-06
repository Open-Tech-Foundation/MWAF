import { setProperty as _setProperty, _mapped, renderDynamic as _renderDynamic, createPropsProxy as _createPropsProxy } from "@opentf/web";
export function render(root, _props) {
  const _holder = {
    _children: _props.children || []
  };
  const _waf_props = _createPropsProxy(_holder);
  Object.assign(_waf_props, _props);
  const props = _waf_props;
  const el0 = document.createElement("div");
  const el1 = document.createElement("h1");
  _setProperty(el1, "className", "text-2xl font-bold", false);
  const text2 = document.createTextNode("Shop");
  el1.appendChild(text2);
  el0.appendChild(el1);
  const el3 = document.createElement("p");
  _setProperty(el3, "className", "mt-4", false);
  const text4 = document.createTextNode("Slug segments: ");
  el3.appendChild(text4);
  el0.appendChild(el3);
  const el5 = document.createElement("ul");
  _setProperty(el5, "className", "list-disc ml-6 mt-2", false);
  const mapped6 = _mapped(() => props.params.value.slug, segment => (() => {
    const el0 = document.createElement("li");
    _renderDynamic(el0, () => segment.value);
    return el0;
  })());
  _renderDynamic(el5, () => mapped6());
  el0.appendChild(el5);
  const el7 = document.createElement("div");
  _setProperty(el7, "className", "mt-4 p-4 bg-slate-800 rounded", false);
  const text8 = document.createTextNode(" Full path: ");
  el7.appendChild(text8);
  const el9 = document.createElement("span");
  _setProperty(el9, "className", "text-indigo-400 font-mono", false);
  const text10 = document.createTextNode("/shop/");
  el9.appendChild(text10);
  _renderDynamic(el9, () => props.params.value.slug.join('/'));
  el7.appendChild(el9);
  el0.appendChild(el7);
  const rootElement = el0;
  root.appendChild(rootElement);
}