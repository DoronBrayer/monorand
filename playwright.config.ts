// ./playwright.config.ts | Monorepo browser test configuration

import { defineConfig } from '@playwright/test'
import path from 'path'

// Get the package name from the environment variable set by the pnpm script.
const PACKAGE_NAME = process.env.PACKAGE_NAME || 'shuffrand'

// Define the base directory for all Playwright outputs.
const REPORTS_BASE_DIR = path.resolve(__dirname, `reports/${PACKAGE_NAME}/playwright`)

export default defineConfig({
    // Point Playwright to the correct package directory to find tests.
    testDir: path.resolve(__dirname, PACKAGE_NAME),

    // Match all regression-style test files with a single, clean pattern.
    testMatch: /test\..*regression\.ts/,

    // Use the 'json' reporter to output a single, timestamped file.
    reporter: [
        [
            'json',
            {
                outputFile: `${REPORTS_BASE_DIR}/${new Date().toJSON().replace(/[:.Z]/g, '')}.json`
            }
        ]
    ],

    // Set the outputDir to the same base directory.
    outputDir: REPORTS_BASE_DIR,

    fullyParallel: true,
    use: {
        trace: 'off',
        screenshot: 'off',
        video: 'off'
    },
    // Use a clean, non-redundant project definition for the browser.
    projects: [{ name: 'chromium', use: { browserName: 'chromium' } }]
})
