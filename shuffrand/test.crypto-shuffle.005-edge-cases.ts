// /shuffrand/test.crypto-shuffle.005-edge-cases.ts

/**
 * Shuffrand Test Suite - cryptoShuffle: Edge Cases
 *
 * This file validates the behavior of `cryptoShuffle` with various edge cases
 * like empty arrays, single-element arrays, and large arrays. It ensures
 * that the function handles these inputs correctly and maintains array integrity.
 *
 * @author Doron Brayer <doronbrayer@outlook.com>
 * @license MIT
 */

import { describe, it, expect } from 'vitest'
// Import from the published package path, resolved by tsconfig.test.json paths
import { cryptoShuffle } from 'shuffrand' // Updated import

// Define a top-level group for these tests
describe('cryptoShuffle: Edge Cases', () => {
    // Empty Array Shuffle (Explicit Input)
    // Call: cryptoShuffle([])
    // Expected: Returns [].
    it('Empty Array Shuffle (Explicit Input)', () => {
        const originalArray: any[] = []
        const shuffledArray = cryptoShuffle(originalArray) // Default is non-destructive

        expect(shuffledArray).toEqual([]) // Should return an empty array
        expect(shuffledArray).not.toBe(originalArray) // Should be a new array instance
    })

    // Empty Array Shuffle (Default isDestructive)
    // Call: cryptoShuffle()
    // Expected: Returns [].
    it('Empty Array Shuffle (Default isDestructive)', () => {
        // When no array is provided, it defaults to an empty array and non-destructive
        const shuffledArray = cryptoShuffle()

        expect(shuffledArray).toEqual([])
        // The result will be a new empty array, so it won't be 'toBe' an implicitly created empty array.
    })

    // Single-Element Array Shuffle (Non-destructive)
    // Call: cryptoShuffle([1], { isDestructive: false })
    // Expected: Returns [1]; original array remains unchanged.
    it('Single-Element Array Shuffle (Non-destructive)', () => {
        const originalArray = [1]
        const originalArrayCopy = [...originalArray]
        const shuffledArray = cryptoShuffle(originalArray, { isDestructive: false })

        expect(shuffledArray).toEqual([1]) // Should remain the same
        expect(shuffledArray).not.toBe(originalArray) // Should be a new array instance
        expect(originalArray).toEqual(originalArrayCopy) // Original array should remain unchanged
    })

    // Single-Element Array Shuffle (Default isDestructive)
    // Call: cryptoShuffle([0])
    // Expected: Returns [0]; original array remains unchanged (as default is non-destructive).
    it('Single-Element Array Shuffle (Default isDestructive)', () => {
        const originalArray = [0]
        const originalArrayCopy = [...originalArray]
        const shuffledArray = cryptoShuffle(originalArray) // Default is non-destructive

        expect(shuffledArray).toEqual([0]) // Should remain the same
        expect(shuffledArray).not.toBe(originalArray) // Should be a new array instance
        expect(originalArray).toEqual(originalArrayCopy) // Original array should remain unchanged
    })

    // Large Array Shuffle (1000 elements)
    // Call: cryptoShuffle(Array.from({ length: 1000 }, (_, i) => i))
    // Expected: Returns a shuffled array; original array remains unchanged.
    it('Large Array Shuffle (1000 elements)', () => {
        const originalArray = Array.from({ length: 1000 }, (_, i) => i)
        const originalArrayCopy = [...originalArray]
        const shuffledArray = cryptoShuffle(originalArray) // Default is non-destructive

        expect(shuffledArray).not.toBe(originalArray) // Should be a new array instance
        expect(shuffledArray.length).toBe(originalArray.length) // Length must be preserved
        expect(shuffledArray).toEqual(expect.arrayContaining(originalArrayCopy)) // Should contain all original elements
        expect(originalArray).toEqual(originalArrayCopy) // Original array should remain unchanged
        // Removed: expect(shuffledArray).not.toEqual(originalArrayCopy); // This can fail probabilistically
    })

    // Overpopulated Array (4000 elements)
    // Call: cryptoShuffle(Array.from({ length: 4000 }, (_, i) => i))
    // Expected: Returns a shuffled array; original array remains unchanged.
    it('Overpopulated Array (4000 elements)', () => {
        const originalArray = Array.from({ length: 4000 }, (_, i) => i)
        const originalArrayCopy = [...originalArray]
        const shuffledArray = cryptoShuffle(originalArray) // Default is non-destructive

        expect(shuffledArray).not.toBe(originalArray) // Should be a new array instance
        expect(shuffledArray.length).toBe(originalArray.length) // Length must be preserved
        expect(shuffledArray).toEqual(expect.arrayContaining(originalArrayCopy)) // Should contain all original elements
        expect(originalArray).toEqual(originalArrayCopy) // Original array should remain unchanged
        // Removed: expect(shuffledArray).not.toEqual(originalArrayCopy); // This can fail probabilistically
    })

    // Array with Many Duplicates (Large Scale)
    it('Array with Many Duplicates (Large Scale)', () => {
        // Create an array with 1000 elements, where half are 'A' and half are 'B'
        const originalArray = Array(500).fill('A').concat(Array(500).fill('B'))
        const originalArrayCopy = [...originalArray]
        const shuffledArray = cryptoShuffle(originalArray)

        expect(shuffledArray).not.toBe(originalArray)
        expect(shuffledArray.length).toBe(originalArray.length)
        expect(shuffledArray).toEqual(expect.arrayContaining(originalArrayCopy))
        expect(originalArray).toEqual(originalArrayCopy)
        // Removed: expect(shuffledArray).not.toEqual(originalArrayCopy); // Still highly unlikely to be identical
    })

    // NEW: Single-Element Array Shuffle (Destructive)
    it('Single-Element Array Shuffle (Destructive) should throw TypeError', () => {
        // Test that isDestructive with a single-element range throws the new minimum length error.
        expect(() => cryptoShuffle(['single'], { isDestructive: true })).toThrow(TypeError)
        expect(() => cryptoShuffle(['single'], { isDestructive: true })).toThrow(
            "Invalid cryptoShuffle parameters: 'isDestructive' requires a shuffle range (defined by startIndex/endIndex) with at least 2 elements to potentially modify the original array."
        )
    })

    // NEW: Array with Non-JSON-Serializable Elements (preventIdentical: true) should throw TypeError
    it('Array with Non-JSON-Serializable Elements (preventIdentical: true) should throw TypeError', () => {
        // BigInt is not JSON serializable
        const originalArray = [1n, 2n, 3n]
        // Expect the function to throw a TypeError due to JSON.stringify failure
        expect(() => cryptoShuffle(originalArray as any[], { preventIdentical: true })).toThrow(TypeError)
        expect(() => cryptoShuffle(originalArray as any[], { preventIdentical: true })).toThrow(
            'Invalid cryptoShuffle parameters: Do not know how to serialize a BigInt'
        )
    })

    // --- NEW POSITIVE TEST CASES FOR FEATURE MINIMUM LENGTH ENFORCEMENTS ---

    // NEW: Should work correctly when preventIdentical is true and array has 2 or more elements
    it('Should work correctly when preventIdentical is true and array has 2 or more elements', () => {
        // Test with a 2-element array where shuffle could theoretically result in identity (though unlikely)
        // The key is that it should NOT throw the new minimum length error.
        const originalArray = [1, 2]
        const originalArrayCopy = [...originalArray]
        expect(() => cryptoShuffle(originalArray, { preventIdentical: true })).not.toThrow() // Should not throw minimum length error

        // Perform the shuffle
        const shuffledArray = cryptoShuffle(originalArray, { preventIdentical: true })

        // Basic checks
        expect(shuffledArray.length).toBe(originalArrayCopy.length)
        expect(shuffledArray).toEqual(expect.arrayContaining(originalArrayCopy))

        // The core guarantee of preventIdentical is that the final output is different from the input.
        // For [1, 2], the only other permutation is [2, 1].
        // While probabilistically possible to get [1, 2] back, the preventIdentical logic should swap first/last,
        // guaranteeing [2, 1] if the initial shuffle was [1, 2].
        // Therefore, the result should be [2, 1]. Let's assert that.
        // Note: This test relies on the specific behavior of preventIdentical and the small array size.
        // For larger arrays, we wouldn't assert the exact output, just that it's different (which we can't do reliably).
        // However, for this 2-element case, we can be specific.
        // Actually, the shuffle itself is random, so it could produce [2, 1] directly.
        // If it produces [1, 2], preventIdentical swaps first/last -> [2, 1].
        // If it produces [2, 1], preventIdentical leaves it.
        // So the final result is guaranteed to be [2, 1] only if we assume the initial shuffle always produces [1, 2].
        // That's not true. The initial shuffle can produce [2, 1].
        // Therefore, the final result could be either [1, 2] or [2, 1].
        // The only guarantee is it's not identical to the original *if* the initial shuffle was identical.
        // But since the initial shuffle is random, we can't predict the final state precisely just based on preventIdentical.
        // The main point of this test is to ensure NO ERROR is thrown for a 2-element array.
        // Let's just check it's one of the two valid permutations and not the original (which it cannot be due to preventIdentical).
        // Wait, no. If the shuffle produces [2, 1], preventIdentical does nothing. If it produces [1, 2], preventIdentical swaps -> [2, 1].
        // So the final result is either [2, 1] (if initial was [2, 1]) or [2, 1] (if initial was [1, 2]).
        // Hmm, that's not right either. Let's trace:
        // Original: [1, 2]
        // Shuffle step (Fisher–Yates):
        //   i=1: j = cryptoRandom({ lowerBound: 0, upperBound: 1 }) -> j is 0 or 1.
        //     If j=1: swap arr[1] and arr[1] -> [1, 2] (no change)
        //     If j=0: swap arr[1] and arr[0] -> [2, 1]
        // So after shuffle: [1, 2] or [2, 1]
        // preventIdentical check:
        //   If shuffledArray === [1, 2]: swap first/last -> [2, 1]
        //   If shuffledArray === [2, 1]: do nothing.
        // Final result: [2, 1] or [2, 1].
        // Therefore, the final result is ALWAYS [2, 1] for a 2-element array with preventIdentical=true.
        // This is a specific behavior of the algorithm on 2 elements.
        expect(shuffledArray).toEqual([2, 1]) // This is the guaranteed result for [1, 2] with preventIdentical.

        // Original array should be unchanged for non-destructive default
        expect(originalArray).toEqual(originalArrayCopy)
    })

    // NEW: Should work correctly when isDestructive is true and the shuffle range has 2 or more elements
    it('Should work correctly when isDestructive is true and the shuffle range has 2 or more elements', () => {
        // Test with a 3-element array and a subarray range [0, 3) which includes 3 elements (indices 0, 1, 2).
        // The key is that it should NOT throw the new minimum length error for isDestructive.
        const originalArray = ['a', 'b', 'c']
        const originalArrayCopy = [...originalArray] // Copy before destructive operation

        // This call should not throw the new isDestructive minimum length error.
        expect(() => cryptoShuffle(originalArray, { isDestructive: true, startIndex: 0, endIndex: 3 })).not.toThrow(
            "Invalid cryptoShuffle parameters: 'isDestructive' requires a shuffle range (defined by startIndex/endIndex) with at least 2 elements to potentially modify the original array."
        )

        // Perform the shuffle (destructive)
        const shuffledArray = cryptoShuffle(originalArray, { isDestructive: true, startIndex: 0, endIndex: 3 })

        // Checks for destructive behavior and correctness
        expect(shuffledArray).toBe(originalArray) // Should be the same instance
        expect(shuffledArray.length).toBe(originalArrayCopy.length) // Length preserved
        // The content should be a permutation of the original
        expect(shuffledArray).toEqual(expect.arrayContaining(originalArrayCopy))
        // The originalArray variable now holds the shuffled content, so we can't directly compare it to originalArrayCopy anymore.
        // The fact that it's a permutation is the main check needed here, plus the instance check above.
    })

    it('Single-Element Array Shuffle (Destructive) should throw TypeError', () => {
        // Test that isDestructive with a single-element range throws the new minimum length error.
        expect(() => cryptoShuffle(['single'], { isDestructive: true })).toThrow(TypeError)
        expect(() => cryptoShuffle(['single'], { isDestructive: true })).toThrow(
            "Invalid cryptoShuffle parameters: 'isDestructive' requires a shuffle range (defined by startIndex/endIndex) with at least 2 elements to potentially modify the original array."
        )
    })

    // --- END NEW TEST CASES ---
})
