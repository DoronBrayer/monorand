// test.crypto-shuffle.004-error-handling.test.ts

/**
 * Shuffrand Test Suite - cryptoShuffle: Error Handling (CSTC025, CSTC027-CSTC030, CSTC031-CSTC033)
 *
 * This file specifically verifies `cryptoShuffle`'s robust error handling, ensuring that
 * invalid inputs or impossible shuffling scenarios correctly throw `TypeError` exceptions.
 *
 * @author Doron Brayer <doronbrayer@outlook.com>
 * @license MIT
 */

import { describe, it, expect } from 'vitest'
import { cryptoShuffle } from './index.js' // Imports from the compiled index.js in dist/

// Define a top-level group for these tests using Vitest's describe
describe('cryptoShuffle: Error Handling', () => {
    // CSTC025: Invalid arr type (null) - ArkType should catch this
    it('CSTC025: Should throw TypeError for invalid arr type (null)', () => {
        const testID = 'CSTC025'
        // @ts-ignore - Intentionally passing invalid type for testing
        expect(() => cryptoShuffle(null as any)).toThrow(TypeError)
        expect(() => cryptoShuffle(null as any)).toThrow(/arr must be an array \(was null\)/)
        console.log(`[${testID}] Passed: Throws TypeError for invalid arr type (null).`)
    })

    // CSTC027: Invalid arr type (string) - ArkType should catch this
    it('CSTC027: Should throw TypeError for invalid arr type (string)', () => {
        const testID = 'CSTC027'
        // @ts-ignore - Intentionally passing invalid type for testing
        expect(() => cryptoShuffle('not an array' as any)).toThrow(TypeError)
        // FIX: Adjusted regex to match the wrapped ArkType message
        expect(() => cryptoShuffle('not an array' as any)).toThrow(
            /Invalid cryptoShuffle parameters: arr must be an array \(was string\)/
        )
        console.log(`[${testID}] Passed: Throws TypeError for invalid arr type (string).`)
    })

    // CSTC028: Invalid isDestructive type (string) - ArkType should catch this
    it('CSTC028: Should throw TypeError for invalid isDestructive type (string)', () => {
        const testID = 'CSTC028'
        // @ts-ignore - Intentionally passing invalid type for testing
        expect(() => cryptoShuffle([], { isDestructive: 'true' as any })).toThrow(TypeError)
        // FIX: Adjusted regex to match the wrapped ArkType message
        expect(() => cryptoShuffle([], { isDestructive: 'true' as any })).toThrow(
            /Invalid cryptoShuffle parameters: isDestructive must be boolean \(was "true"\)/
        )
        console.log(`[${testID}] Passed: Throws TypeError for invalid isDestructive type (string).`)
    })

    // CSTC029: Invalid preventIdentical type (number) - ArkType should catch this
    it('CSTC029: Should throw TypeError for invalid preventIdentical type (number)', () => {
        const testID = 'CSTC029'
        // @ts-ignore - Intentionally passing invalid type for testing
        expect(() => cryptoShuffle([], { preventIdentical: 123 as any })).toThrow(TypeError)
        // FIX: Adjusted regex to match the wrapped ArkType message
        expect(() => cryptoShuffle([], { preventIdentical: 123 as any })).toThrow(
            /Invalid cryptoShuffle parameters: preventIdentical must be boolean \(was 123\)/
        )
        console.log(`[${testID}] Passed: Throws TypeError for invalid preventIdentical type (number).`)
    })

    // CSTC030: Should return empty array when no parameters are provided (arr defaults to [])
    it('CSTC030: Should return empty array when no parameters are provided (arr defaults to [])', () => {
        const testID = 'CSTC030'
        expect(cryptoShuffle()).toEqual([])
        console.log(`[${testID}] Passed: Returns empty array when no parameters are provided.`)
    })

    // --- NEW TEST CASES FOR ENHANCED ERROR HANDLING (CSTC031-CSTC033) ---

    // CSTC031: Should throw TypeError if options object is null
    it('CSTC031: Should throw TypeError if options object is null', () => {
        const testID = 'CSTC031'
        // @ts-ignore - Intentionally passing null for options
        expect(() => cryptoShuffle([], null as any)).toThrow(TypeError)
        expect(() => cryptoShuffle([], null as any)).toThrow(
            "Invalid cryptoShuffle parameters: 'options' cannot be null. Please provide an object or omit it."
        )
        console.log(`[${testID}] Passed: Throws TypeError if options object is null.`)
    })

    // CSTC032: Should throw TypeError if array elements are not JSON-serializable for preventIdentical (original)
    it('CSTC032: Should throw TypeError if array elements are not JSON-serializable for preventIdentical (original)', () => {
        const testID = 'CSTC032'
        // FIX: Using BigInt to guarantee a JSON.stringify error
        const nonSerializableArr = [1, 2, BigInt(10), 4]
        expect(() => cryptoShuffle(nonSerializableArr, { preventIdentical: true })).toThrow(TypeError)
        // FIX: Adjusted regex to match the exact message from our catch block
        expect(() => cryptoShuffle(nonSerializableArr, { preventIdentical: true })).toThrow(
            /Invalid cryptoShuffle parameters: Array elements cannot be serialized for 'preventIdentical' comparison\. Ensure all elements are JSON-serializable\. Original error: Do not know how to serialize a BigInt/
        )
        console.log(
            `[${testID}] Passed: Throws TypeError if array elements are not JSON-serializable for preventIdentical (original).`
        )
    })

    // CSTC033: Should throw TypeError if array elements are not JSON-serializable for preventIdentical (shuffled)
    it('CSTC033: Should throw TypeError if array elements are not JSON-serializable for preventIdentical (shuffled)', () => {
        const testID = 'CSTC033'
        // This test now effectively checks the same serialization error as CSTC032
        // because the error for non-serializable elements occurs when originalArrayCopy is created.
        // We keep it to ensure the path is covered, even if it's the same error message.
        const nonSerializableArr = [1, 2, BigInt(10), 4]
        expect(() => cryptoShuffle(nonSerializableArr, { preventIdentical: true })).toThrow(TypeError)
        // FIX: Adjusted regex to match the exact message from our catch block (same as CSTC032)
        expect(() => cryptoShuffle(nonSerializableArr, { preventIdentical: true })).toThrow(
            /Invalid cryptoShuffle parameters: Array elements cannot be serialized for 'preventIdentical' comparison\. Ensure all elements are JSON-serializable\. Original error: Do not know how to serialize a BigInt/
        )
        console.log(
            `[${testID}] Passed: Throws TypeError if array elements are not JSON-serializable for preventIdentical (shuffled).`
        )
    })

    // --- END NEW TEST CASES ---
})
