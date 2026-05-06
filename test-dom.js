import { renderDynamic } from "./packages/web/runtime/dom.js";
import { signal } from "./packages/web/core/signals.js";

const show = signal(true);
let creates = 0;

const parent = document.createElement("div");

renderDynamic(parent, () => {
  if (show.value) {
    creates++;
    return document.createElement("span");
  }
  return null;
});

console.log("creates after mount:", creates);
show.value = false;
console.log("creates after toggle off:", creates);
show.value = true;
console.log("creates after toggle on:", creates);
