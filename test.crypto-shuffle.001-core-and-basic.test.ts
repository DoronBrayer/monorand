// test.crypto-shuffle.001-core-and-basic.test.ts

/**
 * Shuffrand Test Suite - cryptoShuffle: Core Functionality & Basic Parameters (CSTC001-CSTC006)
 *
 * This file validates the fundamental behavior of `cryptoShuffle` with default parameters
 * and basic destructive/non-destructive modes for arrays of numbers. It also includes
 * the immutability test for non-destructive mode.
 * It uses the Vitest framework for hierarchical grouping (`describe`), individual tests (`it`),
 * and assertions (`expect`).
 *
 * @author Doron Brayer <doronbrayer@outlook.com>
 * @license MIT
 */

import { describe, it, expect } from 'vitest'
import { cryptoShuffle } from './index.js' // Imports from the compiled index.js in dist/
import { processArray } from './test.util.process-array.js' // Import the utility for logging

// Define a top-level group for these tests using Vitest's describe
describe('cryptoShuffle: Core Functionality & Basic Parameters', () => {
    // CSTC001: Default Parameters (Non-destructive, empty array)
    // Call: cryptoShuffle([]) or cryptoShuffle()
    // Expected: Returns [].
    it('CSTC001: Default Parameters (Non-destructive, empty array)', () => {
        const testID = 'CSTC001'
        // Note: cryptoShuffle() with no args implies arr: [] and isDestructive: false
        const shuffledArray = cryptoShuffle([]) // Explicitly pass empty array for clarity, though no args also works
        const originalArray: any[] = [] // For comparison

        expect(shuffledArray).toEqual([]) // Should return an empty array
        expect(shuffledArray).not.toBe(originalArray) // Should be a new array instance
        console.log(
            `[${testID}] Passed: Default Parameters (Non-destructive, empty array). Original: ${processArray(originalArray)}, Shuffled: ${processArray(shuffledArray)}`
        )
    })

    // CSTC002: Non-destructive Shuffle (Numbers)
    // Call: cryptoShuffle([6, 5, 4, 3, 2, 1], { isDestructive: false })
    // Expected: Returns a shuffled array; original array remains unchanged.
    it('CSTC002: Non-destructive Shuffle (Numbers)', () => {
        const testID = 'CSTC002'
        const originalArray = [6, 5, 4, 3, 2, 1]
        const originalArrayCopy = [...originalArray] // Create a copy for comparison
        const shuffledArray = cryptoShuffle(originalArray, { isDestructive: false })

        expect(shuffledArray).not.toBe(originalArray) // Should be a new array instance
        expect(shuffledArray.length).toBe(originalArray.length) // Length must be preserved
        expect(shuffledArray).toEqual(expect.arrayContaining(originalArrayCopy)) // Should contain all original elements
        expect(originalArray).toEqual(originalArrayCopy) // Original array should remain unchanged
        expect(shuffledArray).not.toEqual(originalArrayCopy) // Highly likely to be different after shuffle

        console.log(
            `[${testID}] Passed: Non-destructive Shuffle (Numbers). Original: ${processArray(originalArrayCopy)}, Shuffled: ${processArray(shuffledArray)}`
        )
    })

    // CSTC003: Non-destructive Shuffle (Detailed Logging)
    // Call: cryptoShuffle([0, 1, 2, 3, 4], { isDestructive: false })
    // Expected: Returns a shuffled array; original array remains unchanged.
    it('CSTC003: Non-destructive Shuffle (Detailed Logging)', () => {
        const testID = 'CSTC003'
        const originalArray = [0, 1, 2, 3, 4]
        const originalArrayCopy = [...originalArray] // Create a copy for comparison
        const shuffledArray = cryptoShuffle(originalArray, { isDestructive: false })

        expect(shuffledArray).not.toBe(originalArray) // Should be a new array instance
        expect(shuffledArray.length).toBe(originalArray.length) // Length must be preserved
        expect(shuffledArray).toEqual(expect.arrayContaining(originalArrayCopy)) // Should contain all original elements
        expect(originalArray).toEqual(originalArrayCopy) // Original array should remain unchanged
        expect(shuffledArray).not.toEqual(originalArrayCopy) // Highly likely to be different after shuffle

        console.log(
            `[${testID}] Passed: Non-destructive Shuffle (Detailed Logging). Original: ${processArray(originalArrayCopy)}, Shuffled: ${processArray(shuffledArray)}`
        )
    })

    // CSTC004: Destructive Shuffle (Numbers)
    // Call: cryptoShuffle([6, 5, 4, 3, 2, 1], { isDestructive: true })
    // Expected: Returns a shuffled array; original array is modified.
    it('CSTC004: Destructive Shuffle (Numbers)', () => {
        const testID = 'CSTC004'
        const originalArray = [6, 5, 4, 3, 2, 1]
        const originalArrayCopy = [...originalArray] // Create a copy for comparison before modification
        const shuffledArray = cryptoShuffle(originalArray, { isDestructive: true })

        expect(shuffledArray).toBe(originalArray) // Should be the same array instance
        expect(shuffledArray.length).toBe(originalArrayCopy.length) // Length must be preserved
        expect(shuffledArray).toEqual(expect.arrayContaining(originalArrayCopy)) // Should contain all original elements
        expect(originalArray).toEqual(expect.arrayContaining(originalArrayCopy)) // Original array should be modified
        expect(shuffledArray).not.toEqual(originalArrayCopy) // Highly likely to be different after shuffle

        console.log(
            `[${testID}] Passed: Destructive Shuffle (Numbers). Original (pre-shuffle): ${processArray(originalArrayCopy)}, Shuffled: ${processArray(shuffledArray)}`
        )
    })

    // CSTC005: Destructive Shuffle (Detailed Logging)
    // Call: cryptoShuffle([0, 1, 2, 3, 4], { isDestructive: true })
    // Expected: Returns a shuffled array; original array is modified.
    it('CSTC005: Destructive Shuffle (Detailed Logging)', () => {
        const testID = 'CSTC005'
        const originalArray = [0, 1, 2, 3, 4]
        const originalArrayCopy = [...originalArray] // Create a copy for comparison before modification
        const shuffledArray = cryptoShuffle(originalArray, { isDestructive: true })

        expect(shuffledArray).toBe(originalArray) // Should be the same array instance
        expect(shuffledArray.length).toBe(originalArrayCopy.length) // Length must be preserved
        expect(shuffledArray).toEqual(expect.arrayContaining(originalArrayCopy)) // Should contain all original elements
        expect(originalArray).toEqual(expect.arrayContaining(originalArrayCopy)) // Original array should be modified
        expect(shuffledArray).not.toEqual(originalArrayCopy) // Highly likely to be different after shuffle

        console.log(
            `[${testID}] Passed: Destructive Shuffle (Detailed Logging). Original (pre-shuffle): ${processArray(originalArrayCopy)}, Shuffled: ${processArray(shuffledArray)}`
        )
    })

    // CSTC006: Immutability of Original Array (Non-destructive)
    // This test was previously CSTC60 in the old 001-core-and-basic.test.ts, now re-ID'd and placed here.
    it('CSTC006: Immutability of Original Array (Non-destructive)', () => {
        const testID = 'CSTC006'
        const originalArray = [10, 20, 30]
        const originalArrayBeforeShuffle = [...originalArray] // True copy
        cryptoShuffle(originalArray) // Default is non-destructive
        expect(originalArray).toEqual(originalArrayBeforeShuffle) // Original array should be unchanged
        console.log(`[${testID}] Passed: Immutability of Original Array (Non-destructive).`)
    })
})
