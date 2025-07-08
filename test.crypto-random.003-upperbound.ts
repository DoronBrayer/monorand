// test.003-crypto-random-upperbound.ts

/**
 * shuffrand Test Suite - TC003: Single Parameter: upperBound (Integer)
 *
 * This file tests the cryptoRandom function with only the upperBound parameter set,
 * expecting an integer within the adjusted default range [0, 3].
 *
 * @author Doron Brayer <doronbrayer@outlook.com>
 * @license MIT
 */

import { strict as assert } from 'node:assert';
import { cryptoRandom } from './index.js'; // Import the function from your library's barrel file

/**
 * Runs test case TC03 for cryptoRandom: Single Parameter: upperBound (Integer).
 * @returns {void}
 */
export function testCryptoRandomTC003(): void {
    const testID = 'TC003';
    console.log(`\n--- Running cryptoRandom Test Case ${testID}: Single Parameter: upperBound (Integer) ---`);

    try {
        const upperBound = 3;
        const result = cryptoRandom({ upperBound });
        assert(result >= 0 && result <= 3 && Number.isInteger(result),
            `[${testID}] Failed: Expected integer in [0, 3], got ${result}`);
        console.log(`[${testID}] Passed: Single Parameter: upperBound (Integer). Result: ${result}`);
    } catch (e: any) {
        console.error(`[${testID}] Test Failed: ${e.message}`);
    }
}