// /shuffrand/test.crypto-string.004-edge-cases.ts

/**
 * Shuffrand Test Suite - cryptoString: Edge Cases
 *
 * This file verifies the behavior of `cryptoString` under various edge cases,
 * including larger lengths, statistical distribution, entropy calculations,
 * and interactions with the `noRepeat` feature.
 *
 * @author Doron Brayer <doronbrayer@outlook.com>
 * @license MIT
 */

import { describe, it, expect } from 'vitest'
import { cryptoString, calculateStringEntropy } from 'shuffrand'
import { Constants } from './src.constants.js'

describe('cryptoString: Edge Cases', () => {
    // --- Standard Mode Edge Cases ---

    it('Should handle a large length (stress test)', () => {
        const length = 1000
        const result = cryptoString({ length, characterSet: 'alphanumeric' })
        expect(result).toBeTypeOf('string')
        expect(result).toHaveLength(length)
    })

    it('Should have a reasonable statistical distribution for a binary set', () => {
        const length = 1000
        const customCharacterSet = '01'
        const result = cryptoString({ length, characterSet: customCharacterSet })
        const countZero = (result.match(/0/g) || []).length
        const countOne = (result.match(/1/g) || []).length

        expect(countZero + countOne).toBe(length)
        expect(countZero).toBeGreaterThan(length * 0.4)
        expect(countOne).toBeGreaterThan(length * 0.4)
    })

    it('Should correctly handle complex Unicode characters', () => {
        const length = 8
        // ROBUSTNESS FIX: Use a set of simple, universally supported emojis
        // to avoid any parsing or environment-specific issues.
        const customCharacterSet = '🎲🎯🎨🎭✨🚀💎🔥'
        const result = cryptoString({ length, characterSet: customCharacterSet })
        expect(Array.from(result).length).toBe(length)
        const charSetArray = Array.from(customCharacterSet)
        for (const char of Array.from(result)) {
            expect(charSetArray).toContain(char)
        }
    })

    // --- noRepeat Edge Cases ---

    it('[noRepeat] Should return all unique characters in random order if length equals character set size', () => {
        const charset = '12345'
        const result = cryptoString({ length: 5, characterSet: charset, noRepeat: true })
        expect(result).toHaveLength(5)
        const uniqueChars = new Set(result.split(''))
        expect(uniqueChars.size).toBe(5)
        expect(result.split('').sort().join('')).toEqual('12345')
    })

    it('[noRepeat] Should return an empty string for length 0', () => {
        const result = cryptoString({ length: 0, characterSet: 'alphanumeric', noRepeat: true })
        expect(result).toBe('')
    })

    it('[noRepeat] Should return a single character for length 1', () => {
        const result = cryptoString({ length: 1, characterSet: 'abc', noRepeat: true })
        expect(result).toHaveLength(1)
        expect('abc').toContain(result)
    })

    it('[noRepeat] Should handle a large length and character set', () => {
        const result = cryptoString({ length: 62, characterSet: 'alphanumeric', noRepeat: true })
        expect(result).toHaveLength(62)
        const uniqueChars = new Set(result.split(''))
        expect(uniqueChars.size).toBe(62)
    })

    // --- Entropy Calculation Edge Cases ---

    it('[calculateStringEntropy] Should correctly calculate entropy for a basic alphanumeric string', () => {
        const entropy = calculateStringEntropy({ length: 32, characterSet: 'alphanumeric' })
        expect(entropy).toBeCloseTo(190.53, 2)
    })

    it('[calculateStringEntropy] Should correctly calculate entropy for a custom Unicode character set', () => {
        const entropy = calculateStringEntropy({ length: 10, characterSet: '🎲🎯🎨🎭✨' })
        expect(entropy).toBeCloseTo(23.22, 2)
    })

    it('[calculateStringEntropy] Should handle a very large length', () => {
        const entropy = calculateStringEntropy({ length: 10000, characterSet: 'alphanumeric' })
        expect(entropy).toBeCloseTo(59541.96, 2)
    })

    it('[calculateStringEntropy] Should return 0 for a length of 0', () => {
        const entropy = calculateStringEntropy({ length: 0 })
        expect(entropy).toBe(0)
    })

    it('[calculateStringEntropy] Should return 0 for a single-character set (standard mode, length 1)', () => {
        const entropy = calculateStringEntropy({ length: 1, characterSet: 'A' })
        expect(entropy).toBe(0)
    })

    it('[calculateStringEntropy][noRepeat] Should correctly calculate entropy for the full set', () => {
        const expectedEntropy = Math.log2(10 * 9 * 8 * 7 * 6 * 5 * 4 * 3 * 2 * 1) // log2(10!)
        const actualEntropy = calculateStringEntropy({ length: 10, characterSet: 'numeric', noRepeat: true })
        expect(actualEntropy).toBeCloseTo(expectedEntropy)
    })

    it('[calculateStringEntropy][noRepeat] Should return 0 for a length of 0', () => {
        const entropy = calculateStringEntropy({ length: 0, noRepeat: true })
        expect(entropy).toBe(0)
    })

    it('[calculateStringEntropy][noRepeat] Should return the correct entropy for a single character selection', () => {
        const expectedEntropy = Math.log2(10)
        const actualEntropy = calculateStringEntropy({ length: 1, characterSet: 'numeric', noRepeat: true })
        expect(actualEntropy).toBeCloseTo(expectedEntropy)
    })
})
