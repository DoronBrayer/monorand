// .prettierrc.cjs
module.exports = {
    // Use single quotes instead of double quotes:
    singleQuote: true,
    // Do not add semicolons at the end of statements:
    semi: false,
    // Use 4 spaces for indentation (changed from default 2):
    tabWidth: 4,
    // Use spaces instead of tabs for indentation:
    useTabs: false,
    // Print trailing commas wherever valid in ES5 (objects, arrays, etc.):
    trailingComma: 'es5',
    // Print spaces between brackets in object literals ({ foo: bar }):
    bracketSpacing: true,
    // Put the > of a multi-line HTML (or JSX) element on the same line as the last attribute:
    bracketSameLine: false,
    // Specify the line length that the printer will wrap on:
    printWidth: 120,
    // Ensure consistent line endings (LF for Unix/Git):
    endOfLine: 'lf',
    // Arrow function parentheses behavior (always include for consistency):
    arrowParens: 'always',
}
