// ./datrand/vite.config.ts | Package build configuration

import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
    plugins: [
        dts({
            insertTypesEntry: true
        })
    ],
    build: {
        outDir: 'dist',
        minify: 'esbuild',
        sourcemap: true,
        lib: {
            entry: resolve(__dirname, 'index.ts'),
            name: 'datrand',
            fileName: 'index',
            formats: ['es']
        }
    }
})
