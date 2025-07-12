// test.crypto-random.001-core-and-basic.test.ts

/**
 * Shuffrand Test Suite - cryptoRandom: Core Functionality & Basic Parameters (CRTC01-CRTC10)
 *
 * This file validates the fundamental behavior of `cryptoRandom` with default parameters
 * and basic single-parameter inputs, ensuring the core functionality is robust.
 * It uses the Vitest framework for hierarchical grouping (`describe`), individual tests (`it`),
 * and assertions (`expect`).
 *
 * @author Doron Brayer <doronbrayer@outlook.com>
 * @license MIT
 */

import { describe, it, expect } from 'vitest'
import { cryptoRandom } from './index.js' // Imports from the compiled index.js in dist/

// Define a top-level group for these tests using Vitest's describe
describe('cryptoRandom: Core Functionality & Basic Parameters', () => {
    // CRTC01: Default Parameters (Integer)
    // Call: cryptoRandom() (which maps to cryptoRandom({}) due to default params)
    // Expected: Integer in [0, 2].
    it('CRTC01: Default Parameters (Integer)', () => {
        const testID = 'CRTC01'
        const result = cryptoRandom() // Call with no arguments to test default behavior
        expect(result).toBeTypeOf('number')
        expect(Number.isInteger(result)).toBe(true)
        expect(result).toBeGreaterThanOrEqual(0)
        expect(result).toBeLessThanOrEqual(2)
        console.log(`[${testID}] Passed: Default Parameters (Integer). Result: ${result}`)
    })

    // CRTC02: Single Parameter: lowerBound (Integer)
    // Call: cryptoRandom({ lowerBound: -1 })
    // Expected: Integer in [-1, 2].
    it('CRTC02: Single Parameter: lowerBound (Integer)', () => {
        const testID = 'CRTC02'
        const result = cryptoRandom({ lowerBound: -1 })
        expect(result).toBeTypeOf('number')
        expect(Number.isInteger(result)).toBe(true)
        expect(result).toBeGreaterThanOrEqual(-1)
        expect(result).toBeLessThanOrEqual(2)
        console.log(`[${testID}] Passed: Single Parameter: lowerBound (Integer). Result: ${result}`)
    })

    // CRTC03: Single Parameter: upperBound (Integer)
    // Call: cryptoRandom({ upperBound: 3 })
    // Expected: Integer in [0, 3].
    it('CRTC03: Single Parameter: upperBound (Integer)', () => {
        const testID = 'CRTC03'
        const result = cryptoRandom({ upperBound: 3 })
        expect(result).toBeTypeOf('number')
        expect(Number.isInteger(result)).toBe(true)
        expect(result).toBeGreaterThanOrEqual(0)
        expect(result).toBeLessThanOrEqual(3)
        console.log(`[${testID}] Passed: Single Parameter: upperBound (Integer). Result: ${result}`)
    })

    // CRTC04: Single Parameter: typeOfNum (Double)
    // Call: cryptoRandom({ typeOfNum: 'double' })
    // Expected: Double in [0.000, 2.000] with ≤3 fractional digits (assuming default maxFracDigits is 3 and upperBound is 2).
    it('CRTC04: Single Parameter: typeOfNum (Double)', () => {
        const testID = 'CRTC04'
        const result = cryptoRandom({ typeOfNum: 'double' })
        expect(result).toBeTypeOf('number')
        expect(result).toBeGreaterThanOrEqual(0.0)
        expect(result).toBeLessThanOrEqual(2.0) // Default upperBound is 2
        const fractionalDigits = (result.toString().split('.')[1] || '').length
        expect(fractionalDigits).toBeLessThanOrEqual(3) // Default maxFracDigits is 3
        console.log(`[${testID}] Passed: Single Parameter: typeOfNum (Double). Result: ${result}`)
    })

    // CRTC05: Single Parameter: maxFracDigits (Double)
    // Call: cryptoRandom({ maxFracDigits: 5 })
    // Expected: Double in [0.00000, 2.00000] with ≤5 fractional digits (assuming default bounds apply).
    it('CRTC05: Single Parameter: maxFracDigits (Double)', () => {
        const testID = 'CRTC05'
        // Test with explicit double type and bounds to ensure maxFracDigits is applied correctly
        const result = cryptoRandom({ typeOfNum: 'double', maxFracDigits: 5, lowerBound: 0, upperBound: 2 })
        expect(result).toBeTypeOf('number')
        expect(result).toBeGreaterThanOrEqual(0.0)
        expect(result).toBeLessThanOrEqual(2.0)
        const fractionalDigits = (result.toString().split('.')[1] || '').length
        expect(fractionalDigits).toBeLessThanOrEqual(5)
        console.log(`[${testID}] Passed: Single Parameter: maxFracDigits (Double). Result: ${result}`)
    })

    // CRTC06: Single Parameter: exclusion (Integer - 'both')
    // Call: cryptoRandom({ exclusion: 'both' })
    // Expected: Integer in [0, 2], i.e., 1. (assuming default bounds of [0, 2] apply).
    it("CRTC06: Single Parameter: exclusion (Integer - 'both')", () => {
        const testID = 'CRTC06'
        const result = cryptoRandom({ exclusion: 'both' })
        expect(result).toBeTypeOf('number')
        expect(Number.isInteger(result)).toBe(true)
        expect(result).toBe(1) // Only 1 is expected in [0, 2] with 'both' exclusion
        console.log(`[${testID}] Passed: Single Parameter: exclusion (Integer - 'both'). Result: ${result}`)
    })

    // CRTC07: Integer Generation: No Exclusion
    // Call: cryptoRandom({ lowerBound: 10, upperBound: 20, typeOfNum: "integer", exclusion: "none" })
    // Expected: Integer in [10, 20].
    it('CRTC07: Integer Generation: No Exclusion', () => {
        const testID = 'CRTC07'
        const lower = 10
        const upper = 20
        const result = cryptoRandom({ lowerBound: lower, upperBound: upper, typeOfNum: 'integer', exclusion: 'none' })
        expect(result).toBeTypeOf('number')
        expect(Number.isInteger(result)).toBe(true)
        expect(result).toBeGreaterThanOrEqual(lower)
        expect(result).toBeLessThanOrEqual(upper)
        console.log(`[${testID}] Passed: Integer Generation: No Exclusion. Result: ${result}`)
    })

    // CRTC08: Integer Generation: No Exclusion (Narrow Range)
    // Call: cryptoRandom({ lowerBound: 11, upperBound: 13, typeOfNum: 'integer', exclusion: 'none' })
    // Expected: Integer in [11, 13].
    it('CRTC08: Integer Generation: No Exclusion (Narrow Range)', () => {
        const testID = 'CRTC08'
        const lower = 11
        const upper = 13
        const result = cryptoRandom({ lowerBound: lower, upperBound: upper, typeOfNum: 'integer', exclusion: 'none' })
        expect(result).toBeTypeOf('number')
        expect(Number.isInteger(result)).toBe(true)
        expect(result).toBeGreaterThanOrEqual(lower)
        expect(result).toBeLessThanOrEqual(upper)
        console.log(`[${testID}] Passed: Integer Generation: No Exclusion (Narrow Range). Result: ${result}`)
    })

    // CRTC09: Double Generation: No Exclusion (Specific Frac Digits)
    // Call: cryptoRandom({ lowerBound: 1.5, upperBound: 5.5, typeOfNum: "double", maxFracDigits: 2, exclusion: "none" })
    // Expected: Double in [1.50, 5.50] with ≤2 fractional digits.
    it('CRTC09: Double Generation: No Exclusion (Specific Frac Digits)', () => {
        const testID = 'CRTC09'
        const lower = 1.5
        const upper = 5.5
        const fracDigits = 2
        const result = cryptoRandom({
            lowerBound: lower,
            upperBound: upper,
            typeOfNum: 'double',
            maxFracDigits: fracDigits,
            exclusion: 'none',
        })
        expect(result).toBeTypeOf('number')
        expect(result).toBeGreaterThanOrEqual(lower)
        expect(result).toBeLessThanOrEqual(upper)
        const fractionalDigits = (result.toString().split('.')[1] || '').length
        expect(fractionalDigits).toBeLessThanOrEqual(fracDigits)
        console.log(`[${testID}] Passed: Double Generation: No Exclusion (Specific Frac Digits). Result: ${result}`)
    })

    // CRTC10: Double Generation: No Exclusion (Narrow Range)
    // Call: cryptoRandom({ lowerBound: 0.11, upperBound: 0.13, typeOfNum: 'double', maxFracDigits: 2, exclusion: 'none' })
    // Expected: Double in [0.11, 0.13] with ≤2 fractional digits.
    it('CRTC10: Double Generation: No Exclusion (Narrow Range)', () => {
        const testID = 'CRTC10'
        const lower = 0.11
        const upper = 0.13
        const fracDigits = 2
        const result = cryptoRandom({
            lowerBound: lower,
            upperBound: upper,
            typeOfNum: 'double',
            maxFracDigits: fracDigits,
            exclusion: 'none',
        })
        expect(result).toBeTypeOf('number')
        expect(result).toBeGreaterThanOrEqual(lower)
        expect(result).toBeLessThanOrEqual(upper)
        const fractionalDigits = (result.toString().split('.')[1] || '').length
        expect(fractionalDigits).toBeLessThanOrEqual(fracDigits)
        console.log(`[${testID}] Passed: Double Generation: No Exclusion (Narrow Range). Result: ${result}`)
    })
})
