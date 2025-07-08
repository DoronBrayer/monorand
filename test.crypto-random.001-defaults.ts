// test.001-crypto-random-defaults.ts

/**
 * shuffrand Test Suite - TC001: Default Parameters (Integer)
 *
 * This file tests the cryptoRandom function with no parameters,
 * expecting an integer within the default range [0, 2].
 *
 * @author Doron Brayer <doronbrayer@outlook.com>
 * @license MIT
 */

import { strict as assert } from 'node:assert';
import { cryptoRandom } from './index.js'; // Import the function from your library's barrel file

/**
 * Runs test case TC01 for cryptoRandom: Default Parameters (Integer).
 * @returns {void}
 */
export function testCryptoRandomTC001(): void {
    const testID = 'TC001';
    console.log(`\n--- Running cryptoRandom Test Case ${testID}: Default Parameters (Integer) ---`);

    try {
        const result = cryptoRandom();
        assert(result >= 0 && result <= 2 && Number.isInteger(result),
            `[${testID}] Failed: Expected integer in [0, 2], got ${result}`);
        console.log(`[${testID}] Passed: Default Parameters (Integer). Result: ${result}`);
    } catch (e: any) {
        console.error(`[${testID}] Test Failed: ${e.message}`);
    }
}