// ./shuffrand/vite.config.ts | Package build configuration
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
    plugins: [
        dts({
            insertTypesEntry: true,
            outDir: 'dist'
        })
    ],
    build: {
        outDir: 'dist',
        // Revert to esbuild minification, as it should be sufficient
        minify: 'esbuild', // Keep this, minification is still desired *after* proper bundling
        sourcemap: false, // Disable sourcemaps for smaller production build size
        target: 'es2020', // Set target for modern JS output
        lib: {
            entry: resolve(__dirname, 'index.ts'),
            name: 'shuffrand',
            fileName: 'index',
            formats: ['es'] // ESM-only, as planned
        },
        rollupOptions: {
            // CRITICAL: Explicitly mark dependencies as external
            // This prevents them from being bundled into the output file.
            // They must be listed in "dependencies" or "peerDependencies" in package.json.
            external: [
                'arktype'
                // Add other production dependencies if any (check shuffrand/package.json)
                // '@types/node', // If used at runtime, otherwise likely a devDep
                // Add any deep imports from arktype if needed, e.g., 'arktype/utilities'
                // Regular expressions can also be used for patterns.
            ],
            // Optional: Further configure output if needed (e.g., globals for UMD)
            output: {
                // This can help ensure external imports are handled correctly
            }
        }
    }
})
// Ensure shuffrand/package.json lists 'arktype' correctly:
// It should likely be in "dependencies", not "devDependencies", if it's used at runtime.
// Check the current shuffrand/package.json
