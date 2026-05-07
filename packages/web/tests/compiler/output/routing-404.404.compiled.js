import { _element, _text, _svg, _fragment, createPropsProxy as _createPropsProxy } from "@opentf/web";
export function render(root, _props) {
  const _holder = {
    _children: _props.children || []
  };
  const _waf_props = _createPropsProxy(_holder);
  Object.assign(_waf_props, _props);
  const el0 = _element("div");
  const el1 = _element("h1");
  const text2 = _text("404 - Not Found");
  el1.appendChild(text2);
  el0.appendChild(el1);
  const el3 = _element("p");
  const text4 = _text("The page you are looking for does not exist.");
  el3.appendChild(text4);
  el0.appendChild(el3);
  const rootElement = el0;
  root.appendChild(rootElement);
}