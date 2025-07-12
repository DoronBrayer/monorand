// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        // Configure Vitest to ONLY run compiled JavaScript test files from the dist directory.
        // This adheres to the "test the final product" philosophy.
        include: ['**/dist/**/*.test.js'], // Look for .test.js files specifically in the dist directory
        exclude: ['**/node_modules/**', '**/src/**'], // Exclude node_modules and the original TypeScript source files
        globals: true, // Make describe, it, expect globally available
        environment: 'node', // Specify the test environment
        // You might need to configure resolver options if your imports are complex
        // For example, if you have bare imports that need to resolve to dist/
        // resolve: {
        //   alias: {
        //     './index.js': './dist/index.js', // Example: if you import './index.js' in your tests
        //   },
        // },
    },
})
