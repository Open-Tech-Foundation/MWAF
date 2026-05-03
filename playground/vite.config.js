import { defineConfig } from 'vite'
import { babel } from '@rollup/plugin-babel'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import { ssg } from '../packages/web/ssg/index.js';

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development'
  const isSSG = mode === 'ssg'

  return {
    esbuild: {
      jsx: 'preserve'
    },
    resolve: {
      alias: {
        '@opentf/web': path.resolve(__dirname, '../packages/web/index.js'),
        '@opentf/web-form': path.resolve(__dirname, '../packages/web-form/index.js'),
      },
    },
    plugins: [
      tailwindcss(), 
      babel({
        babelHelpers: 'bundled',
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        exclude: 'node_modules/**',
        configFile: false,
        plugins: [
          "@babel/plugin-syntax-jsx",
          [path.resolve(__dirname, '../packages/web/compiler/index.js')]
        ]
      }), 
      ssg()
    ]
  }
})