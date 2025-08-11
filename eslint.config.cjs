// ./eslint.config.cjs
// Import necessary modules for ESLint flat configuration
const globals = require('globals') // Provides environment-specific global variables (e.g., Node.js)
const tseslint = require('typescript-eslint') // This package exports the flat configs and parser correctly
const js = require('@eslint/js') // ESLint's core recommended rules for JavaScript
const prettierRecommended = require('eslint-plugin-prettier/recommended') // Combines eslint-plugin-prettier and eslint-config-prettier

module.exports = [
    // 0. Global Ignore Patterns: Exclude compiled output and node_modules
    // This pattern uses a wildcard to match any 'dist' directory in any subdirectory.
    {
        ignores: ['**/dist/**', '**/node_modules/', '**/*.d.ts']
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
                ...globals.node // Includes Node.js global variables (e.g., process, require, module)
            }
        },
        rules: {
            // --- General JavaScript Rules (overrides from js.configs.recommended) ---
            // Enforce consistent line endings (LF for Unix/Git compatibility)
            'linebreak-style': ['error', 'unix'],

            // Disallow trailing whitespace (fixes CI error)
            'no-trailing-spaces': 'error',
            // Enforce a newline at the end of files (fixes CI error)
            'eol-last': 'error',

            // --- Custom Rules (apply to both JS and TS unless overridden later) ---
            // Enforce consistent spacing before and after keywords (e.g., if, for, while)
            'keyword-spacing': ['error', { before: true, after: true }],
            // Require or disallow trailing commas in object literals, arrays, etc.
            'comma-dangle': ['error', 'always-multiline'],
            // Do not enforce semicolons at the end of statements (your preference)
            semi: 'off',
            // Enable warnings for extraneous semicolons
            'no-extra-semi': 'error',
            // Enforce the use of single quotes for string literals (your preference)
            quotes: ['error', 'single'],

            // Disable specific TypeScript ESLint rules globally
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
                    ignoreComments: true
                }
            ]
        }
    },

    // 4. Specific configuration for TypeScript files.
    {
        files: ['**/*.ts', '**/*.tsx'], // Only apply these settings to TypeScript files
        languageOptions: {
            parser: tseslint.parser, // Use the TypeScript parser for TS files
            parserOptions: {
                ecmaVersion: 2021, // Specifies the ECMAScript version syntax to support (ES2021 features)
                sourceType: 'module', // Allows for the use of ES modules (import/export)
                project: [
                    './tsconfig.json',
                    './tsconfig.eslint.json',
                    './shuffrand/tsconfig.json',
                    './shuffrand/tsconfig.eslint.json'
                ],
                tsconfigRootDir: __dirname // Set the root directory for tsconfig files
            }
        },
        rules: {
            // --- TypeScript-specific Rule Overrides (from recommended or custom) ---
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/no-var-requires': 'off'
        }
    },

    // 5. Override for eslint.config.cjs itself to allow `require()`
    {
        files: ['eslint.config.cjs'], // Apply this config ONLY to the config file itself
        rules: {
            // Explicitly allow require() statements in this CJS configuration file
            '@typescript-eslint/no-require-imports': 'off'
        }
    },

    // **NEW BLOCK (6): Override for JavaScript test files to allow `require()`**
    // Your `.js` test files are using CommonJS `require()`, so this rule must be disabled.
    {
        files: ['**/*.js'], // This rule will target all .js files, which includes your test files
        rules: {
            '@typescript-eslint/no-require-imports': 'off'
        }
    },

    // **ORIGINAL BLOCK (7): Override for test files to allow `console.log`**
    // This now applies to both TS and JS test files.
    {
        files: ['test/**/*.ts', 'test/**/*.js', 'run-tests.ts'],
        rules: {
            // Allow all console methods in test files (your preference)
            'no-console': 'off'
        }
    },

    // 8. Prettier Integration: MUST BE THE LAST CONFIGURATION IN THE ARRAY
    // This ensures Prettier's formatting rules override any conflicting ESLint rules,
    // and that Prettier runs as an ESLint rule.
    prettierRecommended
]
