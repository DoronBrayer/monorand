// vitest.config.ts (Corrected)

import { defineConfig } from 'vitest/config'

export default defineConfig({
    server: {
        proxy: {
            '/shuffrand': 'https://unpkg.com/shuffrand@latest/',
        },
    },
    test: {
        // This 'include' is smart. It says "run everything in dist/test.*.js"
        include: ['**/dist/test.*.js'],

        // We will keep this exclude, as it's vital for the default test run.
        exclude: [
            '**/node_modules/**',
            '**/src/**',
            '**/dist/test.types.js',
            '**/dist/test.util.*.js',
            '**/*benchmark.js',
            '**/dist/test.*-regression.js',
        ],

        // All other settings are fine as they are.
        // The command line will override the 'environment' for a browser run.
        benchmark: {
            include: ['**/dist/*benchmark.js'],
            reporters: ['default'],
            outputJson: `reports/vitest-bench/${new Date().toJSON().replace(/[:.Z]/g, '')}.json`,
        },
        browser: {
            enabled: true,
            headless: true,
            provider: 'playwright',
            instances: [{ browser: 'chromium' }],
        },
        globals: true,
        environment: 'node',
    },
})
