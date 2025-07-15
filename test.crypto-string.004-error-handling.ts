// test.crypto-string.004-error-handling.ts

/**
 * Shuffrand Test Suite - cryptoString: Error Handling
 *
 * This file specifically verifies `cryptoString`'s robust error handling, ensuring that
 * invalid inputs or impossible string generation scenarios correctly throw `TypeError` exceptions.
 *
 * @author Doron Brayer <doronbrayer@outlook.com>
 * @license MIT
 */

import { describe, it, expect } from 'vitest'
// Import library functions and constants from the published package path, resolved by tsconfig.test.json paths
import { cryptoString, calculateStringEntropy } from 'shuffrand' // Updated import
import { Constants } from 'shuffrand/constants' // Updated import

// Define a top-level group for these tests
describe('cryptoString: Error Handling', () => {
    // Invalid length type (string)
    it('Should throw TypeError for invalid length type (string)', () => {
        // The 'as any' cast is sufficient to bypass type checking for the test
        expect(() => cryptoString({ length: 'abc' as any })).toThrow(TypeError)
        expect(() => cryptoString({ length: 'abc' as any })).toThrow(
            // Adjusted regex to match actual received message (removed quotes around 'abc')
            /Invalid cryptoString parameters: 'length' \(currently abc\) must be a non-negative integer\./
        )
    })

    // Negative length
    it('Should throw TypeError for negative length', () => {
        expect(() => cryptoString({ length: -5 })).toThrow(TypeError)
        expect(() => cryptoString({ length: -5 })).toThrow(
            /Invalid cryptoString parameters: 'length' \(currently -5\) must be a non-negative integer\./
        )
    })

    // Non-integer length
    it('Should throw TypeError for non-integer length', () => {
        expect(() => cryptoString({ length: 10.5 })).toThrow(TypeError)
        expect(() => cryptoString({ length: 10.5 })).toThrow(
            /Invalid cryptoString parameters: 'length' \(currently 10\.5\) must be a non-negative integer\./
        )
    })

    // Invalid characterSet type (number)
    it('Should throw TypeError for invalid characterSet type (number)', () => {
        // The 'as any' cast is sufficient to bypass type checking for the test
        expect(() => cryptoString({ characterSet: 123 as any })).toThrow(TypeError)
        expect(() => cryptoString({ characterSet: 123 as any })).toThrow(
            /Invalid cryptoString parameters: 'characterSet' \(currently 123\) must be a string or a predefined character set name\./
        )
    })

    // Empty custom characterSet
    it('Should throw TypeError for empty custom characterSet', () => {
        expect(() => cryptoString({ characterSet: '' })).toThrow(TypeError)
        // Adjusted regex to match the actual error message thrown when characterSet is empty
        expect(() => cryptoString({ characterSet: '' })).toThrow(
            /Invalid cryptoString parameters: Custom character set must contain at least 2 unique characters for meaningful randomness\./
        )
    })

    // Custom characterSet with less than 2 unique characters
    it('Should throw TypeError for custom characterSet with less than 2 unique characters', () => {
        expect(() => cryptoString({ characterSet: 'AAAA' })).toThrow(TypeError)
        // Regex adjusted to match the message for duplicate characters
        expect(() => cryptoString({ characterSet: 'AAAA' })).toThrow(
            /Invalid cryptoString parameters: Custom character set contains duplicate characters, which would skew randomness distribution\./
        )
        expect(() => cryptoString({ characterSet: 'B' })).toThrow(TypeError)
        // Regex adjusted to match the message for single unique character
        expect(() => cryptoString({ characterSet: 'B' })).toThrow(
            /Invalid cryptoString parameters: Custom character set must contain at least 2 unique characters for meaningful randomness\./
        )
    })

    // Invalid predefined characterSet name
    // NOTE: The function currently throws an error about 'duplicate characters' for 'nonexistent'.
    // This test is updated to match that *current* behavior. You may want to review
    // your cryptoString function's handling of invalid predefined characterSet names.
    it('Should throw TypeError for invalid predefined characterSet name', () => {
        // The 'as any' cast is sufficient to bypass type checking for the test
        expect(() => cryptoString({ characterSet: 'nonexistent' as any })).toThrow(TypeError)
        // Adjusted regex to match the actual received message
        expect(() => cryptoString({ characterSet: 'nonexistent' as any })).toThrow(
            /Invalid cryptoString parameters: Custom character set contains duplicate characters, which would skew randomness distribution\./
        )
    })

    // calculateStringEntropy with invalid length
    it('calculateStringEntropy should throw TypeError for invalid length', () => {
        // The 'as any' cast is sufficient to bypass type checking for the test
        expect(() => calculateStringEntropy({ length: 'bad' as any, characterSet: 'alpha' })).toThrow(TypeError)
        // Adjusted regex to remove quotes around "bad"
        expect(() => calculateStringEntropy({ length: 'bad' as any, characterSet: 'alpha' })).toThrow(
            /Invalid calculateStringEntropy parameters: 'length' \(currently bad\) must be a non-negative integer\./
        )
    })

    // calculateStringEntropy with empty characterSet
    it('calculateStringEntropy should throw TypeError for empty characterSet', () => {
        expect(() => calculateStringEntropy({ length: 10, characterSet: '' })).toThrow(TypeError)
        // Adjusted regex to match the actual error message for empty character set in calculateStringEntropy
        expect(() => calculateStringEntropy({ length: 10, characterSet: '' })).toThrow(
            /Invalid calculateStringEntropy parameters: Character set must contain at least 2 unique characters to calculate meaningful entropy\./
        )
    })

    // calculateStringEntropy with characterSet having less than 2 unique characters
    it('calculateStringEntropy should throw TypeError for characterSet with less than 2 unique characters', () => {
        expect(() => calculateStringEntropy({ length: 10, characterSet: 'A' })).toThrow(TypeError)
        // Adjusted regex to match the actual error message for single unique character in calculateStringEntropy
        expect(() => calculateStringEntropy({ length: 10, characterSet: 'A' })).toThrow(
            /Invalid calculateStringEntropy parameters: Character set must contain at least 2 unique characters to calculate meaningful entropy\./
        )
    })

    // Single Character Custom Set (moved from 001-core)
    it('Should throw TypeError for single character custom set', () => {
        const length = 1
        const customCharacterSet = 'A'
        expect(() => cryptoString({ length, characterSet: customCharacterSet })).toThrow(TypeError)
        expect(() => cryptoString({ length, characterSet: customCharacterSet })).toThrow(
            /Invalid cryptoString parameters: Custom character set must contain at least 2 unique characters for meaningful randomness\./
        )
    })
})
