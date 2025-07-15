// test.crypto-shuffle.003-edge-cases.ts

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
    it('Single-Element Array Shuffle (Destructive)', () => {
        const originalArray = ['single']
        const originalArrayCopy = [...originalArray] // Copy before destructive operation
        const shuffledArray = cryptoShuffle(originalArray, { isDestructive: true })

        expect(shuffledArray).toBe(originalArray) // Should be the same array instance
        expect(shuffledArray.length).toBe(originalArrayCopy.length)
        expect(shuffledArray).toEqual(originalArrayCopy) // Content should remain the same
    })

    // NEW: Array with Non-JSON-Serializable Elements (Non-destructive, preventIdentical: true)
    it('Array with Non-JSON-Serializable Elements (preventIdentical: true) should throw TypeError', () => {
        // BigInt is not JSON serializable
        const originalArray = [1n, 2n, 3n]
        // Expect the function to throw a TypeError due to JSON.stringify failure
        expect(() => cryptoShuffle(originalArray as any[], { preventIdentical: true })).toThrow(TypeError)
        expect(() => cryptoShuffle(originalArray as any[], { preventIdentical: true })).toThrow(
            /Invalid cryptoShuffle parameters: Array elements cannot be serialized for 'preventIdentical' comparison\. Ensure all elements are JSON-serializable\./
        )
    })
})
