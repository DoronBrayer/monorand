// /shuffrand/src.constants.ts

/**
 * shuffrand Constants
 *
 * This file defines various constants used throughout the shuffrand module,
 * adhering to a flat, dot-categorized structure for clarity.
 *
 * @author Doron Brayer <doronbrayer@outlook.com>
 * @license MIT
 */

// Define base character strings as independent constants first.
// These are then used to compose the properties within the Constants object.
const digits = '0123456789'
const latin_lowercase_letters = 'abcdefghijklmnopqrstuvwxyz'
const latin_uppercase_letters = latin_lowercase_letters.toUpperCase()
const latin_letters = latin_lowercase_letters + latin_uppercase_letters
const alphanumeric_chars = latin_lowercase_letters + latin_uppercase_letters + digits
const hex_chars = digits + latin_lowercase_letters.slice(0, 6)

export const Constants = {
    MAX_SAFE_INT: Number.MAX_SAFE_INTEGER,
    MIN_SAFE_INT: Number.MIN_SAFE_INTEGER,
    MAX_SAFE_DOUBLE: 1e15, // 10¹⁵
    MIN_SAFE_DOUBLE: -1e15, // Minus 10¹⁵
    UINT32_MAX_VALUE: 0xffffffff, // Maximum value for a 32-bit unsigned integer (2^32 - 1)
    UINT32_RANGE: 0x100000000, // Range of a 32-bit unsigned integer (2^32)
    MAX_FRACTIONAL_DIGITS: 15, // Max precision for doubles (standard JS float precision)
    MIN_FRACTIONAL_DIGITS: 1, // Avoid integer-like doubles by demanding at least one fractional digit
    MAX_ATTEMPTS_TO_GENERATE_NUM: 30, // Max retries for exclusion constraints

    // --- Character Set Constants (for cryptoString) ---
    // Now, define the properties using the base constants for "var + var" assembly.
    // These properties will correctly infer literal types due to 'as const'.
    /**
     * String containing all digit characters (0-9).
     */
    DIGITS: digits,

    /**
     * String containing all lowercase English alphabet characters (a-z).
     */
    LATIN_LOWERCASE_LETTERS: latin_lowercase_letters,

    /**
     * String containing all uppercase English alphabet characters (A-Z).
     */
    LATIN_UPPERCASE_LETTERS: latin_uppercase_letters,

    /**
     * String containing all English alphabet characters (a-z, A-Z).
     */
    LATIN_LETTERS: latin_letters,

    /**
     * String containing all alphanumeric characters (a-z, A-Z, 0-9).
     */
    ALPHANUMERIC_CHARS: alphanumeric_chars,

    /**
     * String containing all hexadecimal characters (0-9, a-f).
     */
    HEX_CHARS: hex_chars
} as const // Maintain the 'as const' assertion
