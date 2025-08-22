// ./vitest.benchmark.config.ts | Monorepo benchmark configuration
import path from 'path'
import fs from 'fs' // Import fs for directory creation
import { defineConfig } from 'vitest/config'

// --- ENVIRONMENT VARIABLE HANDLING ---
const PACKAGE_NAME = process.env.PACKAGE_NAME || 'shuffrand'
const timestamp = new Date().toJSON().replace(/[:.Z]/g, '')
// --- END ENVIRONMENT VARIABLE HANDLING ---

// --- ROBUST OUTPUT PATH CALCULATION & DIRECTORY CREATION ---
// Calculate the full, absolute path for the benchmark JSON report.
const outputFilePath = path.resolve(__dirname, `./reports/${PACKAGE_NAME}/vite-bench/${timestamp}.json`)
// Calculate the directory part of the path.
const outputDir = path.dirname(outputFilePath)

// PROACTIVE & ROBUST DIRECTORY CREATION:
// This code runs when the config file is imported/evaluated by Node.js,
// *before* Vitest starts. It ensures the directory exists.
// Wrapped in try/catch to surface potential errors during config load.
try {
    // Use { recursive: true } to create intermediate directories if needed.
    fs.mkdirSync(outputDir, { recursive: true })
    console.log(`[CONFIG] Ensured benchmark report directory exists: ${outputDir}`)
} catch (err) {
    console.error(`[CONFIG ERROR] Failed to create benchmark report directory '${outputDir}':`, err)
    // Depending on your preference, you might want to throw here to halt the process
    // if directory creation is critical. Otherwise, Vitest might fail silently later.
    // throw err;
}
// --- END OUTPUT PATH CALCULATION & DIRECTORY CREATION ---

export default defineConfig({
    test: {
        // --- FILE INCLUSION ---
        // Include pattern to find benchmark files within the specified package directory.
        include: [`./${PACKAGE_NAME}/**/*benchmark.ts`],
        // --- BENCHMARK CONFIGURATION ---
        // Configure benchmark-specific settings.
        benchmark: {
            // Include pattern to find benchmark files within the specified package directory.
            include: [`./${PACKAGE_NAME}/**/*benchmark.ts`],
            // Keep the 'default' reporter for terminal output.
            reporters: ['default'],
            // Use the dedicated 'outputJson' option for benchmark results.
            // This is the standard and robust way for benchmarks in v4+.
            // The directory for this file is ensured to exist above.
            outputJson: outputFilePath
        }
        // --- END BENCHMARK CONFIGURATION ---
    }
})
// End of ./vitest.benchmark.config.ts
