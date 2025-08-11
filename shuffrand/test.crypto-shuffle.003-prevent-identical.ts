// /shuffrand/test.crypto-shuffle.003-prevent-identical.ts

/**
 * Shuffrand Test Suite - cryptoShuffle: Prevent Identical Flag
 *
 * This file specifically tests the behavior of `cryptoShuffle` when the `preventIdentical`
 * flag is enabled, ensuring it correctly prevents the original array order from being
 * returned, while acknowledging the introduced statistical bias.
 *
 * @author Doron Brayer <doronbrayer@outlook.com>
 * @license MIT
 */

import { describe, it, expect } from 'vitest'
// Import from the published package path, resolved by tsconfig.test.json paths
import { cryptoShuffle } from 'shuffrand' // Updated import
// Import the deepCopyArray utility directly from its compiled location in dist
import { deepCopyArray } from './test.util.deep-copy-array.js' // Updated import path for compiled utility

// Define a top-level group for these tests
describe('cryptoShuffle: Prevent Identical Flag', () => {
    // preventIdentical: true with a two-item array
    // Call: cryptoShuffle([1, 2], { preventIdentical: true })
    // Expected: Returns a shuffled array that is not [1, 2]. It should be [2, 1].
    it('preventIdentical: true with a two-item array', () => {
        const originalArray = [1, 2]
        const originalArrayCopy = deepCopyArray(originalArray) // Use deepCopyArray for robust comparison setup
        const shuffledArray = cryptoShuffle(originalArray, { preventIdentical: true })

        expect(shuffledArray).not.toEqual(originalArrayCopy) // Should be different from original
        expect(shuffledArray).toEqual([2, 1]) // For 2 elements, it must be the swapped order
        expect(shuffledArray.length).toBe(originalArray.length) // Length must be preserved
        expect(shuffledArray).toEqual(expect.arrayContaining(originalArrayCopy)) // Should contain all original elements
    })

    // preventIdentical: true with a three-item array
    // Call: cryptoShuffle([1, 2, 3], { preventIdentical: true })
    // Expected: Returns a shuffled array that is not [1, 2, 3].
    it('preventIdentical: true with a three-item array', () => {
        const originalArray = [1, 2, 3]
        const originalArrayCopy = deepCopyArray(originalArray) // Use deepCopyArray for robust comparison setup
        const shuffledArray = cryptoShuffle(originalArray, { preventIdentical: true })

        expect(shuffledArray).not.toEqual(originalArrayCopy) // Should be different from original
        expect(shuffledArray.length).toBe(originalArray.length) // Length must be preserved
        expect(shuffledArray).toEqual(expect.arrayContaining(originalArrayCopy)) // Should contain all original elements
    })

    // preventIdentical: true with an empty array
    // Call: cryptoShuffle([], { preventIdentical: true })
    // Expected: Throws TypeError due to minimum length requirement.
    it('preventIdentical: true with an empty array should throw TypeError', () => {
        expect(() => cryptoShuffle([], { preventIdentical: true })).toThrow(TypeError)
        expect(() => cryptoShuffle([], { preventIdentical: true })).toThrow(
            "Invalid cryptoShuffle parameters: 'preventIdentical' requires an array with at least 2 elements to guarantee a different result."
        )
    })

    // preventIdentical: true with a single-item array
    // Call: cryptoShuffle([1], { preventIdentical: true })
    // Expected: Throws TypeError due to minimum length requirement.
    it('preventIdentical: true with a single-item array should throw TypeError', () => {
        expect(() => cryptoShuffle([1], { preventIdentical: true })).toThrow(TypeError)
        expect(() => cryptoShuffle([1], { preventIdentical: true })).toThrow(
            "Invalid cryptoShuffle parameters: 'preventIdentical' requires an array with at least 2 elements to guarantee a different result."
        )
    })

    // NEW: preventIdentical: true with a larger array (e.g., 10 elements)
    it('preventIdentical: true with a larger array (10 elements)', () => {
        const originalArray = Array.from({ length: 10 }, (_, i) => i + 1)
        const originalArrayCopy = deepCopyArray(originalArray)
        const shuffledArray = cryptoShuffle(originalArray, { preventIdentical: true })

        expect(shuffledArray).not.toEqual(originalArrayCopy) // Must not be identical
        expect(shuffledArray.length).toBe(originalArray.length)
        expect(shuffledArray).toEqual(expect.arrayContaining(originalArrayCopy)) // Must contain same elements
    })

    // NEW: preventIdentical: true with a destructive shuffle
    it('preventIdentical: true with a destructive shuffle', () => {
        const originalArray = [1, 2, 3, 4]
        const originalArrayCopy = deepCopyArray(originalArray) // Copy before destructive operation
        const shuffledArray = cryptoShuffle(originalArray, { isDestructive: true, preventIdentical: true })

        expect(shuffledArray).toBe(originalArray) // Should be the same array instance
        expect(shuffledArray).not.toEqual(originalArrayCopy) // Must not be identical to original state
        expect(shuffledArray.length).toBe(originalArrayCopy.length)
        expect(shuffledArray).toEqual(expect.arrayContaining(originalArrayCopy)) // Must contain same elements
    })

    // --- NEW TEST CASE FOR SUBARRAY SHUFFLE INTERACTION ---
    // NEW: preventIdentical compares the FULL output array against the FULL input array, even when shuffling a subarray.
    // This test ensures that if shuffling a subarray results in the full output array being identical to the full input,
    // the preventIdentical logic (swapping first/last of the FULL array) is correctly triggered.
    it('preventIdentical compares full arrays even when shuffling a subarray', () => {
        // Create an array where shuffling the middle subarray [1, 3) (elements 'B', 'C')
        // could theoretically leave the full array unchanged if not for preventIdentical.
        // e.g., Original: ['A', 'B', 'C', 'D'] -> Shuffle subarray [1,3] -> ['A', 'C', 'B', 'D'] (different)
        // OR -> ['A', 'B', 'C', 'D'] (identical full array).
        // If the result is identical to the full input, preventIdentical must swap first/last.
        const originalArray = ['A', 'B', 'C', 'D']
        const originalArrayCopy = deepCopyArray(originalArray)
        const startIndex = 1
        const endIndex = 3 // Shuffle elements at indices 1 and 2 ('B' and 'C')

        // Perform the shuffle with preventIdentical
        const shuffledArray = cryptoShuffle(originalArray, { startIndex, endIndex, preventIdentical: true })

        // Basic checks
        expect(shuffledArray.length).toBe(originalArrayCopy.length)
        expect(shuffledArray).toEqual(expect.arrayContaining(originalArrayCopy)) // Must be a permutation

        // The core assertion: The final output array must NOT be identical to the full original input array.
        // This validates that preventIdentical operates on the entire output, not just the shuffled subarray.
        expect(shuffledArray).not.toEqual(originalArrayCopy)

        // Additional check: The elements outside the shuffle range ([0] and [3]) might or might not have been swapped
        // due to preventIdentical's action on the full array. We cannot assert their specific state here,
        // only that the overall array is different.
    })
    // --- END NEW TEST CASE ---
})
