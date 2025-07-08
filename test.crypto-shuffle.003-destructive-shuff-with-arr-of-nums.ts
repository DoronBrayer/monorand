// test.crypto-shuffle.003-destructive-shuff-with-arr-of-nums.ts

/**
 * shuffrand Test Suite - TC003 (Shuffle): Destructive Shuffle (Numbers)
 *
 * This file tests the cryptoShuffle function with a numeric array and isDestructive set to true,
 * expecting the original array to be shuffled in place (destructive behavior).
 * It uses the detailed logging style.
 *
 * @author Doron Brayer <doronbrayer@outlook.com>
 * @license MIT
 */

import { strict as assert } from 'node:assert';
import { cryptoShuffle } from './index.js'; // Import the function from your library's barrel file
import { processArray } from './test.util.process-array.js'; // Import processArray for beautified logging

/**
 * Runs test case TC003 (Shuffle) for cryptoShuffle: Destructive Shuffle (Numbers).
 * @returns {void}
 */
export function testCryptoShuffleTC003(): void {
    const testID = 'TC003 (Shuffle)';
    console.log(`\n--- Running cryptoShuffle Test Case ${testID}: Destructive Shuffle (Numbers) ---`);

    try {
        const originalArray = [6, 5, 4, 3, 2, 1];
        // Create a copy of the *initial elements* to compare against later,
        // as the originalArray itself will be modified destructively.
        const initialElementsCopy = [...originalArray];
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

        // 2. Assert that the original array's length remains unchanged
        assert.strictEqual(originalArray.length, initialElementsCopy.length,
            `[${testID}] Failed: Original array length was modified.`);

        // 3. Assert that the original array (now shuffled in place) contains the same elements
        //    as it started with (permutation check). Use initialElementsCopy for this.
        const sortedInitialElements = [...initialElementsCopy].sort((a, b) => a - b);
        const sortedCurrentOriginal = [...originalArray].sort((a, b) => a - b);
        assert.deepStrictEqual(sortedCurrentOriginal, sortedInitialElements,
            `[${testID}] Failed: Shuffled original array does not contain the same elements as it started with.`);

        // 4. Robust Probabilistic Check: Ensure the array is actually shuffled (i.e., not identical to original order)
        // We will run the shuffle multiple times to increase confidence.
        const NUM_SHUFFLE_ATTEMPTS = 100;
        let hasShuffledDifferently = false;
        // Use the stringified initial state for comparison
        const initialArrayString = JSON.stringify(initialElementsCopy);

        for (let i = 0; i < NUM_SHUFFLE_ATTEMPTS; i++) {
            // To test shuffling, we need to re-shuffle a fresh copy each time
            const tempArrayForShuffle = [...initialElementsCopy]; // Start with original elements
            cryptoShuffle({ arr: tempArrayForShuffle, isDestructive: true }); // Shuffle destructively
            if (JSON.stringify(tempArrayForShuffle) !== initialArrayString) {
                hasShuffledDifferently = true;
                break; // Found a different shuffle, no need to continue
            }
        }
        assert(hasShuffledDifferently,
            `[${testID}] Failed: After ${NUM_SHUFFLE_ATTEMPTS} attempts, cryptoShuffle (destructive) never produced an array different from the original. This indicates a potential issue with shuffling logic.`);

        console.log(`[${testID}] Passed: Destructive Shuffle (Numbers).`);
    } catch (e: any) {
        console.error(`[${testID}] Test Failed: ${e.message}`);
    }
}