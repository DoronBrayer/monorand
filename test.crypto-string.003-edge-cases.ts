// test.crypto-string.003-edge-cases.ts

/**
 * Shuffrand Test Suite - cryptoString: Edge Cases
 *
 * This file verifies the behavior of `cryptoString` under various edge cases,
 * including larger lengths and statistical distribution checks. It also includes
 * tests for `calculateStringEntropy`.
 *
 * @author Doron Brayer <doronbrayer@outlook.com>
 * @license MIT
 */

import { describe, it, expect } from 'vitest'
// Import library functions and constants from the published package path, resolved by tsconfig.test.json paths
import { cryptoString, calculateStringEntropy } from 'shuffrand' // Updated import
import { Constants } from 'shuffrand/constants' // Updated import

// Define a top-level group for these tests
describe('cryptoString: Edge Cases', () => {
    // Larger Length (Stress test for basic functionality)
    // Call: cryptoString({ length: 100, characterSet: 'alphanumeric' })
    // Expected: Returns a 100-character alphanumeric string.
    it('Larger Length (Stress test for basic functionality)', () => {
        const length = 100
        const characterSet = 'alphanumeric'
        const result = cryptoString({ length, characterSet })
        const expectedCharacterSet = Constants.ALPHANUMERIC_CHARS

        expect(result).toBeTypeOf('string')
        expect(result.length).toBe(length)
        for (const char of result) {
            expect(expectedCharacterSet).toContain(char)
        }
    })

    // Distribution Test (Statistical basic check)
    // Call: cryptoString({ length: 1000, characterSet: 'AB' })
    // Expected: Both 'A' and 'B' should appear (not a rigorous statistical test, just sanity check)
    it('Distribution Test (Statistical basic check)', () => {
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
    })

    // Unicode Surrogate Pairs (Advanced Unicode support)
    // Call: cryptoString({ length: 8, characterSet: '😀😂😇😈' }) - Using simpler emojis
    // Expected: Returns an 8-character string with complex Unicode characters
    it('Unicode Surrogate Pairs (Advanced Unicode support)', () => {
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
    })

    // calculateStringEntropy - Basic Alphanumeric
    // Call: calculateStringEntropy({ length: 32, characterSet: 'alphanumeric' })
    // Expected: Correct entropy for 32 alphanumeric characters
    it('calculateStringEntropy - Basic Alphanumeric', () => {
        const length = 32
        const characterSet = 'alphanumeric'
        const entropy = calculateStringEntropy({ length, characterSet })
        // log2(62) * 32 = ~5.954196310386801 * 32 = ~190.53428193237764
        expect(entropy).toBeCloseTo(190.53, 2)
    })

    // calculateStringEntropy - Custom Unicode Character Set
    // Call: calculateStringEntropy({ length: 10, characterSet: '�🎯🎨🎭✨' })
    // Expected: Correct entropy for 10 characters from a 5-char Unicode set
    it('calculateStringEntropy - Custom Unicode Character Set', () => {
        const length = 10
        const customCharacterSet = '🎲🎯🎨🎭✨' // 5 unique Unicode characters
        const entropy = calculateStringEntropy({ length, characterSet: customCharacterSet })
        // log2(5) * 10 = ~2.321928094887362 * 10 = ~23.21928094887362
        expect(entropy).toBeCloseTo(23.22, 2)
    })

    // calculateStringEntropy - Very Large Length
    it('calculateStringEntropy - Very Large Length', () => {
        const length = 10000 // A very large length
        const characterSet = 'alphanumeric'
        const entropy = calculateStringEntropy({ length, characterSet })
        // log2(62) * 10000 = ~5.954196310386801 * 10000 = ~59541.9631
        expect(entropy).toBeCloseTo(59541.96, 2)
    })

    // NEW: cryptoString with a very large length (e.g., 5000 characters)
    it('cryptoString with a very large length (5000 characters)', () => {
        const length = 5000
        const characterSet = 'alphanumeric'
        const result = cryptoString({ length, characterSet })
        const expectedCharacterSet = Constants.ALPHANUMERIC_CHARS

        expect(result).toBeTypeOf('string')
        expect(result.length).toBe(length)
        for (const char of result) {
            expect(expectedCharacterSet).toContain(char)
        }
    })

    // NEW: calculateStringEntropy with a single-character set (should throw TypeError)
    it('calculateStringEntropy with a single-character set (should throw TypeError)', () => {
        const length = 10 // Length doesn't matter for 1-char set entropy
        const characterSet = 'A' // Single character
        // Expect a TypeError as per the function's validation logic
        expect(() => calculateStringEntropy({ length, characterSet })).toThrow(TypeError)
        expect(() => calculateStringEntropy({ length, characterSet })).toThrow(
            /Invalid calculateStringEntropy parameters: Character set must contain at least 2 unique characters to calculate meaningful entropy\./
        )
    })
})
