// test.crypto-shuffle.002-nondestructive-shuff-with-arr-of-nums.ts

/**
 * shuffrand Test Suite - TC002 (Shuffle): Non-destructive Shuffle (Numbers)
 *
 * This file tests the cryptoShuffle function with a numeric array and isDestructive set to false,
 * expecting a shuffled copy of the array while the original remains unchanged.
 * It draws inspiration from previous test logging styles for clarity and includes a robust
 * probabilistic check to ensure the array is actually shuffled.
 *
 * @author Doron Brayer <doronbrayer@outlook.com>
 * @license MIT
 */

import { strict as assert } from 'node:assert';
import { cryptoShuffle } from './index.js'; // Import the function from your library's barrel file
import { processArray } from './test.util.process-array.js'; // Import processArray for beautified logging

/**
 * Runs test case TC002 (Shuffle) for cryptoShuffle: Non-destructive Shuffle (Numbers).
 * @returns {void}
 */
export function testCryptoShuffleTC002(): void {
    const testID = 'TC002 (Shuffle)';
    console.log(`\n--- Running cryptoShuffle Test Case ${testID}: Non-destructive Shuffle (Numbers) ---`);

    try {
        const originalArray = [6, 5, 4, 3, 2, 1];
        const isDestructive = false;

        // Log initial state and parameters for clarity
        console.log(`[${testID}] Testing cryptoShuffle with:`);
        console.log(`  - arr: ${processArray(originalArray)} (length: ${originalArray.length})`);
        console.log(`  - isDestructive: ${isDestructive}`);

        // Perform the shuffle
        const shuffledArray = cryptoShuffle({ arr: originalArray, isDestructive: isDestructive });

        // Log results and state after shuffle
        console.log(`[${testID}] Shuffled array (returned): ${processArray(shuffledArray)} (length: ${shuffledArray.length})`);
        console.log(`[${testID}] Original array (after shuffle): ${processArray(originalArray)} (length: ${originalArray.length})`);

        // --- ASSERTIONS FOR TEST PASS/FAIL ---

        // 1. Assert that the original array remains unchanged (non-destructive)
        assert.deepStrictEqual(originalArray, [6, 5, 4, 3, 2, 1],
            `[${testID}] Failed: Original array was modified (destructive).`);

        // 2. Assert that a new array instance is returned (non-destructive)
        assert.notStrictEqual(shuffledArray, originalArray,
            `[${testID}] Failed: Returned array is the same instance as original (destructive).`);

        // 3. Assert that the shuffled array has the same length as the original
        assert.strictEqual(shuffledArray.length, originalArray.length,
            `[${testID}] Failed: Shuffled array length mismatch.`);

        // 4. Assert that the shuffled array contains the same elements as the original (permutation check)
        const sortedOriginal = [...originalArray].sort((a, b) => a - b);
        const sortedShuffled = [...shuffledArray].sort((a, b) => a - b);
        assert.deepStrictEqual(sortedShuffled, sortedOriginal,
            `[${testID}] Failed: Shuffled array does not contain the same elements as original (elements mismatch).`);

        // 5. Robust Probabilistic Check: Ensure the array is actually shuffled (i.e., not identical to original)
        const NUM_SHUFFLE_ATTEMPTS = 100;
        let hasShuffledDifferently = false;
        const originalArrayString = JSON.stringify(originalArray); // Stringify once for efficiency

        for (let i = 0; i < NUM_SHUFFLE_ATTEMPTS; i++) {
            const currentShuffled = cryptoShuffle({ arr: originalArray, isDestructive: false });
            // Compare stringified versions to check for difference
            if (JSON.stringify(currentShuffled) !== originalArrayString) {
                hasShuffledDifferently = true;
                break; // Found a different shuffle, no need to continue
            }
        }
        assert(hasShuffledDifferently,
            `[${testID}] Failed: After ${NUM_SHUFFLE_ATTEMPTS} attempts, cryptoShuffle never produced an array different from the original. This indicates a potential issue with shuffling logic.`);

        console.log(`[${testID}] Passed: Non-destructive Shuffle (Numbers).`);
    } catch (e: any) {
        console.error(`[${testID}] Test Failed: ${e.message}`);
    }
}