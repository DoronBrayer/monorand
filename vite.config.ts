// vite.config.ts
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts' // Import the dts plugin
import { resolve } from 'path' // Node.js path module for resolving paths

export default defineConfig({
    plugins: [
        dts({
            // Configuration for vite-plugin-dts to generate .d.ts files
            // This plugin will read your tsconfig.json and source files to create type definitions.
            entryRoot: '.', // Start looking for source files from the project root
            outDir: 'dist', // Output .d.ts files to the 'dist' directory
            // Specify the source files to include for declaration generation.
            // These should match your flat source file names.
            include: [
                'index.ts',
                'src.constants.ts',
                'src.function.crypto-random.ts',
                'src.function.crypto-shuffle.ts',
                'src.function.crypto-string.ts',
                'src.types.ts',
            ],
            // The plugin will automatically generate separate .d.ts files for each entry defined in build.lib.entry.
        }),
    ],
    build: {
        // Configure Vite for Library Mode, which is ideal for building npm packages.
        lib: {
            // Define multiple entry points for your library.
            // The key is the desired output filename (without .js extension),
            // and the value is the path to your source file.
            entry: {
                index: resolve(__dirname, 'index.ts'), // Main entry point
                random: resolve(__dirname, 'src.function.crypto-random.ts'),
                shuffle: resolve(__dirname, 'src.function.crypto-shuffle.ts'),
                string: resolve(__dirname, 'src.function.crypto-string.ts'),
                constants: resolve(__dirname, 'src.constants.ts'), // Expose constants directly
                types: resolve(__dirname, 'src.types.ts'), // Expose types directly
            },
            // The name of your global variable if exposed (e.g., window.shuffrand).
            // This is primarily for UMD/IIFE formats, less critical for ESM.
            name: 'shuffrand',
            // Function to determine the output filename based on format and entry name.
            // This is crucial for matching your package.json exports.
            fileName: (format, entryName) => `${entryName}.${format}.js`,
            // For ESM, the format is 'es'. So, output files will be like:
            // index.es.js, random.es.js, shuffle.es.js, etc.
        },
        rollupOptions: {
            // Rollup is used under the hood by Vite for production builds.
            output: {
                // Output format: 'es' for ES Modules.
                format: 'es',
                chunkFileNames: `[name].js`,
                assetFileNames: `[name].[ext]`,
            },
            // Externalize dependencies that should NOT be bundled into your library.
            // This is crucial for reducing package size and avoiding duplication if
            // the consumer also uses these dependencies.
            external: ['arktype'], // CORRECTED: Externalize 'arktype'
        },
        outDir: 'dist', // The output directory for all compiled files (JS and .d.ts)
        emptyOutDir: true, // Clean the 'dist' directory before building
        minify: true, // Minify the output JavaScript
        sourcemap: false, // Do not generate source maps for the published package
    },
})
