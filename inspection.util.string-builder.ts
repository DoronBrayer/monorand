// inspection.util.string-builder.ts

/**
 * The typical string builder just for performance comparison.
 * @param length The number of characters, i.e. string length.
 * @param characterSet The set of characters to use.
 * @returns A new, random string.
 */
export function standardString(length: number, characterSet: string): string {
    let result = ''
    for (let i = 0; i < length; i++) {
        result += characterSet.charAt(Math.floor(Math.random() * characterSet.length))
    }
    return result
}
