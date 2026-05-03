import { setProperty as _setProperty, renderDynamic as _renderDynamic } from "@opentf/web";
export function render(root, props) {
  const rootElement = (() => {
    const el0 = document.createElement("div");
    _setProperty(el0, "className", "root-layout");
    const el1 = document.createElement("nav");
    const el2 = document.createElement("a");
    _setProperty(el2, "href", "/");
    const text3 = document.createTextNode("Home");
    el2.appendChild(text3);
    el1.appendChild(el2);
    el0.appendChild(el1);
    const el4 = document.createElement("main");
    _renderDynamic(el4, () => props.children);
    el0.appendChild(el4);
    return el0;
  })();
  root.appendChild(rootElement);
}