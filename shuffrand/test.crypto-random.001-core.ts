// /shuffrand/test.crypto-random.001-core.ts

/**
 * Shuffrand Test Suite - cryptoRandom: Core Functionality
 *
 * This file validates the fundamental behavior of `cryptoRandom` with its
 * default settings and basic integer/double generation, ensuring it produces
 * numbers within the expected range and type.
 *
 * @author Doron Brayer <doronbrayer@outlook.com>
 * @license MIT
 */

// Import from the published package path, resolved by tsconfig.test.json paths
import { cryptoRandom } from 'shuffrand' // Updated import
import { describe, expect, it } from 'vitest'

// Define a top-level group for these tests
describe('cryptoRandom: Core Functionality', () => {
    // Default Parameters (0 to 2, integer)
    // Call: cryptoRandom()
    // Expected: Returns an integer between 0 (inclusive) and 2 (inclusive).
    it('Default Parameters (0 to 2, integer)', () => {
        const result = cryptoRandom()
        expect(result).toBeGreaterThanOrEqual(0)
        expect(result).toBeLessThanOrEqual(2) // Upper bound is 2, inclusive for integers
        expect(Number.isInteger(result)).toBe(true) // Should be an integer by default
    })

    // Basic Integer Generation
    // Call: cryptoRandom({ lowerBound: 1, upperBound: 10, typeOfNum: 'integer' })
    // Expected: Returns an integer between 1 and 10 (inclusive).
    it('Basic Integer Generation', () => {
        const result = cryptoRandom({ lowerBound: 1, upperBound: 10, typeOfNum: 'integer' })
        expect(result).toBeGreaterThanOrEqual(1)
        expect(result).toBeLessThanOrEqual(10)
        expect(Number.isInteger(result)).toBe(true)
    })

    // Basic Double Generation with Bounds
    // Call: cryptoRandom({ lowerBound: 1.0, upperBound: 2.0, typeOfNum: 'double' })
    // Expected: Returns a double between 1.0 (inclusive) and 2.0 (exclusive).
    it('Basic Double Generation with Bounds', () => {
        const result = cryptoRandom({ lowerBound: 1.0, upperBound: 2.0, typeOfNum: 'double' })
        expect(result).toBeGreaterThanOrEqual(1.0)
        expect(result).toBeLessThan(2.0)
        expect(Number.isInteger(result)).toBe(false) // Should be a double
    })

    // Single Value Range (Integer)
    // Call: cryptoRandom({ lowerBound: 5, upperBound: 5, typeOfNum: 'integer' })
    // Expected: Returns 5.
    it('Single Value Range (Integer)', () => {
        const result = cryptoRandom({ lowerBound: 5, upperBound: 5, typeOfNum: 'integer' })
        expect(result).toBe(5)
        expect(Number.isInteger(result)).toBe(true)
    })

    // NEW: Basic Double Generation with maxFracDigits
    // Call: cryptoRandom({ lowerBound: 1.0, upperBound: 2.0, typeOfNum: 'double', maxFracDigits: 2 })
    // Expected: Returns a double between 1.0 (inclusive) and 2.0 (exclusive), rounded to 2 decimal places.
    it('Basic Double Generation with maxFracDigits', () => {
        const result = cryptoRandom({ lowerBound: 1.0, upperBound: 2.0, typeOfNum: 'double', maxFracDigits: 2 })
        expect(result).toBeGreaterThanOrEqual(1.0)
        expect(result).toBeLessThan(2.0)
        // Check if it's a double (not an integer) and has at most 2 decimal places
        expect(Number(result.toFixed(2))).toBe(result) // Ensures it's rounded to 2 places
        expect(Number.isInteger(result)).toBe(false)
    })

    // NEW: Single Value Range (Double)
    // Call: cryptoRandom({ lowerBound: 5.5, upperBound: 5.5, typeOfNum: 'double' })
    // Expected: Returns 5.5.
    it('Single Value Range (Double)', () => {
        const result = cryptoRandom({ lowerBound: 5.5, upperBound: 5.5, typeOfNum: 'double' })
        expect(result).toBe(5.5)
        expect(Number.isInteger(result)).toBe(false) // Should be a double
    })
})
