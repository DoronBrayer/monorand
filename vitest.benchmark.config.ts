// ./vitest.benchmark.config.ts | Monorepo benchmark configuration
import { defineConfig } from 'vitest/config'
import path from 'path'

// Use the PACKAGE_NAME variable to locate the correct test directory.
const PACKAGE_NAME = process.env.PACKAGE_NAME || 'shuffrand'

// Generate a timestamp for the report filename.
const timestamp = new Date().toJSON().replace(/[:.Z]/g, '')

export default defineConfig({
    test: {
        // Corrected include pattern to use the generic '*benchmark.ts'
        include: [`./${PACKAGE_NAME}/**/*benchmark.ts`],

        // Explicitly enable the benchmark mode for these specific test files.
        benchmark: {
            include: [`./${PACKAGE_NAME}/**/*benchmark.ts`]
        },

        // Corrected the reporters configuration to use the nested array format
        // and resolved the path to be absolute.
        reporters: [
            'default',
            [
                'json',
                {
                    outputFile: path.resolve(__dirname, `./reports/${PACKAGE_NAME}/vite-bench/${timestamp}.json`)
                }
            ]
        ]
    }
})
