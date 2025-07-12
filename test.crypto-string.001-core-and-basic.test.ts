// test.crypto-string.001-core-and-basic.test.ts

/**
 * Shuffrand Test Suite - cryptoString: Core Functionality & Basic Parameters (CSTC001-CSTC021, excluding CSTC012)
 *
 * This file verifies the fundamental functionality and expected behavior of `cryptoString`
 * under various common and basic scenarios, adhering to `shuffrand`'s testing philosophy.
 * It covers different lengths, predefined character sets, and custom character sets,
 * including mixed and Unicode characters, and edge cases like zero and single-character lengths.
 * It also includes a basic statistical distribution check and tests for `calculateStringEntropy`.
 *
 * @author Doron Brayer <doronbrayer@outlook.com>
 * @license MIT
 */

// Essential Vitest imports
import { describe, it, expect } from 'vitest'
// Import library functions and constants from the compiled index.js
import { cryptoString, Constants, calculateStringEntropy } from './index.js'

// Define a top-level group for these tests
describe('cryptoString: Core Functionality & Basic Parameters', () => {
    // CSTC001: Default Parameters (Length 16, Alphanumeric)
    // Call: cryptoString()
    // Expected: Returns a 16-character string containing only alphanumeric characters.
    it('CSTC001: Default Parameters (Length 16, Alphanumeric)', () => {
        const testID = 'CSTC001'
        const result = cryptoString() // Call with no arguments to test default behavior
        const expectedLength = 16
        const expectedCharacterSet = Constants.ALPHANUMERIC_CHARS

        expect(result).toBeTypeOf('string')
        expect(result.length).toBe(expectedLength)
        // Verify all characters in the result are from the expected set
        for (const char of result) {
            expect(expectedCharacterSet).toContain(char)
        }
        console.log(`[${testID}] Passed: Default Parameters. Result: ${result}`)
    })

    // CSTC002: Specific Length (Numeric character set)
    // Call: cryptoString({ length: 10, characterSet: 'numeric' })
    // Expected: Returns a 10-character string containing only digits.
    it('CSTC002: Specific Length (Numeric character set)', () => {
        const testID = 'CSTC002'
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
        console.log(`[${testID}] Passed: Specific Length (Numeric). Result: ${result}`)
    })

    // CSTC003: Custom Character Set (Hexadecimal, specific length)
    // Call: cryptoString({ length: 8, characterSet: '0123456789ABCDEF' })
    // Expected: Returns an 8-character string containing only the specified custom hex characters.
    it('CSTC003: Custom Character Set (Hexadecimal, specific length)', () => {
        const testID = 'CSTC003'
        const length = 8
        const customCharacterSet = '0123456789ABCDEF' // Custom string
        const result = cryptoString({ length, characterSet: customCharacterSet })

        expect(result).toBeTypeOf('string')
        expect(result.length).toBe(length)
        // Verify all characters in the result are from the custom set
        for (const char of result) {
            expect(customCharacterSet).toContain(char)
        }
        console.log(`[${testID}] Passed: Custom Character Set (Hex). Result: ${result}`)
    })

    // CSTC004: Zero Length String
    // Call: cryptoString({ length: 0, characterSet: 'alpha' })
    // Expected: Returns an empty string.
    it('CSTC004: Zero Length String', () => {
        const testID = 'CSTC004'
        const length = 0
        const characterSet = 'alpha' // Any character set, should still return empty
        const result = cryptoString({ length, characterSet })

        expect(result).toBeTypeOf('string')
        expect(result.length).toBe(length) // Length should be 0
        expect(result).toBe('') // Should be an empty string
        console.log(`[${testID}] Passed: Zero Length String. Result: "${result}"`)
    })

    // CSTC005: Specific Length (Alpha character set)
    // Call: cryptoString({ length: 12, characterSet: 'alpha' })
    // Expected: Returns a 12-character string containing only Latin letters (uppercase/lowercase).
    it('CSTC005: Specific Length (Alpha character set)', () => {
        const testID = 'CSTC005'
        const length = 12
        const characterSet = 'alpha'
        const result = cryptoString({ length, characterSet })
        const expectedCharacterSet = Constants.LATIN_LETTERS

        expect(result).toBeTypeOf('string')
        expect(result.length).toBe(length)
        for (const char of result) {
            expect(expectedCharacterSet).toContain(char)
        }
        console.log(`[${testID}] Passed: Specific Length (Alpha). Result: ${result}`)
    })

    // CSTC006: Specific Length (Lowercase character set)
    // Call: cryptoString({ length: 7, characterSet: 'lowercase' })
    // Expected: Returns a 7-character string containing only lowercase Latin letters.
    it('CSTC006: Specific Length (Lowercase character set)', () => {
        const testID = 'CSTC006'
        const length = 7
        const characterSet = 'lowercase'
        const result = cryptoString({ length, characterSet })
        const expectedCharacterSet = Constants.LATIN_LOWERCASE_LETTERS

        expect(result).toBeTypeOf('string')
        expect(result.length).toBe(length)
        for (const char of result) {
            expect(expectedCharacterSet).toContain(char)
        }
        console.log(`[${testID}] Passed: Specific Length (Lowercase). Result: ${result}`)
    })

    // CSTC007: Specific Length (Uppercase character set)
    // Call: cryptoString({ length: 5, characterSet: 'uppercase' })
    // Expected: Returns a 5-character string containing only uppercase Latin letters.
    it('CSTC007: Specific Length (Uppercase character set)', () => {
        const testID = 'CSTC007'
        const length = 5
        const characterSet = 'uppercase'
        const result = cryptoString({ length, characterSet })
        const expectedCharacterSet = Constants.LATIN_UPPERCASE_LETTERS

        expect(result).toBeTypeOf('string')
        expect(result.length).toBe(length)
        for (const char of result) {
            expect(expectedCharacterSet).toContain(char)
        }
        console.log(`[${testID}] Passed: Specific Length (Uppercase). Result: ${result}`)
    })

    // CSTC008: Specific Length (Hex character set - predefined name)
    // Call: cryptoString({ length: 16, characterSet: 'hex' })
    // Expected: Returns a 16-character string containing only hexadecimal characters.
    it('CSTC008: Specific Length (Hex character set - predefined name)', () => {
        const testID = 'CSTC008'
        const length = 16
        const characterSet = 'hex'
        const result = cryptoString({ length, characterSet })
        const expectedCharacterSet = Constants.HEX_CHARS

        expect(result).toBeTypeOf('string')
        expect(result.length).toBe(length)
        for (const char of result) {
            expect(expectedCharacterSet).toContain(char)
        }
        console.log(`[${testID}] Passed: Specific Length (Hex). Result: ${result}`)
    })

    // CSTC009: Custom Character Set with Special Characters and Length 1
    // Call: cryptoString({ length: 1, characterSet: '!@#$%^&*' })
    // Expected: Returns a 1-character string from the custom set.
    it('CSTC009: Custom Character Set with Special Characters and Length 1', () => {
        const testID = 'CSTC009'
        const length = 1
        const customCharacterSet = '!@#$%^&*'
        const result = cryptoString({ length, characterSet: customCharacterSet })

        expect(result).toBeTypeOf('string')
        expect(result.length).toBe(length)
        expect(customCharacterSet).toContain(result) // For length 1, can check directly
        console.log(`[${testID}] Passed: Custom Character Set with Special Chars & Length 1. Result: "${result}"`)
    })

    // CSTC010: Mixed Custom Character Set (Letters, Numbers, Symbols)
    // Call: cryptoString({ length: 15, characterSet: 'ABCabc123!@#' })
    // Expected: Returns a 15-character string containing only the specified mixed characters.
    it('CSTC010: Mixed Custom Character Set (Letters, Numbers, Symbols)', () => {
        const testID = 'CSTC010'
        const length = 15
        const customCharacterSet = 'ABCabc123!@#' // Mixed: uppercase, lowercase, digits, symbols
        const result = cryptoString({ length, characterSet: customCharacterSet })

        expect(result).toBeTypeOf('string')
        expect(result.length).toBe(length)
        for (const char of result) {
            expect(customCharacterSet).toContain(char)
        }
        console.log(`[${testID}] Passed: Mixed Custom Character Set. Result: ${result}`)
    })

    // CSTC011: Larger Length (Stress test for basic functionality)
    // Call: cryptoString({ length: 100, characterSet: 'alphanumeric' })
    // Expected: Returns a 100-character alphanumeric string.
    it('CSTC011: Larger Length (Stress test for basic functionality)', () => {
        const testID = 'CSTC011'
        const length = 100
        const characterSet = 'alphanumeric'
        const result = cryptoString({ length, characterSet })
        const expectedCharacterSet = Constants.ALPHANUMERIC_CHARS

        expect(result).toBeTypeOf('string')
        expect(result.length).toBe(length)
        for (const char of result) {
            expect(expectedCharacterSet).toContain(char)
        }
        console.log(`[${testID}] Passed: Larger Length (100 chars). Result length: ${result.length}`)
    })

    // CSTC012: Single Character Custom Set (Edge case) - REMOVED as cryptoString now throws an error for < 2 unique chars.
    // This test case is no longer valid for "Core & Basic" as the function correctly prevents this input.

    // CSTC013: Unicode Characters (Modern character support)
    // Call: cryptoString({ length: 10, characterSet: '🎲🎯🎨🎭✨' })
    // Expected: Returns a 10-character string containing only the specified Unicode characters.
    it('CSTC013: Unicode Characters (Modern character support)', () => {
        const testID = 'CSTC013'
        const length = 10
        const customCharacterSet = '🎲🎯🎨🎭✨' // 5 unique Unicode emoji characters
        const result = cryptoString({ length, characterSet: customCharacterSet })

        expect(result).toBeTypeOf('string')
        // FIX: Assert on Array.from(result).length to correctly count logical Unicode characters
        expect(Array.from(result).length).toBe(length)
        // Convert to array for proper Unicode handling in assertion
        const charSetArray = Array.from(customCharacterSet)
        for (const char of Array.from(result)) {
            // Ensure iteration is Unicode-aware
            expect(charSetArray).toContain(char)
        }
        console.log(`[${testID}] Passed: Unicode Characters. Result: ${result}`)
    })

    // Additional Core Test Cases (CSTC014-CSTC019)
    // CSTC014: Empty Object Parameter
    // Call: cryptoString({})
    // Expected: Returns a 16-character alphanumeric string (same as default)
    it('CSTC014: Empty Object Parameter', () => {
        const testID = 'CSTC014'
        const result = cryptoString({})
        const expectedLength = 16
        const expectedCharacterSet = Constants.ALPHANUMERIC_CHARS

        expect(result).toBeTypeOf('string')
        expect(result.length).toBe(expectedLength)
        for (const char of result) {
            expect(expectedCharacterSet).toContain(char)
        }
        console.log(`[${testID}] Passed: Empty Object Parameter. Result: ${result}`)
    })

    // CSTC015: Only Length Specified (Default character set)
    // Call: cryptoString({ length: 25 })
    // Expected: Returns a 25-character alphanumeric string
    it('CSTC015: Only Length Specified (Default character set)', () => {
        const testID = 'CSTC015'
        const length = 25
        const result = cryptoString({ length })
        const expectedCharacterSet = Constants.ALPHANUMERIC_CHARS

        expect(result).toBeTypeOf('string')
        expect(result.length).toBe(length)
        for (const char of result) {
            expect(expectedCharacterSet).toContain(char)
        }
        console.log(`[${testID}] Passed: Only Length Specified. Result: ${result}`)
    })

    // CSTC016: Only Character Set Specified (Default length)
    // Call: cryptoString({ characterSet: 'hex' })
    // Expected: Returns a 16-character hex string
    it('CSTC016: Only Character Set Specified (Default length)', () => {
        const testID = 'CSTC016'
        const characterSet = 'hex'
        const result = cryptoString({ characterSet })
        const expectedLength = 16
        const expectedCharacterSet = Constants.HEX_CHARS

        expect(result).toBeTypeOf('string')
        expect(result.length).toBe(expectedLength)
        for (const char of result) {
            expect(expectedCharacterSet).toContain(char)
        }
        console.log(`[${testID}] Passed: Only Character Set Specified. Result: ${result}`)
    })

    // CSTC017: Two-Character Custom Set (Minimum meaningful randomness)
    // Call: cryptoString({ length: 50, characterSet: 'AB' })
    // Expected: Returns a 50-character string containing only 'A' and 'B'
    it('CSTC017: Two-Character Custom Set (Minimum meaningful randomness)', () => {
        const testID = 'CSTC017'
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
        console.log(`[${testID}] Passed: Two-Character Custom Set. Result: ${result}`)
    })

    // CSTC018: Distribution Test (Statistical basic check)
    // Call: cryptoString({ length: 1000, characterSet: 'AB' })
    // Expected: Both 'A' and 'B' should appear (not a rigorous statistical test, just sanity check)
    it('CSTC018: Distribution Test (Statistical basic check)', () => {
        const testID = 'CSTC018'
        const length = 1000
        const customCharacterSet = 'AB'
        const result = cryptoString({ length, characterSet: customCharacterSet })

        expect(result).toBeTypeOf('string')
        expect(result.length).toBe(length)

        const countA = (result.match(/A/g) || []).length
        const countB = (result.match(/B/g) || []).length

        // Basic sanity checks (not rigorous statistical tests)
        expect(countA + countB).toBe(length)
        expect(countA).toBeGreaterThan(0)
        expect(countB).toBeGreaterThan(0)
        // Very loose bounds - just ensuring both characters appear
        expect(countA).toBeGreaterThan(length * 0.1) // At least 10%
        expect(countB).toBeGreaterThan(length * 0.1) // At least 10%

        console.log(`[${testID}] Passed: Distribution Test. A: ${countA}, B: ${countB}`)
    })

    // CSTC019: Unicode Surrogate Pairs (Advanced Unicode support)
    // Call: cryptoString({ length: 8, characterSet: '😀😂😇😈' }) - Using simpler emojis
    // Expected: Returns an 8-character string with complex Unicode characters
    it('CSTC019: Unicode Surrogate Pairs (Advanced Unicode support)', () => {
        const testID = 'CSTC019'
        const length = 8
        // Using simpler, single-code-point emojis to avoid potential environment-specific ZWJ sequence issues
        const customCharacterSet = '😀😂😇😈' // Simpler, unique Unicode emoji characters
        const result = cryptoString({ length, characterSet: customCharacterSet })

        expect(result).toBeTypeOf('string')
        expect(Array.from(result).length).toBe(length) // Assert on logical length

        // Convert to array for proper Unicode handling
        const charSetArray = Array.from(customCharacterSet)

        for (const char of Array.from(result)) {
            // Ensure iteration is Unicode-aware
            expect(charSetArray).toContain(char)
        }
        console.log(`[${testID}] Passed: Unicode Surrogate Pairs. Result: ${result}`)
    })

    // CSTC020: calculateStringEntropy - Basic Alphanumeric
    // Call: calculateStringEntropy({ length: 32, characterSet: 'alphanumeric' })
    // Expected: Correct entropy for 32 alphanumeric characters
    it('CSTC020: calculateStringEntropy - Basic Alphanumeric', () => {
        const testID = 'CSTC020'
        const length = 32
        const characterSet = 'alphanumeric'
        const entropy = calculateStringEntropy({ length, characterSet })
        // log2(62) * 32 = ~5.954196310386801 * 32 = ~190.53428193237764
        expect(entropy).toBeCloseTo(190.53, 2)
        console.log(`[${testID}] Passed: Entropy Alphanumeric. Entropy: ${entropy.toFixed(2)} bits`)
    })

    // CSTC021: calculateStringEntropy - Custom Unicode Character Set
    // Call: calculateStringEntropy({ length: 10, characterSet: '�🎯🎨🎭✨' })
    // Expected: Correct entropy for 10 characters from a 5-char Unicode set
    it('CSTC021: calculateStringEntropy - Custom Unicode Character Set', () => {
        const testID = 'CSTC021'
        const length = 10
        const customCharacterSet = '🎲🎯🎨🎭✨' // 5 unique Unicode characters
        const entropy = calculateStringEntropy({ length, characterSet: customCharacterSet })
        // log2(5) * 10 = ~2.321928094887362 * 10 = ~23.21928094887362
        expect(entropy).toBeCloseTo(23.22, 2)
        console.log(`[${testID}] Passed: Entropy Unicode. Entropy: ${entropy.toFixed(2)} bits`)
    })
})
