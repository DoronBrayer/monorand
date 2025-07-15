// test.crypto-string.001-core.ts

/**
 * Shuffrand Test Suite - cryptoString: Core Functionality
 *
 * This file verifies the absolute fundamental functionality and expected behavior of `cryptoString`
 * under its default parameters and most basic usage scenarios.
 *
 * @author Doron Brayer <doronbrayer@outlook.com>
 * @license MIT
 */

import { describe, it, expect } from 'vitest'
// Import from the published package path, resolved by tsconfig.test.json paths
import { cryptoString } from 'shuffrand' // Updated import
import { Constants } from 'shuffrand/constants' // Updated import

// Define a top-level group for these tests
describe('cryptoString: Core Functionality', () => {
    // Default Parameters (Length 16, Alphanumeric)
    // Call: cryptoString()
    // Expected: Returns a 16-character string containing only alphanumeric characters.
    it('Default Parameters (Length 16, Alphanumeric)', () => {
        const result = cryptoString() // Call with no arguments to test default behavior
        const expectedLength = 16
        const expectedCharacterSet = Constants.ALPHANUMERIC_CHARS

        expect(result).toBeTypeOf('string')
        expect(result.length).toBe(expectedLength)
        // Verify all characters in the result are from the expected set
        for (const char of result) {
            expect(expectedCharacterSet).toContain(char)
        }
    })

    // Zero Length String
    // Call: cryptoString({ length: 0, characterSet: 'alpha' })
    // Expected: Returns an empty string.
    it('Zero Length String', () => {
        const length = 0
        const characterSet = 'alpha' // Any character set, should still return empty
        const result = cryptoString({ length, characterSet })

        expect(result).toBeTypeOf('string')
        expect(result.length).toBe(length) // Length should be 0
        expect(result).toBe('') // Should be an empty string
    })

    // Empty Object Parameter
    // Call: cryptoString({})
    // Expected: Returns a 16-character alphanumeric string (same as default)
    it('Empty Object Parameter', () => {
        const result = cryptoString({})
        const expectedLength = 16
        const expectedCharacterSet = Constants.ALPHANUMERIC_CHARS

        expect(result).toBeTypeOf('string')
        expect(result.length).toBe(expectedLength)
        for (const char of result) {
            expect(expectedCharacterSet).toContain(char)
        }
    })

    // Only Length Specified (Default character set)
    // Call: cryptoString({ length: 25 })
    // Expected: Returns a 25-character alphanumeric string
    it('Only Length Specified (Default character set)', () => {
        const length = 25
        const result = cryptoString({ length })
        const expectedCharacterSet = Constants.ALPHANUMERIC_CHARS

        expect(result).toBeTypeOf('string')
        expect(result.length).toBe(length)
        for (const char of result) {
            expect(expectedCharacterSet).toContain(char)
        }
    })

    // Only Character Set Specified (Default length)
    // Call: cryptoString({ characterSet: 'hex' })
    // Expected: Returns a 16-character hex string
    it('Only Character Set Specified (Default length)', () => {
        const characterSet = 'hex'
        const result = cryptoString({ characterSet })
        const expectedLength = 16
        const expectedCharacterSet = Constants.HEX_CHARS

        expect(result).toBeTypeOf('string')
        expect(result.length).toBe(expectedLength)
        for (const char of result) {
            expect(expectedCharacterSet).toContain(char)
        }
    })

    // NEW: Custom Character Set
    // Call: cryptoString({ length: 10, characterSet: '!@#$' })
    // Expected: Returns a 10-character string containing only !, @, #, or $.
    it('Custom Character Set', () => {
        const length = 10
        const customSet = '!@#$'
        const result = cryptoString({ length, characterSet: customSet })

        expect(result).toBeTypeOf('string')
        expect(result.length).toBe(length)
        for (const char of result) {
            expect(customSet).toContain(char)
        }
    })

    // NEW: Single Length String
    // Call: cryptoString({ length: 1, characterSet: 'alpha' })
    // Expected: Returns a 1-character string from the alpha set.
    it('Single Length String', () => {
        const length = 1
        const characterSet = 'alpha'
        const result = cryptoString({ length, characterSet })

        expect(result).toBeTypeOf('string')
        expect(result.length).toBe(length)
        // Corrected: Use Constants.LATIN_LETTERS instead of Constants.ALPHA_CHARS
        expect(Constants.LATIN_LETTERS).toContain(result) // Check if the single char is in alpha set
    })
})
