// test.crypto-shuffle.001-defaults.ts

/**
 * shuffrand Test Suite - TC001 (Shuffle): Default Parameters (Non-destructive, empty array)
 *
 * This file tests the cryptoShuffle function with no parameters,
 * expecting an empty array to be returned (non-destructive behavior).
 * This is the first test case in the cryptoShuffle series, using detailed logging.
 *
 * @author Doron Brayer <doronbrayer@outlook.com>
 * @license MIT
 */

import { strict as assert } from 'node:assert';
import { cryptoShuffle } from './index.js'; // Import the function from your library's barrel file
import { processArray } from './test.util.process-array.js'; // <-- IMPORT processArray for logging

/**
 * Runs test case TC001 (Shuffle) for cryptoShuffle: Default Parameters (Non-destructive, empty array).
 * @returns {void}
 */
export function testCryptoShuffleTC001(): void {
    const testID = 'TC001 (Shuffle)';
    console.log(`\n--- Running cryptoShuffle Test Case ${testID}: Default Parameters (Non-destructive, empty array) ---`);

    try {
        // Log initial state and parameters for clarity
        console.log(`[${testID}] Testing cryptoShuffle with no parameters (default behavior).`);
        console.log(`  - Expected input: empty array []`);
        console.log(`  - Expected isDestructive: false (default)`);

        const result = cryptoShuffle();

        // Log results
        console.log(`[${testID}] Returned array: ${processArray(result)} (length: ${result.length})`);

        // --- ASSERTIONS FOR TEST PASS/FAIL ---
        assert(Array.isArray(result), `[${testID}] Failed: Expected an array, got ${typeof result}`);
        assert.strictEqual(result.length, 0, `[${testID}] Failed: Expected an empty array, got length ${result.length}`);

        console.log(`[${testID}] Passed: Default Parameters (Non-destructive, empty array).`);
    } catch (e: any) {
        console.error(`[${testID}] Test Failed: ${e.message}`);
    }
}