// test.crypto-random.004-edge-cases.ts

/**
 * Shuffrand Test Suite - cryptoRandom: Edge Cases
 *
 * This file specifically validates the behavior of `cryptoRandom` under various
 * edge-case scenarios, ensuring robustness and correctness for unusual inputs.
 * These include reversed bounds, negative ranges, extreme values (MAX_SAFE_INTEGER),
 * and specific fractional digit requirements.
 *
 * @author Doron Brayer <doronbrayer@outlook.com>
 * @license MIT
 */

import { describe, it, expect } from 'vitest'
// Import from the published package path, resolved by tsconfig.test.json paths
import { cryptoRandom } from 'shuffrand' // Updated import
// Removed: import { TypeError } from 'arktype/dist/errors.js'; // This import is not needed as cryptoRandom throws a global TypeError

// Define a top-level group for these tests
describe('cryptoRandom: Edge Cases', () => {
    // Reversed Bounds (Integer)
    // Call: cryptoRandom({ lowerBound: 10, upperBound: 1, typeOfNum: 'integer' })
    // Expected: Should swap bounds and return an integer between 1 and 10.
    it('Reversed Bounds (Integer)', () => {
        const result = cryptoRandom({ lowerBound: 10, upperBound: 1, typeOfNum: 'integer' })
        expect(result).toBeGreaterThanOrEqual(1)
        expect(result).toBeLessThanOrEqual(10)
        expect(Number.isInteger(result)).toBe(true)
    })

    // Negative Range (Integer)
    // Call: cryptoRandom({ lowerBound: -10, upperBound: -5, typeOfNum: 'integer' })
    // Expected: Returns an integer between -10 and -5.
    it('Negative Range (Integer)', () => {
        const result = cryptoRandom({ lowerBound: -10, upperBound: -5, typeOfNum: 'integer' })
        expect(result).toBeGreaterThanOrEqual(-10)
        expect(result).toBeLessThanOrEqual(-5)
        expect(Number.isInteger(result)).toBe(true)
    })

    // Negative Bounds (Integer)
    // Call: cryptoRandom({ lowerBound: -10, upperBound: -1, typeOfNum: 'integer', exclusion: 'both' })
    // Expected: Returns an integer between -9 and -2 (inclusive).
    it('Negative Bounds (Integer)', () => {
        const result = cryptoRandom({ lowerBound: -10, upperBound: -1, typeOfNum: 'integer', exclusion: 'both' })
        expect(result).toBeGreaterThanOrEqual(-9)
        expect(result).toBeLessThanOrEqual(-2)
        expect(Number.isInteger(result)).toBe(true)
        expect(result).not.toBe(-10)
        expect(result).not.toBe(-1)
    })

    // Mixed Positive/Negative Range, Exclude Both (Integer)
    // Call: cryptoRandom({ lowerBound: -2, upperBound: 2, typeOfNum: 'integer', exclusion: 'both' })
    // Expected: Returns an integer from {-1, 0, 1}.
    it('Mixed Positive/Negative Range, Exclude Both (Integer)', () => {
        const result = cryptoRandom({ lowerBound: -2, upperBound: 2, typeOfNum: 'integer', exclusion: 'both' })
        expect(result).toBeGreaterThanOrEqual(-1)
        expect(result).toBeLessThanOrEqual(1)
        expect(Number.isInteger(result)).toBe(true)
        expect(result).not.toBe(-2)
        expect(result).not.toBe(2)
    })

    // Zero-Crossing Boundaries (Integer)
    // Call: cryptoRandom({ lowerBound: -0.5, upperBound: 0.5, typeOfNum: 'integer' })
    // Expected: Returns 0.
    it('Zero-Crossing Boundaries (Integer)', () => {
        const result = cryptoRandom({ lowerBound: -0.5, upperBound: 0.5, typeOfNum: 'integer' })
        expect(result).toBe(0)
        expect(Number.isInteger(result)).toBe(true)
    })

    // Near-Integer Boundaries (Integer Type)
    // Call: cryptoRandom({ lowerBound: 4.9, upperBound: 5.1, typeOfNum: 'integer' })
    // Expected: Returns 5.
    it('Near-Integer Boundaries (Integer Type)', () => {
        const result = cryptoRandom({ lowerBound: 4.9, upperBound: 5.1, typeOfNum: 'integer' })
        expect(result).toBe(5)
        expect(Number.isInteger(result)).toBe(true)
    })

    // Narrow Double Range, Exclude Both
    // Call: cryptoRandom({ lowerBound: 0.1, upperBound: 0.100001, typeOfNum: 'double', exclusion: 'both' })
    // Expected: Throws an Error due to inability to find a number within max attempts.
    it('Narrow Double Range, Exclude Both (Expect Error)', () => {
        const lower = 0.1
        const upper = 0.100001
        // Expect the function to throw an Error with the specific message
        expect(() =>
            cryptoRandom({ lowerBound: lower, upperBound: upper, typeOfNum: 'double', exclusion: 'both' })
        ).toThrow(Error)
        expect(() =>
            cryptoRandom({ lowerBound: lower, upperBound: upper, typeOfNum: 'double', exclusion: 'both' })
        ).toThrow(
            `Unable to generate a random number within the range [${lower}\u2013${upper}] that satisfies the exclusion constraint: 'both'. Max attempts (30) reached.`
        )
    })

    // Mixed Positive/Negative Range, Exclude Both (Double)
    // Call: cryptoRandom({ lowerBound: -0.5, upperBound: 0.5, typeOfNum: 'double', exclusion: 'both' })
    // Expected: Returns a double between -0.5 and 0.5 (exclusive).
    it('Mixed Positive/Negative Range, Exclude Both (Double)', () => {
        const result = cryptoRandom({ lowerBound: -0.5, upperBound: 0.5, typeOfNum: 'double', exclusion: 'both' })
        expect(result).toBeGreaterThan(-0.5)
        expect(result).toBeLessThan(0.5)
    })

    // Max Fractional Digits: 5
    // Call: cryptoRandom({ lowerBound: 0, upperBound: 1, typeOfNum: 'double', maxFracDigits: 5 })
    // Expected: Returns a double with at most 5 fractional digits.
    it('Max Fractional Digits: 5', () => {
        const result = cryptoRandom({ lowerBound: 0, upperBound: 1, typeOfNum: 'double', maxFracDigits: 5 })
        const fractionalPart = result.toString().split('.')[1]
        if (fractionalPart) {
            expect(fractionalPart.length).toBeLessThanOrEqual(5)
        }
    })

    // Max Fractional Digits: 12
    // Call: cryptoRandom({ lowerBound: 0, upperBound: 1, typeOfNum: 'double', maxFracDigits: 12 })
    // Expected: Returns a double with at most 12 fractional digits.
    it('Max Fractional Digits: 12', () => {
        const result = cryptoRandom({ lowerBound: 0, upperBound: 1, typeOfNum: 'double', maxFracDigits: 12 })
        const fractionalPart = result.toString().split('.')[1]
        if (fractionalPart) {
            expect(fractionalPart.length).toBeLessThanOrEqual(12)
        }
    })

    // TRULY needed: Updated test to expect TypeError for maxFracDigits: 0 with typeOfNum: 'double'
    // This now expects the message from the *custom validation* block, as that runs first.
    it('Max Fractional Digits: 0 should throw a TypeError for double typeOfNum', () => {
        expect(() => cryptoRandom({ lowerBound: 0.1, upperBound: 0.9, typeOfNum: 'double', maxFracDigits: 0 })).toThrow(
            TypeError
        ) // Refers to global TypeError
        expect(() => cryptoRandom({ lowerBound: 0.1, upperBound: 0.9, typeOfNum: 'double', maxFracDigits: 0 })).toThrow(
            'maxFracDigits (currently 0) must be an integer between 1 and 15 (inclusive) to ensure reliable precision.'
        )
    })

    // Extreme Bounds: Number.MAX_SAFE_INTEGER Range
    // Call: cryptoRandom({ lowerBound: Number.MAX_SAFE_INTEGER - 10, upperBound: Number.MAX_SAFE_INTEGER, typeOfNum: 'integer' })
    // Expected: Returns an integer within the extreme range.
    it('Extreme Bounds: Number.MAX_SAFE_INTEGER Range', () => {
        const lower = Number.MAX_SAFE_INTEGER - 10
        const upper = Number.MAX_SAFE_INTEGER
        const result = cryptoRandom({ lowerBound: lower, upperBound: upper, typeOfNum: 'integer' })
        expect(result).toBeGreaterThanOrEqual(lower)
        expect(result).toBeLessThanOrEqual(upper)
        expect(Number.isInteger(result)).toBe(true)
    })

    // Extreme Bounds: Number.MIN_SAFE_INTEGER Range
    // Call: cryptoRandom({ lowerBound: Number.MIN_SAFE_INTEGER, upperBound: Number.MIN_SAFE_INTEGER + 10, typeOfNum: 'integer' })
    // Expected: Returns an integer within the extreme negative range.
    it('Extreme Bounds: Number.MIN_SAFE_INTEGER Range', () => {
        const lower = Number.MIN_SAFE_INTEGER
        const upper = Number.MIN_SAFE_INTEGER + 10
        const result = cryptoRandom({ lowerBound: lower, upperBound: upper, typeOfNum: 'integer' })
        expect(result).toBeGreaterThanOrEqual(lower)
        expect(result).toBeLessThanOrEqual(upper)
        expect(Number.isInteger(result)).toBe(true)
    })

    // Double Generation: Large Range with Max Frac Digits
    // Call: cryptoRandom({ lowerBound: 0, upperBound: 1000000, typeOfNum: 'double', maxFracDigits: 3 })
    // Expected: Returns a double within the range with at most 3 fractional digits.
    it('Double Generation: Large Range with Max Frac Digits', () => {
        const result = cryptoRandom({ lowerBound: 0, upperBound: 1000000, typeOfNum: 'double', maxFracDigits: 3 })
        expect(result).toBeGreaterThanOrEqual(0)
        expect(result).toBeLessThanOrEqual(1000000)
        const fractionalPart = result.toString().split('.')[1]
        if (fractionalPart) {
            expect(fractionalPart.length).toBeLessThanOrEqual(3)
        }
    })

    // NEW: Reversed Bounds (Double)
    // Call: cryptoRandom({ lowerBound: 10.5, upperBound: 1.5, typeOfNum: 'double' })
    // Expected: Should swap bounds and return a double between 1.5 (inclusive) and 10.5 (exclusive).
    it('Reversed Bounds (Double)', () => {
        const result = cryptoRandom({ lowerBound: 10.5, upperBound: 1.5, typeOfNum: 'double' })
        expect(result).toBeGreaterThanOrEqual(1.5)
        expect(result).toBeLessThan(10.5)
        expect(Number.isInteger(result)).toBe(false)
    })

    // NEW: Extreme Bounds (Integer) with Exclusion (Upper)
    // Call: cryptoRandom({ lowerBound: Number.MAX_SAFE_INTEGER - 2, upperBound: Number.MAX_SAFE_INTEGER, typeOfNum: 'integer', exclusion: 'upper bound' })
    // Expected: Returns an integer between MAX_SAFE_INTEGER - 2 and MAX_SAFE_INTEGER - 1.
    it('Extreme Bounds (Integer) with Exclusion (Upper)', () => {
        const lower = Number.MAX_SAFE_INTEGER - 2
        const upper = Number.MAX_SAFE_INTEGER
        const result = cryptoRandom({
            lowerBound: lower,
            upperBound: upper,
            typeOfNum: 'integer',
            exclusion: 'upper bound',
        })
        expect(result).toBeGreaterThanOrEqual(lower)
        expect(result).toBeLessThanOrEqual(upper - 1) // Exclude upper bound
        expect(Number.isInteger(result)).toBe(true)
        expect(result).not.toBe(upper)
    })

    // NEW: Extreme Negative Bounds (Integer) with Exclusion (Lower)
    // Call: cryptoRandom({ lowerBound: Number.MIN_SAFE_INTEGER, upperBound: Number.MIN_SAFE_INTEGER + 2, typeOfNum: 'integer', exclusion: 'lower bound' })
    // Expected: Returns an integer between MIN_SAFE_INTEGER + 1 and MIN_SAFE_INTEGER + 2.
    it('Extreme Negative Bounds (Integer) with Exclusion (Lower)', () => {
        const lower = Number.MIN_SAFE_INTEGER
        const upper = Number.MIN_SAFE_INTEGER + 2
        const result = cryptoRandom({
            lowerBound: lower,
            upperBound: upper,
            typeOfNum: 'integer',
            exclusion: 'lower bound',
        })
        expect(result).toBeGreaterThanOrEqual(lower + 1) // Exclude lower bound
        expect(result).toBeLessThanOrEqual(upper)
        expect(Number.isInteger(result)).toBe(true)
        expect(result).not.toBe(lower)
    })
})
