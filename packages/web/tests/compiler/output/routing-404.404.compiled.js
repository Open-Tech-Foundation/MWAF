import { createPropsProxy as _createPropsProxy } from "@opentf/web";
export function render(root, _props) {
  const _holder = {
    _children: _props.children || []
  };
  const _waf_props = _createPropsProxy(_holder);
  Object.assign(_waf_props, _props);
  const el0 = document.createElement("div");
  const el1 = document.createElement("h1");
  const text2 = document.createTextNode("404 - Not Found");
  el1.appendChild(text2);
  el0.appendChild(el1);
  const el3 = document.createElement("p");
  const text4 = document.createTextNode("The page you are looking for does not exist.");
  el3.appendChild(text4);
  el0.appendChild(el3);
  const rootElement = el0;
  root.appendChild(rootElement);
}