// eslint.config.cjs
// Import necessary modules for ESLint flat configuration
const globals = require('globals') // Provides environment-specific global variables (e.g., Node.js)
const tseslint = require('typescript-eslint') // This package exports the flat configs and parser correctly
const js = require('@eslint/js') // ESLint's core recommended rules for JavaScript
const prettierRecommended = require('eslint-plugin-prettier/recommended') // Combines eslint-plugin-prettier and eslint-config-prettier

module.exports = [
    // 0. Global Ignore Patterns: Exclude compiled output and node_modules
    // These patterns are relative to the project root.
    {
        ignores: ['dist/', 'node_modules/'],
    },

    // 1. ESLint's core recommended rules for general JavaScript best practices.
    // This is a single config object.
    js.configs.recommended,

    // 2. TypeScript-specific recommended rules.
    // `tseslint.configs.recommended` is already an array of flat config objects.
    // Spread them directly into the main `module.exports` array.
    ...tseslint.configs.recommended,
    // Optional: Add ...tseslint.configs.stylistic for stylistic rules if desired later.

    // 3. General configuration for all files (JS and TS).
    // This object defines general settings that apply broadly.
    {
        files: ['**/*.{js,mjs,cjs,ts,tsx}'], // Apply to JS and TS files
        languageOptions: {
            // Define global variables available in the environment
            globals: {
                ...globals.node, // Includes Node.js global variables (e.g., process, require, module)
            },
        },
        rules: {
            // --- General JavaScript Rules (overrides from js.configs.recommended) ---
            // Enforce consistent line endings (LF for Unix/Git compatibility)
            'linebreak-style': ['error', 'unix'],

            // ADDED as per expert's suggestion: Disallow trailing whitespace (fixes CI error)
            'no-trailing-spaces': 'error',
            // ADDED as per expert's suggestion: Enforce a newline at the end of files (fixes CI error)
            'eol-last': 'error',

            // --- Custom Rules (apply to both JS and TS unless overridden later) ---
            // Enforce consistent spacing before and after keywords (e.g., if, for, while)
            'keyword-spacing': ['error', { before: true, after: true }],
            // Require or disallow trailing commas in object literals, arrays, etc.
            'comma-dangle': ['error', 'always-multiline'],
            // REMOVED: 'indent' rule. Prettier (which is last in the config) will handle indentation.
            // This aligns with the expert's implicit suggestion to let Prettier manage formatting.
            // Do not enforce semicolons at the end of statements (your preference)
            semi: 'off',
            // Enable warnings for extraneous semicolons
            'no-extra-semi': 'error',
            // Enforce the use of single quotes for string literals (your preference)
            quotes: ['error', 'single'],

            // ADDED as per expert's suggestion: Disable specific TypeScript ESLint rules globally
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': 'off',

            // Enforce a maximum line length for code (warns, doesn't error) (your preference)
            'max-len': [
                'warn',
                {
                    code: 120,
                    ignoreUrls: true,
                    ignoreStrings: true,
                    ignoreTemplateLiterals: true,
                    ignoreComments: true,
                },
            ],
        },
    },

    // 4. Specific configuration for TypeScript files.
    // This object applies the TypeScript parser and any TS-specific rule overrides.
    {
        files: ['**/*.ts', '**/*.tsx'], // Only apply these settings to TypeScript files
        languageOptions: {
            parser: tseslint.parser, // Use the TypeScript parser for TS files
            parserOptions: {
                ecmaVersion: 2021, // Specifies the ECMAScript version syntax to support (ES2021 features)
                sourceType: 'module', // Allows for the use of ES modules (import/export)
                // UPDATED: Provide an array of tsconfig files for ESLint to consider
                project: ['./tsconfig.json', './tsconfig.eslint.json'],
                tsconfigRootDir: __dirname, // Set the root directory for tsconfig files
            },
        },
        // No 'plugins' or 'extends' needed here for the basic recommended setup,
        // as `tseslint.configs.recommended` already handles that at the top level.
        rules: {
            // --- TypeScript-specific Rule Overrides (from recommended or custom) ---
            // Removed specific overrides for rules now handled globally in section 3:
            // '@typescript-eslint/no-unused-vars' and '@typescript-eslint/no-explicit-any'
            // Allow empty functions (e.g., no-op functions) (your preference)
            '@typescript-eslint/no-empty-function': 'off',
            // Allow the use of `require()` in TypeScript files generally (if needed) (your preference)
            '@typescript-eslint/no-var-requires': 'off',
        },
    },

    // 5. Override for eslint.config.cjs itself to allow `require()`
    // This is crucial because this config file is a CommonJS module.
    {
        files: ['eslint.config.cjs'], // Apply this config ONLY to the config file itself
        rules: {
            // Explicitly allow require() statements in this CJS configuration file
            '@typescript-eslint/no-require-imports': 'off',
        },
    },

    // 6. Override for test files to allow `console.log`
    // Test files often use console.log for outputting test results or debugging.
    {
        files: ['test/**/*.ts', 'run-tests.ts'], // Apply this config ONLY to test files
        rules: {
            // Allow all console methods in test files (your preference)
            'no-console': 'off',
        },
    },

    // 7. Prettier Integration: MUST BE THE LAST CONFIGURATION IN THE ARRAY
    // This ensures Prettier's formatting rules override any conflicting ESLint rules,
    // and that Prettier runs as an ESLint rule.
    prettierRecommended,
]
