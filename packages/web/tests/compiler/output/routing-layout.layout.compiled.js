import { setProperty as _setProperty, renderDynamic as _renderDynamic, createPropsProxy as _createPropsProxy } from "@opentf/web";
export function render(root, _props) {
  const _holder = {
    _children: _props.children || []
  };
  const _waf_props = _createPropsProxy(_holder);
  Object.assign(_waf_props, _props);
  const props = _waf_props;
  const el0 = document.createElement("div");
  _setProperty(el0, "className", "root-layout", false);
  const el1 = document.createElement("nav");
  const el2 = document.createElement("a");
  _setProperty(el2, "href", "/", false);
  const text3 = document.createTextNode("Home");
  el2.appendChild(text3);
  el1.appendChild(el2);
  el0.appendChild(el1);
  const el4 = document.createElement("main");
  _renderDynamic(el4, () => props.children);
  el0.appendChild(el4);
  const rootElement = el0;
  root.appendChild(rootElement);
}