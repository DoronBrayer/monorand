// test.crypto-random.002-exclusion-logic.test.ts

/**
 * Shuffrand Test Suite - cryptoRandom: Exclusion Logic (CRTC11-CRTC19)
 *
 * This file rigorously tests `cryptoRandom`'s precise boundary exclusion capabilities
 * for both integer and double generation, ensuring statistical correctness.
 * It uses the Vitest framework for hierarchical grouping (`describe`), individual tests (`it`),
 * and assertions (`expect`).
 *
 * @author Doron Brayer <doronbrayer@outlook.com>
 * @license MIT
 */

import { describe, it, expect } from 'vitest'
import { cryptoRandom } from './index.js' // Imports from the compiled index.js in dist/

// Define a top-level group for these tests using Vitest's describe
describe('cryptoRandom: Exclusion Logic', () => {
    // CRTC11: Integer Generation: Exclude Lower Bound
    it('CRTC11: Integer Generation: Exclude Lower Bound', () => {
        const testID = 'CRTC11'
        const lower = 10
        const upper = 20
        const result = cryptoRandom({
            lowerBound: lower,
            upperBound: upper,
            typeOfNum: 'integer',
            exclusion: 'lower bound',
        })
        expect(result).toBeTypeOf('number')
        expect(Number.isInteger(result)).toBe(true)
        expect(result).toBeGreaterThanOrEqual(lower + 1) // Should be >= 11
        expect(result).toBeLessThanOrEqual(upper) // Should be <= 20
        console.log(`[${testID}] Passed: Integer Generation: Exclude Lower Bound. Result: ${result}`)
    })

    // CRTC12: Integer Generation: Exclude Lower Bound (Narrow Range)
    it('CRTC12: Integer Generation: Exclude Lower Bound (Narrow Range)', () => {
        const testID = 'CRTC12'
        const lower = 11
        const upper = 13
        const result = cryptoRandom({
            lowerBound: lower,
            upperBound: upper,
            typeOfNum: 'integer',
            exclusion: 'lower bound',
        })
        expect(result).toBeTypeOf('number')
        expect(Number.isInteger(result)).toBe(true)
        expect(result).toBeGreaterThanOrEqual(lower + 1) // Should be >= 12
        expect(result).toBeLessThanOrEqual(upper) // Should be <= 13
        console.log(`[${testID}] Passed: Integer Generation: Exclude Lower Bound (Narrow Range). Result: ${result}`)
    })

    // CRTC13: Integer Generation: Exclude Upper Bound
    it('CRTC13: Integer Generation: Exclude Upper Bound', () => {
        const testID = 'CRTC13'
        const lower = 10
        const upper = 20
        const result = cryptoRandom({
            lowerBound: lower,
            upperBound: upper,
            typeOfNum: 'integer',
            exclusion: 'upper bound',
        })
        expect(result).toBeTypeOf('number')
        expect(Number.isInteger(result)).toBe(true)
        expect(result).toBeGreaterThanOrEqual(lower) // Should be >= 10
        expect(result).toBeLessThanOrEqual(upper - 1) // Should be <= 19
        console.log(`[${testID}] Passed: Integer Generation: Exclude Upper Bound. Result: ${result}`)
    })

    // CRTC14: Integer Generation: Exclude Upper Bound (Narrow Range)
    it('CRTC14: Integer Generation: Exclude Upper Bound (Narrow Range)', () => {
        const testID = 'CRTC14'
        const lower = 11
        const upper = 13
        const result = cryptoRandom({
            lowerBound: lower,
            upperBound: upper,
            typeOfNum: 'integer',
            exclusion: 'upper bound',
        })
        expect(result).toBeTypeOf('number')
        expect(Number.isInteger(result)).toBe(true)
        expect(result).toBeGreaterThanOrEqual(lower) // Should be >= 11
        expect(result).toBeLessThanOrEqual(upper - 1) // Should be <= 12
        console.log(`[${testID}] Passed: Integer Generation: Exclude Upper Bound (Narrow Range). Result: ${result}`)
    })

    // CRTC15: Integer Generation: Exclude Both Bounds
    it('CRTC15: Integer Generation: Exclude Both Bounds', () => {
        const testID = 'CRTC15'
        const lower = 10
        const upper = 20
        const result = cryptoRandom({ lowerBound: lower, upperBound: upper, typeOfNum: 'integer', exclusion: 'both' })
        expect(result).toBeTypeOf('number')
        expect(Number.isInteger(result)).toBe(true)
        expect(result).toBeGreaterThanOrEqual(lower + 1) // Should be >= 11
        expect(result).toBeLessThanOrEqual(upper - 1) // Should be <= 19
        console.log(`[${testID}] Passed: Integer Generation: Exclude Both Bounds. Result: ${result}`)
    })

    // CRTC16: Integer Generation: Exclude Both Bounds (Narrow Range)
    it('CRTC16: Integer Generation: Exclude Both Bounds (Narrow Range)', () => {
        const testID = 'CRTC16'
        const lower = 11
        const upper = 13
        const result = cryptoRandom({ lowerBound: lower, upperBound: upper, typeOfNum: 'integer', exclusion: 'both' })
        expect(result).toBeTypeOf('number')
        expect(Number.isInteger(result)).toBe(true)
        expect(result).toBe(12) // Only 12 is expected in [11, 13] with 'both' exclusion
        console.log(`[${testID}] Passed: Integer Generation: Exclude Both Bounds (Narrow Range). Result: ${result}`)
    })

    // CRTC17: Double Generation: Exclude Both Bounds
    it('CRTC17: Double Generation: Exclude Both Bounds', () => {
        const testID = 'CRTC17'
        const lower = 1.5
        const upper = 5.5
        const result = cryptoRandom({ lowerBound: lower, upperBound: upper, typeOfNum: 'double', exclusion: 'both' })
        expect(result).toBeTypeOf('number')
        expect(result).toBeGreaterThanOrEqual(lower) // Lower bound is inclusive
        expect(result).toBeLessThan(upper) // Upper bound is exclusive
        console.log(`[${testID}] Passed: Double Generation: Exclude Both Bounds. Result: ${result}`)
    })

    // CRTC18: Double Generation: Exclude Both Bounds (Narrow Range)
    it('CRTC18: Double Generation: Exclude Both Bounds (Narrow Range)', () => {
        const testID = 'CRTC18'
        const lower = 0.11
        const upper = 0.13
        const fracDigits = 2
        const result = cryptoRandom({
            lowerBound: lower,
            upperBound: upper,
            typeOfNum: 'double',
            maxFracDigits: fracDigits,
            exclusion: 'both',
        })
        expect(result).toBeTypeOf('number')
        expect(result).toBe(0.12) // Only 0.12 is expected in [0.11, 0.13] with 'both' exclusion and 2 frac digits
        const fractionalDigits = (result.toString().split('.')[1] || '').length
        expect(fractionalDigits).toBeLessThanOrEqual(fracDigits)
        console.log(`[${testID}] Passed: Double Generation: Exclude Both Bounds (Narrow Range). Result: ${result}`)
    })

    // CRTC19: Double Generation: Exclude Lower Bound (Narrow Range)
    it('CRTC19: Double Generation: Exclude Lower Bound (Narrow Range)', () => {
        const testID = 'CRTC19'
        const lower = 0.11
        const upper = 0.13
        const fracDigits = 2
        const result = cryptoRandom({
            lowerBound: lower,
            upperBound: upper,
            typeOfNum: 'double',
            maxFracDigits: fracDigits,
            exclusion: 'lower bound',
        })
        expect(result).toBeTypeOf('number')
        expect(result).toBeGreaterThanOrEqual(lower) // Lower bound is inclusive
        expect(result).toBeLessThanOrEqual(upper) // Upper bound is inclusive
        // For 'lower bound' exclusion on [0.11, 0.13] with 2 frac digits, expected range is (0.11, 0.13]
        // So, result should be 0.12 or 0.13
        expect(result).toBeGreaterThan(0.11)
        expect(result).toBeLessThanOrEqual(0.13)
        const fractionalDigits = (result.toString().split('.')[1] || '').length
        expect(fractionalDigits).toBeLessThanOrEqual(fracDigits)
        console.log(`[${testID}] Passed: Double Generation: Exclude Lower Bound (Narrow Range). Result: ${result}`)
    })
})
