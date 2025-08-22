// /shuffrand/test.crypto-string.003-no-repeat.ts

/**
 * Shuffrand Test Suite - cryptoString: noRepeat Feature
 *
 * This file validates the core correctness of the `noRepeat: true` feature,
 * ensuring it produces strings with no duplicate characters as per the design.
 *
 * @author Doron Brayer <doronbrayer@outlook.com>
 * @license MIT
 */

import { calculateStringEntropy, cryptoString } from 'shuffrand'
import { describe, expect, it } from 'vitest'

describe('cryptoString: noRepeat Feature', () => {
    // --- Correctness Tests ---
    it('Should generate a string with no repeating characters from an alphanumeric set', () => {
        const result = cryptoString({ length: 10, characterSet: 'alphanumeric', noRepeat: true })
        expect(result).toHaveLength(10)
        const uniqueChars = new Set(result.split(''))
        expect(uniqueChars.size).toBe(result.length)
        expect(result).toMatch(/^[a-zA-Z0-9]+$/)
    })

    it('Should generate a string with no repeating characters from a custom set', () => {
        const customSet = 'ABCDEF123456'
        const result = cryptoString({ length: 6, characterSet: customSet, noRepeat: true })
        expect(result).toHaveLength(6)
        const uniqueChars = new Set(result.split(''))
        expect(uniqueChars.size).toBe(6)
        for (const char of result) {
            expect(customSet).toContain(char)
        }
    })

    it('Should correctly handle Unicode characters without repeats', () => {
        const emojiSet = '🎲🎯🎨🎭✨🚀💎🔥'
        const result = cryptoString({ length: 4, characterSet: emojiSet, noRepeat: true })
        expect(Array.from(result).length).toBe(4)
        const uniqueChars = new Set(Array.from(result))
        expect(uniqueChars.size).toBe(4)
        const emojiArray = Array.from(emojiSet)
        for (const char of Array.from(result)) {
            expect(emojiArray).toContain(char)
        }
    })

    it('Should generate different results on subsequent calls (proving randomness)', () => {
        const results = new Set()
        for (let i = 0; i < 10; i++) {
            results.add(cryptoString({ length: 8, characterSet: 'alphanumeric', noRepeat: true }))
        }
        expect(results.size).toBeGreaterThan(1)
    })

    // --- Entropy Calculation Correctness ---
    it('Should calculate entropy correctly for sampling without replacement', () => {
        const expectedEntropy = Math.log2(5) + Math.log2(4) + Math.log2(3) // Picking 3 from 'abcde'
        const actualEntropy = calculateStringEntropy({ length: 3, characterSet: 'abcde', noRepeat: true })
        expect(actualEntropy).toBeCloseTo(expectedEntropy)
    })

    it('Should handle entropy calculation for length equal to charset size', () => {
        const expectedEntropy = Math.log2(3) + Math.log2(2) + Math.log2(1) // log2(3*2*1) = log2(6)
        const actualEntropy = calculateStringEntropy({ length: 3, characterSet: 'abc', noRepeat: true })
        expect(actualEntropy).toBeCloseTo(expectedEntropy)
    })
})
