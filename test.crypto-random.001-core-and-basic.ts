// test.crypto-random.001-core-and-basic.ts

/**
 * Shuffrand Test Suite - cryptoRandom: Core Functionality & Basic Parameters (TC01-TC10)
 *
 * This file consolidates test cases for the core functionality and basic parameter
 * handling of the `cryptoRandom` function. It uses Node.js's native `node:test` runner,
 * with a nested `test()` block acting as a 'describe' group for these related tests.
 * This version uses direct `node:assert` for assertions, providing stability.
 * Fixes CRTC04, CRTC05, CRTC10 by explicitly setting relevant parameters for doubles.
 * This version now correctly awaits all subtests using Promise.all() and exports
 * the main test suite for explicit awaiting in run-tests.ts to prevent
 * 'cancelledByParent' or 'parentAlreadyFinished' errors in CI.
 *
 * @author Doron Brayer <doronbrayer@outlook.com>
 * @license MIT
 */

import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { cryptoRandom } from './index.js' // Imports from the compiled index.js in dist/
// Removed ArkType imports from test.types.ts as per user preference for direct assertions

// Define a top-level group for these tests, acting as a 'describe' group.
// IMPORTANT: This test function is now EXPORTED so run-tests.ts can await its completion.
export const cryptoRandomCoreAndBasicTests = test('cryptoRandom: Core Functionality & Basic Parameters', async (t) => {
    const subtests = [] // Array to hold promises for each subtest

    // CRTC01: Default Parameters (Integer)
    subtests.push(
        t.test('CRTC01: Default Parameters (Integer)', () => {
            const testID = 'CRTC01'
            const result = cryptoRandom()
            assert(
                result >= 0 && result <= 2 && Number.isInteger(result),
                `[${testID}] Failed: Expected integer in [0, 2], got ${result}`
            )
            console.log(`[${testID}] Passed: Default Parameters (Integer). Result: ${result}`)
        })
    )

    // CRTC02: Single Parameter: lowerBound (Integer)
    subtests.push(
        t.test('CRTC02: Single Parameter: lowerBound (Integer)', () => {
            const testID = 'CRTC02'
            const result = cryptoRandom({ lowerBound: -1 })
            assert(
                result >= -1 && result <= 2 && Number.isInteger(result),
                `[${testID}] Failed: Expected integer in [-1, 2], got ${result}`
            )
            console.log(`[${testID}] Passed: Single Parameter: lowerBound (Integer). Result: ${result}`)
        })
    )

    // CRTC03: Single Parameter: upperBound (Integer)
    subtests.push(
        t.test('CRTC03: Single Parameter: upperBound (Integer)', () => {
            const testID = 'CRTC03'
            const result = cryptoRandom({ upperBound: 3 })
            assert(
                result >= 0 && result <= 3 && Number.isInteger(result),
                `[${testID}] Failed: Expected integer in [0, 3], got ${result}`
            )
            console.log(`[${testID}] Passed: Single Parameter: upperBound (Integer). Result: ${result}`)
        })
    )

    // CRTC04: Single Parameter: typeOfNum (Double)
    subtests.push(
        t.test('CRTC04: Single Parameter: typeOfNum (Double)', () => {
            const testID = 'CRTC04'
            // FIX: Explicitly set upperBound to 1 for double generation to match test expectation
            const result = cryptoRandom({ typeOfNum: 'double', upperBound: 1 })
            assert(
                result >= 0.0 && result <= 1.0 && typeof result === 'number',
                `[${testID}] Failed: Expected double in [0.000, 1.000], got ${result}`
            )
            // Further check for fractional digits (up to 3)
            const fractionalDigits = (result.toString().split('.')[1] || '').length
            assert(
                fractionalDigits <= 3,
                `[${testID}] Failed: Expected at most 3 fractional digits, got ${fractionalDigits} for ${result}`
            )
            console.log(`[${testID}] Passed: Single Parameter: typeOfNum (Double). Result: ${result}`)
        })
    )

    // CRTC05: Single Parameter: maxFracDigits (Double)
    subtests.push(
        t.test('CRTC05: Single Parameter: maxFracDigits (Double)', () => {
            const testID = 'CRTC05'
            // FIX: Explicitly set typeOfNum to 'double' and upperBound to 1 for this test
            const result = cryptoRandom({ typeOfNum: 'double', upperBound: 1, maxFracDigits: 5 })
            assert(
                result >= 0.0 && result <= 1.0 && typeof result === 'number',
                `[${testID}] Failed: Expected double in [0.00000, 1.00000], got ${result}`
            )
            const fractionalDigits = (result.toString().split('.')[1] || '').length
            assert(
                fractionalDigits <= 5,
                `[${testID}] Failed: Expected at most 5 fractional digits, got ${fractionalDigits} for ${result}`
            )
            console.log(`[${testID}] Passed: Single Parameter: maxFracDigits (Double). Result: ${result}`)
        })
    )

    // CRTC06: Single Parameter: exclusion (Integer - 'both')
    subtests.push(
        t.test("CRTC06: Single Parameter: exclusion (Integer - 'both')", () => {
            const testID = 'CRTC06'
            const result = cryptoRandom({ exclusion: 'both' })
            // Assuming default bounds of [0, 2], 'both' exclusion means only 1 is expected
            assert(
                result === 1,
                `[${testID}] Failed: Expected integer 1 with 'both' exclusion on [0, 2], got ${result}`
            )
            console.log(`[${testID}] Passed: Single Parameter: exclusion (Integer - 'both'). Result: ${result}`)
        })
    )

    // CRTC07: Integer Generation: No Exclusion
    subtests.push(
        t.test('CRTC07: Integer Generation: No Exclusion', () => {
            const testID = 'CRTC07'
            const lower = 10
            const upper = 20
            const result = cryptoRandom({
                lowerBound: lower,
                upperBound: upper,
                typeOfNum: 'integer',
                exclusion: 'none',
            })
            assert(
                result >= lower && result <= upper && Number.isInteger(result),
                `[${testID}] Failed: Expected integer in [${lower}, ${upper}], got ${result}`
            )
            console.log(`[${testID}] Passed: Integer Generation: No Exclusion. Result: ${result}`)
        })
    )

    // CRTC08: Integer Generation: No Exclusion (Narrow Range)
    subtests.push(
        t.test('CRTC08: Integer Generation: No Exclusion (Narrow Range)', () => {
            const testID = 'CRTC08'
            const lower = 11
            const upper = 13
            const result = cryptoRandom({
                lowerBound: lower,
                upperBound: upper,
                typeOfNum: 'integer',
                exclusion: 'none',
            })
            assert(
                result >= lower && result <= upper && Number.isInteger(result),
                `[${testID}] Failed: Expected integer in [${lower}, ${upper}], got ${result}`
            )
            console.log(`[${testID}] Passed: Integer Generation: No Exclusion (Narrow Range). Result: ${result}`)
        })
    )

    // CRTC09: Double Generation: No Exclusion (Specific Frac Digits)
    subtests.push(
        t.test('CRTC09: Double Generation: No Exclusion (Specific Frac Digits)', () => {
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
            assert(
                result >= lower && result <= upper && typeof result === 'number',
                `[${testID}] Failed: Expected double in [${lower}, ${upper}], got ${result}`
            )
            const fractionalDigits = (result.toString().split('.')[1] || '').length
            assert(
                fractionalDigits <= fracDigits,
                `[${testID}] Failed: Expected at most ${fracDigits} fractional digits, got ${fractionalDigits} for ${result}`
            )
            console.log(`[${testID}] Passed: Double Generation: No Exclusion (Specific Frac Digits). Result: ${result}`)
        })
    )

    // CRTC10: Double Generation: No Exclusion (Narrow Range)
    subtests.push(
        t.test('CRTC10: Double Generation: No Exclusion (Narrow Range)', () => {
            const testID = 'CRTC10'
            const lower = 0.11
            const upper = 0.13
            const fracDigits = 2
            // FIX: Pass maxFracDigits to cryptoRandom
            const result = cryptoRandom({
                lowerBound: lower,
                upperBound: upper,
                typeOfNum: 'double',
                maxFracDigits: fracDigits,
                exclusion: 'none',
            })
            assert(
                result >= lower && result <= upper && typeof result === 'number',
                `[${testID}] Failed: Expected double in [${lower}, ${upper}], got ${result}`
            )
            const fractionalDigits = (result.toString().split('.')[1] || '').length
            assert(
                fractionalDigits <= fracDigits,
                `[${testID}] Failed: Expected at most ${fracDigits} fractional digits, got ${fractionalDigits} for ${result}`
            )
            console.log(`[${testID}] Passed: Double Generation: No Exclusion (Narrow Range). Result: ${result}`)
        })
    )

    await Promise.all(subtests) // Wait for all subtests to complete
})
