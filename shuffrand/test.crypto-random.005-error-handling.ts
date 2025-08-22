// /shuffrand/test.crypto-random.005-error-handling.ts

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

import { TraversalError } from 'arktype' // Import TraversalError from ArkType
// Import from the published package path, resolved by tsconfig.test.json paths
import { cryptoRandom } from 'shuffrand'
import { describe, expect, it } from 'vitest'
import { Constants } from './src.constants.js'
// TRULY needed: Correctly import randomParamsSchema directly from its source
import { randomParamsSchema } from './src.types.js'

// Define a top-level group for these tests
describe('cryptoRandom: Error Handling', () => {
    // Invalid lowerBound type (string) - ArkType should catch this
    it('Should throw TraversalError for invalid lowerBound type (string) (ArkType message)', () => {
        // The 'as any' cast is sufficient to bypass type checking for the test
        // ArkType throws a custom TraversalError, which extends Error.
        // We expect it to be an instance of Error and check the message.
        // Adjusted regex to match actual ArkType message
        expect(() => cryptoRandom({ lowerBound: 'abc' as any })).toThrow(/lowerBound must be a number \(was a string\)/)
    })

    // Invalid upperBound type (boolean) - ArkType should catch this
    it('Should throw TraversalError for invalid upperBound type (boolean) (ArkType message)', () => {
        // Adjusted regex to match actual ArkType message
        expect(() => cryptoRandom({ upperBound: true as any })).toThrow(/upperBound must be a number \(was boolean\)/)
    })

    // Invalid typeOfNum (number) - ArkType should catch this
    it('Should throw TraversalError for invalid typeOfNum (number) (ArkType message)', () => {
        // Adjusted regex to match actual ArkType message
        expect(() => cryptoRandom({ typeOfNum: 123 as any })).toThrow(
            /typeOfNum must be "double" or "integer" \(was 123\)/
        )
    })

    // Invalid exclusion (array) - ArkType should catch this
    it('Should throw TraversalError for invalid exclusion (array) (ArkType message)', () => {
        // Adjusted regex to match actual ArkType message
        expect(() => cryptoRandom({ exclusion: [] as any })).toThrow(
            /exclusion must be "both", "lower bound", "none" or "upper bound" \(was \[\]\)/
        )
    })

    // Invalid maxFracDigits type (string) - Custom validation throws TypeError
    // TRULY needed: Updated regex to match the new message (between 1 and 15) and added 'as any'
    it('Should throw TypeError for invalid maxFracDigits type (string) (custom message)', () => {
        expect(() => cryptoRandom({ maxFracDigits: 'five' as any })).toThrow(TypeError)
        expect(() => cryptoRandom({ maxFracDigits: 'five' as any })).toThrow(
            /maxFracDigits \(currently five\) must be an integer between 1 and 15 \(inclusive\) to ensure reliable precision\./
        )
    })

    // --- Impossible Range / Exclusion Combinations ---

    it('Should NOT throw error for lowerBound > upperBound (integer) - function reorders bounds', () => {
        expect(() => cryptoRandom({ lowerBound: 10, upperBound: 1, typeOfNum: 'integer' })).not.toThrow()
    })

    it('Should NOT throw error for lowerBound > upperBound (double) - function reorders bounds', () => {
        expect(() => cryptoRandom({ lowerBound: 10.5, upperBound: 5.5, typeOfNum: 'double' })).not.toThrow()
    })

    it('Should throw TypeError for impossible integer exclusion (range 5-6, both)', () => {
        expect(() => cryptoRandom({ lowerBound: 5, upperBound: 6, typeOfNum: 'integer', exclusion: 'both' })).toThrow(
            TypeError
        )
        expect(() => cryptoRandom({ lowerBound: 5, upperBound: 6, typeOfNum: 'integer', exclusion: 'both' })).toThrow(
            // Adjusted regex to match actual received message
            /Invalid integer range after exclusions: the original range of \[5–6\] with exclusion 'both' results in an empty integer range\./
        )
    })

    it('Should throw TypeError for impossible integer exclusion (range 1-2, both)', () => {
        expect(() => cryptoRandom({ lowerBound: 1, upperBound: 2, typeOfNum: 'integer', exclusion: 'both' })).toThrow(
            TypeError
        )
        expect(() => cryptoRandom({ lowerBound: 1, upperBound: 2, typeOfNum: 'integer', exclusion: 'both' })).toThrow(
            // Adjusted regex to match actual received message
            /Invalid integer range after exclusions: the original range of \[1–2\] with exclusion 'both' results in an empty integer range\./
        )
    })

    it('Should throw TypeError for impossible integer exclusion (range 11-12, both)', () => {
        expect(() => cryptoRandom({ lowerBound: 11, upperBound: 12, typeOfNum: 'integer', exclusion: 'both' })).toThrow(
            TypeError
        )
        expect(() => cryptoRandom({ lowerBound: 11, upperBound: 12, typeOfNum: 'integer', exclusion: 'both' })).toThrow(
            // Adjusted regex to match actual received message
            /Invalid integer range after exclusions: the original range of \[11–12\] with exclusion 'both' results in an empty integer range\./
        )
    })

    it('Should throw TypeError for invalid double range with both exclusion (lower == upper)', () => {
        expect(() =>
            cryptoRandom({ lowerBound: 5.0, upperBound: 5.0, typeOfNum: 'double', exclusion: 'both' })
        ).toThrow(TypeError)
        expect(() =>
            cryptoRandom({ lowerBound: 5.0, upperBound: 5.0, typeOfNum: 'double', exclusion: 'both' })
        ).toThrow(
            // Adjusted regex to match actual received message
            /Invalid range for double with 'both' exclusion: lowerBound \(5\) equals upperBound \(5\)\./
        )
    })

    it('Should throw TypeError for empty integer range from decimal bounds', () => {
        expect(() => cryptoRandom({ lowerBound: 1.1, upperBound: 1.9, typeOfNum: 'integer' })).toThrow(TypeError)
        expect(() => cryptoRandom({ lowerBound: 1.1, upperBound: 1.9, typeOfNum: 'integer' })).toThrow(
            // Adjusted regex to match actual received message
            /Invalid integer range after exclusions: the original range of \[1\.1–1\.9\] with exclusion 'none' results in an empty integer range\./
        )
    })

    // TRULY needed: Updated regex to match the new message (between 1 and 15)
    it('Should throw TypeError for maxFracDigits > 15 (custom message)', () => {
        expect(() => cryptoRandom({ lowerBound: 0, upperBound: 1, typeOfNum: 'double', maxFracDigits: 16 })).toThrow(
            TypeError
        )
        expect(() => cryptoRandom({ lowerBound: 0, upperBound: 1, typeOfNum: 'double', maxFracDigits: 16 })).toThrow(
            /maxFracDigits \(currently 16\) must be an integer between 1 and 15 \(inclusive\) to ensure reliable precision\./
        )
    })

    // TRULY needed: Updated regex to match the new message (between 1 and 15)
    it('Should throw TypeError for negative maxFracDigits (custom message)', () => {
        expect(() => cryptoRandom({ lowerBound: 0, upperBound: 1, typeOfNum: 'double', maxFracDigits: -1 })).toThrow(
            TypeError
        )
        expect(() => cryptoRandom({ lowerBound: 0, upperBound: 1, typeOfNum: 'double', maxFracDigits: -1 })).toThrow(
            /maxFracDigits \(currently -1\) must be an integer between 1 and 15 \(inclusive\) to ensure reliable precision\./
        )
    })

    // --- Extreme Value Handling (ArkType handled) ---

    // Removed unused @ts-expect-error
    it('Should throw TraversalError for lowerBound exceeding MAX_SAFE_INTEGER (ArkType message)', () => {
        const largeNum = Constants.MAX_SAFE_INT + 1
        const validUpperBound = Constants.MAX_SAFE_INT - 1
        expect(() =>
            cryptoRandom({ lowerBound: largeNum as any, upperBound: validUpperBound, typeOfNum: 'integer' })
        ).toThrow(
            // Adjusted regex to match ArkType's message about being "at most" the safe integer
            new RegExp(`lowerBound must be at most ${Constants.MAX_SAFE_INT} \\(was ${largeNum}\\)`)
        )
    })

    // Removed unused @ts-expect-error
    it('Should throw TraversalError for upperBound falling below MIN_SAFE_INTEGER (ArkType message)', () => {
        const smallNum = Constants.MIN_SAFE_INT - 1
        const validLowerBound = Constants.MIN_SAFE_INT + 1
        expect(() =>
            cryptoRandom({ lowerBound: validLowerBound, upperBound: smallNum as any, typeOfNum: 'integer' })
        ).toThrow(
            // Adjusted regex to match ArkType's message about being "at least" the safe integer
            new RegExp(`upperBound must be at least ${Constants.MIN_SAFE_INT} \\(was ${smallNum}\\)`)
        )
    })

    // Removed unused @ts-expect-error
    it('Should throw TraversalError for both bounds being problematic (mixed, ArkType message)', () => {
        const largeNum = Constants.MAX_SAFE_INT + 1
        const smallNum = Constants.MIN_SAFE_INT - 1
        expect(() =>
            cryptoRandom({ lowerBound: largeNum as any, upperBound: smallNum as any, typeOfNum: 'integer' })
        ).toThrow(
            // Adjusted regex to match ArkType's messages for both lower and upper bounds
            new RegExp(
                `lowerBound must be at most ${Constants.MAX_SAFE_INT} \\(was ${largeNum}\\)|upperBound must be at least ${Constants.MIN_SAFE_INT} \\(was ${smallNum}\\)`
            )
        )
    })

    // Removed unused @ts-expect-error
    it('Should throw TraversalError for both bounds being non-finite (ArkType message)', () => {
        // Adjusted regex to match ArkType's messages for non-finite numbers when they are outside safe range
        expect(() =>
            cryptoRandom({ lowerBound: Infinity as any, upperBound: -Infinity as any, typeOfNum: 'double' })
        ).toThrow(
            new RegExp(
                `lowerBound must be at most ${Constants.MAX_SAFE_INT} \\(was Infinity\\)|upperBound must be at least ${Constants.MIN_SAFE_INT} \\(was -Infinity\\)`
            )
        )
    })

    // Removed unused @ts-expect-error
    it('Should throw TraversalError for both bounds being finite but outside safe range (ArkType message)', () => {
        const largeNum = Constants.MAX_SAFE_INT + 1
        const smallNum = Constants.MIN_SAFE_INT - 1
        expect(() =>
            cryptoRandom({ lowerBound: largeNum as any, upperBound: smallNum as any, typeOfNum: 'double' })
        ).toThrow(
            new RegExp(
                `lowerBound must be at most ${Constants.MAX_SAFE_INT} \\(was ${largeNum}\\)|upperBound must be at least ${Constants.MIN_SAFE_INT} \\(was ${smallNum}\\)`
            )
        )
    })

    // --- Missing Parameters (ArkType handled) ---

    // Note: ArkType's assert method is used here to test schema validation directly.
    // The main cryptoRandom function applies defaults before ArkType's assert.

    // Removed unused @ts-expect-error
    it('Should throw TraversalError when lowerBound is undefined (via ArkType)', () => {
        expect(() => randomParamsSchema.assert({ lowerBound: undefined as any, upperBound: 5 })).toThrow(
            /lowerBound must be a number \(was undefined\)/
        )
    })

    // Removed unused @ts-expect-error
    it('Should throw TraversalError when upperBound is undefined (via ArkType)', () => {
        expect(() => randomParamsSchema.assert({ lowerBound: 0, upperBound: undefined as any })).toThrow(
            /upperBound must be a number \(was undefined\)/
        )
    })
})
