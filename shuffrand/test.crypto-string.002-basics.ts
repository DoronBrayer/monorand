// /shuffrand/test.crypto-string.002-basics.ts

/**
 * Shuffrand Test Suite - cryptoString: Basic Parameters
 *
 * This file verifies the fundamental functionality and expected behavior of `cryptoString`
 * under various common and basic scenarios, including different lengths, predefined character sets,
 * and custom character sets (mixed and Unicode characters).
 *
 * @author Doron Brayer <doronbrayer@outlook.com>
 * @license MIT
 */

// Essential Vitest imports
import { describe, it, expect } from 'vitest'
// Import library functions and constants from the published package path, resolved by tsconfig.test.json paths
import { cryptoString, calculateStringEntropy } from 'shuffrand' // Updated import
import { Constants } from './src.constants.js' // Updated import

// Define a top-level group for these tests
describe('cryptoString: Basic Parameters', () => {
    // Specific Length (Numeric character set)
    // Call: cryptoString({ length: 10, characterSet: 'numeric' })
    // Expected: Returns a 10-character string containing only digits.
    it('Specific Length (Numeric character set)', () => {
        const length = 10
        const characterSet = 'numeric' // Predefined name
        const result = cryptoString({ length, characterSet })
        const expectedCharacterSet = Constants.DIGITS // Map to actual constant

        expect(result).toBeTypeOf('string')
        expect(result.length).toBe(length)
        // Verify all characters in the result are from the expected set
        for (const char of result) {
            expect(expectedCharacterSet).toContain(char)
        }
    })

    // Custom Character Set (Hexadecimal, specific length)
    // Call: cryptoString({ length: 8, characterSet: '0123456789ABCDEF' })
    // Expected: Returns an 8-character string containing only the specified custom hex characters.
    it('Custom Character Set (Hexadecimal, specific length)', () => {
        const length = 8
        const customCharacterSet = '0123456789ABCDEF' // Custom string
        const result = cryptoString({ length, characterSet: customCharacterSet })

        expect(result).toBeTypeOf('string')
        expect(result.length).toBe(length)
        // Verify all characters in the result are from the custom set
        for (const char of result) {
            expect(customCharacterSet).toContain(char)
        }
    })

    // Specific Length (Alpha character set)
    // Call: cryptoString({ length: 12, characterSet: 'alpha' })
    // Expected: Returns a 12-character string containing only Latin letters (uppercase/lowercase).
    it('Specific Length (Alpha character set)', () => {
        const length = 12
        const characterSet = 'alpha'
        const result = cryptoString({ length, characterSet })
        const expectedCharacterSet = Constants.LATIN_LETTERS

        expect(result).toBeTypeOf('string')
        expect(result.length).toBe(length)
        for (const char of result) {
            expect(expectedCharacterSet).toContain(char)
        }
    })

    // Specific Length (Lowercase character set)
    // Call: cryptoString({ length: 7, characterSet: 'lowercase' })
    // Expected: Returns a 7-character string containing only lowercase Latin letters.
    it('Specific Length (Lowercase character set)', () => {
        const length = 7
        const characterSet = 'lowercase'
        const result = cryptoString({ length, characterSet })
        const expectedCharacterSet = Constants.LATIN_LOWERCASE_LETTERS

        expect(result).toBeTypeOf('string')
        expect(result.length).toBe(length)
        for (const char of result) {
            expect(expectedCharacterSet).toContain(char)
        }
    })

    // Specific Length (Uppercase character set)
    // Call: cryptoString({ length: 5, characterSet: 'uppercase' })
    // Expected: Returns a 5-character string containing only uppercase Latin letters.
    it('Specific Length (Uppercase character set)', () => {
        const length = 5
        const characterSet = 'uppercase'
        const result = cryptoString({ length, characterSet })
        const expectedCharacterSet = Constants.LATIN_UPPERCASE_LETTERS

        expect(result).toBeTypeOf('string')
        expect(result.length).toBe(length)
        for (const char of result) {
            expect(expectedCharacterSet).toContain(char)
        }
    })

    // Specific Length (Hex character set - predefined name)
    // Call: cryptoString({ length: 16, characterSet: 'hex' })
    // Expected: Returns a 16-character string containing only hexadecimal characters.
    it('Specific Length (Hex character set - predefined name)', () => {
        const length = 16
        const characterSet = 'hex'
        const result = cryptoString({ length, characterSet })
        const expectedCharacterSet = Constants.HEX_CHARS

        expect(result).toBeTypeOf('string')
        expect(result.length).toBe(length)
        for (const char of result) {
            expect(expectedCharacterSet).toContain(char)
        }
    })

    // Custom Character Set with Special Characters and Length 1
    // Call: cryptoString({ length: 1, characterSet: '!@#$%^&*' })
    // Expected: Returns a 1-character string from the custom set.
    it('Custom Character Set with Special Characters and Length 1', () => {
        const length = 1
        const customCharacterSet = '!@#$%^&*'
        const result = cryptoString({ length, characterSet: customCharacterSet })

        expect(result).toBeTypeOf('string')
        expect(result.length).toBe(length)
        expect(customCharacterSet).toContain(result) // For length 1, can check directly
    })

    // Mixed Custom Character Set (Letters, Numbers, Symbols)
    // Call: cryptoString({ length: 15, characterSet: 'ABCabc123!@#' })
    // Expected: Returns a 15-character string containing only the specified mixed characters.
    it('Mixed Custom Character Set (Letters, Numbers, Symbols)', () => {
        const length = 15
        const customCharacterSet = 'ABCabc123!@#' // Mixed: uppercase, lowercase, digits, symbols
        const result = cryptoString({ length, characterSet: customCharacterSet })

        expect(result).toBeTypeOf('string')
        expect(result.length).toBe(length)
        for (const char of result) {
            expect(customCharacterSet).toContain(char)
        }
    })

    // Unicode Characters (Modern character support)
    // Call: cryptoString({ length: 10, characterSet: '🎲🎯🎨🎭✨' })
    // Expected: Returns a 10-character string containing only the specified Unicode characters.
    it('Unicode Characters (Modern character support)', () => {
        const length = 10
        const customCharacterSet = '🎲🎯🎨🎭✨' // 5 unique Unicode emoji characters
        const result = cryptoString({ length, characterSet: customCharacterSet })

        expect(result).toBeTypeOf('string')
        // Assert on Array.from(result).length to correctly count logical Unicode characters
        expect(Array.from(result).length).toBe(length)
        // Convert to array for proper Unicode handling in assertion
        const charSetArray = Array.from(customCharacterSet)
        for (const char of Array.from(result)) {
            // Ensure iteration is Unicode-aware
            expect(charSetArray).toContain(char)
        }
    })

    // Two-Character Custom Set (Minimum meaningful randomness)
    // Call: cryptoString({ length: 50, characterSet: 'AB' })
    // Expected: Returns a 50-character string containing only 'A' and 'B'
    it('Two-Character Custom Set (Minimum meaningful randomness)', () => {
        const length = 50
        const customCharacterSet = 'AB' // Minimum for meaningful randomness
        const result = cryptoString({ length, characterSet: customCharacterSet })

        expect(result).toBeTypeOf('string')
        expect(result.length).toBe(length)
        for (const char of result) {
            expect(customCharacterSet).toContain(char)
        }
        // Additional check: Should contain both characters in a 50-char string (very high probability)
        expect(result).toMatch(/A/)
        expect(result).toMatch(/B/)
    })
})
