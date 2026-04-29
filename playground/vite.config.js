import { defineConfig } from 'vite'
import { babel } from '@rollup/plugin-babel'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development'

  return {
    esbuild: {
      jsx: 'preserve'
    },
    resolve: {
      alias: isDev ? {
        '@opentf/web': path.resolve(__dirname, '../packages/web/index.js'),
        '@opentf/web-form': path.resolve(__dirname, '../packages/web-form'),
      } : {}
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
          [isDev ? path.resolve(__dirname, '../packages/web/compiler/index.js') : "@opentf/web/compiler"]
        ]
      }), 
      cloudflare()
    ]
  }
})