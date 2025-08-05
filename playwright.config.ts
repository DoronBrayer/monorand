// playwright.config.ts
import { defineConfig } from '@playwright/test'

// Define the common base directory for all outputs
const REPORTS_BASE_DIR = 'reports/playwright'

export default defineConfig({
    // Find our single, specific E2E test file
    testMatch: 'test.*regression.ts',

    // Use the 'json' reporter to output a single file
    reporter: [
        [
            'json',
            {
                // Prepend the REPORTS_BASE_DIR to the outputFile path
                outputFile: `${REPORTS_BASE_DIR}/${new Date().toJSON().replace(/[:.Z]/g, '')}.json`,
            },
        ],
    ],

    // Set the outputDir to the same base directory
    outputDir: REPORTS_BASE_DIR,

    fullyParallel: true,
    use: {
        trace: 'off',
        screenshot: 'off',
        video: 'off',
    },
    projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
})
