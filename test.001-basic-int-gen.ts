/**
 * shuffrand Test Suite - Basic Integer Generation
 *
 * This file contains fundamental test cases for the `cryptoRandom` function
 * when generating basic integer values within specified inclusive ranges.
 * Adheres to a flat, dot-categorized, kebab-cased structure for clarity.
 *
 * @author Doron Brayer <doronbrayer@outlook.com>
 * @license MIT
 */

import { strict as assert } from 'node:assert'
import { cryptoRandom } from './src.function.crypto-random.js' // Import from compiled barrel file

/**
 * Runs test cases for basic integer generation using cryptoRandom.
 * @returns {void}
 */
export function testBasicIntegerGeneration(): void {
    console.log('\n--- Testing cryptoRandom: Basic Integer Generation ---')

    // Test 1: Basic integer generation (0 or 1 inclusive)
    try {
        const testID = 'TC01-INT-BASIC'
        const num = cryptoRandom({ lowerBound: 0, upperBound: 1, typeOfNum: 'integer' })
        assert(num === 0 || num === 1, `[${testID}] Failed: Expected 0 or 1, got ${num}`)
        console.log(`[${testID}] Passed: Basic integer generation (0 or 1). Result: ${num}`)
    } catch (e: any) {
        console.error(`[TC01-INT-BASIC] Test Failed: ${e.message}`)
    }

    // Test 2: Integer in a specific range [5, 10] inclusive
    try {
        const testID = 'TC02-INT-RANGE'
        const num = cryptoRandom({ lowerBound: 5, upperBound: 10, typeOfNum: 'integer' })
        assert(num >= 5 && num <= 10, `[${testID}] Failed: Expected integer in [5,10], got ${num}`)
        console.log(`[${testID}] Passed: Integer in specific range [5,10]. Result: ${num}`)
    } catch (e: any) {
        console.error(`[TC02-INT-RANGE] Test Failed: ${e.message}`)
    }

    // Test 3: Zero Bounds (integer) - From your primitive TC15
    try {
        const testID = 'TC03-INT-ZERO'
        const lowerBound = 0
        const upperBound = 0
        const typeOfNum = 'integer'
        const exclusion = 'none' // Explicitly none for this basic test
        const expectedYield = 0

        const actualYield = cryptoRandom({
            lowerBound: lowerBound,
            upperBound: upperBound,
            typeOfNum: typeOfNum,
            exclusion: exclusion,
        })

        assert.strictEqual(
            actualYield,
            expectedYield,
            `[${testID}] Failed: Expected ${expectedYield}, got ${actualYield}`
        )
        console.log(`[${testID}] Passed: Zero bounds (integer). Result: ${actualYield}`)
    } catch (e: any) {
        console.error(`[TC03-INT-ZERO] Test Failed: ${e.message}`)
    }

    // Test 4: Negative Bounds (integer) - From your primitive TC14
    try {
        const testID = 'TC04-INT-NEG'
        const lowerBound = -10
        const upperBound = -1
        const typeOfNum = 'integer'
        const exclusion = 'none'
        // We can't assert a specific number, but we can assert it's within the range
        const num = cryptoRandom({
            lowerBound: lowerBound,
            upperBound: upperBound,
            typeOfNum: typeOfNum,
            exclusion: exclusion,
        })
        assert(
            num >= lowerBound && num <= upperBound,
            `[${testID}] Failed: Expected integer in [${lowerBound},${upperBound}], got ${num}`
        )
        console.log(`[${testID}] Passed: Negative bounds (integer). Result: ${num}`)
    } catch (e: any) {
        console.error(`[TC04-INT-NEG] Test Failed: ${e.message}`)
    }

    // Test 5: Negative Range (integer) - From your primitive TC31
    try {
        const testID = 'TC05-INT-NEG-RANGE'
        const lowerBound = -4
        const upperBound = -2
        const typeOfNum = 'integer'
        const num = cryptoRandom({
            lowerBound: lowerBound,
            upperBound: upperBound,
            typeOfNum: typeOfNum,
        })
        assert(
            num >= lowerBound && num <= upperBound,
            `[${testID}] Failed: Expected integer in [${lowerBound},${upperBound}], got ${num}`
        )
        console.log(`[${testID}] Passed: Negative range (integer). Result: ${num}`)
    } catch (e: any) {
        console.error(`[TC05-INT-NEG-RANGE] Test Failed: ${e.message}`)
    }

    // Test 6: lowerBound is greater than upperBound (integer) - From your primitive TC30a
    try {
        const testID = 'TC06-INT-LB-GT-UB'
        const lowerBound = 2
        const upperBound = 0
        const num = cryptoRandom({
            lowerBound: lowerBound,
            upperBound: upperBound,
            typeOfNum: 'integer',
        })
        // The function internally swaps, so we expect it to be in [0,2]
        assert(num >= 0 && num <= 2, `[${testID}] Failed: Expected integer in [0,2], got ${num}`)
        console.log(`[${testID}] Passed: lowerBound > upperBound (integer). Result: ${num}`)
    } catch (e: any) {
        console.error(`[TC06-INT-LB-GT-UB] Test Failed: ${e.message}`)
    }

    // Test 7: lowerBound is equal to upperBound (integer) - From your primitive TC30b
    try {
        const testID = 'TC07-INT-LB-EQ-UB'
        const lowerBound = 2
        const upperBound = 2
        const expectedYield = 2
        const num = cryptoRandom({
            lowerBound: lowerBound,
            upperBound: upperBound,
            typeOfNum: 'integer',
        })
        assert.strictEqual(num, expectedYield, `[${testID}] Failed: Expected ${expectedYield}, got ${num}`)
        console.log(`[${testID}] Passed: lowerBound == upperBound (integer). Result: ${num}`)
    } catch (e: any) {
        console.error(`[TC07-INT-LB-EQ-UB] Test Failed: ${e.message}`)
    }
}
