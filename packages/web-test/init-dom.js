import { GlobalWindow } from "happy-dom";

// Initialize happy-dom explicitly
const win = new GlobalWindow();
globalThis.window = win;
globalThis.document = win.document;
globalThis.HTMLElement = win.HTMLElement;
globalThis.customElements = win.customElements;
globalThis.Node = win.Node;
globalThis.navigator = win.navigator;
globalThis.Event = win.Event;
globalThis.CustomEvent = win.CustomEvent;
