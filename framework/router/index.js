import { withInstance } from '../runtime/lifecycle.js'
import { signal } from '@preact/signals-core'

export const routes = {
  pages: {},
  layouts: {},
  notFound: null
}

export const router = {
  pathname: signal(window.location.pathname),
  searchParams: signal(new URLSearchParams(window.location.search)),
  push: (path) => navigate(path),
  replace: (path) => navigate(path, undefined, true)
}

let currentPageInstance = null;

export function registerRoutes(pages) {
  for (const path in pages) {
    const isLayout = path.endsWith('layout.jsx') || path.endsWith('layout.tsx');
    const isNotFound = path.endsWith('404.jsx') || path.endsWith('404.tsx');
    
    let route = path
      .replace(/^.*\/app/, '') 
      .replace(/\/(page|layout|404)\.(jsx|tsx)$/, '');
    
    if (route === '') route = '/';
    
    if (isNotFound) {
      routes.notFound = pages[path];
    } else if (isLayout) {
      routes.layouts[route] = pages[path];
    } else {
      routes.pages[route] = pages[path];
    }
  }
}

function matchRoute(path) {
  for (const route in routes.pages) {
    // Convert [ ...param ] to catch-all regex and [ param ] to single segment regex
    const pattern = route
      .replace(/\[\.\.\.([^\]]+)\]/g, '(?<$1>.+)')
      .replace(/\[([^\]]+)\]/g, '(?<$1>[^/]+)');
    
    const regex = new RegExp(`^${pattern}$`);
    const match = path.match(regex);
    if (match) {
      const params = { ...(match.groups || {}) };
      
      // Transform catch-all segments into arrays
      for (const key in params) {
        if (route.includes(`[...${key}]`)) {
          params[key] = params[key].split('/');
        }
      }

      return { 
        page: routes.pages[route], 
        params,
        route
      };
    }
  }
  return null;
}

export function navigate(path, root = document.getElementById("app"), replace = false, isPopState = false) {
  // Parse path for pathname and search params
  const url = new URL(path, window.location.origin);
  const pathname = url.pathname;
  
  if (!isPopState) {
    router.pathname.value = pathname;
    router.searchParams.value = new URLSearchParams(url.search);
  }

  const match = matchRoute(pathname) || (routes.notFound ? { page: routes.notFound, params: {}, route: null } : null);
  
  if (match) {
    const { page, params, route } = match;
    
    // Cleanup previous page
    if (currentPageInstance && currentPageInstance._onCleanups) {
      currentPageInstance._onCleanups.forEach(fn => fn());
    }
    
    // Create new page instance
    const instance = { _onMounts: [], _onCleanups: [] };
    currentPageInstance = instance;

    // Find all parent layouts
    const layoutChain = [];
    if (route) {
      let currentPath = route;
      while (true) {
        if (routes.layouts[currentPath]) {
          layoutChain.unshift(routes.layouts[currentPath]);
        }
        if (currentPath === '/') break;
        currentPath = currentPath.substring(0, currentPath.lastIndexOf('/')) || '/';
      }
    }

    // Render the chain with instance context
    let content = document.createDocumentFragment();
    withInstance(instance, () => {
      page.render(content, { params });

      for (let i = layoutChain.length - 1; i >= 0; i--) {
        const layout = layoutChain[i];
        const nextContent = document.createDocumentFragment();
        layout.render(nextContent, { children: content, params });
        content = nextContent;
      }
    });

    root.innerHTML = '';
    root.appendChild(content);

    // Trigger mount hooks
    if (instance._onMounts) {
      instance._onMounts.forEach(fn => fn());
    }

    if (!isPopState) {
      if (replace) {
        window.history.replaceState({}, '', path);
      } else {
        window.history.pushState({}, '', path);
      }
    }
  } else {
    root.innerHTML = '<h1>404 Not Found</h1>';
  }
}

// Sync router state with browser history navigation
if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => {
    router.pathname.value = window.location.pathname;
    router.searchParams.value = new URLSearchParams(window.location.search);
    navigate(window.location.pathname + window.location.search, undefined, false, true);
  });
}
