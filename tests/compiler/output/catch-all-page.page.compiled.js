import { renderDynamic as _renderDynamic } from "/framework/runtime/dom.js";
export function render(root, props) {
  const rootElement = (() => {
    const el0 = document.createElement("div");
    const el1 = document.createElement("h1");
    el1.className = "text-2xl font-bold";
    const text2 = document.createTextNode("Shop");
    el1.appendChild(text2);
    el0.appendChild(el1);
    const el3 = document.createElement("p");
    el3.className = "mt-4";
    const text4 = document.createTextNode("Slug segments: ");
    el3.appendChild(text4);
    el0.appendChild(el3);
    const el5 = document.createElement("ul");
    el5.className = "list-disc ml-6 mt-2";
    _renderDynamic(el5, () => props.params.slug.map(segment => (() => {
      const el0 = document.createElement("li");
      _renderDynamic(el0, () => segment);
      return el0;
    })()));
    el0.appendChild(el5);
    const el6 = document.createElement("div");
    el6.className = "mt-4 p-4 bg-slate-800 rounded";
    const text7 = document.createTextNode("Full path: ");
    el6.appendChild(text7);
    const el8 = document.createElement("span");
    el8.className = "text-indigo-400 font-mono";
    const text9 = document.createTextNode("/shop/");
    el8.appendChild(text9);
    _renderDynamic(el8, () => props.params.slug.join('/'));
    el6.appendChild(el8);
    el0.appendChild(el6);
    return el0;
  })();
  root.appendChild(rootElement);
}