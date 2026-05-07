import { _element, _text, _svg, _fragment, renderDynamic as _renderDynamic, createPropsProxy as _createPropsProxy } from "@opentf/web";
export function render(root, _props) {
  const _holder = {
    _children: _props.children || []
  };
  const _waf_props = _createPropsProxy(_holder);
  Object.assign(_waf_props, _props);
  const name = "Web App Framework";
  const el0 = _element("div");
  const el1 = _element("span");
  const text2 = _text("Hello ");
  el1.appendChild(text2);
  _renderDynamic(el1, () => name);
  const text3 = _text("!");
  el1.appendChild(text3);
  el0.appendChild(el1);
  const el4 = _element("p");
  const text5 = _text(" Line 1 Line 2 ");
  el4.appendChild(text5);
  el0.appendChild(el4);
  const el6 = _element("div");
  const text7 = _text("Spaces should be preserved here -> ");
  el6.appendChild(text7);
  el0.appendChild(el6);
  const rootElement = el0;
  root.appendChild(rootElement);
}