import { _element, _text, _svg, _fragment, setProperty as _setProperty, createPropsProxy as _createPropsProxy } from "@opentf/web";
export function render(root, _props) {
  const _holder = {
    _children: _props.children || []
  };
  const _waf_props = _createPropsProxy(_holder);
  Object.assign(_waf_props, _props);
  const el0 = _element("div");
  const el1 = _element("h1");
  const text2 = _text("Title");
  el1.appendChild(text2);
  el0.appendChild(el1);
  const el3 = _element("p");
  _setProperty(el3, "className", "foo", false);
  const text4 = _text(" Content ");
  el3.appendChild(text4);
  el0.appendChild(el3);
  const rootElement = el0;
  root.appendChild(rootElement);
}