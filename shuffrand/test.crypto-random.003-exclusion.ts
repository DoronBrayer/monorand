// /shuffrand/test.crypto-random.003-exclusion.ts

/**
 * Shuffrand Test Suite - cryptoRandom: Exclusion Logic
 *
 * This file rigorously tests `cryptoRandom`'s precise boundary exclusion capabilities
 * for both integer and double generation, ensuring statistical correctness.
 *
 * @author Doron Brayer <doronbrayer@outlook.com>
 * @license MIT
 */

import { describe, it, expect } from 'vitest'
// Import from the published package path, resolved by tsconfig.test.json paths
import { cryptoRandom } from 'shuffrand' // Updated import

// Define a top-level group for these tests
describe('cryptoRandom: Exclusion Logic', () => {
    // Integer Generation: Exclude Lower Bound
    it('Integer Generation: Exclude Lower Bound', () => {
        const lower = 10
        const upper = 20
        const result = cryptoRandom({
            lowerBound: lower,
            upperBound: upper,
            typeOfNum: 'integer',
            exclusion: 'lower bound'
        })
        expect(result).toBeTypeOf('number')
        expect(Number.isInteger(result)).toBe(true)
        expect(result).toBeGreaterThanOrEqual(lower + 1) // Should be >= 11
        expect(result).toBeLessThanOrEqual(upper) // Should be <= 20
    })

    // Integer Generation: Exclude Lower Bound (Narrow Range)
    it('Integer Generation: Exclude Lower Bound (Narrow Range)', () => {
        const lower = 11
        const upper = 13
        const result = cryptoRandom({
            lowerBound: lower,
            upperBound: upper,
            typeOfNum: 'integer',
            exclusion: 'lower bound'
        })
        expect(result).toBeTypeOf('number')
        expect(Number.isInteger(result)).toBe(true)
        expect(result).toBeGreaterThanOrEqual(lower + 1) // Should be >= 12
        expect(result).toBeLessThanOrEqual(upper) // Should be <= 13
    })

    // Integer Generation: Exclude Upper Bound
    it('Integer Generation: Exclude Upper Bound', () => {
        const lower = 10
        const upper = 20
        const result = cryptoRandom({
            lowerBound: lower,
            upperBound: upper,
            typeOfNum: 'integer',
            exclusion: 'upper bound'
        })
        expect(result).toBeTypeOf('number')
        expect(Number.isInteger(result)).toBe(true)
        expect(result).toBeGreaterThanOrEqual(lower) // Should be >= 10
        expect(result).toBeLessThanOrEqual(upper - 1) // Should be <= 19
    })

    // Integer Generation: Exclude Upper Bound (Narrow Range)
    it('Integer Generation: Exclude Upper Bound (Narrow Range)', () => {
        const lower = 11
        const upper = 13
        const result = cryptoRandom({
            lowerBound: lower,
            upperBound: upper,
            typeOfNum: 'integer',
            exclusion: 'upper bound'
        })
        expect(result).toBeTypeOf('number')
        expect(Number.isInteger(result)).toBe(true)
        expect(result).toBeGreaterThanOrEqual(lower) // Should be >= 11
        expect(result).toBeLessThanOrEqual(upper - 1) // Should be <= 12
    })

    // Integer Generation: Exclude Both Bounds
    it('Integer Generation: Exclude Both Bounds', () => {
        const lower = 10
        const upper = 20
        const result = cryptoRandom({ lowerBound: lower, upperBound: upper, typeOfNum: 'integer', exclusion: 'both' })
        expect(result).toBeTypeOf('number')
        expect(Number.isInteger(result)).toBe(true)
        expect(result).toBeGreaterThanOrEqual(lower + 1) // Should be >= 11
        expect(result).toBeLessThanOrEqual(upper - 1) // Should be <= 19
    })

    // Integer Generation: Exclude Both Bounds (Narrow Range)
    it('Integer Generation: Exclude Both Bounds (Narrow Range)', () => {
        const lower = 11
        const upper = 13
        const result = cryptoRandom({ lowerBound: lower, upperBound: upper, typeOfNum: 'integer', exclusion: 'both' })
        expect(result).toBeTypeOf('number')
        expect(Number.isInteger(result)).toBe(true)
        expect(result).toBe(12) // Only 12 is expected in [11, 13] with 'both' exclusion
    })

    // Double Generation: Exclude Lower Bound
    it('Double Generation: Exclude Lower Bound', () => {
        const lower = 1.5
        const upper = 5.5
        const result = cryptoRandom({
            lowerBound: lower,
            upperBound: upper,
            typeOfNum: 'double',
            exclusion: 'lower bound'
        })
        expect(result).toBeTypeOf('number')
        expect(result).toBeGreaterThan(lower) // Lower bound is exclusive
        expect(result).toBeLessThanOrEqual(upper) // Upper bound is inclusive
    })

    // Double Generation: Exclude Upper Bound
    it('Double Generation: Exclude Upper Bound', () => {
        const lower = 1.5
        const upper = 5.5
        const result = cryptoRandom({
            lowerBound: lower,
            upperBound: upper,
            typeOfNum: 'double',
            exclusion: 'upper bound'
        })
        expect(result).toBeTypeOf('number')
        expect(result).toBeGreaterThanOrEqual(lower) // Lower bound is inclusive
        expect(result).toBeLessThan(upper) // Upper bound is exclusive
    })

    // Double Generation: Exclude Both Bounds
    it('Double Generation: Exclude Both Bounds', () => {
        const lower = 1.5
        const upper = 5.5
        const result = cryptoRandom({ lowerBound: lower, upperBound: upper, typeOfNum: 'double', exclusion: 'both' })
        expect(result).toBeTypeOf('number')
        expect(result).toBeGreaterThan(lower) // Lower bound is exclusive
        expect(result).toBeLessThan(upper) // Upper bound is exclusive
    })

    // Double Generation: Exclude Both Bounds (Narrow Range)
    it('Double Generation: Exclude Both Bounds (Narrow Range)', () => {
        const lower = 0.11
        const upper = 0.13
        const fracDigits = 2
        const result = cryptoRandom({
            lowerBound: lower,
            upperBound: upper,
            typeOfNum: 'double',
            maxFracDigits: fracDigits,
            exclusion: 'both'
        })
        expect(result).toBeTypeOf('number')
        expect(result).toBeGreaterThan(lower)
        expect(result).toBeLessThan(upper)
        // Expect result to be 0.12
        expect(result).toBeCloseTo(0.12, fracDigits)
        const fractionalDigits = (result.toString().split('.')[1] || '').length
        expect(fractionalDigits).toBeLessThanOrEqual(fracDigits)
    })

    // Double Generation: Exclude Lower Bound (Narrow Range)
    it('Double Generation: Exclude Lower Bound (Narrow Range)', () => {
        const lower = 0.11
        const upper = 0.13
        const fracDigits = 2
        const result = cryptoRandom({
            lowerBound: lower,
            upperBound: upper,
            typeOfNum: 'double',
            maxFracDigits: fracDigits,
            exclusion: 'lower bound'
        })
        expect(result).toBeTypeOf('number')
        expect(result).toBeGreaterThan(0.11) // Lower bound is exclusive
        expect(result).toBeLessThanOrEqual(0.13) // Upper bound is inclusive
        // For 'lower bound' exclusion on [0.11, 0.13] with 2 frac digits, expected range is (0.11, 0.13]
        // So, result should be 0.12 or 0.13
        expect(result === 0.12 || result === 0.13).toBe(true)
        const fractionalDigits = (result.toString().split('.')[1] || '').length
        expect(fractionalDigits).toBeLessThanOrEqual(fracDigits)
    })

    // Double Generation: Exclude Upper Bound (Narrow Range)
    it('Double Generation: Exclude Upper Bound (Narrow Range)', () => {
        const lower = 0.11
        const upper = 0.13
        const fracDigits = 2
        const result = cryptoRandom({
            lowerBound: lower,
            upperBound: upper,
            typeOfNum: 'double',
            maxFracDigits: fracDigits,
            exclusion: 'upper bound'
        })
        expect(result).toBeTypeOf('number')
        expect(result).toBeGreaterThanOrEqual(0.11) // Lower bound is inclusive
        expect(result).toBeLessThan(0.13) // Upper bound is exclusive
        // For 'upper bound' exclusion on [0.11, 0.13] with 2 frac digits, expected range is [0.11, 0.13)
        // So, result should be 0.11 or 0.12
        expect(result === 0.11 || result === 0.12).toBe(true)
        const fractionalDigits = (result.toString().split('.')[1] || '').length
        expect(fractionalDigits).toBeLessThanOrEqual(fracDigits)
    })

    // Double Generation: Exclude Both, Max Frac Digits 15
    it('Double Generation: Exclude Both, Max Frac Digits 15', () => {
        const lower = 0.000000000000001 // Smallest possible positive double with 15 frac digits
        const upper = 0.000000000000003
        const fracDigits = 15
        const result = cryptoRandom({
            lowerBound: lower,
            upperBound: upper,
            typeOfNum: 'double',
            maxFracDigits: fracDigits,
            exclusion: 'both'
        })
        expect(result).toBeTypeOf('number')
        expect(result).toBeGreaterThan(lower)
        expect(result).toBeLessThan(upper)
        // Expect result to be 0.000000000000002
        expect(result).toBeCloseTo(0.000000000000002, 15)
        const fractionalDigits = (result.toString().split('.')[1] || '').length
        expect(fractionalDigits).toBeLessThanOrEqual(fracDigits)
    })

    // Double Generation: Exclude Lower, Max Frac Digits 14
    it('Double Generation: Exclude Lower, Max Frac Digits 14', () => {
        const lower = 0.12345678901234
        const upper = 0.12345678901236
        const fracDigits = 14
        const result = cryptoRandom({
            lowerBound: lower,
            upperBound: upper,
            typeOfNum: 'double',
            maxFracDigits: fracDigits,
            exclusion: 'lower bound'
        })
        expect(result).toBeTypeOf('number')
        expect(result).toBeGreaterThan(lower)
        expect(result).toBeLessThanOrEqual(upper)
        // Expect result to be 0.12345678901235 or 0.12345678901236
        expect(result === 0.12345678901235 || result === 0.12345678901236).toBe(true)
        const fractionalDigits = (result.toString().split('.')[1] || '').length
        expect(fractionalDigits).toBeLessThanOrEqual(fracDigits)
    })

    // NEW: Integer Generation: Exclude Lower Bound (Range of 2 integers)
    it('Integer Generation: Exclude Lower Bound (Range of 2 integers)', () => {
        const lower = 5
        const upper = 6
        const result = cryptoRandom({
            lowerBound: lower,
            upperBound: upper,
            typeOfNum: 'integer',
            exclusion: 'lower bound'
        })
        expect(result).toBeTypeOf('number')
        expect(Number.isInteger(result)).toBe(true)
        expect(result).toBe(6) // Only 6 is expected in [5, 6] with 'lower bound' exclusion
    })

    // NEW: Integer Generation: Exclude Upper Bound (Range of 2 integers)
    it('Integer Generation: Exclude Upper Bound (Range of 2 integers)', () => {
        const lower = 5
        const upper = 6
        const result = cryptoRandom({
            lowerBound: lower,
            upperBound: upper,
            typeOfNum: 'integer',
            exclusion: 'upper bound'
        })
        expect(result).toBeTypeOf('number')
        expect(Number.isInteger(result)).toBe(true)
        expect(result).toBe(5) // Only 5 is expected in [5, 6] with 'upper bound' exclusion
    })

    // NEW: Integer Generation: Exclude Both Bounds (Range of 3 integers)
    it('Integer Generation: Exclude Both Bounds (Range of 3 integers)', () => {
        const lower = 5
        const upper = 7
        const result = cryptoRandom({
            lowerBound: lower,
            upperBound: upper,
            typeOfNum: 'integer',
            exclusion: 'both'
        })
        expect(result).toBeTypeOf('number')
        expect(Number.isInteger(result)).toBe(true)
        expect(result).toBe(6) // Only 6 is expected in [5, 7] with 'both' exclusion
    })
})
