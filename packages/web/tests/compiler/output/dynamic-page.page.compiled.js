import { onMount as _onMount, onCleanup as _onCleanup, renderDynamic as _renderDynamic } from "@opentf/web";
export function render(root, props) {
  _onMount(() => {
    console.log(`Post page mounted with ID: ${props.params.id}`);
  });
  _onCleanup(() => {
    console.log(`Post page cleaned up with ID: ${props.params.id}`);
  });
  const rootElement = (() => {
    const el0 = document.createElement("div");
    const el1 = document.createElement("h1");
    el1.className = "text-2xl font-bold";
    const text2 = document.createTextNode("Post ");
    el1.appendChild(text2);
    _renderDynamic(el1, () => props.params.id);
    el0.appendChild(el1);
    const el3 = document.createElement("p");
    el3.className = "mt-4";
    const text4 = document.createTextNode("This is a dynamic post page for ID: ");
    el3.appendChild(text4);
    const el5 = document.createElement("span");
    el5.className = "font-mono bg-gray-200 px-1";
    _renderDynamic(el5, () => props.params.id);
    el3.appendChild(el5);
    el0.appendChild(el3);
    return el0;
  })();
  root.appendChild(rootElement);
}