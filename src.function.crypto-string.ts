// src.function.crypto-string.ts

/**
 * shuffrand - Cryptographically Secure Random String Generation
 *
 * This file contains the core logic for generating cryptographically secure random strings,
 * adhering to a flat, dot-categorized structure for clarity.
 *
 * @author Doron Brayer <doronbrayer@outlook.com>
 * @license MIT
 */

// Import types, Constants, and the cryptoRandom function from their respective dot-categorized files
import { CryptoStringParams, cryptoStringParamsSchema } from './src.types.js'
import { cryptoRandom } from './src.function.crypto-random.js'
import { Constants } from './src.constants.js'

// Define standard character sets mapping to Constants for convenience and security
// These are internal to cryptoString and map the user-facing names to the actual character strings.
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
 * This function focuses strictly on generating a secure random sequence of characters.
 * It does NOT generate UUIDs, complex passwords, or other formatted data.
 *
 * ALGORITHM OVERVIEW:
 * 1. Parameter validation with Unicode-aware duplicate detection
 * 2. Character set normalization using Array.from() for proper Unicode handling
 * 3. Cryptographically secure index generation via cryptoRandom (bias-free)
 * 4. Direct character selection without intermediate transformations
 * 5. Efficient array-based construction with single join operation
 *
 * SECURITY PROPERTIES:
 * - Uses cryptographically secure random number generation via `cryptoRandom`
 * - Leverages `webcrypto.getRandomValues()` as the entropy source
 * - Inherits modulo bias prevention from `cryptoRandom` for uniform distribution
 * - Ensures uniform selection across all characters in the provided set
 * - Generates strings with maximum entropy (log2(charset_size) * length bits)
 * - No predictable patterns, suitable for cryptographic applications
 * - Unicode-aware character handling prevents encoding-based vulnerabilities
 *
 * @param {CryptoStringParams} [rawParams={}] - The raw parameters for random string generation.
 * @param {number} [rawParams.length=16] - The desired length of the random string. Must be a non-negative integer.
 * @param {'alphanumeric'|'numeric'|'alpha'|'hex'|'uppercase'|'lowercase'|string} [rawParams.characterSet='alphanumeric'] - The character set to use.
 * Can be a predefined string or a custom string of characters.
 * @returns {string} - The cryptographically secure random string.
 * @throws {TypeError} - If input parameters do not conform to the schema or if the character set is empty.
 *
 * @example
 * // Generate a 32-character alphanumeric string
 * const token = cryptoString({ length: 32 });
 * console.log(token); // e.g., "aBc1XyZ7pQ2R3sT4uV5wX6yZ7aB8c"
 *
 * // Generate a 64-character hex string for cryptographic keys
 * const key = cryptoString({ length: 64, characterSet: 'hex' });
 * console.log(key); // e.g., "8f3b1e0a2d5c4b6e7f9a1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f"
 *
 * // Generate using a custom character set (Unicode-safe)
 * const emoji = cryptoString({ length: 8, characterSet: '🎲🎯🎨🎭✨' }); // No duplicates in example
 * console.log(emoji); // e.g., "🎯🎭🎲🎨✨🎯🎭🎲"
 */
export function cryptoString(rawParams: CryptoStringParams = {}): string {
    // --- Initial Parameter Validation (DX-focused) ---
    // Catches cases where rawParams itself is null, which bypasses default parameter assignment.
    if (rawParams === null) {
        throw new TypeError(
            "Invalid cryptoString parameters: 'rawParams' cannot be null. Please provide an object or omit it."
        )
    }

    // Apply defaults for initial custom validation checks
    const effectiveLength = rawParams.length ?? 16
    const effectiveCharacterSet = rawParams.characterSet ?? 'alphanumeric'

    // Custom validation for 'length' (DX-focused)
    if (typeof effectiveLength !== 'number' || !Number.isInteger(effectiveLength) || effectiveLength < 0) {
        throw new TypeError(
            `Invalid cryptoString parameters: 'length' (currently ${effectiveLength}) must be a non-negative integer.`
        )
    }

    // Enhanced validation for extremely large lengths (memory safety)
    if (effectiveLength > 1_000_000) {
        throw new TypeError(
            `Invalid cryptoString parameters: 'length' (currently ${effectiveLength}) exceeds maximum safe limit of 1,000,000 characters.`
        )
    }

    // Custom validation for 'characterSet' (DX-focused)
    let finalCharacterSet: string
    if (typeof effectiveCharacterSet === 'string') {
        // Check if it's one of the predefined keys from our map
        if (Object.prototype.hasOwnProperty.call(CHARACTER_SETS_MAP, effectiveCharacterSet)) {
            finalCharacterSet = CHARACTER_SETS_MAP[effectiveCharacterSet as keyof typeof CHARACTER_SETS_MAP]
        } else {
            // Otherwise, treat it as a custom string provided by the user
            finalCharacterSet = effectiveCharacterSet

            // Enhanced Unicode-aware validation for duplicate characters in custom character sets
            // Use Array.from() to correctly handle surrogate pairs (multi-code unit characters like emojis)
            const charsArray = Array.from(finalCharacterSet)
            const uniqueChars = new Set(charsArray)

            if (uniqueChars.size !== charsArray.length) {
                throw new TypeError(
                    'Invalid cryptoString parameters: Custom character set contains duplicate characters, which would skew randomness distribution.'
                )
            }

            // Additional validation for character set size (entropy considerations)
            if (charsArray.length < 2) {
                throw new TypeError(
                    'Invalid cryptoString parameters: Custom character set must contain at least 2 unique characters for meaningful randomness.'
                )
            }
        }
    } else {
        // If characterSet is not a string, it's invalid
        throw new TypeError(
            `Invalid cryptoString parameters: 'characterSet' (currently ${effectiveCharacterSet}) must be a string or a predefined character set name.`
        )
    }

    if (finalCharacterSet.length === 0) {
        throw new TypeError("Invalid cryptoString parameters: The resolved 'characterSet' cannot be empty.")
    }
    // --- END Initial Parameter Validation ---

    // ArkType Validation (for other potential issues, though custom checks cover most)
    // This provides an additional layer of validation and ensures consistency with other functions.
    try {
        cryptoStringParamsSchema.assert(rawParams)
    } catch (e: any) {
        throw new TypeError(`Invalid cryptoString parameters: ${e.summary || e.message}`)
    }

    // If length is 0, return an empty string immediately
    if (effectiveLength === 0) {
        return ''
    }

    // Pre-allocate result array for optimal performance
    const resultArray = new Array<string>(effectiveLength)

    // Convert character set to array once for Unicode-safe indexing
    // This ensures proper handling of surrogate pairs and multi-byte characters
    const finalCharacterSetArray = Array.from(finalCharacterSet)
    const characterSetLength = finalCharacterSetArray.length

    // Optimized character generation loop with cryptographically secure indexing
    for (let i = 0; i < effectiveLength; i++) {
        // Use cryptoRandom to pick a cryptographically secure random index
        // This inherits all the bias-prevention and security properties of cryptoRandom
        // The upperBound is inclusive for integers when exclusion is 'none'
        const randomIndex = cryptoRandom({
            lowerBound: 0,
            upperBound: characterSetLength - 1, // Max index is length - 1
            typeOfNum: 'integer',
            exclusion: 'none',
        })

        // Direct character selection - no intermediate transformations
        resultArray[i] = finalCharacterSetArray[randomIndex]
    }

    // Single join operation for optimal string construction
    return resultArray.join('')
}

/**
 * Utility function to calculate the theoretical entropy of a string generated
 * with the given parameters. This is useful for security analysis and validation.
 *
 * @param {CryptoStringParams} params - The parameters used for string generation.
 * @returns {number} - The theoretical entropy in bits.
 * @throws {TypeError} - If input parameters are invalid (e.g., character set has less than 2 unique characters).
 *
 * @example
 * // Calculate entropy for a 32-character alphanumeric string
 * const entropy = calculateStringEntropy({ length: 32 });
 * console.log(`Entropy: ${entropy.toFixed(2)} bits`); // e.g., "Entropy: 190.91 bits"
 */
export function calculateStringEntropy(params: CryptoStringParams = {}): number {
    const effectiveLength = params.length ?? 16
    const effectiveCharacterSet = params.characterSet ?? 'alphanumeric'

    // --- START: Minimal addition to throw error for failing test in 004-error-handling.js ---
    // CSTCEH08: calculateStringEntropy with invalid length
    if (typeof effectiveLength !== 'number' || !Number.isInteger(effectiveLength) || effectiveLength < 0) {
        throw new TypeError(
            `Invalid calculateStringEntropy parameters: 'length' (currently ${effectiveLength}) must be a non-negative integer.`
        )
    }
    // --- END: Minimal addition ---

    let charsetSize: number
    if (
        typeof effectiveCharacterSet === 'string' &&
        Object.prototype.hasOwnProperty.call(CHARACTER_SETS_MAP, effectiveCharacterSet)
    ) {
        charsetSize = CHARACTER_SETS_MAP[effectiveCharacterSet as keyof typeof CHARACTER_SETS_MAP].length
    } else {
        // For custom character sets, use Array.from to correctly count unique Unicode characters
        const charsArray = Array.from(effectiveCharacterSet)
        const uniqueChars = new Set(charsArray)

        if (uniqueChars.size < 2) {
            // This validation is crucial here too, as entropy needs at least 2 options
            throw new TypeError(
                'Invalid calculateStringEntropy parameters: Character set must contain at least 2 unique characters to calculate meaningful entropy.'
            )
        }
        charsetSize = uniqueChars.size
    }

    if (charsetSize === 0) {
        // If for some reason charsetSize is 0 (e.g., empty string passed as custom characterSet), entropy is 0
        return 0
    }

    // Entropy = log2(charset_size) * length
    return Math.log2(charsetSize) * effectiveLength
}
