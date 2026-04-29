import { queries, getQueriesForElement } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

let mountedComponents = new Set();

/**
 * Renders a compiled Web App Framework component into a DOM container.
 * 
 * @param {Function|HTMLElement} Component - The compiled component function or class.
 * @param {Object} props - Properties to pass to the component.
 * @returns {Object} - Testing library queries bound to the container.
 */
export function render(Component, props = {}) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  
  let element;
  
  // If the Component is a function, it should return a DOM node (since our compiler generates direct DOM nodes)
  // Wait, the compiler returns a Web Component (HTMLElement) OR an instance of a function.
  // Actually, functional components are compiled to standard HTMLElements that extend HTMLElement.
  if (typeof Component === 'function' && Component.prototype instanceof HTMLElement) {
    // If it's a registered Web Component class
    const tagName = Component.prototype.tagName?.toLowerCase() || Component.name.toLowerCase();
    element = document.createElement(tagName);
    Object.assign(element, props);
    container.appendChild(element);
  } else if (typeof Component === 'function') {
    // If it's a functional component not converted to a class (though our compiler usually does)
    element = Component(props);
    if (element instanceof Node) {
      container.appendChild(element);
    }
  } else if (typeof Component === 'string') {
    // It's a tag name
    element = document.createElement(Component);
    Object.assign(element, props);
    container.appendChild(element);
  } else {
    throw new Error("Invalid component type passed to render()");
  }

  mountedComponents.add(container);

  return {
    container,
    unmount: () => {
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
      mountedComponents.delete(container);
    },
    ...getQueriesForElement(container, queries)
  };
}

export { userEvent };

/**
 * Cleans up all mounted components. Automatically called after each test if supported.
 */
export function cleanup() {
  mountedComponents.forEach(container => {
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });
  mountedComponents.clear();
}
