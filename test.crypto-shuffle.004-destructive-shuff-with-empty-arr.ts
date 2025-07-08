// test.crypto-shuffle.004-destructive-shuff-with-empty-arr.ts

/**
 * shuffrand Test Suite - TC004 (Shuffle): Destructive Shuffle (Empty Array)
 *
 * This file tests the cryptoShuffle function with an empty array and isDestructive set to true,
 * expecting an empty array to be returned (destructive behavior, though no actual shuffle occurs).
 *
 * @author Doron Brayer <doronbrayer@outlook.com>
 * @license MIT
 */

import { strict as assert } from 'node:assert';
import { cryptoShuffle } from './index.js'; // Import the function from your library's barrel file
import { processArray } from './test.util.process-array.js'; // Import processArray for beautified logging

/**
 * Runs test case TC004 (Shuffle) for cryptoShuffle: Destructive Shuffle (Empty Array).
 * @returns {void}
 */
export function testCryptoShuffleTC004(): void {
    const testID = 'TC004 (Shuffle)';
    console.log(`\n--- Running cryptoShuffle Test Case ${testID}: Destructive Shuffle (Empty Array) ---`);

    try {
        const originalArray: any[] = []; // Explicitly empty array
        const isDestructive = true;

        // Log initial state and parameters for clarity
        console.log(`[${testID}] Testing cryptoShuffle with:`);
        console.log(`  - arr: ${processArray(originalArray)} (length: ${originalArray.length})`);
        console.log(`  - isDestructive: ${isDestructive}`);

        const returnedArray = cryptoShuffle({ arr: originalArray, isDestructive: isDestructive });

        // Log results and state after shuffle
        console.log(`[${testID}] Returned array: ${processArray(returnedArray)} (length: ${returnedArray.length})`);
        console.log(`[${testID}] Original array (after shuffle): ${processArray(originalArray)} (length: ${originalArray.length})`);

        // --- ASSERTIONS FOR TEST PASS/FAIL ---

        // 1. Assert that the returned array is the SAME instance as the original array (destructive)
        assert.strictEqual(returnedArray, originalArray,
            `[${testID}] Failed: Returned array is NOT the same instance as original (not destructive).`);

        // 2. Assert that the array remains empty
        assert.strictEqual(originalArray.length, 0,
            `[${testID}] Failed: Original array length was modified. Expected 0, got ${originalArray.length}.`);
        assert.strictEqual(returnedArray.length, 0,
            `[${testID}] Failed: Returned array length was modified. Expected 0, got ${returnedArray.length}.`);

        // 3. Assert that the array content remains empty
        assert.deepStrictEqual(originalArray, [],
            `[${testID}] Failed: Original array content was modified.`);
        assert.deepStrictEqual(returnedArray, [],
            `[${testID}] Failed: Returned array content was modified.`);

        console.log(`[${testID}] Passed: Destructive Shuffle (Empty Array).`);
    } catch (e: any) {
        console.error(`[${testID}] Test Failed: ${e.message}`);
    }
}