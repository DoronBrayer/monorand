// ./vite.config.ts | Monorepo build configuration (strict-mode, zero errors)

import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'node:path'

export default defineConfig(({ mode }) => {
    const isTest = mode === 'test'
    const packageName = process.env.PACKAGE_NAME || 'shuffrand'
    const PACKAGE_PATH = resolve(__dirname, `./${packageName}`)

    return {
        plugins: [
            dts({
                entryRoot: resolve(PACKAGE_PATH, 'src'),
                outDir: resolve(PACKAGE_PATH, 'dist'),
                insertTypesEntry: true,
                rollupTypes: true,
                bundledPackages: [packageName]
            })
        ],
        build: {
            target: 'esnext',
            minify: 'esbuild',
            outDir: resolve(PACKAGE_PATH, 'dist'),
            emptyOutDir: false,
            lib: {
                entry: isTest ? resolve(PACKAGE_PATH, 'test.*.ts') : resolve(PACKAGE_PATH, 'index.ts'),
                formats: ['es'],
                fileName: () => (isTest ? 'index.js' : 'index.mjs')
            },
            rollupOptions: {
                external: ['arktype']
            }
        }
    }
})
