export function render(root, props) {
  const rootElement = (() => {
    const el0 = document.createElement("div");
    const el1 = document.createElement("h1");
    const text2 = document.createTextNode("404 - Not Found");
    el1.appendChild(text2);
    el0.appendChild(el1);
    const el3 = document.createElement("p");
    const text4 = document.createTextNode("The page you are looking for does not exist.");
    el3.appendChild(text4);
    el0.appendChild(el3);
    return el0;
  })();
  root.appendChild(rootElement);
}