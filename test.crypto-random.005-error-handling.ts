// test.crypto-random.005-error-handling.ts

/**
 * Shuffrand Test Suite - cryptoRandom: Error Handling
 *
 * This file specifically verifies `cryptoRandom`'s robust error handling, ensuring that
 * invalid inputs or impossible number generation scenarios correctly throw `TypeError`
 * or `TraversalError` exceptions. It covers various invalid parameter types, out-of-bounds
 * values, and impossible exclusion scenarios.
 *
 * @author Doron Brayer <doronbrayer@outlook.com>
 * @license MIT
 */

import { describe, it, expect } from 'vitest'
// Import from the published package path, resolved by tsconfig.test.json paths
import { cryptoRandom } from 'shuffrand'
import { Constants } from 'shuffrand/constants'

// Define a top-level group for these tests
describe('cryptoRandom: Error Handling', () => {
    // Invalid lowerBound type (string) - ArkType should catch this
    it('Should throw TraversalError for invalid lowerBound type (string) (ArkType message)', () => {
        // The 'as any' cast is sufficient to bypass type checking for the test
        // ArkType throws a custom TraversalError, which extends Error.
        // We expect it to be an instance of Error and check the message.
        expect(() => cryptoRandom({ lowerBound: 'abc' as any })).toThrow(Error)
        expect(() => cryptoRandom({ lowerBound: 'abc' as any })).toThrow(
            // Adjusted regex to match actual ArkType message
            /lowerBound must be a number \(was a string\)/
        )
    })
})

// Invalid upperBound type (boolean) - ArkType should catch this
it('Should throw TraversalError for invalid upperBound type (boolean) (ArkType message)', () => {
    expect(() => cryptoRandom({ upperBound: true as any })).toThrow(Error)
    expect(() => cryptoRandom({ upperBound: true as any })).toThrow(
        // Adjusted regex to match actual ArkType message
        /upperBound must be a number \(was boolean\)/
    )
})

// Invalid typeOfNum (number) - ArkType should catch this
it('Should throw TraversalError for invalid typeOfNum (number) (ArkType message)', () => {
    expect(() => cryptoRandom({ typeOfNum: 123 as any })).toThrow(Error)
    expect(() => cryptoRandom({ typeOfNum: 123 as any })).toThrow(
        // Adjusted regex to match actual ArkType message
        /typeOfNum must be "double" or "integer" \(was 123\)/
    )
})

// Invalid exclusion (array) - ArkType should catch this
it('Should throw TraversalError for invalid exclusion (array) (ArkType message)', () => {
    expect(() => cryptoRandom({ exclusion: [] as any })).toThrow(Error)
    expect(() => cryptoRandom({ exclusion: [] as any })).toThrow(
        // Adjusted regex to match actual ArkType message
        /exclusion must be "both", "lower bound", "none" or "upper bound" \(was \[\]\)/
    )
})

// Invalid maxFracDigits type (string) - Custom validation throws TypeError
it('Should throw TypeError for invalid maxFracDigits type (string) (custom message)', () => {
    expect(() => cryptoRandom({ maxFracDigits: 'five' as any })).toThrow(TypeError)
    expect(() => cryptoRandom({ maxFracDigits: 'five' as any })).toThrow(
        // Adjusted regex to match the exact received message
        /maxFracDigits \(currently five\) must be an integer between 0 and 15 \(inclusive\) to ensure reliable precision\./
    )
})

// lowerBound > upperBound (integer) - EXPECT NO ERROR, FUNCTION REORDERS BOUNDS
it('Should NOT throw error for lowerBound > upperBound (integer) - function reorders bounds', () => {
    // The function reorders bounds, so no error is expected here.
    // We expect a valid integer result within the reordered range.
    const result = cryptoRandom({ lowerBound: 10, upperBound: 5, typeOfNum: 'integer' })
    expect(result).toBeGreaterThanOrEqual(5)
    expect(result).toBeLessThanOrEqual(10)
    expect(Number.isInteger(result)).toBe(true)
})

// lowerBound > upperBound (double) - EXPECT NO ERROR, FUNCTION REORDERS BOUNDS
it('Should NOT throw error for lowerBound > upperBound (double) - function reorders bounds', () => {
    // The function reorders bounds, so no error is expected here.
    // We expect a valid double result within the reordered range.
    const result = cryptoRandom({ lowerBound: 10.5, upperBound: 5.5, typeOfNum: 'double' })
    expect(result).toBeGreaterThanOrEqual(5.5)
    expect(result).toBeLessThanOrEqual(10.5) // Upper bound is inclusive for double due to rounding/epsilon
    expect(Number.isInteger(result)).toBe(false)
})

// Impossible integer range with exclusion 'both' (e.g., lower=5, upper=6, exclude both)
it('Should throw TypeError for impossible integer exclusion (range 5-6, both)', () => {
    expect(() => cryptoRandom({ lowerBound: 5, upperBound: 6, typeOfNum: 'integer', exclusion: 'both' })).toThrow(
        TypeError
    )
    expect(() => cryptoRandom({ lowerBound: 5, upperBound: 6, typeOfNum: 'integer', exclusion: 'both' })).toThrow(
        // Adjusted regex to match actual received message
        /Invalid integer range after exclusions: the original range of \[5–6\] with exclusion 'both' results in an empty integer range\./
    )
})

// Impossible integer range with exclusion 'both' (e.g., lower=1, upper=2, exclude both)
it('Should throw TypeError for impossible integer exclusion (range 1-2, both)', () => {
    expect(() => cryptoRandom({ lowerBound: 1, upperBound: 2, typeOfNum: 'integer', exclusion: 'both' })).toThrow(
        TypeError
    )
    expect(() => cryptoRandom({ lowerBound: 1, upperBound: 2, typeOfNum: 'integer', exclusion: 'both' })).toThrow(
        // Adjusted regex to match actual received message
        /Invalid integer range after exclusions: the original range of \[1–2\] with exclusion 'both' results in an empty integer range\./
    )
})

// Impossible integer range with exclusion 'both' (e.g., lower=11, upper=12, exclude both)
it('Should throw TypeError for impossible integer exclusion (range 11-12, both)', () => {
    expect(() => cryptoRandom({ lowerBound: 11, upperBound: 12, typeOfNum: 'integer', exclusion: 'both' })).toThrow(
        TypeError
    )
    expect(() => cryptoRandom({ lowerBound: 11, upperBound: 12, typeOfNum: 'integer', exclusion: 'both' })).toThrow(
        // Adjusted regex to match actual received message
        /Invalid integer range after exclusions: the original range of \[11–12\] with exclusion 'both' results in an empty integer range\./
    )
})

// Invalid double range with both exclusion (lower == upper)
it('Should throw TypeError for invalid double range with both exclusion (lower == upper)', () => {
    expect(() => cryptoRandom({ lowerBound: 5.0, upperBound: 5.0, typeOfNum: 'double', exclusion: 'both' })).toThrow(
        TypeError
    )
    expect(() => cryptoRandom({ lowerBound: 5.0, upperBound: 5.0, typeOfNum: 'double', exclusion: 'both' })).toThrow(
        // Adjusted regex to match actual received message
        /Invalid range for double with 'both' exclusion: lowerBound \(5\) equals upperBound \(5\)\./
    )
})

// Should throw TypeError for empty integer range from decimal bounds
it('Should throw TypeError for empty integer range from decimal bounds', () => {
    expect(() => cryptoRandom({ lowerBound: 1.1, upperBound: 1.9, typeOfNum: 'integer' })).toThrow(TypeError)
    expect(() => cryptoRandom({ lowerBound: 1.1, upperBound: 1.9, typeOfNum: 'integer' })).toThrow(
        // Adjusted regex to match actual received message
        /Invalid integer range after exclusions: the original range of \[1\.1–1\.9\] with exclusion 'none' results in an empty integer range\./
    )
})

// Should throw TypeError for maxFracDigits > 15 (custom message)
it('Should throw TypeError for maxFracDigits > 15 (custom message)', () => {
    expect(() => cryptoRandom({ lowerBound: 0, upperBound: 1, typeOfNum: 'double', maxFracDigits: 16 })).toThrow(
        TypeError
    )
    expect(() => cryptoRandom({ lowerBound: 0, upperBound: 1, typeOfNum: 'double', maxFracDigits: 16 })).toThrow(
        /maxFracDigits \(currently 16\) must be an integer between 0 and 15 \(inclusive\) to ensure reliable precision\./
    )
})

// Should throw TypeError for negative maxFracDigits (custom message)
it('Should throw TypeError for negative maxFracDigits (custom message)', () => {
    expect(() => cryptoRandom({ lowerBound: 0, upperBound: 1, typeOfNum: 'double', maxFracDigits: -1 })).toThrow(
        TypeError
    )
    expect(() => cryptoRandom({ lowerBound: 0, upperBound: 1, typeOfNum: 'double', maxFracDigits: -1 })).toThrow(
        // Adjusted regex to match the exact received message
        /maxFracDigits \(currently -1\) must be an integer between 0 and 15 \(inclusive\) to ensure reliable precision\./
    )
})

// Should throw TraversalError for lowerBound exceeding MAX_SAFE_INTEGER (ArkType message)
it('Should throw TraversalError for lowerBound exceeding MAX_SAFE_INTEGER (ArkType message)', () => {
    const largeNum = Constants.MAX_SAFE_INT + 1
    const validUpperBound = Constants.MAX_SAFE_INT - 1
    expect(() => cryptoRandom({ lowerBound: largeNum, upperBound: validUpperBound, typeOfNum: 'integer' })).toThrow(
        Error
    )
    expect(() => cryptoRandom({ lowerBound: largeNum, upperBound: validUpperBound, typeOfNum: 'integer' })).toThrow(
        // Adjusted regex to match ArkType's message about being "at most" the safe integer
        new RegExp(`lowerBound must be at most ${Constants.MAX_SAFE_INT} \\(was ${largeNum}\\)`)
    )
})

// Should throw TraversalError for upperBound falling below MIN_SAFE_INTEGER (ArkType message)
it('Should throw TraversalError for upperBound falling below MIN_SAFE_INTEGER (ArkType message)', () => {
    const smallNum = Constants.MIN_SAFE_INT - 1
    const validLowerBound = Constants.MIN_SAFE_INT + 1
    expect(() => cryptoRandom({ lowerBound: validLowerBound, upperBound: smallNum, typeOfNum: 'integer' })).toThrow(
        Error
    )
    expect(() => cryptoRandom({ lowerBound: validLowerBound, upperBound: smallNum, typeOfNum: 'integer' })).toThrow(
        // Adjusted regex to match ArkType's message about being "at least" the safe integer
        new RegExp(`upperBound must be at least ${Constants.MIN_SAFE_INT} \\(was ${smallNum}\\)`)
    )
})

// Should throw TraversalError for both bounds being problematic (mixed, ArkType message)
it('Should throw TraversalError for both bounds being problematic (mixed, ArkType message)', () => {
    const largeNum = Constants.MAX_SAFE_INT + 1
    const smallNum = Constants.MIN_SAFE_INT - 1
    expect(() => cryptoRandom({ lowerBound: largeNum, upperBound: smallNum, typeOfNum: 'integer' })).toThrow(Error)
    expect(() => cryptoRandom({ lowerBound: largeNum, upperBound: smallNum, typeOfNum: 'integer' })).toThrow(
        // Adjusted regex to match ArkType's messages for both lower and upper bounds
        new RegExp(
            `lowerBound must be at most ${Constants.MAX_SAFE_INT} \\(was ${largeNum}\\)|upperBound must be at least ${Constants.MIN_SAFE_INT} \\(was ${smallNum}\\)`
        )
    )
})

// Should throw TraversalError for both bounds being non-finite (ArkType message)
it('Should throw TraversalError for both bounds being non-finite (ArkType message)', () => {
    expect(() => cryptoRandom({ lowerBound: Infinity, upperBound: -Infinity, typeOfNum: 'double' })).toThrow(Error)
    // Adjusted regex to match ArkType's messages for non-finite numbers when they are outside safe range
    expect(() => cryptoRandom({ lowerBound: Infinity, upperBound: -Infinity, typeOfNum: 'double' })).toThrow(
        new RegExp(
            `lowerBound must be at most ${Constants.MAX_SAFE_INT} \\(was Infinity\\)|upperBound must be at least ${Constants.MIN_SAFE_INT} \\(was -Infinity\\)`
        )
    )
})

// Should throw TraversalError for both bounds being finite but outside safe range (ArkType message)
it('Should throw TraversalError for both bounds being finite but outside safe range (ArkType message)', () => {
    const largeNum = Constants.MAX_SAFE_INT + 1
    const smallNum = Constants.MIN_SAFE_INT - 1
    expect(() => cryptoRandom({ lowerBound: largeNum, upperBound: smallNum, typeOfNum: 'double' })).toThrow(Error)
    expect(() => cryptoRandom({ lowerBound: largeNum, upperBound: smallNum, typeOfNum: 'double' })).toThrow(
        new RegExp(
            `lowerBound must be at most ${Constants.MAX_SAFE_INT} \\(was ${largeNum}\\)|upperBound must be at least ${Constants.MIN_SAFE_INT} \\(was ${smallNum}\\)`
        )
    )
})

// Should throw TraversalError when lowerBound is undefined (via ArkType)
it('Should throw TraversalError when lowerBound is undefined (via ArkType)', () => {
    expect(() => cryptoRandom({ lowerBound: undefined as any })).toThrow(Error)
    expect(() => cryptoRandom({ lowerBound: undefined as any })).toThrow(
        /lowerBound must be a number \(was undefined\)/
    )
})

// Should throw TraversalError when upperBound is undefined (via ArkType)
it('Should throw TraversalError when upperBound is undefined (via ArkType)', () => {
    expect(() => cryptoRandom({ upperBound: undefined as any })).toThrow(Error)
    expect(() => cryptoRandom({ upperBound: undefined as any })).toThrow(
        /upperBound must be a number \(was undefined\)/
    )
})
