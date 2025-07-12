// test.crypto-shuffle.003-prevent-identical.test.ts

/**
 * Shuffrand Test Suite - cryptoShuffle: Prevent Identical Flag (CSTC021-CSTC024)
 *
 * This file specifically tests the behavior of `cryptoShuffle` when the `preventIdentical`
 * flag is enabled, ensuring it correctly prevents the original array order from being
 * returned, while acknowledging the introduced statistical bias.
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
describe('cryptoShuffle: Prevent Identical Flag', () => {
    // CSTC021: preventIdentical: true with a two-item array
    // Previously CSTC68 (from old plan), or CSTC61 (from old 002-edge-cases)
    // Call: cryptoShuffle([1, 2], { preventIdentical: true })
    // Expected: Returns a shuffled array that is not [1, 2]. It should be [2, 1].
    it('CSTC021: preventIdentical: true with a two-item array', () => {
        const testID = 'CSTC021'
        const originalArray = [1, 2]
        const shuffledArray = cryptoShuffle(originalArray, { preventIdentical: true })

        expect(shuffledArray).not.toEqual(originalArray) // Should be different from original
        expect(shuffledArray).toEqual([2, 1]) // For 2 elements, it must be the swapped order
        expect(shuffledArray.length).toBe(originalArray.length) // Length must be preserved
        expect(shuffledArray).toEqual(expect.arrayContaining(originalArray)) // Should contain all original elements

        console.log(
            `[${testID}] Passed: preventIdentical (2 items). Original: ${processArray(originalArray)}, Shuffled: ${processArray(shuffledArray)}`
        )
    })

    // CSTC022: preventIdentical: true with a three-item array
    // Previously CSTC69 (from old plan), or CSTC62 (from old 002-edge-cases)
    // Call: cryptoShuffle([1, 2, 3], { preventIdentical: true })
    // Expected: Returns a shuffled array that is not [1, 2, 3].
    it('CSTC022: preventIdentical: true with a three-item array', () => {
        const testID = 'CSTC022'
        const originalArray = [1, 2, 3]
        const shuffledArray = cryptoShuffle(originalArray, { preventIdentical: true })

        expect(shuffledArray).not.toEqual(originalArray) // Should be different from original
        expect(shuffledArray.length).toBe(originalArray.length) // Length must be preserved
        expect(shuffledArray).toEqual(expect.arrayContaining(originalArray)) // Should contain all original elements

        console.log(
            `[${testID}] Passed: preventIdentical (3 items). Original: ${processArray(originalArray)}, Shuffled: ${processArray(shuffledArray)}`
        )
    })

    // CSTC023: preventIdentical: true with an empty array
    // Previously CSTC70 (from old plan), or CSTC73 (from old 003-error-handling)
    // Call: cryptoShuffle([], { preventIdentical: true })
    // Expected: Returns [].
    it('CSTC023: preventIdentical: true with an empty array', () => {
        const testID = 'CSTC023'
        const originalArray: any[] = []
        const shuffledArray = cryptoShuffle(originalArray, { preventIdentical: true })

        expect(shuffledArray).toEqual([]) // Should return an empty array
        expect(shuffledArray).not.toBe(originalArray) // Should be a new array instance (even if empty)

        console.log(
            `[${testID}] Passed: preventIdentical (empty array). Original: ${processArray(originalArray)}, Shuffled: ${processArray(shuffledArray)}`
        )
    })

    // CSTC024: preventIdentical: true with a single-item array
    // Previously CSTC71 (from old plan), or CSTC72 (from old 003-error-handling)
    // Call: cryptoShuffle([1], { preventIdentical: true })
    // Expected: Returns [1].
    it('CSTC024: preventIdentical: true with a single-item array', () => {
        const testID = 'CSTC024'
        const originalArray = [1]
        const shuffledArray = cryptoShuffle(originalArray, { preventIdentical: true })

        expect(shuffledArray).toEqual([1]) // Should return the same single element
        expect(shuffledArray).not.toBe(originalArray) // Should be a new array instance

        console.log(
            `[${testID}] Passed: preventIdentical (single item). Original: ${processArray(originalArray)}, Shuffled: ${processArray(shuffledArray)}`
        )
    })
})
