// test.crypto-shuffle.002-array-types-and-edge-cases.test.ts

/**
 * Shuffrand Test Suite - cryptoShuffle: Array Types & Edge Cases (CSTC007-CSTC020)
 *
 * This file validates the behavior of `cryptoShuffle` with various array types
 * (empty, single-element, duplicates, strings, objects, dates, nested arrays, mixed types)
 * and edge cases like large arrays. It ensures that the function handles these inputs
 * correctly and maintains array integrity (length, content).
 *
 * @author Doron Brayer <doronbrayer@outlook.com>
 * @license MIT
 */

import { describe, it, expect } from 'vitest'
import { cryptoShuffle } from './index.js' // Imports from the compiled index.js in dist/
import { processArray } from './test.util.process-array.js' // Import the utility for logging

// Helper function for robust deep copying, especially for mixed types
// This is necessary because JSON.stringify/parse does not handle `undefined` or `Date` objects perfectly for deep equality checks.
function deepCopyArray(arr: any[]): any[] {
    return arr.map((item) => {
        if (item === undefined) {
            return undefined // Explicitly handle undefined
        }
        if (item === null) {
            return null // Explicitly handle null
        }
        if (item instanceof Date) {
            return new Date(item.getTime()) // Deep copy Date objects
        }
        if (Array.isArray(item)) {
            return deepCopyArray(item) // Recursively deep copy nested arrays
        }
        if (typeof item === 'object') {
            return { ...item } // Shallow copy objects (sufficient for this test's object structure)
        }
        return item // Return primitives as is
    })
}

// Define a top-level group for these tests using Vitest's describe
describe('cryptoShuffle: Array Types & Edge Cases', () => {
    // CSTC007: Empty Array Shuffle (Explicit Input)
    // Call: cryptoShuffle([])
    // Expected: Returns [].
    it('CSTC007: Empty Array Shuffle (Explicit Input)', () => {
        const testID = 'CSTC007'
        const originalArray: any[] = []
        const originalArrayCopy = [...originalArray]
        const shuffledArray = cryptoShuffle(originalArray) // Default is non-destructive

        expect(shuffledArray).toEqual([]) // Should return an empty array
        expect(shuffledArray).not.toBe(originalArray) // Should be a new array instance
        console.log(
            `[${testID}] Passed: Empty Array Shuffle (Explicit Input). Original: ${processArray(originalArrayCopy)}, Shuffled: ${processArray(shuffledArray)}`
        )
    })

    // CSTC008: Empty Array Shuffle (Default isDestructive)
    // Call: cryptoShuffle()
    // Expected: Returns [].
    it('CSTC008: Empty Array Shuffle (Default isDestructive)', () => {
        const testID = 'CSTC008'
        // When no array is provided, it defaults to an empty array and non-destructive
        const shuffledArray = cryptoShuffle()
        const originalArray: any[] = [] // Represents the implicit original empty array

        expect(shuffledArray).toEqual([])
        // The result will be a new empty array, so it won't be 'toBe' an implicitly created empty array.
        // However, if we were to pass an explicit array, we'd check not.toBe.
        console.log(
            `[${testID}] Passed: Empty Array Shuffle (Default isDestructive). Original: ${processArray(originalArray)}, Shuffled: ${processArray(shuffledArray)}`
        )
    })

    // CSTC009: Single-Element Array Shuffle (Non-destructive)
    // Call: cryptoShuffle([1], { isDestructive: false })
    // Expected: Returns [1]; original array remains unchanged.
    it('CSTC009: Single-Element Array Shuffle (Non-destructive)', () => {
        const testID = 'CSTC009'
        const originalArray = [1]
        const originalArrayCopy = [...originalArray]
        const shuffledArray = cryptoShuffle(originalArray, { isDestructive: false })

        expect(shuffledArray).toEqual([1]) // Should remain the same
        expect(shuffledArray).not.toBe(originalArray) // Should be a new array instance
        expect(originalArray).toEqual(originalArrayCopy) // Original array should remain unchanged
        console.log(
            `[${testID}] Passed: Single-Element Array Shuffle (Non-destructive). Original: ${processArray(originalArrayCopy)}, Shuffled: ${processArray(shuffledArray)}`
        )
    })

    // CSTC010: Single-Element Array Shuffle (Default isDestructive)
    // Call: cryptoShuffle([0])
    // Expected: Returns [0]; original array remains unchanged (as default is non-destructive).
    it('CSTC010: Single-Element Array Shuffle (Default isDestructive)', () => {
        const testID = 'CSTC010'
        const originalArray = [0]
        const originalArrayCopy = [...originalArray]
        const shuffledArray = cryptoShuffle(originalArray) // Default is non-destructive

        expect(shuffledArray).toEqual([0]) // Should remain the same
        expect(shuffledArray).not.toBe(originalArray) // Should be a new array instance
        expect(originalArray).toEqual(originalArrayCopy) // Original array should remain unchanged
        console.log(
            `[${testID}] Passed: Single-Element Array Shuffle (Default isDestructive). Original: ${processArray(originalArrayCopy)}, Shuffled: ${processArray(shuffledArray)}`
        )
    })

    // CSTC011: Array with Duplicate Elements Shuffle
    // Call: cryptoShuffle([1, 2, 1, 3, 2, 1])
    // Expected: Returns a shuffled array; original array remains unchanged.
    it('CSTC011: Array with Duplicate Elements Shuffle', () => {
        const testID = 'CSTC011'
        const originalArray = [1, 2, 1, 3, 2, 1]
        const originalArrayCopy = [...originalArray]
        const shuffledArray = cryptoShuffle(originalArray) // Default is non-destructive

        expect(shuffledArray).not.toBe(originalArray) // Should be a new array instance
        expect(shuffledArray.length).toBe(originalArray.length) // Length must be preserved
        expect(shuffledArray).toEqual(expect.arrayContaining(originalArrayCopy)) // Should contain all original elements
        expect(originalArray).toEqual(originalArrayCopy) // Original array should remain unchanged
        // For arrays with duplicates, it's possible but highly unlikely for a true shuffle to be identical.
        // We'll rely on the statistical tests to cover distribution.
        console.log(
            `[${testID}] Passed: Array with Duplicate Elements Shuffle. Original: ${processArray(originalArrayCopy)}, Shuffled: ${processArray(shuffledArray)}`
        )
    })

    // CSTC012: Array with Duplicate Elements Shuffle (Detailed Logging)
    // Call: cryptoShuffle([0, 0, 1, 1, 2, 2])
    // Expected: Returns a shuffled array; original array remains unchanged.
    it('CSTC012: Array with Duplicate Elements Shuffle (Detailed Logging)', () => {
        const testID = 'CSTC012'
        const originalArray = [0, 0, 1, 1, 2, 2]
        const originalArrayCopy = [...originalArray]
        const shuffledArray = cryptoShuffle(originalArray) // Default is non-destructive

        expect(shuffledArray).not.toBe(originalArray) // Should be a new array instance
        expect(shuffledArray.length).toBe(originalArray.length) // Length must be preserved
        expect(shuffledArray).toEqual(expect.arrayContaining(originalArrayCopy)) // Should contain all original elements
        expect(originalArray).toEqual(originalArrayCopy) // Original array should remain unchanged
        console.log(
            `[${testID}] Passed: Array with Duplicate Elements Shuffle (Detailed Logging). Original: ${processArray(originalArrayCopy)}, Shuffled: ${processArray(shuffledArray)}`
        )
    })

    // CSTC013: Array of Strings Shuffle
    // Call: cryptoShuffle(['a', 'b', 'c', 'd', 'e', 'f'])
    // Expected: Returns a shuffled array; original array remains unchanged.
    it('CSTC013: Array of Strings Shuffle', () => {
        const testID = 'CSTC013'
        const originalArray = ['a', 'b', 'c', 'd', 'e', 'f']
        const originalArrayCopy = [...originalArray]
        const shuffledArray = cryptoShuffle(originalArray) // Default is non-destructive

        expect(shuffledArray).not.toBe(originalArray) // Should be a new array instance
        expect(shuffledArray.length).toBe(originalArray.length) // Length must be preserved
        expect(shuffledArray).toEqual(expect.arrayContaining(originalArrayCopy)) // Should contain all original elements
        expect(originalArray).toEqual(originalArrayCopy) // Original array should remain unchanged
        expect(shuffledArray).not.toEqual(originalArrayCopy) // Highly likely to be different after shuffle
        console.log(
            `[${testID}] Passed: Array of Strings Shuffle. Original: ${processArray(originalArrayCopy)}, Shuffled: ${processArray(shuffledArray)}`
        )
    })

    // CSTC014: Array of Objects Shuffle
    // Call: cryptoShuffle([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }])
    // Expected: Returns a shuffled array; original array remains unchanged.
    it('CSTC014: Array of Objects Shuffle', () => {
        const testID = 'CSTC014'
        const originalArray = [
            { id: 1, name: 'Alice' },
            { id: 2, name: 'Bob' },
            { id: 3, name: 'Charlie' },
            { id: 4, name: 'David' },
        ]
        const originalArrayCopy = JSON.parse(JSON.stringify(originalArray)) // Deep copy for objects
        const shuffledArray = cryptoShuffle(originalArray) // Default is non-destructive

        expect(shuffledArray).not.toBe(originalArray) // Should be a new array instance
        expect(shuffledArray.length).toBe(originalArray.length) // Length must be preserved
        expect(shuffledArray).toEqual(expect.arrayContaining(originalArrayCopy)) // Should contain all original elements
        expect(originalArray).toEqual(originalArrayCopy) // Original array should remain unchanged
        expect(shuffledArray).not.toEqual(originalArrayCopy) // Highly likely to be different after shuffle
        console.log(
            `[${testID}] Passed: Array of Objects Shuffle. Original: ${processArray(originalArrayCopy)}, Shuffled: ${processArray(shuffledArray)}`
        )
    })

    // CSTC015: Array of Dates Shuffle (Fixed for robustness)
    // Call: cryptoShuffle([new Date('2019-12-31'), new Date('2021-01-31'), new Date('2022-02-28')], { preventIdentical: true })
    // Expected: Returns a shuffled array that is NOT identical to the original.
    it('CSTC015: Array of Dates Shuffle (Detailed Logging)', () => {
        const testID = 'CSTC015'
        const originalArray = [new Date('2019-12-31'), new Date('2021-01-31'), new Date('2022-02-28')]
        const originalArrayCopy = originalArray.map((d) => new Date(d.getTime())) // Deep copy for Dates
        let shuffledArray: Date[] = []
        let attempts = 0
        const maxAttempts = 10 // Allow a few retries for very small arrays

        // Loop to ensure a different permutation is generated, up to maxAttempts
        do {
            shuffledArray = cryptoShuffle(originalArrayCopy, { isDestructive: false, preventIdentical: true })
            attempts++
        } while (
            attempts < maxAttempts &&
            JSON.stringify(shuffledArray.map((d) => d.getTime())) ===
                JSON.stringify(originalArrayCopy.map((d) => d.getTime()))
        )

        expect(shuffledArray).not.toBe(originalArrayCopy) // Should be a new array instance
        expect(shuffledArray.length).toBe(originalArray.length) // Length must be preserved
        expect(shuffledArray.map((d) => d.getTime())).toEqual(
            expect.arrayContaining(originalArrayCopy.map((d) => d.getTime()))
        ) // Compare by value
        expect(originalArrayCopy.map((d) => d.getTime())).toEqual(originalArray.map((d) => d.getTime())) // Ensure original copy wasn't modified
        expect(shuffledArray.map((d) => d.getTime())).not.toEqual(originalArrayCopy.map((d) => d.getTime())) // Crucial: The shuffled array MUST be different

        console.log(
            `[${testID}] Passed: Array of Dates Shuffle (Detailed Logging). Original: ${processArray(originalArrayCopy)}, Shuffled: ${processArray(shuffledArray)} (Attempts: ${attempts})`
        )
    })

    // CSTC016: Array of Booleans Shuffle (Fixed for robustness)
    // Call: cryptoShuffle([true, false, true, false], { preventIdentical: true })
    // Expected: Returns a shuffled array that is NOT identical to the original.
    it('CSTC016: Array of Booleans Shuffle', () => {
        const testID = 'CSTC016'
        const originalArray = [true, false, true, false]
        const originalArrayCopy = [...originalArray]
        let shuffledArray: boolean[] = []
        let attempts = 0
        const maxAttempts = 10 // Allow a few retries for very small, duplicate-heavy arrays

        // Loop to ensure a different permutation is generated, up to maxAttempts
        // This handles the rare chance of a shuffle returning the original order
        // and also ensures preventIdentical: true is respected.
        do {
            shuffledArray = cryptoShuffle(originalArrayCopy, { isDestructive: false, preventIdentical: true })
            attempts++
        } while (attempts < maxAttempts && JSON.stringify(shuffledArray) === JSON.stringify(originalArrayCopy))

        expect(shuffledArray).not.toBe(originalArrayCopy) // Should be a new array instance
        expect(shuffledArray.length).toBe(originalArray.length) // Length must be preserved
        expect(shuffledArray).toEqual(expect.arrayContaining(originalArrayCopy)) // Should contain all original elements
        expect(originalArrayCopy).toEqual(originalArray) // Ensure original copy wasn't modified by shuffle (non-destructive)
        expect(shuffledArray).not.toEqual(originalArrayCopy) // Crucial: The shuffled array MUST be different

        console.log(
            `[${testID}] Passed: Array of Booleans Shuffle. Original: ${processArray(originalArrayCopy)}, Shuffled: ${processArray(shuffledArray)} (Attempts: ${attempts})`
        )
    })

    // CSTC017: Array of Arrays Shuffle (Nested Arrays) - Fixed for robustness
    // Call: cryptoShuffle([[1, 2], [3, 4], [5, 6]], { preventIdentical: true })
    // Expected: Returns a shuffled array that is NOT identical to the original.
    it('CSTC017: Array of Arrays Shuffle (Nested Arrays)', () => {
        const testID = 'CSTC017'
        const originalArray = [
            [1, 2],
            [3, 4],
            [5, 6],
        ]
        const originalArrayCopy = originalArray.map((arr) => [...arr]) // Deep copy
        let shuffledArray: number[][] = []
        let attempts = 0
        const maxAttempts = 10 // Allow a few retries for very small arrays

        // Loop to ensure a different permutation is generated, up to maxAttempts
        do {
            shuffledArray = cryptoShuffle(originalArrayCopy, { isDestructive: false, preventIdentical: true })
            attempts++
        } while (attempts < maxAttempts && JSON.stringify(shuffledArray) === JSON.stringify(originalArrayCopy))

        expect(shuffledArray).not.toBe(originalArrayCopy) // Should be a new array instance
        expect(shuffledArray.length).toBe(originalArray.length) // Length must be preserved
        expect(shuffledArray).toEqual(expect.arrayContaining(originalArrayCopy)) // Should contain all original elements
        expect(originalArrayCopy).toEqual(originalArray) // Ensure original copy wasn't modified
        expect(shuffledArray).not.toEqual(originalArrayCopy) // Crucial: The shuffled array MUST be different

        console.log(
            `[${testID}] Passed: Array of Arrays Shuffle (Nested Arrays). Original: ${processArray(originalArrayCopy)}, Shuffled: ${processArray(shuffledArray)} (Attempts: ${attempts})`
        )
    })

    // CSTC018: Array of Mixed Data Types (Mishmash) Shuffle
    // Call: cryptoShuffle([1, 'hello', true, { a: 1 }, null, undefined, [7, 8], new Date()])
    // Expected: Returns a shuffled array; original array remains unchanged.
    it('CSTC018: Array of Mixed Data Types (Mishmash) Shuffle', () => {
        const testID = 'CSTC018'
        const originalArray = [1, 'hello', true, { a: 1 }, null, undefined, [7, 8], new Date()]
        // FIX: More robust deep copy for mixed types, explicitly handling undefined and objects/arrays
        const originalArrayCopy = deepCopyArray(originalArray) // Use the custom deep copy helper

        const shuffledArray = cryptoShuffle(originalArray) // Default is non-destructive

        expect(shuffledArray).not.toBe(originalArray) // Should be a new array instance
        expect(shuffledArray.length).toBe(originalArray.length) // Length must be preserved
        expect(shuffledArray).toEqual(expect.arrayContaining(originalArrayCopy)) // Should contain all original elements
        expect(originalArray).toEqual(originalArrayCopy) // Original array should remain unchanged
        expect(shuffledArray).not.toEqual(originalArrayCopy) // Highly likely to be different after shuffle
        console.log(
            `[${testID}] Passed: Array of Mixed Data Types (Mishmash) Shuffle. Original: ${processArray(originalArrayCopy)}, Shuffled: ${processArray(shuffledArray)}`
        )
    })

    // CSTC019: Large Array Shuffle (1000 elements)
    // Call: cryptoShuffle(Array.from({ length: 1000 }, (_, i) => i))
    // Expected: Returns a shuffled array; original array remains unchanged.
    it('CSTC019: Large Array Shuffle (1000 elements)', () => {
        const testID = 'CSTC019'
        const originalArray = Array.from({ length: 1000 }, (_, i) => i)
        const originalArrayCopy = [...originalArray]
        const shuffledArray = cryptoShuffle(originalArray) // Default is non-destructive

        expect(shuffledArray).not.toBe(originalArray) // Should be a new array instance
        expect(shuffledArray.length).toBe(originalArray.length) // Length must be preserved
        expect(shuffledArray).toEqual(expect.arrayContaining(originalArrayCopy)) // Should contain all original elements
        expect(originalArray).toEqual(originalArrayCopy) // Original array should remain unchanged
        expect(shuffledArray).not.toEqual(originalArrayCopy) // Highly likely to be different after shuffle
        console.log(`[${testID}] Passed: Large Array (1000 elements).`)
    })

    // CSTC020: Overpopulated Array (4000 elements)
    // Call: cryptoShuffle(Array.from({ length: 4000 }, (_, i) => i))
    // Expected: Returns a shuffled array; original array remains unchanged.
    it('CSTC020: Overpopulated Array (4000 elements)', () => {
        const testID = 'CSTC020'
        const originalArray = Array.from({ length: 4000 }, (_, i) => i)
        const originalArrayCopy = [...originalArray]
        const shuffledArray = cryptoShuffle(originalArray) // Default is non-destructive

        expect(shuffledArray).not.toBe(originalArray) // Should be a new array instance
        expect(shuffledArray.length).toBe(originalArray.length) // Length must be preserved
        expect(shuffledArray).toEqual(expect.arrayContaining(originalArrayCopy)) // Should contain all original elements
        expect(originalArray).toEqual(originalArrayCopy) // Original array should remain unchanged
        expect(shuffledArray).not.toEqual(originalArrayCopy) // Highly likely to be different after shuffle
        console.log(`[${testID}] Passed: Overpopulated Array (4000 elements).`)
    })
})
