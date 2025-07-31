// test.crypto-shuffle.003-prevent-identical.ts

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
    // Expected: Returns [].
    it('preventIdentical: true with an empty array', () => {
        const originalArray: any[] = []
        const originalArrayCopy = deepCopyArray(originalArray) // Use deepCopyArray for robust comparison setup
        const shuffledArray = cryptoShuffle(originalArray, { preventIdentical: true })

        expect(shuffledArray).toEqual([]) // Should return an empty array
        expect(shuffledArray).not.toBe(originalArray) // Should be a new array instance (even if empty)
    })

    // preventIdentical: true with a single-item array
    // Call: cryptoShuffle([1], { preventIdentical: true })
    // Expected: Returns [1].
    it('preventIdentical: true with a single-item array', () => {
        const originalArray = [1]
        const originalArrayCopy = deepCopyArray(originalArray) // Use deepCopyArray for robust comparison setup
        const shuffledArray = cryptoShuffle(originalArray, { preventIdentical: true })

        expect(shuffledArray).toEqual([1]) // Should return the same single element
        expect(shuffledArray).not.toBe(originalArray) // Should be a new array instance
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
})
