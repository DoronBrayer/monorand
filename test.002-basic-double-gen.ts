/**
 * shuffrand Test Suite - Basic Double Generation
 *
 * This file contains fundamental test cases for the `cryptoRandom` function
 * when generating basic double values within specified inclusive ranges.
 * Adheres to a flat, dot-categorized, kebab-cased structure for clarity.
 *
 * @author Doron Brayer <doronbrayer@outlook.com>
 * @license MIT
 */

import { strict as assert } from 'node:assert'
import { cryptoRandom } from './src.function.crypto-random.js' // Import from compiled barrel file

/**
 * Runs test cases for basic double generation using cryptoRandom.
 * @returns {void}
 */
export function testBasicDoubleGeneration(): void {
    console.log('\n--- Testing cryptoRandom: Basic Double Generation ---')

    // Test 1: Basic double generation (0.0 to 1.0 inclusive) - From primitive TC02
    try {
        const testID = 'TC01-DBL-BASIC'
        const num = cryptoRandom({ lowerBound: 0, upperBound: 1, typeOfNum: 'double' })
        assert(num >= 0 && num <= 1, `[${testID}] Failed: Expected >=0 and <=1, got ${num}`)
        console.log(`[${testID}] Passed: Basic double generation (0.0 to 1.0). Result: ${num}`)
    } catch (e: any) {
        console.error(`[TC01-DBL-BASIC] Test Failed: ${e.message}`)
    }

    // Test 2: Double in a specific range [10.0, 20.0] inclusive with 2 frac digits - From primitive TC04
    try {
        const testID = 'TC02-DBL-RANGE-FRAC'
        const lowerBound = 10
        const upperBound = 20
        const maxFracDigits = 2
        const num = cryptoRandom({
            lowerBound: lowerBound,
            upperBound: upperBound,
            typeOfNum: 'double',
            maxFracDigits: maxFracDigits,
        })
        assert(
            num >= lowerBound && num <= upperBound,
            `[${testID}] Failed: Expected double in [${lowerBound},${upperBound}], got ${num}`
        )
        const decimalPlaces = num.toString().includes('.') ? num.toString().split('.')[1].length : 0
        assert(
            decimalPlaces <= maxFracDigits,
            `[${testID}] Failed: Expected ${maxFracDigits} frac digits, got ${decimalPlaces} for ${num}`
        )
        console.log(
            `[${testID}] Passed: Double in specific range [${lowerBound},${upperBound}] with ${maxFracDigits} frac digits. Result: ${num}`
        )
    } catch (e: any) {
        console.error(`[TC02-DBL-RANGE-FRAC] Test Failed: ${e.message}`)
    }

    // Test 3: Fractional digits for double (maxFracDigits: 2) - From primitive TC11
    try {
        const testID = 'TC03-DBL-FRAC-2'
        const lowerBound = 1.5
        const upperBound = 5.5
        const typeOfNum = 'double'
        const maxFracDigits = 2
        const exclusion = 'none'

        const actualYield = cryptoRandom({
            lowerBound: lowerBound,
            upperBound: upperBound,
            typeOfNum: typeOfNum,
            maxFracDigits: maxFracDigits,
            exclusion: exclusion,
        })

        const decimalPlaces = actualYield.toString().includes('.') ? actualYield.toString().split('.')[1].length : 0
        assert(
            decimalPlaces <= maxFracDigits,
            `[${testID}] Failed: Expected <= ${maxFracDigits} decimal places, got ${decimalPlaces} for ${actualYield}`
        )
        console.log(
            `[${testID}] Passed: Fractional digits for double (maxFracDigits: ${maxFracDigits}). Result: ${actualYield}`
        )
    } catch (e: any) {
        console.error(`[TC03-DBL-FRAC-2] Test Failed: ${e.message}`)
    }

    // Test 4: Different Max Fractional Digits (maxFracDigits: 5) - From primitive TC16
    try {
        const testID = 'TC04-DBL-FRAC-5'
        const lowerBound = 1.5
        const upperBound = 5.5
        const typeOfNum = 'double'
        const maxFracDigits = 5
        const exclusion = 'none'

        const actualYield = cryptoRandom({
            lowerBound: lowerBound,
            upperBound: upperBound,
            typeOfNum: typeOfNum,
            maxFracDigits: maxFracDigits,
            exclusion: exclusion,
        })

        const decimalPlaces = actualYield.toString().includes('.') ? actualYield.toString().split('.')[1].length : 0
        assert(
            decimalPlaces <= maxFracDigits,
            `[${testID}] Failed: Expected <= ${maxFracDigits} decimal places, got ${decimalPlaces} for ${actualYield}`
        )
        console.log(
            `[${testID}] Passed: Different Max Fractional Digits (maxFracDigits: ${maxFracDigits}). Result: ${actualYield}`
        )
    } catch (e: any) {
        console.error(`[TC04-DBL-FRAC-5] Test Failed: ${e.message}`)
    }

    // Test 5: Ultra-high maxFractDigits (clamped to 15) - From primitive TC32
    try {
        const testID = 'TC05-DBL-FRAC-ULTRA'
        const typeOfNum = 'double'
        const maxFracDigits = 26 // This should be clamped internally to 15
        const expectedQtyOfFractionalDigits = 15 // Max precision for JS doubles

        const actualYield = cryptoRandom({
            typeOfNum: typeOfNum,
            maxFracDigits: maxFracDigits,
        })

        const actualQtyOfFractionalDigits = actualYield.toString().includes('.')
            ? actualYield.toString().split('.')[1].length
            : 0
        // We can't guarantee exactly 15, but it should be <= 15 and greater than 0 for a random double
        assert(
            actualQtyOfFractionalDigits <= expectedQtyOfFractionalDigits,
            `[${testID}] Failed: Expected <= ${expectedQtyOfFractionalDigits} frac digits, got ${actualQtyOfFractionalDigits}`
        )
        // Also check it's not an integer if maxFracDigits > 0
        if (expectedQtyOfFractionalDigits > 0) {
            assert(
                actualQtyOfFractionalDigits > 0 || actualYield === 0 || actualYield === 1,
                `[${testID}] Failed: Expected fractional part, got integer for ${actualYield}`
            )
        }
        console.log(
            `[${testID}] Passed: Ultra-high maxFracDigits. Result: ${actualYield} (${actualQtyOfFractionalDigits} digits)`
        )
    } catch (e: any) {
        console.error(`[TC05-DBL-FRAC-ULTRA] Test Failed: ${e.message}`)
    }

    // Test 6: Twelve fractional digits - From primitive TC33
    try {
        const testID = 'TC06-DBL-FRAC-12'
        const typeOfNum = 'double'
        const maxFracDigits = 12
        const expectedQtyOfFractionalDigits = 12

        const actualYield = cryptoRandom({
            typeOfNum: typeOfNum,
            maxFracDigits: maxFracDigits,
        })

        const actualQtyOfFractionalDigits = actualYield.toString().includes('.')
            ? actualYield.toString().split('.')[1].length
            : 0
        assert(
            actualQtyOfFractionalDigits <= expectedQtyOfFractionalDigits,
            `[${testID}] Failed: Expected <= ${expectedQtyOfFractionalDigits} frac digits, got ${actualQtyOfFractionalDigits}`
        )
        // Also check it's not an integer if maxFracDigits > 0
        if (expectedQtyOfFractionalDigits > 0) {
            assert(
                actualQtyOfFractionalDigits > 0 || actualYield === 0 || actualYield === 1,
                `[${testID}] Failed: Expected fractional part, got integer for ${actualYield}`
            )
        }
        console.log(
            `[${testID}] Passed: Twelve fractional digits. Result: ${actualYield} (${actualQtyOfFractionalDigits} digits)`
        )
    } catch (e: any) {
        console.error(`[TC06-DBL-FRAC-12] Test Failed: ${e.message}`)
    }

    // Test 7: Zero fractional digits (should yield an integer-like double) - From primitive TC34
    try {
        const testID = 'TC07-DBL-FRAC-0'
        const typeOfNum = 'double'
        const maxFracDigits = 0

        const actualYield = cryptoRandom({
            typeOfNum: typeOfNum,
            maxFracDigits: maxFracDigits,
        })

        const decimalPlaces = actualYield.toString().includes('.') ? actualYield.toString().split('.')[1].length : 0
        assert.strictEqual(
            decimalPlaces,
            0,
            `[${testID}] Failed: Expected 0 decimal places, got ${decimalPlaces} for ${actualYield}`
        )
        assert(Number.isInteger(actualYield), `[${testID}] Failed: Expected an integer value, got ${actualYield}`)
        console.log(`[${testID}] Passed: Zero fractional digits. Result: ${actualYield}`)
    } catch (e: any) {
        console.error(`[TC07-DBL-FRAC-0] Test Failed: ${e.message}`)
    }
}
