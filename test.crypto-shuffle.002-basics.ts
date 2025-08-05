// test.crypto-shuffle.002-basics.ts

/**
 * Shuffrand Test Suite - cryptoShuffle: Basic Parameters & Array Types
 *
 * This file validates the behavior of `cryptoShuffle` with various basic array types
 * (duplicates, strings, objects, dates, nested arrays, mixed types) and common scenarios.
 * It ensures that the function handles these inputs correctly and maintains array integrity (length, content).
 *
 * @author Doron Brayer <doronbrayer@outlook.com>
 * @license MIT
 */
import { describe, it, expect } from 'vitest'
// Import from the published package path, resolved by tsconfig.test.json paths
import { cryptoShuffle } from 'shuffrand' // Updated import
// Import the deepCopyArray utility directly from its compiled location in dist
import { deepCopyArray } from './test.util.deep-copy-array.js' // CORRECTED import path for compiled utility

// Define a top-level group for these tests
describe('cryptoShuffle: Basic Parameters & Array Types', () => {
    // Array with Duplicate Elements Shuffle
    // Call: cryptoShuffle([1, 2, 1, 3, 2, 1])
    // Expected: Returns a shuffled array; original array remains unchanged.
    it('Array with Duplicate Elements Shuffle', () => {
        const originalArray = [1, 2, 1, 3, 2, 1]
        const originalArrayCopy = [...originalArray]
        const shuffledArray = cryptoShuffle(originalArray) // Default is non-destructive
        expect(shuffledArray).not.toBe(originalArray) // Should be a new array instance
        expect(shuffledArray.length).toBe(originalArray.length) // Length must be preserved
        expect(shuffledArray).toEqual(expect.arrayContaining(originalArrayCopy)) // Should contain all original elements
        expect(originalArray).toEqual(originalArrayCopy) // Original array should remain unchanged
        // Removed: expect(shuffledArray).not.toEqual(originalArrayCopy); // This can fail probabilistically
    })

    // Array of Strings Shuffle
    // Call: cryptoShuffle(['a', 'b', 'c', 'd', 'e', 'f'])
    // Expected: Returns a shuffled array; original array remains unchanged.
    it('Array of Strings Shuffle', () => {
        const originalArray = ['a', 'b', 'c', 'd', 'e', 'f']
        const originalArrayCopy = [...originalArray]
        const shuffledArray = cryptoShuffle(originalArray) // Default is non-destructive
        expect(shuffledArray).not.toBe(originalArray) // Should be a new array instance
        expect(shuffledArray.length).toBe(originalArray.length) // Length must be preserved
        expect(shuffledArray).toEqual(expect.arrayContaining(originalArrayCopy)) // Should contain all original elements
        expect(originalArray).toEqual(originalArrayCopy) // Original array should remain unchanged
        // Removed: expect(shuffledArray).not.toEqual(originalArrayCopy); // This can fail probabilistically
    })

    // Array of Objects Shuffle
    // Call: cryptoShuffle([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }])
    // Expected: Returns a shuffled array; original array remains unchanged.
    it('Array of Objects Shuffle', () => {
        const originalArray = [
            { id: 1, name: 'Alice' },
            { id: 2, name: 'Bob' },
            { id: 3, name: 'Charlie' },
            { id: 4, name: 'David' },
        ]
        // Use deepCopyArray for robust copying of objects
        const originalArrayCopy = deepCopyArray(originalArray)
        const shuffledArray = cryptoShuffle(originalArray) // Default is non-destructive
        expect(shuffledArray).not.toBe(originalArray) // Should be a new array instance
        expect(shuffledArray.length).toBe(originalArray.length) // Length must be preserved
        expect(shuffledArray).toEqual(expect.arrayContaining(originalArrayCopy)) // Should contain all original elements
        expect(originalArray).toEqual(originalArrayCopy) // Original array should remain unchanged
        // Removed: expect(shuffledArray).not.toEqual(originalArrayCopy); // This can fail probabilistically
    })

    // Array of Dates Shuffle
    // Call: cryptoShuffle([new Date('2019-12-31'), new Date('2021-01-31'), new Date('2022-02-28')])
    // Expected: Returns a shuffled array; original array remains unchanged.
    it('Array of Dates Shuffle', () => {
        const originalArray = [new Date('2019-12-31'), new Date('2021-01-31'), new Date('2022-02-28')]
        // Use deepCopyArray for robust copying of Date objects
        const originalArrayCopy = deepCopyArray(originalArray)
        const shuffledArray = cryptoShuffle(originalArray) // Default is non-destructive
        expect(shuffledArray).not.toBe(originalArray) // Should be a new array instance
        expect(shuffledArray.length).toBe(originalArray.length) // Length must be preserved
        // Explicitly type 'd' as Date to resolve TS7006
        expect(shuffledArray.map((d: Date) => d.getTime())).toEqual(
            expect.arrayContaining(originalArrayCopy.map((d: Date) => d.getTime()))
        ) // Compare by value
        expect(originalArrayCopy.map((d: Date) => d.getTime())).toEqual(originalArray.map((d: Date) => d.getTime())) // Ensure original copy wasn't modified
        // Removed: expect(shuffledArray.map((d: Date) => d.getTime())).not.toEqual(originalArrayCopy.map((d: Date) => d.getTime())); // This can fail probabilistically
    })

    // Array of Booleans Shuffle
    // Call: cryptoShuffle([true, false, true, false])
    // Expected: Returns a shuffled array; original array remains unchanged.
    it('Array of Booleans Shuffle', () => {
        const originalArray = [true, false, true, false]
        const originalArrayCopy = [...originalArray]
        const shuffledArray = cryptoShuffle(originalArray) // Default is non-destructive
        expect(shuffledArray).not.toBe(originalArray) // Should be a new array instance
        expect(shuffledArray.length).toBe(originalArray.length) // Length must be preserved
        expect(shuffledArray).toEqual(expect.arrayContaining(originalArrayCopy)) // Should contain all original elements
        expect(originalArrayCopy).toEqual(originalArray) // Ensure original copy wasn't modified by shuffle (non-destructive)
        // Removed: expect(shuffledArray).not.toEqual(originalArrayCopy); // This can fail probabilistically
    })

    // Array of Arrays Shuffle (Nested Arrays)
    // Call: cryptoShuffle([[1, 2], [3, 4], [5, 6]])
    // Expected: Returns a shuffled array; original array remains unchanged.
    it('Array of Arrays Shuffle (Nested Arrays)', () => {
        const originalArray = [
            [1, 2],
            [3, 4],
            [5, 6],
        ]
        // Use deepCopyArray for robust copying of nested arrays
        const originalArrayCopy = deepCopyArray(originalArray)
        const shuffledArray = cryptoShuffle(originalArray) // Default is non-destructive
        expect(shuffledArray).not.toBe(originalArray) // Should be a new array instance
        expect(shuffledArray.length).toBe(originalArray.length) // Length must be preserved
        expect(shuffledArray).toEqual(expect.arrayContaining(originalArrayCopy)) // Should contain all original elements
        expect(originalArrayCopy).toEqual(originalArray) // Ensure original copy wasn't modified
        // Removed: expect(shuffledArray).not.toEqual(originalArrayCopy); // This can fail probabilistically
    })

    // Array of Mixed Data Types (Mishmash) Shuffle
    // Call: cryptoShuffle([1, 'hello', true, { a: 1 }, null, undefined, [7, 8], new Date()])
    // Expected: Returns a shuffled array; original array remains unchanged.
    it('Array of Mixed Data Types (Mishmash) Shuffle', () => {
        const originalArray = [1, 'hello', true, { a: 1 }, null, undefined, [7, 8], new Date()]
        // Use the custom deep copy helper for mixed types
        const originalArrayCopy = deepCopyArray(originalArray)
        const shuffledArray = cryptoShuffle(originalArray) // Default is non-destructive
        expect(shuffledArray).not.toBe(originalArray) // Should be a new array instance
        expect(shuffledArray.length).toBe(originalArray.length) // Length must be preserved
        expect(shuffledArray).toEqual(expect.arrayContaining(originalArrayCopy)) // Should contain all original elements
        expect(originalArray).toEqual(originalArrayCopy) // Original array should remain unchanged
        // Removed: expect(shuffledArray).not.toEqual(originalArrayCopy); // This can fail probabilistically
    })

    // Array with Null Elements
    it('Array with Null Elements', () => {
        const originalArray = [1, null, 3, null, 5]
        const originalArrayCopy = deepCopyArray(originalArray) // Use deepCopyArray
        const shuffledArray = cryptoShuffle(originalArray)
        expect(shuffledArray).not.toBe(originalArray)
        expect(shuffledArray.length).toBe(originalArray.length)
        expect(shuffledArray).toEqual(expect.arrayContaining(originalArrayCopy))
        expect(originalArray).toEqual(originalArrayCopy)
        // Removed: expect(shuffledArray).not.toEqual(originalArrayCopy);
    })

    // Array with Undefined Elements
    it('Array with Undefined Elements', () => {
        const originalArray = [undefined, 2, undefined, 4, undefined]
        const originalArrayCopy = deepCopyArray(originalArray) // Use deepCopyArray
        const shuffledArray = cryptoShuffle(originalArray)
        expect(shuffledArray).not.toBe(originalArray)
        expect(shuffledArray.length).toBe(originalArray.length)
        expect(shuffledArray).toEqual(expect.arrayContaining(originalArrayCopy))
        expect(originalArray).toEqual(originalArrayCopy)
        // Removed: expect(shuffledArray).not.toEqual(originalArrayCopy);
    })

    // Array with Mixed Null and Undefined Elements
    it('Array with Mixed Null and Undefined Elements', () => {
        const originalArray = [1, null, undefined, 4, null, 6, undefined]
        const originalArrayCopy = deepCopyArray(originalArray) // Use deepCopyArray
        const shuffledArray = cryptoShuffle(originalArray)
        expect(shuffledArray).not.toBe(originalArray)
        expect(shuffledArray.length).toBe(originalArray.length)
        expect(shuffledArray).toEqual(expect.arrayContaining(originalArrayCopy))
        expect(originalArray).toEqual(originalArrayCopy)
        // Removed: expect(shuffledArray).not.toEqual(originalArrayCopy);
    })

    // NEW: Single Element Array Shuffle
    it('Single Element Array Shuffle', () => {
        const originalArray = [42]
        const originalArrayCopy = [...originalArray]
        const shuffledArray = cryptoShuffle(originalArray)
        expect(shuffledArray).not.toBe(originalArray) // Still a new instance for non-destructive
        expect(shuffledArray.length).toBe(originalArray.length)
        expect(shuffledArray).toEqual(originalArrayCopy) // Should remain the same content
    })

    // --- NEW TEST CASE FOR EXPLICIT isDestructive: false ---
    // NEW: Array of Objects Shuffle with isDestructive explicitly set to false
    // This test mirrors the "Array of Objects Shuffle" test but explicitly uses the isDestructive: false option.
    // It ensures that explicitly setting isDestructive to false behaves identically to the default non-destructive behavior.
    it('Array of Objects Shuffle with isDestructive explicitly set to false', () => {
        const originalArray = [
            { id: 'X', value: 100 },
            { id: 'Y', value: 200 },
            { id: 'Z', value: 300 },
        ]
        // Use deepCopyArray for robust copying of objects
        const originalArrayCopy = deepCopyArray(originalArray)
        // Explicitly set isDestructive: false
        const shuffledArray = cryptoShuffle(originalArray, { isDestructive: false })

        expect(shuffledArray).not.toBe(originalArray) // Should be a new array instance (non-destructive)
        expect(shuffledArray.length).toBe(originalArray.length) // Length must be preserved
        expect(shuffledArray).toEqual(expect.arrayContaining(originalArrayCopy)) // Should contain all original elements
        expect(originalArray).toEqual(originalArrayCopy) // Original array should remain unchanged
        // Note: We don't check if shuffledArray !== originalArrayCopy content-wise as it's probabilistic.
    })
    // --- END NEW TEST CASE ---
})
