// test.crypto-random.004-error-handling.test.ts

/**
 * Shuffrand Test Suite - cryptoRandom: Error Handling (CRTC27, CRTC34, CRTC37-CRTC48, CRTC49-CRTC53)
 *
 * This file specifically verifies `cryptoRandom`'s robust error handling, ensuring that
 * invalid inputs or impossible generation scenarios correctly throw `TypeError` or `Error` exceptions.
 * It includes tests CRTC27 and CRTC34, which were moved from edge-cases as they correctly
 * trigger validation errors.
 *
 * @author Doron Brayer <doronbrayer@outlook.com>
 * @license MIT
 */

import { describe, it, expect } from 'vitest'
import { cryptoRandom } from './index.js' // Imports from the compiled index.js in dist/
import { Constants } from './src.constants.js' // Added import for Constants

// Define a top-level group for these tests using Vitest's describe
describe('cryptoRandom: Error Handling', () => {
    // CRTC27: Decimal Bounds for Integer Type (now expecting error)
    it('CRTC27: Should throw TypeError for empty integer range from decimal bounds', () => {
        const testID = 'CRTC27'
        expect(() => {
            cryptoRandom({ lowerBound: 2.4, upperBound: 2.6, typeOfNum: 'integer', exclusion: 'none' })
        }).toThrow(TypeError)
        expect(() => {
            cryptoRandom({ lowerBound: 2.4, upperBound: 2.6, typeOfNum: 'integer', exclusion: 'none' })
        }).toThrow(
            "Invalid integer range after exclusions: the original range of [2.4–2.6] with exclusion 'none' results in an empty integer range."
        )
        console.log(`[${testID}] Passed: Throws TypeError for empty integer range from decimal bounds.`)
    })

    // CRTC34: Max Fractional Digits: Ultra-High (26)
    it('CRTC34: Should throw TypeError for maxFracDigits > 15 (custom message)', () => {
        const testID = 'CRTC34'
        expect(() => {
            cryptoRandom({ typeOfNum: 'double', maxFracDigits: 26, lowerBound: 0, upperBound: 1 })
        }).toThrow(TypeError)
        expect(() => {
            cryptoRandom({ typeOfNum: 'double', maxFracDigits: 26, lowerBound: 0, upperBound: 1 })
        }).toThrow(
            `maxFracDigits (currently 26) must be an integer between ${Constants.MIN_FRACTIONAL_DIGITS} and ${Constants.MAX_FRACTIONAL_DIGITS} (inclusive) to ensure reliable precision.`
        )
        console.log(`[${testID}] Passed: Throws TypeError for maxFracDigits > 15 (custom message).`)
    })

    // CRTC37: Invalid Bounds Type (String) - Now caught by ArkType
    it('CRTC37: Should throw TypeError for invalid lowerBound type (string) (ArkType message)', () => {
        const testID = 'CRTC37'
        let thrownError: any
        try {
            cryptoRandom({
                lowerBound: 'a' as any, // Retaining 'as any' here as it's a direct type mismatch test
                upperBound: 5,
                typeOfNum: 'integer',
                exclusion: 'none',
            })
        } catch (e) {
            thrownError = e
        }
        expect(thrownError.name).toBe('TraversalError')
        expect(thrownError.message).toMatch(/lowerBound must be a number \(was (?:a string|"a")\)/)
        console.log(`[${testID}] Passed: Throws TypeError for invalid lowerBound type (string) (ArkType message).`)
    })

    // CRTC38: Invalid Lower Bound (Negative Infinity) - Now caught by ArkType
    it('CRTC38: Should throw TypeError for negative infinity lowerBound (ArkType message)', () => {
        const testID = 'CRTC38'
        let thrownError: any
        try {
            cryptoRandom({ lowerBound: Number.NEGATIVE_INFINITY })
        } catch (e) {
            thrownError = e
        }
        expect(thrownError.name).toBe('TraversalError')
        expect(thrownError.message).toMatch(
            new RegExp(`lowerBound must be at least ${Constants.MIN_SAFE_INT} \\(was -Infinity\\)`)
        )
        console.log(`[${testID}] Passed: Throws TypeError for negative infinity lowerBound (ArkType message).`)
    })

    // CRTC39: Invalid Upper Bound (NaN) - Now caught by ArkType
    it('CRTC39: Should throw TypeError for NaN upperBound (ArkType message)', () => {
        const testID = 'CRTC39'
        let thrownError: any
        try {
            cryptoRandom({ upperBound: NaN })
        } catch (e) {
            thrownError = e
        }
        expect(thrownError.name).toBe('TraversalError')
        expect(thrownError.message).toMatch(/upperBound must be a number \(was NaN\)/)
        console.log(`[${testID}] Passed: Throws TypeError for NaN upperBound (ArkType message).`)
    })

    // CRTC40: Invalid exclusion String (Silly Arg)
    it('CRTC40: Should throw TraversalError for invalid exclusion string', () => {
        const testID = 'CRTC40'
        let thrownError: any
        try {
            cryptoRandom({
                exclusion: '_____________' as any, // Retaining 'as any' here for direct type mismatch
            })
        } catch (e) {
            thrownError = e
        }
        expect(thrownError.name).toBe('TraversalError')
        expect(thrownError.message).toMatch(
            /exclusion must be "both", "lower bound", "none" or "upper bound" \(was "_____________"\)/
        ) // ArkType's error message
        console.log(`[${testID}] Passed: Throws TraversalError for invalid exclusion string.`)
    })

    // CRTC41: Invalid typeOfNum String (Silly Arg)
    it('CRTC41: Should throw TraversalError for invalid typeOfNum string', () => {
        const testID = 'CRTC41'
        let thrownError: any
        try {
            cryptoRandom({
                typeOfNum: '_____________' as any, // Retaining 'as any' here for direct type mismatch
            })
        } catch (e) {
            thrownError = e
        }
        expect(thrownError.name).toBe('TraversalError')
        expect(thrownError.message).toMatch(/typeOfNum must be "double" or "integer" \(was "_____________"\)/) // ArkType's error message
        console.log(`[${testID}] Passed: Throws TraversalError for invalid typeOfNum string.`)
    })

    // CRTC42: Impossible Integer Exclusion (Range 5-6, Exclude Both)
    it('CRTC42: Should throw TypeError for impossible integer exclusion (range 5-6, both)', () => {
        const testID = 'CRTC42'
        expect(() => cryptoRandom({ lowerBound: 5, upperBound: 6, typeOfNum: 'integer', exclusion: 'both' })).toThrow(
            TypeError
        )
        expect(() => {
            cryptoRandom({ lowerBound: 5, upperBound: 6, typeOfNum: 'integer', exclusion: 'both' })
        }).toThrow(
            "Invalid integer range after exclusions: the original range of [5–6] with exclusion 'both' results in an empty integer range."
        )
        console.log(`[${testID}] Passed: Throws TypeError for impossible integer exclusion (range 5-6, both).`)
    })

    // CRTC43: Impossible Integer Exclusion (Range 1-2, Exclude Both)
    it('CRTC43: Should throw TypeError for impossible integer exclusion (range 1-2, both)', () => {
        const testID = 'CRTC43'
        expect(() => cryptoRandom({ lowerBound: 1, upperBound: 2, typeOfNum: 'integer', exclusion: 'both' })).toThrow(
            TypeError
        )
        expect(() => {
            cryptoRandom({ lowerBound: 1, upperBound: 2, typeOfNum: 'integer', exclusion: 'both' })
        }).toThrow(
            "Invalid integer range after exclusions: the original range of [1–2] with exclusion 'both' results in an empty integer range."
        )
        console.log(`[${testID}] Passed: Throws TypeError for impossible integer exclusion (range 1-2, both).`)
    })

    // CRTC44: Impossible Integer Exclusion (Range 11-12, Exclude Both)
    it('CRTC44: Should throw TypeError for impossible integer exclusion (range 11-12, both)', () => {
        const testID = 'CRTC44'
        expect(() => cryptoRandom({ lowerBound: 11, upperBound: 12, typeOfNum: 'integer', exclusion: 'both' })).toThrow(
            TypeError
        )
        expect(() => {
            cryptoRandom({ lowerBound: 11, upperBound: 12, typeOfNum: 'integer', exclusion: 'both' })
        }).toThrow(
            "Invalid integer range after exclusions: the original range of [11–12] with exclusion 'both' results in an empty integer range."
        )
        console.log(`[${testID}] Passed: Throws TypeError for impossible integer exclusion (range 11-12, both).`)
    })

    // CRTC45: lowerBound equals upperBound for double with both exclusion
    it('CRTC45: Should throw TypeError for invalid double range with both exclusion (lower == upper)', () => {
        const testID = 'CRTC45'
        expect(() =>
            cryptoRandom({ lowerBound: 1.5, upperBound: 1.5, typeOfNum: 'double', exclusion: 'both' })
        ).toThrow(TypeError)
        expect(() =>
            cryptoRandom({ lowerBound: 1.5, upperBound: 1.5, typeOfNum: 'double', exclusion: 'both' })
        ).toThrow(/Invalid range for double with 'both' exclusion: lowerBound \(1.5\) equals upperBound \(1.5\)\./)
        console.log(
            `[${testID}] Passed: Throws TypeError for invalid double range with both exclusion (lower == upper).`
        )
    })

    // CRTC46: lowerBound undefined (falsey) - ArkType should catch this
    it('CRTC46: Should throw TraversalError when lowerBound is undefined (via ArkType)', () => {
        const testID = 'CRTC46'
        let thrownError: any
        try {
            cryptoRandom({ lowerBound: undefined as any, upperBound: 5, typeOfNum: 'integer' }) // Retaining 'as any' for direct type mismatch
        } catch (e) {
            thrownError = e
        }
        expect(thrownError.name).toBe('TraversalError')
        expect(thrownError.message).toMatch(/lowerBound must be a number \(was undefined\)/)
        console.log(`[${testID}] Passed: Throws TraversalError when lowerBound is undefined.`)
    })

    // CRTC47: upperBound undefined (falsey) - ArkType should catch this
    it('CRTC47: Should throw TraversalError when upperBound is undefined (via ArkType)', () => {
        const testID = 'CRTC47'
        let thrownError: any
        try {
            cryptoRandom({ lowerBound: 0, upperBound: undefined as any, typeOfNum: 'integer' }) // Retaining 'as any' for direct type mismatch
        } catch (e) {
            thrownError = e
        }
        expect(thrownError.name).toBe('TraversalError')
        expect(thrownError.message).toMatch(/upperBound must be a number \(was undefined\)/)
        console.log(`[${testID}] Passed: Throws TraversalError when upperBound is undefined.`)
    })

    // CRTC48: maxFracDigits negative
    it('CRTC48: Should throw TypeError for negative maxFracDigits (custom message)', () => {
        const testID = 'CRTC48'
        let thrownError: any
        try {
            cryptoRandom({ typeOfNum: 'double', maxFracDigits: -1 as any }) // Retaining 'as any' for direct type mismatch
        } catch (e) {
            thrownError = e
        }
        expect(() => cryptoRandom({ typeOfNum: 'double', maxFracDigits: -1 })).toThrow(TypeError)
        expect(() => cryptoRandom({ typeOfNum: 'double', maxFracDigits: -1 })).toThrow(
            `maxFracDigits (currently -1) must be an integer between ${Constants.MIN_FRACTIONAL_DIGITS} and ${Constants.MAX_FRACTIONAL_DIGITS} (inclusive) to ensure reliable precision.`
        )
        console.log(`[${testID}] Passed: Throws TypeError for negative maxFracDigits (custom message).`)
    })

    // --- NEW TEST CASES FOR SAFE NUMERICAL BOUNDS VALIDATION (CRTC49-CRTC53) - Now caught by ArkType ---

    // CRTC49: lowerBound outside MAX_SAFE_INTEGER
    it('CRTC49: Should throw TypeError for lowerBound exceeding MAX_SAFE_INTEGER (ArkType message)', () => {
        const testID = 'CRTC49'
        const largeNum = Number.MAX_SAFE_INTEGER + 1
        let thrownError: any
        try {
            cryptoRandom({ lowerBound: largeNum, upperBound: largeNum + 10 })
        } catch (e) {
            thrownError = e
        }
        expect(thrownError.name).toBe('TraversalError')
        expect(thrownError.message).toMatch(
            new RegExp(`upperBound must be at most ${Constants.MAX_SAFE_INT} \\(was ${largeNum + 10}\\)`)
        )
        console.log(`[${testID}] Passed: Throws TypeError for lowerBound exceeding MAX_SAFE_INTEGER (ArkType message).`)
    })

    // CRTC50: upperBound outside MIN_SAFE_INTEGER
    it('CRTC50: Should throw TypeError for upperBound falling below MIN_SAFE_INTEGER (ArkType message)', () => {
        const testID = 'CRTC50'
        const smallNum = Number.MIN_SAFE_INTEGER - 1
        let thrownError: any
        try {
            cryptoRandom({ lowerBound: smallNum - 10, upperBound: smallNum })
        } catch (e) {
            thrownError = e
        }
        expect(thrownError.name).toBe('TraversalError')
        expect(thrownError.message).toMatch(
            new RegExp(`lowerBound must be at least ${Constants.MIN_SAFE_INT} \\(was ${smallNum - 10}\\)`)
        )
        console.log(
            `[${testID}] Passed: Throws TypeError for upperBound falling below MIN_SAFE_INTEGER (ArkType message).`
        )
    })

    // CRTC51: Both bounds outside safe range (one non-finite, one out-of-safe) - Now caught by ArkType
    it('CRTC51: Should throw TypeError for both bounds being problematic (mixed, ArkType message)', () => {
        const testID = 'CRTC51'
        const largeNum = Number.MAX_SAFE_INTEGER + 100
        let thrownError: any
        try {
            cryptoRandom({ lowerBound: Number.NEGATIVE_INFINITY, upperBound: largeNum })
        } catch (e) {
            thrownError = e
        }
        expect(thrownError.name).toBe('TraversalError')
        expect(thrownError.message).toMatch(
            new RegExp(`lowerBound must be at least ${Constants.MIN_SAFE_INT} \\(was -Infinity\\)`)
        ) // ArkType catches the first error, which is lowerBound
        console.log(`[${testID}] Passed: Throws TypeError for both bounds being problematic (mixed, ArkType message).`)
    })

    // CRTC52: Both bounds non-finite - Now caught by ArkType
    it('CRTC52: Should throw TypeError for both bounds being non-finite (ArkType message)', () => {
        const testID = 'CRTC52'
        let thrownError: any
        try {
            cryptoRandom({ lowerBound: Infinity, upperBound: NaN })
        } catch (e) {
            thrownError = e
        }
        expect(thrownError.name).toBe('TraversalError')
        // FIX: Adjusted to expect the error for upperBound (NaN) as ArkType's schema for 'number?' will catch NaN first.
        expect(thrownError.message).toMatch(/upperBound must be a number \(was NaN\)/)
        console.log(`[${testID}] Passed: Throws TypeError for both bounds being non-finite (ArkType message).`)
    })

    // CRTC53: lowerBound finite but outside safe range, upperBound finite but outside safe range - Now caught by ArkType
    it('CRTC53: Should throw TypeError for both bounds being finite but outside safe range (ArkType message)', () => {
        const testID = 'CRTC53'
        const lower = Number.MIN_SAFE_INTEGER - 5
        const upper = Number.MAX_SAFE_INTEGER + 5
        let thrownError: any
        try {
            cryptoRandom({ lowerBound: lower, upperBound: upper })
        } catch (e) {
            thrownError = e
        }
        expect(thrownError.name).toBe('TraversalError')
        expect(thrownError.message).toMatch(
            new RegExp(`lowerBound must be at least ${Constants.MIN_SAFE_INT} \\(was ${lower}\\)`)
        ) // ArkType catches the first error, which is lowerBound
        console.log(
            `[${testID}] Passed: Throws TypeError for both bounds being finite but outside safe range (ArkType message).`
        )
    })

    // --- END NEW TEST CASES ---
})
