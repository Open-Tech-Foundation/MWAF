import { signal as _signal, _element, _text, _svg, _fragment, renderDynamic as _renderDynamic, createPropsProxy as _createPropsProxy, _initInternalState, _reconnectWafComponent, _clearChildren, withInstance as _withInstance, _disconnectWafComponent } from "@opentf/web";
class StateEdgeCasesElement extends HTMLElement {
  static observedAttributes = [];
  constructor() {
    super();
    _initInternalState(this, {});
  }
  attributeChangedCallback(name, _, value) {
    if (this._propsSignals[name]) this._propsSignals[name].value = value;
  }
  connectedCallback() {
    if (this._mounted) {
      _reconnectWafComponent(this);
      return;
    }
    this._mounted = true;
    const _waf_props = _createPropsProxy(this);
    const _isHydrating = this.hasAttribute("data-ssg");
    if (!_isHydrating) {
      this._children = Array.from(this.childNodes);
      _clearChildren(this);
    }
    _withInstance(this, () => {
      let count = _signal(0);
      let user = _signal({
        name: "Alice",
        age: 30
      });
      let todos = _signal([]);

      // 1. Basic reassignment
      count.value = 10;

      // 2. Update expressions
      count.value++;
      --count.value;

      // 3. Member expressions
      user.value.name = "Bob";
      const age = user.value.age;
      todos.value.push("learn waf");

      // 4. Object property shorthand
      const data = {
        count: count.value,
        user: user.value
      };

      // 5. Destructuring
      const {
        name
      } = user.value;
      const [first] = todos.value;

      // 6. Computed property access
      const prop = "age";
      console.log(user.value[prop]);

      // 7. Passing as argument
      console.log(count.value, user.value);
      const el0 = _element("div");
      const el1 = _element("span");
      _renderDynamic(el1, () => count.value);
      el0.appendChild(el1);
      const el2 = _element("span");
      _renderDynamic(el2, () => user.value.name);
      el0.appendChild(el2);
      const el3 = _element("button");
      el3.onclick = () => {
        count.value++;
        user.value.age++;
      };
      const text4 = _text("Increment");
      el3.appendChild(text4);
      el0.appendChild(el3);
      const rootElement = el0;
      if (!_isHydrating) this.appendChild(rootElement);
    });
    _withInstance(this, () => {
      this._onMounts.forEach(fn => fn());
    });
  }
  disconnectedCallback() {
    _disconnectWafComponent(this);
  }
}
customElements.define("web-stateedgecases", StateEdgeCasesElement);
export default StateEdgeCasesElement;