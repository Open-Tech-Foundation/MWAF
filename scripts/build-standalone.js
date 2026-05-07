import { execSync } from 'child_process';
import { renameSync, existsSync, unlinkSync } from 'fs';
import path from 'path';

const build = () => {
  console.log('🏗️ Building Standalone Playground Assets...');

  const packagesWebDir = path.resolve('packages/web');
  const standaloneDir = path.resolve('playground/app/standalone');

  // 1. Build Compiler Standalone
  console.log('🔨 Compiling Standalone Compiler...');
  execSync(`bun run --cwd ${packagesWebDir} tsup compiler/index.js --format esm --no-splitting --clean false --outDir ${standaloneDir}`, { stdio: 'inherit' });
  
  const compilerOldPath = path.join(standaloneDir, 'index.js');
  const compilerNewPath = path.join(standaloneDir, 'compiler.js');
  if (existsSync(compilerOldPath)) {
    if (existsSync(compilerNewPath)) unlinkSync(compilerNewPath);
    renameSync(compilerOldPath, compilerNewPath);
  }

  // 2. Build Runtime Standalone
  console.log('🔨 Compiling Standalone Runtime...');
  execSync(`bun run --cwd ${packagesWebDir} tsup index.js --format esm --no-splitting --clean false --outDir ${standaloneDir}`, { stdio: 'inherit' });
  
  const webOldPath = path.join(standaloneDir, 'index.js');
  const webNewPath = path.join(standaloneDir, 'web.js');
  if (existsSync(webOldPath)) {
    if (existsSync(webNewPath)) unlinkSync(webNewPath);
    renameSync(webOldPath, webNewPath);
  }

  console.log('✅ Standalone Playground assets built successfully.');
};

build();
