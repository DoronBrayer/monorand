// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        // Configure Vitest to ONLY run compiled JavaScript test files from the dist directory.
        // This adheres to the "test the final product" philosophy.
        // The pattern has been updated to be more specific, including only the actual test suites.
        include: [
            '**/dist/test.crypto-random.*.js',
            '**/dist/test.crypto-shuffle.*.js',
            '**/dist/test.crypto-string.*.js',
        ],
        // Exclude node_modules and the original TypeScript source files.
        exclude: ['**/node_modules/**', '**/src/**'],
        globals: true, // Make describe, it, expect globally available
        environment: 'node', // Specify the test environment
    },
})
