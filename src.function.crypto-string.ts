// src.function.crypto-string.ts (Final & Corrected)

/**
 * shuffrand - Cryptographically Secure Random String Generation
 *
 * This file contains the core logic for generating cryptographically secure random strings,
 * adhering to a flat, dot-categorized structure for clarity.
 *
 * @author Doron Brayer <doronbrayer@outlook.com>
 * @license MIT
 */

// Import types, Constants, and other shuffrand functions
import { CryptoStringParams, cryptoStringParamsSchema } from './src.types.js'
import { cryptoRandom } from './src.function.crypto-random.js'
import { cryptoShuffle } from './src.function.crypto-shuffle.js'
import { Constants } from './src.constants.js'

// Define standard character sets mapping to Constants for convenience and security
const CHARACTER_SETS_MAP = {
    alphanumeric: Constants.ALPHANUMERIC_CHARS,
    numeric: Constants.DIGITS,
    alpha: Constants.LATIN_LETTERS,
    hex: Constants.HEX_CHARS,
    uppercase: Constants.LATIN_UPPERCASE_LETTERS,
    lowercase: Constants.LATIN_LOWERCASE_LETTERS,
} as const

/**
 * Generates a cryptographically secure random string of a specified length
 * from a given character set.
 *
 * @param {CryptoStringParams} [rawParams={}] - The raw parameters for random string generation.
 * @param {number} [rawParams.length=16] - The desired length of the random string.
 * @param {'alphanumeric'|'numeric'|'alpha'|'hex'|'uppercase'|'lowercase'|string} [rawParams.characterSet='alphanumeric'] - The character set to use.
 * @param {boolean} [rawParams.noRepeat=false] - If true, ensures no character appears more than once in the result.
 * @returns {string} - The cryptographically secure random string.
 * @throws {TypeError} - If input parameters are invalid.
 */
export function cryptoString(rawParams: CryptoStringParams = {}): string {
    // --- Initial Parameter Validation ---
    if (rawParams === null) {
        throw new TypeError(
            "Invalid cryptoString parameters: 'rawParams' cannot be null. Please provide an object or omit it."
        )
    }
    try {
        cryptoStringParamsSchema.assert(rawParams)
    } catch (e: any) {
        throw new TypeError(`Invalid cryptoString parameters: ${e.summary || e.message}`)
    }

    // Apply defaults
    const effectiveLength = rawParams.length ?? 16
    const effectiveCharacterSet = rawParams.characterSet ?? 'alphanumeric'
    const effectiveNoRepeat = rawParams.noRepeat ?? false

    // --- Custom Logic Validation ---
    if (effectiveLength > 1_000_000) {
        throw new TypeError(
            `Invalid cryptoString parameters: 'length' exceeds maximum safe limit of 1,000,000 characters.`
        )
    }

    let finalCharacterSet: string
    if (
        typeof effectiveCharacterSet === 'string' &&
        Object.prototype.hasOwnProperty.call(CHARACTER_SETS_MAP, effectiveCharacterSet)
    ) {
        finalCharacterSet = CHARACTER_SETS_MAP[effectiveCharacterSet as keyof typeof CHARACTER_SETS_MAP]
    } else {
        finalCharacterSet = effectiveCharacterSet as string
        // CORRECTED: A custom character set MUST NOT contain duplicates, ever.
        const charsArray = Array.from(finalCharacterSet)
        const uniqueChars = new Set(charsArray)
        if (uniqueChars.size !== charsArray.length) {
            throw new TypeError(
                'Invalid cryptoString parameters: Custom character set contains duplicate characters, which would skew randomness distribution.'
            )
        }
    }

    if (finalCharacterSet.length === 0 && effectiveLength > 0) {
        throw new TypeError("Invalid cryptoString parameters: The resolved 'characterSet' cannot be empty.")
    }

    const uniqueCharactersArray = Array.from(new Set(Array.from(finalCharacterSet)))

    if (uniqueCharactersArray.length < 2 && effectiveLength > 1) {
        throw new TypeError(
            'Invalid cryptoString parameters: Character set must contain at least 2 unique characters to generate a string longer than 1.'
        )
    }

    if (effectiveNoRepeat) {
        if (effectiveLength > uniqueCharactersArray.length) {
            throw new TypeError(
                `Invalid cryptoString parameters: Cannot generate a string of length ${effectiveLength} with no repeats from a character set with only ${uniqueCharactersArray.length} unique characters.`
            )
        }
    }

    if (effectiveLength === 0) {
        return ''
    }

    // --- Core Generation Logic ---
    if (effectiveNoRepeat) {
        const shuffledCharacters = cryptoShuffle(uniqueCharactersArray)
        return shuffledCharacters.slice(0, effectiveLength).join('')
    } else {
        const resultArray = new Array<string>(effectiveLength)
        const finalCharacterSetArray = Array.from(finalCharacterSet)
        const characterSetLength = finalCharacterSetArray.length
        for (let i = 0; i < effectiveLength; i++) {
            const randomIndex = cryptoRandom({
                lowerBound: 0,
                upperBound: characterSetLength - 1,
                typeOfNum: 'integer',
                exclusion: 'none',
            })
            resultArray[i] = finalCharacterSetArray[randomIndex]
        }
        return resultArray.join('')
    }
}

/**
 * ... (JSDoc for calculateStringEntropy) ...
 */
export function calculateStringEntropy(params: CryptoStringParams = {}): number {
    try {
        cryptoStringParamsSchema.assert(params)
    } catch (e: any) {
        throw new TypeError(`Invalid calculateStringEntropy parameters: ${e.summary || e.message}`)
    }

    const effectiveLength = params.length ?? 16
    const effectiveCharacterSet = params.characterSet ?? 'alphanumeric'
    const effectiveNoRepeat = params.noRepeat ?? false

    let finalCharacterSet: string
    if (
        typeof effectiveCharacterSet === 'string' &&
        Object.prototype.hasOwnProperty.call(CHARACTER_SETS_MAP, effectiveCharacterSet)
    ) {
        finalCharacterSet = CHARACTER_SETS_MAP[effectiveCharacterSet as keyof typeof CHARACTER_SETS_MAP]
    } else {
        finalCharacterSet = effectiveCharacterSet as string
    }

    const uniqueChars = new Set(Array.from(finalCharacterSet))
    const charsetSize = uniqueChars.size

    if (effectiveNoRepeat) {
        if (effectiveLength > charsetSize) {
            throw new TypeError(
                `Invalid calculateStringEntropy parameters: Cannot calculate entropy for a length of ${effectiveLength} with no repeats from a character set with only ${charsetSize} unique characters.`
            )
        }
        let totalEntropy = 0
        for (let i = 0; i < effectiveLength; i++) {
            const availableChoices = charsetSize - i
            if (availableChoices > 0) {
                totalEntropy += Math.log2(availableChoices)
            }
        }
        return totalEntropy
    }

    if (charsetSize < 2 && effectiveLength > 1) {
        throw new TypeError(
            'Invalid calculateStringEntropy parameters: Character set must contain at least 2 unique characters to calculate meaningful entropy.'
        )
    }

    if (charsetSize === 0) {
        return 0
    }

    return Math.log2(charsetSize) * effectiveLength
}
