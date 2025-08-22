// ./shuffrand/vite.config.ts | Package build configuration
// This config forces Terser minification to ensure the output is truly minified.

import { resolve } from 'path'
// Import Terser manually to configure it directly
import { minify } from 'terser' // This requires `terser` to be installed
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
    plugins: [
        dts({
            insertTypesEntry: true,
            outDir: 'dist',
            // Roll up individual .d.ts files into a single index.d.ts
            rollupTypes: true
        }),
        {
            // Custom plugin to force aggressive Terser minification on the generated bundle
            name: 'force-terser-minify',
            async renderChunk(code, chunk, outputOptions) {
                // Only minify the main entry chunk (index.mjs)
                if (chunk.fileName === 'index.mjs' || chunk.name === 'index') {
                    try {
                        console.log(`[force-terser-minify] Minifying ${chunk.fileName}...`)
                        // Invoke Terser directly with aggressive settings
                        const minified = await minify(code, {
                            // Enable compression
                            compress: {
                                drop_debugger: true,
                                unused: true,
                                dead_code: true,
                                drop_console: true,
                                passes: 2
                            },
                            // Enable variable name mangling
                            mangle: true,
                            // Output options
                            format: {
                                comments: false
                            },
                            // Toplevel optimizations
                            toplevel: true,
                            // Match build.sourcemap setting
                            sourceMap: false
                        })

                        if (minified.code) {
                            console.log(`[force-terser-minify] Minification of ${chunk.fileName} complete.`)
                            // --- FIX: Ensure the returned map type is compatible with Vite ---
                            // Return only the code string, let Vite handle source maps if needed.
                            // If minified.map is needed, it must be processed to match Vite's expected type.
                            // For now, returning just the code to avoid complex type mapping.
                            return { code: minified.code }
                            // --- END FIX ---
                        } else {
                            console.warn(`[force-terser-minify] Minification returned no code for ${chunk.fileName}`)
                        }
                    } catch (error) {
                        console.error(`[force-terser-minify] Error minifying ${chunk.fileName}:`, error)
                        // Let the original code pass through on error
                    }
                }
                // Return nothing to leave the chunk unchanged (or return {code} explicitly)
                // Returning `null` or `undefined` might cause issues, so we return the original code
                // if the chunk wasn't the target or minification failed.
                // However, the safest return for "no change" in modern Rollup/Vite is to not return
                // a Promise.resolve or reject, or return `null`.
                // Let's explicitly return the original code if not processed.
                // Actually, if we don't return for non-target chunks, it should be fine.
                // But to be safe and match the hook signature precisely, we should handle it.
                // The simplest safe return for "do nothing" is often just not returning a Promise,
                // but since this is async, we need to return something.
                // Returning `{ code }` for the original code is the safest default if not processed.
                // But for the target chunk, we already returned { code: minified.code } above.
                // For non-target chunks, we implicitly fall through. Let's make it explicit.
                if (!(chunk.fileName === 'index.mjs' || chunk.name === 'index')) {
                    // Not our target chunk, do nothing.
                    return null // This is a valid return to indicate no change.
                }
                // If it was our target chunk but minification failed, we also fall through here.
                // Returning null here means "no change to this chunk".
                return null
            }
        }
    ],
    build: {
        outDir: 'dist',
        // Crucial: Disable Vite's built-in minification to prevent conflicts
        minify: false,
        sourcemap: false, // Disable sourcemaps (Part-III.md)
        target: 'es2020', // Modern target (Part-III.md)
        lib: {
            entry: resolve(__dirname, 'index.ts'),
            name: 'shuffrand',
            // Explicitly set the file name for ESM
            fileName: () => 'index.mjs',
            formats: ['es'] // ESM-only output (Part-II & Part-III.md)
        },
        rollupOptions: {
            // CRITICAL: Ensure arktype is NOT bundled
            external: (id) => {
                return id.startsWith('arktype')
            },
            output: {
                // Keep ESM settings standard
            }
        }
    }
})
// Ensure shuffrand/package.json lists 'arktype' correctly:
// peerDependencies (optional) and devDependencies.
// CRITICAL: Ensure `terser` is installed as a dev dependency:
// Run: `pnpm --filter shuffrand add -D terser`
