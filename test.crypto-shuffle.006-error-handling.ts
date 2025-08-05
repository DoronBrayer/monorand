// test.crypto-shuffle.006-error-handling.ts

/**
 * Shuffrand Test Suite - cryptoShuffle: Error Handling
 *
 * This file specifically verifies `cryptoShuffle`'s robust error handling, ensuring that
 * invalid inputs or impossible shuffling scenarios correctly throw `TypeError` exceptions.
 *
 * @author Doron Brayer <doronbrayer@outlook.com>
 * @license MIT
 */

import { describe, it, expect } from 'vitest'
// Import from the published package path, resolved by tsconfig.test.json paths
import { cryptoShuffle } from 'shuffrand' // Updated import

// Define a top-level group for these tests
describe('cryptoShuffle: Error Handling', () => {
    // Invalid arr type (null) - ArkType should catch this
    it('Should throw TypeError for invalid arr type (null)', () => {
        // The 'as any' cast is sufficient to bypass type checking for the test
        expect(() => cryptoShuffle(null as any)).toThrow(TypeError)
        // Adjusted regex to match the full ArkType message
        expect(() => cryptoShuffle(null as any)).toThrow(
            /Invalid cryptoShuffle parameters: arr must be an array \(was null\)/
        )
    })

    // Invalid arr type (string) - ArkType should catch this
    it('Should throw TypeError for invalid arr type (string)', () => {
        // The 'as any' cast is sufficient to bypass type checking for the test
        expect(() => cryptoShuffle('not an array' as any)).toThrow(TypeError)
        // Adjusted regex to match the full ArkType message
        expect(() => cryptoShuffle('not an array' as any)).toThrow(
            /Invalid cryptoShuffle parameters: arr must be an array \(was string\)/
        )
    })

    // Invalid isDestructive type (string) - ArkType should catch this
    it('Should throw TypeError for invalid isDestructive type (string)', () => {
        // The 'as any' cast is sufficient to bypass type checking for the test
        expect(() => cryptoShuffle([], { isDestructive: 'true' as any })).toThrow(TypeError)
        // Adjusted regex to match the full ArkType message
        expect(() => cryptoShuffle([], { isDestructive: 'true' as any })).toThrow(
            /Invalid cryptoShuffle parameters: isDestructive must be boolean \(was "true"\)/
        )
    })

    // Invalid preventIdentical type (number) - ArkType should catch this
    it('Should throw TypeError for invalid preventIdentical type (number)', () => {
        // The 'as any' cast is sufficient to bypass type checking for the test
        expect(() => cryptoShuffle([], { preventIdentical: 123 as any })).toThrow(TypeError)
        // Adjusted regex to match the full ArkType message
        expect(() => cryptoShuffle([], { preventIdentical: 123 as any })).toThrow(
            /Invalid cryptoShuffle parameters: preventIdentical must be boolean \(was 123\)/
        )
    })

    // Should return empty array when no parameters are provided (arr defaults to [])
    it('Should return empty array when no parameters are provided (arr defaults to [])', () => {
        expect(cryptoShuffle()).toEqual([])
    })

    // Should throw TypeError if options object is null
    it('Should throw TypeError if options object is null', () => {
        // The 'as any' cast is sufficient to bypass type checking for the test
        expect(() => cryptoShuffle([], null as any)).toThrow(TypeError)
        // Adjusted regex to match the *exact* received message, which is a custom one
        expect(() => cryptoShuffle([], null as any)).toThrow(
            `Invalid cryptoShuffle parameters: 'options' cannot be null. Please provide an object or omit it.`
        )
    })

    // Should throw TypeError if array elements are not JSON-serializable for preventIdentical (original)
    it('Should throw TypeError if array elements are not JSON-serializable for preventIdentical (original)', () => {
        // Using BigInt to guarantee a JSON.stringify error
        const nonSerializableArr = [1, 2, BigInt(10), 4]
        expect(() => cryptoShuffle(nonSerializableArr, { preventIdentical: true })).toThrow(TypeError)
        expect(() => cryptoShuffle(nonSerializableArr, { preventIdentical: true })).toThrow(
            /Invalid cryptoShuffle parameters: Array elements cannot be serialized for 'preventIdentical' comparison\. Ensure all elements are JSON-serializable\. Original error: Do not know how to serialize a BigInt/
        )
    })

    // Should throw TypeError if array elements are not JSON-serializable for preventIdentical (shuffled)
    it('Should throw TypeError if array elements are not JSON-serializable for preventIdentical (shuffled)', () => {
        // This test effectively checks the same serialization error as CSTEC07
        // because the error for non-serializable elements occurs when originalArrayCopy is created.
        // We keep it to ensure the path is covered, even if it's the same error message.
        const nonSerializableArr = [1, 2, BigInt(10), 4]
        expect(() => cryptoShuffle(nonSerializableArr, { preventIdentical: true })).toThrow(TypeError)
        expect(() => cryptoShuffle(nonSerializableArr, { preventIdentical: true })).toThrow(
            /Invalid cryptoShuffle parameters: Array elements cannot be serialized for 'preventIdentical' comparison\. Ensure all elements are JSON-serializable\. Original error: Do not know how to serialize a BigInt/
        )
    })

    // --- NEW TEST CASES FOR FEATURE MINIMUM LENGTH ENFORCEMENTS ---

    // Should throw TypeError if preventIdentical is true but array has fewer than 2 elements
    it('Should throw TypeError if preventIdentical is true but array has fewer than 2 elements', () => {
        // Test with empty array []
        expect(() => cryptoShuffle([], { preventIdentical: true })).toThrow(TypeError)
        expect(() => cryptoShuffle([], { preventIdentical: true })).toThrow(
            "Invalid cryptoShuffle parameters: 'preventIdentical' requires an array with at least 2 elements to guarantee a different result."
        )

        // Test with single-element array [1]
        expect(() => cryptoShuffle([1], { preventIdentical: true })).toThrow(TypeError)
        expect(() => cryptoShuffle([1], { preventIdentical: true })).toThrow(
            "Invalid cryptoShuffle parameters: 'preventIdentical' requires an array with at least 2 elements to guarantee a different result."
        )
    })

    // Should throw TypeError if isDestructive is true but the effective shuffle range has fewer than 2 elements
    it('Should throw TypeError if isDestructive is true but the effective shuffle range has fewer than 2 elements', () => {
        // Test with empty array and isDestructive: true (range is [0, 0) - 0 elements)
        expect(() => cryptoShuffle([], { isDestructive: true })).toThrow(TypeError)
        expect(() => cryptoShuffle([], { isDestructive: true })).toThrow(
            "Invalid cryptoShuffle parameters: 'isDestructive' requires a shuffle range (defined by startIndex/endIndex) with at least 2 elements to potentially modify the original array."
        )

        // Test with single-element array and isDestructive: true (range is [0, 1) - 1 element)
        expect(() => cryptoShuffle([1], { isDestructive: true })).toThrow(TypeError)
        expect(() => cryptoShuffle([1], { isDestructive: true })).toThrow(
            "Invalid cryptoShuffle parameters: 'isDestructive' requires a shuffle range (defined by startIndex/endIndex) with at least 2 elements to potentially modify the original array."
        )

        // Test with valid array but subarray range [1, 2) - 1 element (range has fewer than 2 elements)
        expect(() => cryptoShuffle([1, 2, 3], { isDestructive: true, startIndex: 1, endIndex: 2 })).toThrow(TypeError)
        expect(() => cryptoShuffle([1, 2, 3], { isDestructive: true, startIndex: 1, endIndex: 2 })).toThrow(
            "Invalid cryptoShuffle parameters: 'isDestructive' requires a shuffle range (defined by startIndex/endIndex) with at least 2 elements to potentially modify the original array."
        )

        // Test with valid array but subarray range [0, 1) - 1 element (range has fewer than 2 elements)
        expect(() => cryptoShuffle([1, 2, 3], { isDestructive: true, startIndex: 0, endIndex: 1 })).toThrow(TypeError)
        expect(() => cryptoShuffle([1, 2, 3], { isDestructive: true, startIndex: 0, endIndex: 1 })).toThrow(
            "Invalid cryptoShuffle parameters: 'isDestructive' requires a shuffle range (defined by startIndex/endIndex) with at least 2 elements to potentially modify the original array."
        )

        // Test with valid array but startIndex >= endIndex (e.g., [2, 2) or [3, 1)) - 0 elements (range has fewer than 2 elements)
        expect(() => cryptoShuffle([1, 2, 3], { isDestructive: true, startIndex: 2, endIndex: 2 })).toThrow(TypeError)
        expect(() => cryptoShuffle([1, 2, 3], { isDestructive: true, startIndex: 2, endIndex: 2 })).toThrow(
            "Invalid cryptoShuffle parameters: 'isDestructive' requires a shuffle range (defined by startIndex/endIndex) with at least 2 elements to potentially modify the original array."
        )
        expect(() => cryptoShuffle([1, 2, 3], { isDestructive: true, startIndex: 3, endIndex: 1 })).toThrow(TypeError)
        expect(() => cryptoShuffle([1, 2, 3], { isDestructive: true, startIndex: 3, endIndex: 1 })).toThrow(
            "Invalid cryptoShuffle parameters: 'isDestructive' requires a shuffle range (defined by startIndex/endIndex) with at least 2 elements to potentially modify the original array."
        )
    })

    // --- END NEW TEST CASES ---
})
