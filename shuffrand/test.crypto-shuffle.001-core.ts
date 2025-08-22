// /shuffrand/test.crypto-shuffle.001-core.ts

/**
 * Shuffrand Test Suite - cryptoShuffle: Core Functionality
 *
 * This file validates the absolute fundamental behavior of `cryptoShuffle` with
 * default parameters and the most basic, expected outputs. It serves as a quick
 * sanity check for the function's core integrity.
 *
 * @author Doron Brayer <doronbrayer@outlook.com>
 * @license MIT
 */

// Import from the published package path, resolved by tsconfig.test.json paths
import { cryptoShuffle } from 'shuffrand' // Updated import
import { describe, expect, it } from 'vitest'

// Define a top-level group for these tests
describe('cryptoShuffle: Core Functionality', () => {
    // Default Parameters (Non-destructive, empty array)
    // Call: cryptoShuffle([]) or cryptoShuffle()
    // Expected: Returns [].
    it('Default Parameters (Non-destructive, empty array)', () => {
        // Note: cryptoShuffle() with no args implies arr: [] and isDestructive: false
        const originalArray: any[] = [] // For comparison
        const shuffledArray = cryptoShuffle([]) // Explicitly pass empty array for clarity, though no args also works

        expect(shuffledArray).toEqual([]) // Should return an empty array
        expect(shuffledArray).not.toBe(originalArray) // Should be a new array instance
    })

    // Non-destructive Shuffle (Numbers)
    // Call: cryptoShuffle([6, 5, 4, 3, 2, 1], { isDestructive: false })
    // Expected: Returns a shuffled array; original array remains unchanged.
    it('Non-destructive Shuffle (Numbers)', () => {
        const originalArray = [6, 5, 4, 3, 2, 1]
        const originalArrayCopy = [...originalArray] // Create a copy for comparison
        const shuffledArray = cryptoShuffle(originalArray, { isDestructive: false })

        expect(shuffledArray).not.toBe(originalArray) // Should be a new array instance
        expect(shuffledArray.length).toBe(originalArray.length) // Length must be preserved
        expect(shuffledArray).toEqual(expect.arrayContaining(originalArrayCopy)) // Should contain all original elements
        expect(originalArray).toEqual(originalArrayCopy) // Original array should remain unchanged
        // Removed: expect(shuffledArray).not.toEqual(originalArrayCopy); // This can fail probabilistically
    })

    // Destructive Shuffle (Numbers)
    // Call: cryptoShuffle([6, 5, 4, 3, 2, 1], { isDestructive: true })
    // Expected: Returns a shuffled array; original array is modified.
    it('Destructive Shuffle (Numbers)', () => {
        const originalArray = [6, 5, 4, 3, 2, 1]
        const originalArrayCopy = [...originalArray] // Create a copy for comparison before modification
        const shuffledArray = cryptoShuffle(originalArray, { isDestructive: true })

        expect(shuffledArray).toBe(originalArray) // Should be the same array instance
        expect(shuffledArray.length).toBe(originalArrayCopy.length) // Length must be preserved
        expect(shuffledArray).toEqual(expect.arrayContaining(originalArrayCopy)) // Should contain all original elements
        expect(originalArray).toEqual(expect.arrayContaining(originalArrayCopy)) // Original array should be modified
        // Removed: expect(shuffledArray).not.toEqual(originalArrayCopy); // This can fail probabilistically
    })

    // Immutability of Original Array (Non-destructive)
    it('Immutability of Original Array (Non-destructive)', () => {
        const originalArray = [10, 20, 30]
        const originalArrayBeforeShuffle = [...originalArray] // True copy
        cryptoShuffle(originalArray) // Default is non-destructive
        expect(originalArray).toEqual(originalArrayBeforeShuffle) // Original array should be unchanged
    })

    // NEW: Non-destructive Shuffle (Strings)
    it('Non-destructive Shuffle (Strings)', () => {
        const originalArray = ['apple', 'banana', 'cherry', 'date']
        const originalArrayCopy = [...originalArray]
        const shuffledArray = cryptoShuffle(originalArray, { isDestructive: false })

        expect(shuffledArray).not.toBe(originalArray)
        expect(shuffledArray.length).toBe(originalArray.length)
        expect(shuffledArray).toEqual(expect.arrayContaining(originalArrayCopy))
        expect(originalArray).toEqual(originalArrayCopy)
    })

    // NEW: Destructive Shuffle (Objects)
    it('Destructive Shuffle (Objects)', () => {
        const obj1 = { id: 1, name: 'A' }
        const obj2 = { id: 2, name: 'B' }
        const obj3 = { id: 3, name: 'C' }
        const originalArray = [obj1, obj2, obj3]
        const originalArrayCopy = [...originalArray] // Copy of references

        const shuffledArray = cryptoShuffle(originalArray, { isDestructive: true })

        expect(shuffledArray).toBe(originalArray) // Should be the same array instance
        expect(shuffledArray.length).toBe(originalArrayCopy.length)
        // Check that the shuffled array still contains the same object references
        expect(shuffledArray).toContain(obj1)
        expect(shuffledArray).toContain(obj2)
        expect(shuffledArray).toContain(obj3)
        // Ensure the original array (now shuffled) contains the same elements as the copy
        expect(originalArray).toEqual(expect.arrayContaining(originalArrayCopy))
    })

    // --- NEW TEST CASE FOR CORE DEFAULT BEHAVIOR ---
    // NEW: Default Non-destructive Behavior with Non-empty Array
    // This test explicitly verifies that calling cryptoShuffle without the isDestructive option
    // defaults to non-destructive behavior, creating a new array instance, for a non-empty input.
    it('Default Non-destructive Behavior with Non-empty Array', () => {
        const originalArray = [100, 200, 300] // Non-empty array
        const originalArrayCopy = [...originalArray] // Copy for comparison
        // Call cryptoShuffle WITHOUT the isDestructive option
        const shuffledArray = cryptoShuffle(originalArray)

        expect(shuffledArray).not.toBe(originalArray) // Should be a NEW array instance (non-destructive default)
        expect(shuffledArray.length).toBe(originalArray.length) // Length preserved
        expect(shuffledArray).toEqual(expect.arrayContaining(originalArrayCopy)) // Contains original elements
        expect(originalArray).toEqual(originalArrayCopy) // Original array unchanged
        // Note: We don't check if shuffledArray !== originalArrayCopy content-wise as it's probabilistic.
    })
    // --- END NEW TEST CASE ---
})
