// ./shuffrand/vite.config.ts | Package build configuration
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

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
            name: 'shuffrand',
            fileName: 'index',
            formats: ['es']
        }
    }
})
