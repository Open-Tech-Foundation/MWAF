import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, rmSync } from 'fs';
import { join, resolve, dirname, relative } from 'path';
import { pathToFileURL } from 'url';
import { createJiti } from 'jiti';

/**
 * Vite SSG Plugin for @opentf/web
 * 
 * Pre-renders static routes at build time by:
 * 1. Compiling page/layout .jsx files with Babel + the @opentf/web compiler
 * 2. Running them against a linkedom server DOM
 * 3. Injecting the rendered HTML into dist/index.html
 * 
 * Only activates when Vite mode === 'ssg'.
 * 
 * Usage in vite.config.js:
 *   import { ssg } from '@opentf/web/ssg';
 *   export default defineConfig({ plugins: [ssg()] });
 * 
 * Invocation:
 *   vite build --mode ssg
 */
export function ssg(options = {}) {
  let root;
  let outDir;
  let shouldRender = false;
  let projectConfig = { ...options.config };

  return {
    name: 'web-ssg',
    apply: 'build',

    async config(config, { mode }) {
      root = config.root || process.cwd();
      
      // 1. Load web.config.ts/js
      const configFiles = ['web.config.ts', 'web.config.js', 'web.config.mjs'];
      const jiti = createJiti(import.meta.url);
      
      for (const file of configFiles) {
        const configPath = resolve(root, file);
        if (existsSync(configPath)) {
          try {
            const module = await jiti.import(configPath);
            projectConfig = { ...projectConfig, ...(module.default || {}) };
            break;
          } catch (e) {}
        }
      }

      shouldRender = projectConfig.mode?.rendering === 'ssg' || mode === 'ssg';

      // 2. Inject necessary configuration
      if (shouldRender) {
        return {
          resolve: {
            alias: {
              '@opentf/web': resolve(root, '../packages/web/index.js'),
              '@opentf/web-form': resolve(root, '../packages/web-form'),
            }
          },
          define: {
            'window.__WAF_CONFIG__': JSON.stringify(projectConfig)
          }
          // Note: Babel is usually handled in the vite.config.js for now 
          // because it needs to run on all files, but we could inject it here too.
        };
      }
    },

    async configResolved(config) {
      root = config.root;
      outDir = resolve(root, config.build.outDir || 'dist');
      shouldRender = projectConfig.mode?.rendering === 'ssg' || config.mode === 'ssg';
    },

    async closeBundle() {
      if (!shouldRender) return;

      console.log('\n⚡ SSG: Starting static site generation...\n');

      // 2. Find the app directory
      const appDir = resolve(root, 'app');
      if (!existsSync(appDir)) {
        console.warn('⚡ SSG: No app/ directory found. Skipping SSG.');
        return;
      }

      // 3. Discover routes from the app directory
      const routes = discoverRoutes(appDir);
      const staticRoutes = routes.filter(r => !r.route.includes('['));

      if (staticRoutes.length === 0) {
        console.log('⚡ SSG: No static routes found. Skipping.');
        return;
      }

      console.log(`⚡ SSG: Pre-rendering ${staticRoutes.length} static routes...\n`);

      // 4. Read the built index.html shell
      const shellPath = join(outDir, 'index.html');
      if (!existsSync(shellPath)) {
        console.error('⚡ SSG: dist/index.html not found. Run vite build first.');
        return;
      }
      let htmlShell = readFileSync(shellPath, 'utf-8');

      // Clean up development paths that might be left in the shell
      htmlShell = htmlShell.replace(/<link [^>]*href=["']\/app\/[^"']*["'][^>]*>/g, '');
      htmlShell = htmlShell.replace(/<script [^>]*src=["']\/main\.js["'][^>]*><\/script>/g, '');

      // Inject configuration
      const configScript = `<script>window.__WAF_CONFIG__ = ${JSON.stringify(projectConfig)};</script>`;
      htmlShell = htmlShell.replace('</head>', `${configScript}</head>`);

      // 5. Set up the server DOM environment
      const { createServerDOM, upgradeCustomElements } = await import('./render.js');

      // 6. Resolve the compiler
      const compilerPath = resolve(root, '../packages/web/compiler/index.js');
      let compiler;
      try {
        compiler = (await import(pathToFileURL(compilerPath).href)).default;
      } catch {
        try {
          compiler = (await import('@opentf/web/compiler')).default;
        } catch {
          console.error('⚡ SSG: Cannot find @opentf/web compiler.');
          return;
        }
      }

      let babel;
      try {
        babel = await import('@babel/core');
      } catch {
        console.error('⚡ SSG: @babel/core is required for SSG.');
        return;
      }

      // 6. Resolve the runtime source path for imports in compiled output
      const runtimePath = resolve(root, '../packages/web/dist/index.js');

      // 7. Set up a temp directory for compiled modules
      const tmpDir = join(root, '.ssg-tmp');
      if (existsSync(tmpDir)) rmSync(tmpDir, { recursive: true });
      mkdirSync(tmpDir, { recursive: true });

      let successCount = 0;

      // Set up the server DOM environment once for all renders
      const { document, cleanup } = createServerDOM();

      for (const routeInfo of staticRoutes) {
        try {
          const { route, pagePath, layoutPaths } = routeInfo;

          // Compile the page module
          const pageModule = await compileAndLoad(pagePath, babel, compiler, appDir, tmpDir, runtimePath, root);

          // Compile layout modules
          const layoutModules = [];
          for (const lp of layoutPaths) {
            const layoutModule = await compileAndLoad(lp, babel, compiler, appDir, tmpDir, runtimePath, root);
            layoutModules.push(layoutModule);
          }

          const appRoot = document.getElementById('app');
          appRoot.innerHTML = '';

          // Render page content
          const pageContainer = document.createElement('div');
          if (pageModule.render) {
            pageModule.render(pageContainer, { params: {} });
          }

          let content = pageContainer;

          // Wrap in layouts (innermost to outermost)
          for (let i = layoutModules.length - 1; i >= 0; i--) {
            const layout = layoutModules[i];
            const layoutContainer = document.createElement('div');

            const children = document.createDocumentFragment();
            while (content.firstChild) {
              children.appendChild(content.firstChild);
            }

            if (layout.render) {
              layout.render(layoutContainer, { children, params: {} });
            }

            content = layoutContainer;
          }

          upgradeCustomElements(content);

          // Move to app root
          while (content.firstChild) {
            appRoot.appendChild(content.firstChild);
          }

          const renderedHTML = appRoot.innerHTML;

          // Inject into the HTML shell
          const outputHtml = htmlShell.replace(
            /<div id="app"[^>]*>[\s\S]*?<\/div>/,
            `<div id="app" data-ssg="true">${renderedHTML}</div>`
          );

          // Write the output file
          const outputPath = route === '/'
            ? join(outDir, 'index.html')
            : join(outDir, route.slice(1), 'index.html');

          mkdirSync(dirname(outputPath), { recursive: true });
          writeFileSync(outputPath, outputHtml, 'utf-8');

          console.log(`  ✓ ${route}`);
          successCount++;
        } catch (err) {
          console.error(`  ✗ ${routeInfo.route} — ${err.message}`);
          if (process.env.DEBUG) console.error(err.stack);
        }
      }

      cleanup();

      // Clean up temp dir
      try {
        rmSync(tmpDir, { recursive: true });
      } catch {}

      console.log(`\n⚡ SSG: Done! ${successCount}/${staticRoutes.length} routes pre-rendered.\n`);
    }
  };
}

/**
 * Compiles a JSX source file with Babel and the @opentf/web compiler,
 * then dynamically imports the compiled module.
 * 
 * Rewrites imports to use absolute paths so the compiled modules can be 
 * loaded from a temporary directory without standard Node resolution.
 */
async function compileAndLoad(filePath, babel, compiler, appDir, tmpDir, runtimePath, root) {
  const source = readFileSync(filePath, 'utf-8');

  const result = await babel.transformAsync(source, {
    filename: filePath,
    plugins: [
      '@babel/plugin-syntax-jsx',
      [compiler, { runtimeSource: '@opentf/web' }]
    ],
    sourceMaps: false,
    configFile: false,
    babelrc: false,
  });

  if (!result || !result.code) {
    throw new Error(`Failed to compile ${filePath}`);
  }

  const code = rewriteImports(result.code, filePath, appDir, tmpDir, runtimePath, babel, compiler, root);

  // Write the compiled module
  const relPath = relative(appDir, filePath);
  const compiledPath = join(tmpDir, relPath.replace(/\.(jsx|tsx)$/, '.mjs'));
  mkdirSync(dirname(compiledPath), { recursive: true });
  writeFileSync(compiledPath, code, 'utf-8');

  // Import it
  const module = await import(pathToFileURL(compiledPath).href + `?t=${Date.now()}`);
  return module;
}

/**
 * Compiles a JSX file and writes it without importing — for dependency resolution.
 */
function compileAndWrite(filePath, babel, compiler, appDir, tmpDir, runtimePath, root) {
  const source = readFileSync(filePath, 'utf-8');

  const result = babel.transformSync(source, {
    filename: filePath,
    plugins: [
      '@babel/plugin-syntax-jsx',
      [compiler, { runtimeSource: '@opentf/web' }]
    ],
    sourceMaps: false,
    configFile: false,
    babelrc: false,
  });

  if (!result || !result.code) return;

  const code = rewriteImports(result.code, filePath, appDir, tmpDir, runtimePath, babel, compiler, root);

  const relPath = relative(appDir, filePath);
  const compiledPath = join(tmpDir, relPath.replace(/\.(jsx|tsx)$/, '.mjs'));
  mkdirSync(dirname(compiledPath), { recursive: true });
  writeFileSync(compiledPath, code, 'utf-8');
}

/**
 * Rewrites import statements in the compiled code to use absolute file URLs.
 */
function rewriteImports(code, filePath, appDir, tmpDir, runtimePath, babel, compiler, root) {
  const runtimeFileUrl = pathToFileURL(runtimePath).href;
  const webFormPath = resolve(root, '../packages/web-form/index.js');
  const webFormFileUrl = pathToFileURL(webFormPath).href;
  const sourceDir = dirname(filePath);

  return code.replace(
    /from\s+["']([^"']+)["']/g,
    (match, importPath) => {
      // 1. @opentf/web
      if (importPath === '@opentf/web' || importPath.startsWith('@opentf/web/')) {
        return `from "${runtimeFileUrl}"`;
      }

      // 2. @opentf/web-form (alias)
      if (importPath === '@opentf/web-form') {
        return `from "${webFormFileUrl}"`;
      }

      // 3. Relative imports
      if (importPath.startsWith('.')) {
        let absPath = resolve(sourceDir, importPath);
        
        // Resolve extension
        if (!existsSync(absPath)) {
          for (const ext of ['.jsx', '.tsx', '.js', '.ts']) {
            if (existsSync(absPath + ext)) {
              absPath += ext;
              break;
            }
          }
        }

        if (existsSync(absPath)) {
          if (absPath.endsWith('.jsx') || absPath.endsWith('.tsx')) {
            const depRelPath = relative(appDir, absPath);
            const depCompiledPath = join(tmpDir, depRelPath.replace(/\.(jsx|tsx)$/, '.mjs'));
            if (!existsSync(depCompiledPath)) {
              compileAndWrite(absPath, babel, compiler, appDir, tmpDir, runtimePath, root);
            }
            return `from "${pathToFileURL(depCompiledPath).href}"`;
          }
          return `from "${pathToFileURL(absPath).href}"`;
        }
      }

      // 4. Other node_modules (like @opentf/std, zod)
      // We try to resolve them using Node's require.resolve if possible
      try {
        const resolved = createRequire(importPath.startsWith('.') ? filePath : join(root, 'index.js')).resolve(importPath);
        return `from "${pathToFileURL(resolved).href}"`;
      } catch (e) {
        // Fallback to original match if resolution fails
        return match;
      }
    }
  );
}

/**
 * Discovers routes by scanning the app directory for page.jsx files.
 */
function discoverRoutes(appDir, basePath = '') {
  const routes = [];
  const entries = readdirSync(appDir, { withFileTypes: true });

  // Check for page file in current directory
  const pageFile = entries.find(e =>
    e.isFile() && /^page\.(jsx|tsx|js|ts)$/.test(e.name)
  );

  if (pageFile) {
    const route = basePath || '/';
    const pagePath = join(appDir, pageFile.name);

    // Collect layouts up the tree
    const layoutPaths = collectLayouts(appDir);

    routes.push({ route, pagePath, layoutPaths });
  }

  // Recurse into subdirectories
  for (const entry of entries) {
    if (entry.isDirectory() && !entry.name.startsWith('.') && !entry.name.startsWith('_') && entry.name !== 'components' && entry.name !== 'icons' && entry.name !== 'node_modules') {
      const subRoutes = discoverRoutes(
        join(appDir, entry.name),
        `${basePath}/${entry.name}`
      );
      routes.push(...subRoutes);
    }
  }

  return routes;
}

/**
 * Collects layout files from the given directory up to the app root.
 * Returns layouts in order: outermost (app root) first.
 */
function collectLayouts(pageDir) {
  const layouts = [];
  let current = pageDir;

  while (true) {
    const files = readdirSync(current);
    const layoutFile = files.find(f => /^layout\.(jsx|tsx|js|ts)$/.test(f));

    if (layoutFile) {
      layouts.unshift(join(current, layoutFile));
    }

    const parent = dirname(current);
    if (parent === current) break;

    // Stop if the directory is named 'app' (the root of routes)
    if (current.endsWith('/app') || current.endsWith('\\app')) break;

    current = parent;
  }

  return layouts;
}

export default ssg;
