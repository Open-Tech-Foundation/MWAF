import { onMount as _onMount, onCleanup as _onCleanup, setProperty as _setProperty, renderDynamic as _renderDynamic, createPropsProxy as _createPropsProxy } from "@opentf/web";
export function render(root, _props) {
  const _holder = {
    _children: _props.children || []
  };
  const _waf_props = _createPropsProxy(_holder);
  Object.assign(_waf_props, _props);
  const props = _waf_props;
  _onMount(() => {
    console.log(`Post page mounted with ID: ${props.params.value.id}`);
  });
  _onCleanup(() => {
    console.log(`Post page cleaned up with ID: ${props.params.value.id}`);
  });
  const el0 = document.createElement("div");
  const el1 = document.createElement("h1");
  _setProperty(el1, "className", "text-2xl font-bold", false);
  const text2 = document.createTextNode("Post ");
  el1.appendChild(text2);
  _renderDynamic(el1, () => props.params.value.id);
  el0.appendChild(el1);
  const el3 = document.createElement("p");
  _setProperty(el3, "className", "mt-4", false);
  const text4 = document.createTextNode("This is a dynamic post page for ID: ");
  el3.appendChild(text4);
  const el5 = document.createElement("span");
  _setProperty(el5, "className", "font-mono bg-gray-200 px-1", false);
  _renderDynamic(el5, () => props.params.value.id);
  el3.appendChild(el5);
  el0.appendChild(el3);
  const rootElement = el0;
  root.appendChild(rootElement);
}