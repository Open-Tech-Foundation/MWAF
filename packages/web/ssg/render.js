import { parseHTML } from 'linkedom';
import { signal, _setSSG } from '../core/signals.js';
import { getWafProps, _initWafComponent } from '../runtime/index.js';

/**
 * Creates a server-side DOM environment using linkedom.
 * Sets up all globals needed by compiled @opentf/web components.
 * 
 * @returns {{ document, window, cleanup }} The server document and a cleanup function.
 */
export function createServerDOM(html = '<!DOCTYPE html><html><head></head><body><div id="app"></div></body></html>') {
  const { document, window } = parseHTML(html);

  // Store original globals to restore later
  const originals = {
    document: globalThis.document,
    window: globalThis.window,
    HTMLElement: globalThis.HTMLElement,
    SVGElement: globalThis.SVGElement,
    Element: globalThis.Element,
    Node: globalThis.Node,
    customElements: globalThis.customElements,
    navigator: globalThis.navigator,
    location: globalThis.location,
    __WAF_SSG__: globalThis.__WAF_SSG__,
  };

  // Set up globals that compiled components expect
  function setGlobal(key, value) {
    try {
      globalThis[key] = value;
    } catch (e) {
      // If setting fails (read-only), try defineProperty
      try {
        Object.defineProperty(globalThis, key, {
          value,
          configurable: true,
          writable: true,
        });
      } catch (e2) {
        console.warn(`⚡ SSG: Could not set global ${key}: ${e2.message}`);
      }
    }
  }

  setGlobal('document', document);
  setGlobal('__WAF_SSG__', true);
  _setSSG(true);
  setGlobal('window', window);
  setGlobal('HTMLElement', window.HTMLElement);
  setGlobal('SVGElement', window.SVGElement || window.HTMLElement);
  setGlobal('Element', window.Element || window.HTMLElement);
  setGlobal('Node', window.Node);
  setGlobal('navigator', window.navigator || { userAgent: '' });
  setGlobal('location', window.location || { pathname: '/', search: '', hash: '' });

  // Set up customElements registry if linkedom doesn't provide one
  if (!globalThis.customElements) {
    const registry = new Map();
    globalThis.customElements = {
      define(name, constructor) {
        registry.set(name, constructor);
      },
      get(name) {
        return registry.get(name);
      },
      whenDefined(name) {
        return Promise.resolve(registry.get(name));
      }
    };
  }

  const cleanup = () => {
    Object.keys(originals).forEach(key => {
      try {
        if (originals[key] !== undefined) {
          globalThis[key] = originals[key];
        } else {
          delete globalThis[key];
        }
      } catch (e) {
        try {
          Object.defineProperty(globalThis, key, {
            value: originals[key],
            configurable: true,
            writable: true,
          });
        } catch (e2) {
          // Ignore restoration failures
        }
      }
    });
    _setSSG(originals.__WAF_SSG__ || false);
  };

  return { document, window, cleanup };
}

/**
 * Renders a page module into an HTML string using the server DOM.
 * 
 * @param {Object} pageModule - The compiled page module with a render() export
 * @param {Object} options
 * @param {Object} options.params - Route params to pass to the page
 * @param {Array}  options.layoutModules - Layout modules to wrap the page, outermost first
 * @returns {string} The rendered HTML string
 */
export function renderPage(pageModule, { params = {}, layoutModules = [] } = {}) {
  const { document, cleanup } = createServerDOM();

  try {
    const root = document.getElementById('app');

    // Create a container for the page content
    const pageContainer = document.createElement('div');
    
    // Render the page
    if (pageModule.render) {
      pageModule.render(pageContainer, { params });
    } else if (pageModule.default?.render) {
      pageModule.default.render(pageContainer, { params });
    }

    let content = pageContainer;

    // Wrap in layouts (innermost to outermost)
    for (let i = layoutModules.length - 1; i >= 0; i--) {
      const layout = layoutModules[i];
      const layoutContainer = document.createElement('div');
      
      // Get the page content as child nodes
      const children = document.createDocumentFragment();
      while (content.firstChild) {
        children.appendChild(content.firstChild);
      }

      if (layout.render) {
        layout.render(layoutContainer, { children, params });
      } else if (layout.default?.render) {
        layout.default.render(layoutContainer, { children, params });
      }

      content = layoutContainer;
    }

    // Upgrade Custom Elements (Manual Shredding for SSG)
    upgradeCustomElements(content);

    // Move final content to root
    while (content.firstChild) {
      root.appendChild(content.firstChild);
    }

    // Mark as SSG for hydration detection
    root.setAttribute('data-ssg', 'true');

    return root.innerHTML;
  } finally {
    cleanup();
  }
}

/**
 * Upgrade Custom Elements (Manual Shredding for SSG)
 */
export function upgradeCustomElements(node) {
  if (node._waf_upgraded) return;

  if (node.tagName) {
    const tagName = node.tagName.toLowerCase();
    
    // Process properties for all elements (native and custom)
    const wafProps = getWafProps(node);
    if (wafProps) {
      wafProps.forEach(key => {
        // Skip internal properties and event handlers
        if (key === 'children' || key.startsWith('on')) return;
        
        const value = node[key];
        // Only sync defined values. 
        // For SSG, we want to ensure properties like 'value', 'checked', etc. are reflected in the HTML.
        if (value !== undefined && value !== null) {
          if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            node.setAttribute(key === 'className' ? 'class' : key, value);
          }
        } else if (value === undefined || value === null) {
          // If it was explicitly set to null/undefined, ensure it's not in the HTML
          node.removeAttribute(key === 'className' ? 'class' : key);
        }
      });
    }

    if (tagName.startsWith('web-')) {
      const Constructor = globalThis.customElements.get(tagName);
      if (Constructor) {
        node._waf_upgraded = true;
        const initialValues = {};
        
        for (let i = 0; i < node.attributes.length; i++) {
          const attr = node.attributes[i];
          initialValues[attr.name] = attr.value;
        }

        if (wafProps) {
          wafProps.forEach(key => {
            initialValues[key] = node[key];
          });
        }

        // console.log(`⚡ SSG: Upgrading <${tagName}>`);

        // Use a mock object to avoid polluting the actual node's prototype
        const mockInstance = {
          tagName: node.tagName,
          attributes: node.attributes,
          childNodes: Array.from(node.childNodes),
          firstChild: node.firstChild,
          lastChild: node.lastChild,
          appendChild(child) { return node.appendChild(child); },
          removeChild(child) { return node.removeChild(child); },
          insertBefore(node_to_insert, reference_node) { return node.insertBefore(node_to_insert, reference_node); },
          setAttribute(name, value) { return node.setAttribute(name, value); },
          removeAttribute(name) { return node.removeAttribute(name); },
          getAttribute(name) { return node.getAttribute(name); },
          hasAttribute(name) { return node.hasAttribute(name); },
          addEventListener() {},
          removeEventListener() {},
          _propsSignals: {},
          _onMounts: [],
          _onCleanups: []
        };

        const meta = _initWafComponent(mockInstance);
        Object.keys(initialValues).forEach(attr => {
          meta._propsSignals[attr] = signal(initialValues[attr]);
        });

        // Call the component logic with our mock instance
        try {
          Constructor.prototype.connectedCallback.call(mockInstance);
        } catch (e) {
          console.error(`⚡ SSG: Error rendering <${tagName}>:`, e.message);
        }
      } else {
        console.warn(`⚡ SSG: <${tagName}> not registered.`);
      }
    }
  }
  
  let child = node.firstChild;
  while (child) {
    upgradeCustomElements(child);
    child = child.nextSibling;
  }
}
