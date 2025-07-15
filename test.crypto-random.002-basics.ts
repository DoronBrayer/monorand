// test.crypto-random.002-basics.ts

/**
 * Shuffrand Test Suite - cryptoRandom: Basic Parameters
 *
 * This file validates the behavior of `cryptoRandom` with various basic parameters,
 * including different bounds, `typeOfNum` (integer/double), and `maxFracDigits`.
 * It ensures that the function generates numbers correctly according to the specified options.
 *
 * @author Doron Brayer <doronbrayer@outlook.com>
 * @license MIT
 */

import { describe, it, expect } from 'vitest'
// Import from the published package path, resolved by tsconfig.test.json paths
import { cryptoRandom } from 'shuffrand' // Updated import

// Define a top-level group for these tests
describe('cryptoRandom: Basic Parameters', () => {
    // Integer Generation - Positive Range
    // Call: cryptoRandom({ lowerBound: 10, upperBound: 20, typeOfNum: 'integer' })
    // Expected: Returns an integer between 10 and 20 (inclusive).
    it('Integer Generation - Positive Range', () => {
        const result = cryptoRandom({ lowerBound: 10, upperBound: 20, typeOfNum: 'integer' })
        expect(result).toBeGreaterThanOrEqual(10)
        expect(result).toBeLessThanOrEqual(20)
        expect(Number.isInteger(result)).toBe(true)
    })

    // Double Generation - Positive Range with maxFracDigits
    // Call: cryptoRandom({ lowerBound: 0.1, upperBound: 0.9, typeOfNum: 'double', maxFracDigits: 2 })
    // Expected: Returns a double between 0.1 and 0.9 (exclusive of 0.9), with at most 2 fractional digits.
    it('Double Generation - Positive Range with maxFracDigits', () => {
        const result = cryptoRandom({ lowerBound: 0.1, upperBound: 0.9, typeOfNum: 'double', maxFracDigits: 2 })
        expect(result).toBeGreaterThanOrEqual(0.1)
        expect(result).toBeLessThan(0.9)
        expect(Number.isInteger(result)).toBe(false)
        const fractionalPart = result.toString().split('.')[1]
        if (fractionalPart) {
            expect(fractionalPart.length).toBeLessThanOrEqual(2)
        }
    })

    // Integer Generation - Negative Range
    // Call: cryptoRandom({ lowerBound: -10, upperBound: -1, typeOfNum: 'integer' })
    // Expected: Returns an integer between -10 and -1 (inclusive).
    it('Integer Generation - Negative Range', () => {
        const result = cryptoRandom({ lowerBound: -10, upperBound: -1, typeOfNum: 'integer' })
        expect(result).toBeGreaterThanOrEqual(-10)
        expect(result).toBeLessThanOrEqual(-1)
        expect(Number.isInteger(result)).toBe(true)
    })

    // Double Generation - Negative Range
    // Call: cryptoRandom({ lowerBound: -5.5, upperBound: -1.5, typeOfNum: 'double' })
    // Expected: Returns a double between -5.5 (inclusive) and -1.5 (exclusive).
    it('Double Generation - Negative Range', () => {
        const result = cryptoRandom({ lowerBound: -5.5, upperBound: -1.5, typeOfNum: 'double' })
        expect(result).toBeGreaterThanOrEqual(-5.5)
        expect(result).toBeLessThan(-1.5)
        expect(Number.isInteger(result)).toBe(false)
    })

    // Integer Generation - Mixed Positive and Negative Range
    // Call: cryptoRandom({ lowerBound: -5, upperBound: 5, typeOfNum: 'integer' })
    // Expected: Returns an integer between -5 and 5 (inclusive).
    it('Integer Generation - Mixed Positive and Negative Range', () => {
        const result = cryptoRandom({ lowerBound: -5, upperBound: 5, typeOfNum: 'integer' })
        expect(result).toBeGreaterThanOrEqual(-5)
        expect(result).toBeLessThanOrEqual(5)
        expect(Number.isInteger(result)).toBe(true)
    })

    // Double Generation - Mixed Positive and Negative Range
    // Call: cryptoRandom({ lowerBound: -2.5, upperBound: 2.5, typeOfNum: 'double' })
    // Expected: Returns a double between -2.5 (inclusive) and 2.5 (exclusive).
    it('Double Generation - Mixed Positive and Negative Range', () => {
        const result = cryptoRandom({ lowerBound: -2.5, upperBound: 2.5, typeOfNum: 'double' })
        expect(result).toBeGreaterThanOrEqual(-2.5)
        expect(result).toBeLessThan(2.5)
        expect(Number.isInteger(result)).toBe(false)
    })

    // Zero as a Bound (Integer)
    // Call: cryptoRandom({ lowerBound: 0, upperBound: 10, typeOfNum: 'integer' })
    // Expected: Returns an integer between 0 and 10 (inclusive).
    it('Zero as a Bound (Integer)', () => {
        const result = cryptoRandom({ lowerBound: 0, upperBound: 10, typeOfNum: 'integer' })
        expect(result).toBeGreaterThanOrEqual(0)
        expect(result).toBeLessThanOrEqual(10)
        expect(Number.isInteger(result)).toBe(true)
    })

    // NEW: Double Generation with maxFracDigits: 0 (should be integer-like)
    // Call: cryptoRandom({ lowerBound: 1.0, upperBound: 5.0, typeOfNum: 'double', maxFracDigits: 0 })
    // Expected: Returns a double between 1.0 (inclusive) and 5.0 (exclusive), effectively an integer.
    it('Double Generation with maxFracDigits: 0 (should be integer-like)', () => {
        const result = cryptoRandom({ lowerBound: 1.0, upperBound: 5.0, typeOfNum: 'double', maxFracDigits: 0 })
        expect(result).toBeGreaterThanOrEqual(1.0)
        expect(result).toBeLessThan(5.0)
        expect(result % 1).toBe(0) // Should have no fractional part
    })

    // NEW: Double Generation with maxFracDigits: 15 (max precision)
    // Call: cryptoRandom({ lowerBound: 0, upperBound: 1, typeOfNum: 'double', maxFracDigits: 15 })
    // Expected: Returns a double between 0 (inclusive) and 1 (exclusive), with up to 15 fractional digits.
    it('Double Generation with maxFracDigits: 15 (max precision)', () => {
        const result = cryptoRandom({ lowerBound: 0, upperBound: 1, typeOfNum: 'double', maxFracDigits: 15 })
        expect(result).toBeGreaterThanOrEqual(0)
        expect(result).toBeLessThan(1)
        const fractionalPart = result.toString().split('.')[1]
        if (fractionalPart) {
            expect(fractionalPart.length).toBeLessThanOrEqual(15)
        }
    })

    // NEW: Integer Generation with Decimal Bounds (should round bounds)
    // Call: cryptoRandom({ lowerBound: 1.1, upperBound: 5.9, typeOfNum: 'integer' })
    // Expected: Returns an integer between 2 and 5 (inclusive).
    it('Integer Generation with Decimal Bounds (should round bounds)', () => {
        const result = cryptoRandom({ lowerBound: 1.1, upperBound: 5.9, typeOfNum: 'integer' })
        expect(result).toBeGreaterThanOrEqual(2) // Math.ceil(1.1)
        expect(result).toBeLessThanOrEqual(5) // Math.floor(5.9)
        expect(Number.isInteger(result)).toBe(true)
    })

    // NEW: Double Generation with Mixed Integer/Decimal Bounds
    // Call: cryptoRandom({ lowerBound: 1, upperBound: 5.5, typeOfNum: 'double' })
    // Expected: Returns a double between 1 (inclusive) and 5.5 (exclusive).
    it('Double Generation with Mixed Integer/Decimal Bounds', () => {
        const result = cryptoRandom({ lowerBound: 1, upperBound: 5.5, typeOfNum: 'double' })
        expect(result).toBeGreaterThanOrEqual(1)
        expect(result).toBeLessThan(5.5)
        expect(Number.isInteger(result)).toBe(false) // Should be a double
    })
})
