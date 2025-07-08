// test.002-crypto-random-lowerbound.ts

/**
 * shuffrand Test Suite - TC002: Single Parameter: lowerBound (Integer)
 *
 * This file tests the cryptoRandom function with only the lowerBound parameter set,
 * expecting an integer within the adjusted default range [-1, 2].
 *
 * @author Doron Brayer <doronbrayer@outlook.com>
 * @license MIT
 */

import { strict as assert } from 'node:assert';
import { cryptoRandom } from './index.js'; // Import the function from your library's barrel file

/**
 * Runs test case TC02 for cryptoRandom: Single Parameter: lowerBound (Integer).
 * @returns {void}
 */
export function testCryptoRandomTC002(): void {
    const testID = 'TC002';
    console.log(`\n--- Running cryptoRandom Test Case ${testID}: Single Parameter: lowerBound (Integer) ---`);

    try {
        const lowerBound = -1;
        const result = cryptoRandom({ lowerBound });
        assert(result >= -1 && result <= 2 && Number.isInteger(result),
            `[${testID}] Failed: Expected integer in [-1, 2], got ${result}`);
        console.log(`[${testID}] Passed: Single Parameter: lowerBound (Integer). Result: ${result}`);
    } catch (e: any) {
        console.error(`[${testID}] Test Failed: ${e.message}`);
    }
}