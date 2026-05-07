import { _element, _text, _svg, _fragment, setProperty as _setProperty, renderDynamic as _renderDynamic, createPropsProxy as _createPropsProxy } from "@opentf/web";
export function render(root, _props) {
  const _holder = {
    _children: _props.children || []
  };
  const _waf_props = _createPropsProxy(_holder);
  Object.assign(_waf_props, _props);
  const props = _waf_props;
  const el0 = _element("div");
  _setProperty(el0, "className", "root-layout", false);
  const el1 = _element("nav");
  const el2 = _element("a");
  _setProperty(el2, "href", "/", false);
  const text3 = _text("Home");
  el2.appendChild(text3);
  el1.appendChild(el2);
  el0.appendChild(el1);
  const el4 = _element("main");
  _renderDynamic(el4, () => props.children);
  el0.appendChild(el4);
  const rootElement = el0;
  root.appendChild(rootElement);
}