import { registerRoutes, navigate, router } from '../router/index'

export function mountApp() {
  console.log('mountApp() called');
  const root = document.getElementById('app')
  
  // 1. Discover Pages & Layouts
  const pages = import.meta.glob('../../app/**/{page,layout,404}.{jsx,tsx}', { eager: true })
  console.log('Pages found:', Object.keys(pages));
  registerRoutes(pages)
  
  // 2. Discover Route Guard (Convention-based)
  const guards = import.meta.glob('../../app/routeGuard.{js,ts,jsx,tsx}', { eager: true })
  const guard = Object.values(guards)[0]?.default;
  if (guard) {
    console.log('🛡️ Route Guard detected and activated');
    router.guard = guard;
  }
  
  const initialPath = window.location.pathname
  console.log('Initial path:', initialPath);
  navigate(initialPath, root)

  window.onpopstate = () => {
    navigate(window.location.pathname, root)
  }
}
