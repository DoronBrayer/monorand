// ./shuffrand/vitest.config.ts | Package-level test configuration

import { defineConfig } from 'vitest/config'
import { resolve } from 'node:path'

export default defineConfig({
    test: {
        // We now correctly include the source TypeScript test files.
        include: ['test.*.ts', 'inspection.*.ts'],

        // We now correctly exclude source, node_modules, and non-unit files.
        exclude: [
            '**/node_modules/**',
            '**/src/**',
            'test.types.ts',
            'test.util.*.ts',
            '**/*benchmark.ts',
            '**/*-regression.ts'
        ],

        // Benchmark suite (scoped to this package)
        benchmark: {
            // We now correctly include the source TypeScript benchmark file.
            include: ['inspection.performance-benchmark.ts'],
            reporters: ['default'],
            outputJson: resolve(__dirname, `../reports/vitest-bench/${new Date().toJSON().replace(/[:.Z]/g, '')}.json`)
        },

        // This is necessary for your Playwright tests. We will keep it.
        browser: {
            enabled: true,
            headless: true,
            provider: 'playwright',
            instances: [{ browser: 'chromium' }]
        },
        globals: true,
        environment: 'node'
    },

    resolve: {
        alias: {
            // Resolve bare "shuffrand" to the compiled package artifact
            shuffrand: resolve(__dirname, './dist/index.js')
        }
    }
})
