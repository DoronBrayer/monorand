// test.crypto-random.003-edge-cases.test.ts

/**
 * Shuffrand Test Suite - cryptoRandom: Edge Cases (CRTC20-CRTC36, excluding moved error cases)
 *
 * This file delves into various edge cases and specific numerical scenarios for `cryptoRandom`,
 * ensuring robustness across unusual inputs and boundary conditions. It uses the Vitest framework
 * for hierarchical grouping (`describe`), individual tests (`it`), and assertions (`expect`).
 * CRTC27 and CRTC34 have been moved to the error-handling test file as they correctly throw errors.
 *
 * @author Doron Brayer <doronbrayer@outlook.com>
 * @license MIT
 */

import { describe, it, expect } from 'vitest'
import { cryptoRandom } from './index.js' // Imports from the compiled index.js in dist/

// Define a top-level group for these tests using Vitest's describe
describe('cryptoRandom: Edge Cases', () => {
    // CRTC20: Zero Bounds (Integer)
    it('CRTC20: Zero Bounds (Integer)', () => {
        const testID = 'CRTC20'
        const result = cryptoRandom({ lowerBound: 0, upperBound: 0, typeOfNum: 'integer', exclusion: 'none' })
        expect(result).toBe(0)
        console.log(`[${testID}] Passed: Zero Bounds (Integer). Result: ${result}`)
    })

    // CRTC21: Equal Bounds (Integer)
    it('CRTC21: Equal Bounds (Integer)', () => {
        const testID = 'CRTC21'
        const result = cryptoRandom({ lowerBound: 2, upperBound: 2 })
        expect(result).toBe(2)
        console.log(`[${testID}] Passed: Equal Bounds (Integer). Result: ${result}`)
    })

    // CRTC22: Reversed Bounds (Integer)
    it('CRTC22: Reversed Bounds (Integer)', () => {
        const testID = 'CRTC22'
        const result = cryptoRandom({ lowerBound: 2, upperBound: 0 })
        expect(result).toBeTypeOf('number')
        expect(Number.isInteger(result)).toBe(true)
        expect(result).toBeGreaterThanOrEqual(0)
        expect(result).toBeLessThanOrEqual(2)
        console.log(`[${testID}] Passed: Reversed Bounds (Integer). Result: ${result}`)
    })

    // CRTC23: Negative Range (Integer)
    it('CRTC23: Negative Range (Integer)', () => {
        const testID = 'CRTC23'
        const result = cryptoRandom({ lowerBound: -4, upperBound: -2 })
        expect(result).toBeTypeOf('number')
        expect(Number.isInteger(result)).toBe(true)
        expect(result).toBeGreaterThanOrEqual(-4)
        expect(result).toBeLessThanOrEqual(-2)
        console.log(`[${testID}] Passed: Negative Range (Integer). Result: ${result}`)
    })

    // CRTC24: Negative Bounds (Integer)
    it('CRTC24: Negative Bounds (Integer)', () => {
        const testID = 'CRTC24'
        const result = cryptoRandom({ lowerBound: -10, upperBound: -1, typeOfNum: 'integer', exclusion: 'none' })
        expect(result).toBeTypeOf('number')
        expect(Number.isInteger(result)).toBe(true)
        expect(result).toBeGreaterThanOrEqual(-10)
        expect(result).toBeLessThanOrEqual(-1)
        console.log(`[${testID}] Passed: Negative Bounds (Integer). Result: ${result}`)
    })

    // CRTC25: Mixed Positive/Negative Range, Exclude Both (Integer)
    it('CRTC25: Mixed Positive/Negative Range, Exclude Both (Integer)', () => {
        const testID = 'CRTC25'
        const result = cryptoRandom({ lowerBound: -1.5, upperBound: 1.5, typeOfNum: 'integer', exclusion: 'both' })
        expect(result).toBeTypeOf('number')
        expect(Number.isInteger(result)).toBe(true)
        expect(result).toBeGreaterThanOrEqual(-1) // -1.5 rounded up to -1
        expect(result).toBeLessThanOrEqual(1) // 1.5 rounded down to 1
        console.log(`[${testID}] Passed: Mixed Positive/Negative Range, Exclude Both (Integer). Result: ${result}`)
    })

    // CRTC26: Zero-Crossing Boundaries (Integer)
    it('CRTC26: Zero-Crossing Boundaries (Integer)', () => {
        const testID = 'CRTC26'
        const result = cryptoRandom({ lowerBound: -0.6, upperBound: 0.4, typeOfNum: 'integer' })
        expect(result).toBe(0) // Only 0 is integer in [-0.6, 0.4]
        console.log(`[${testID}] Passed: Zero-Crossing Boundaries (Integer). Result: ${result}`)
    })

    // CRTC28: Near-Integer Boundaries (Integer Type)
    it('CRTC28: Near-Integer Boundaries (Integer Type)', () => {
        const testID = 'CRTC28'
        const result = cryptoRandom({ lowerBound: 1.99, upperBound: 2.01, typeOfNum: 'integer' })
        expect(result).toBe(2) // Only 2 is integer in [1.99, 2.01]
        console.log(`[${testID}] Passed: Near-Integer Boundaries (Integer Type). Result: ${result}`)
    })

    // CRTC29: Narrow Double Range, Exclude Both
    it('CRTC29: Narrow Double Range, Exclude Both', () => {
        const testID = 'CRTC29'
        const result = cryptoRandom({
            lowerBound: 1.001,
            upperBound: 1.003,
            typeOfNum: 'double',
            maxFracDigits: 3,
            exclusion: 'both',
        })
        expect(result).toBeTypeOf('number')
        expect(result).toBe(1.002) // Only 1.002 is expected in (1.001, 1.003) with 3 frac digits
        const fractionalDigits = (result.toString().split('.')[1] || '').length
        expect(fractionalDigits).toBeLessThanOrEqual(3)
        console.log(`[${testID}] Passed: Narrow Double Range, Exclude Both. Result: ${result}`)
    })

    // CRTC30: Mixed Positive/Negative Range, Exclude Both (Double)
    it('CRTC30: Mixed Positive/Negative Range, Exclude Both (Double)', () => {
        const testID = 'CRTC30'
        const result = cryptoRandom({
            lowerBound: -0.01,
            upperBound: 0.01,
            typeOfNum: 'double',
            maxFracDigits: 2,
            exclusion: 'both',
        })
        expect(result).toBeTypeOf('number')
        expect(result).toBeCloseTo(0.0, 2) // Use toBeCloseTo for floating point comparisons, allowing for +/-0
        const fractionalDigits = (result.toString().split('.')[1] || '').length
        expect(fractionalDigits).toBeLessThanOrEqual(2)
        console.log(`[${testID}] Passed: Mixed Positive/Negative Range, Exclude Both (Double). Result: ${result}`)
    })

    // CRTC31: Max Fractional Digits: 5
    it('CRTC31: Max Fractional Digits: 5', () => {
        const testID = 'CRTC31'
        const result = cryptoRandom({
            lowerBound: 1.5,
            upperBound: 5.5,
            typeOfNum: 'double',
            maxFracDigits: 5,
            exclusion: 'none',
        })
        expect(result).toBeTypeOf('number')
        expect(result).toBeGreaterThanOrEqual(1.5)
        expect(result).toBeLessThanOrEqual(5.5)
        const fractionalDigits = (result.toString().split('.')[1] || '').length
        expect(fractionalDigits).toBeLessThanOrEqual(5)
        console.log(`[${testID}] Passed: Max Fractional Digits: 5. Result: ${result}`)
    })

    // CRTC32: Max Fractional Digits: 12
    it('CRTC32: Max Fractional Digits: 12', () => {
        const testID = 'CRTC32'
        const result = cryptoRandom({ typeOfNum: 'double', maxFracDigits: 12, lowerBound: 0, upperBound: 1 })
        expect(result).toBeTypeOf('number')
        expect(result).toBeGreaterThanOrEqual(0)
        expect(result).toBeLessThanOrEqual(1)
        const fractionalDigits = (result.toString().split('.')[1] || '').length
        expect(fractionalDigits).toBeLessThanOrEqual(12)
        console.log(`[${testID}] Passed: Max Fractional Digits: 12. Result: ${result}`)
    })

    // CRTC33: Max Fractional Digits: 0
    it('CRTC33: Max Fractional Digits: 0', () => {
        const testID = 'CRTC33'
        const result = cryptoRandom({ typeOfNum: 'double', maxFracDigits: 0, lowerBound: 0, upperBound: 1 })
        expect(result).toBeTypeOf('number')
        expect(Number.isInteger(result)).toBe(true) // Should be an integer
        expect(result).toBeGreaterThanOrEqual(0)
        expect(result).toBeLessThanOrEqual(1)
        const fractionalDigits = (result.toString().split('.')[1] || '').length
        expect(fractionalDigits).toBe(0) // Should have 0 fractional digits
        console.log(`[${testID}] Passed: Max Fractional Digits: 0. Result: ${result}`)
    })

    // CRTC35: Extreme Bounds: Number.MAX_SAFE_INTEGER Range
    it('CRTC35: Extreme Bounds: Number.MAX_SAFE_INTEGER Range', () => {
        const testID = 'CRTC35'
        const lower = Number.MAX_SAFE_INTEGER - 10
        const upper = Number.MAX_SAFE_INTEGER
        const result = cryptoRandom({ lowerBound: lower, upperBound: upper, typeOfNum: 'integer' })
        expect(result).toBeTypeOf('number')
        expect(Number.isInteger(result)).toBe(true)
        expect(result).toBeGreaterThanOrEqual(lower)
        expect(result).toBeLessThanOrEqual(upper)
        console.log(`[${testID}] Passed: Extreme Bounds: Number.MAX_SAFE_INTEGER Range. Result: ${result}`)
    })

    // CRTC36: Extreme Bounds: Number.MIN_SAFE_INTEGER Range
    it('CRTC36: Extreme Bounds: Number.MIN_SAFE_INTEGER Range', () => {
        const testID = 'CRTC36'
        const lower = Number.MIN_SAFE_INTEGER
        const upper = Number.MIN_SAFE_INTEGER + 10
        const result = cryptoRandom({ lowerBound: lower, upperBound: upper, typeOfNum: 'integer' })
        expect(result).toBeTypeOf('number')
        expect(Number.isInteger(result)).toBe(true)
        expect(result).toBeGreaterThanOrEqual(lower)
        expect(result).toBeLessThanOrEqual(upper)
        console.log(`[${testID}] Passed: Extreme Bounds: Number.MIN_SAFE_INTEGER Range. Result: ${result}`)
    })
})
