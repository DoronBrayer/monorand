// test.crypto-string.005-error-handling.ts

/**
 * Shuffrand Test Suite - cryptoString: Error Handling
 *
 * This file verifies `cryptoString`'s robust error handling for general
 * and feature-specific inputs, ensuring invalid scenarios throw correctly.
 *
 * @author Doron Brayer <doronbrayer@outlook.com>
 * @license MIT
 */

import { describe, it, expect } from 'vitest'
import { cryptoString, calculateStringEntropy } from 'shuffrand'

describe('cryptoString: Error Handling', () => {
    // --- General Error Handling (Invalid Parameters) ---

    it('Should throw TypeError for invalid length type (e.g., string)', () => {
        expect(() => cryptoString({ length: 'abc' as any })).toThrow(/length/)
    })

    it('Should throw TypeError for a negative length', () => {
        expect(() => cryptoString({ length: -5 })).toThrow(/length/)
    })

    it('Should throw TypeError for a non-integer length', () => {
        expect(() => cryptoString({ length: 10.5 })).toThrow(/length/)
    })

    it('Should throw TypeError for an invalid characterSet type (e.g., number)', () => {
        expect(() => cryptoString({ characterSet: 123 as any })).toThrow(/characterSet/)
    })

    it('Should throw TypeError for an invalid noRepeat type (e.g., string)', () => {
        expect(() => cryptoString({ noRepeat: 'true' as any })).toThrow(/noRepeat/)
    })

    // --- Character Set Content Errors (Standard Mode) ---

    it('should throw TypeError for an empty custom characterSet when length > 0', () => {
        // An empty charset is only an error if you try to generate a non-empty string.
        expect(() => cryptoString({ length: 1, characterSet: '' })).toThrow(/cannot be empty/)

        // Requesting a zero-length string from an empty set is valid and should return ''.
        // This confirms the logic `if (finalCharacterSet.length === 0 && effectiveLength > 0)` is working.
        expect(cryptoString({ length: 0, characterSet: '' })).toBe('')
    })

    it('Should throw TypeError for a custom characterSet with duplicate characters', () => {
        expect(() => cryptoString({ characterSet: 'AABBCC' })).toThrow(
            /Custom character set contains duplicate characters/
        )
    })

    it('Should throw if length > 1 and characterSet has fewer than 2 unique chars', () => {
        expect(() => cryptoString({ length: 2, characterSet: 'A' })).toThrow(
            /must contain at least 2 unique characters/
        )
    })

    // --- noRepeat Feature Error Handling ---

    it('[noRepeat] Should throw a TypeError if length exceeds unique characters in a predefined set', () => {
        expect(() => {
            cryptoString({ length: 11, characterSet: 'numeric', noRepeat: true })
        }).toThrow(
            /Cannot generate a string of length 11 with no repeats from a character set with only 10 unique characters/
        )
    })

    it('[noRepeat] Should throw a TypeError if length exceeds unique characters in a custom set', () => {
        expect(() => {
            cryptoString({ length: 6, characterSet: 'ABCDE', noRepeat: true })
        }).toThrow(
            /Cannot generate a string of length 6 with no repeats from a character set with only 5 unique characters/
        )
    })

    it('[noRepeat] Should still throw for a custom set with duplicates even if length is valid', () => {
        // This confirms our refined logic that custom sets must always be unique.
        expect(() => {
            cryptoString({ length: 2, characterSet: 'AABBCC', noRepeat: true })
        }).toThrow(/Custom character set contains duplicate characters/)
    })

    // --- calculateStringEntropy Error Handling ---

    it('[calculateEntropy] Should throw TypeError for invalid length type', () => {
        expect(() => calculateStringEntropy({ length: 'bad' as any })).toThrow(/length/)
    })

    it('[calculateEntropy] Should throw for a character set of less than 2 unique characters when length > 1', () => {
        expect(() => calculateStringEntropy({ length: 10, characterSet: 'A' })).toThrow(
            /must contain at least 2 unique characters to calculate meaningful entropy/
        )
    })

    it('[calculateEntropy][noRepeat] Should throw an error for an impossible length', () => {
        expect(() => {
            calculateStringEntropy({ length: 6, characterSet: 'abcde', noRepeat: true })
        }).toThrow(/Cannot calculate entropy for a length of 6 with no repeats/)
    })

    it('[calculateEntropy] Should NOT throw for a single-character set if length is 1', () => {
        // This is a valid edge case where entropy is 0.
        expect(() => calculateStringEntropy({ length: 1, characterSet: 'A' })).not.toThrow()
    })
})
