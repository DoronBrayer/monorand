// src.types.ts

import { type } from 'arktype'
import { Constants } from './src.constants.js' // IMPORTANT: This import is crucial for schemas

/**
 * Defines a reusable ArkType schema for a number that must be within the
 * JavaScript safe integer range (MIN_SAFE_INTEGER to MAX_SAFE_INTEGER).
 * This ensures that numbers used for bounds are always safe for arithmetic
 * operations without precision loss.
 */
const safeRangeNumberType = type('number').atLeast(Constants.MIN_SAFE_INT).atMost(Constants.MAX_SAFE_INT)

/**
 * Parameters for the cryptoRandom function.
 */
export interface RandomParams {
    lowerBound?: number
    upperBound?: number
    typeOfNum?: 'integer' | 'double'
    exclusion?: 'none' | 'lower bound' | 'upper bound' | 'both'
    /**
     * The maximum number of fractional digits for 'double' type numbers.
     * If specified, the generated double will be rounded to this many decimal places.
     * Must be a non-negative integer. Defaults to `3`.
     */
    maxFracDigits?: number
}

/**
 * ArkType schema for validating RandomParams.
 */
export const randomParamsSchema = type({
    // Using the reusable safeRangeNumberType for lowerBound and upperBound.
    lowerBound: safeRangeNumberType.optional(),
    upperBound: safeRangeNumberType.optional(),
    typeOfNum: "'integer'|'double'?",
    exclusion: "'none'|'lower bound'|'upper bound'|'both'?",
    // Added schema validation for maxFracDigits as per the ArkType Conclusions Recap.
    // This ensures it's an optional integer between 0 and 15.
    maxFracDigits: `0 <= number.integer <= 15?`,
})

/**
 * Parameters for the cryptoShuffle function.
 * @template T The type of elements in the array.
 */
export interface ShuffleParams<T> {
    arr?: T[]
    isDestructive?: boolean
    /**
     * If true, the function will attempt to prevent the shuffled array from being
     * identical to the original input array. This introduces a statistical bias
     * by excluding the original permutation. Do not use in cryptographic or
     * fairness-critical contexts where absolute unbiased randomness is required.
     * Defaults to `false`.
     */
    preventIdentical?: boolean
}

/**
 * ArkType schema for validating ShuffleParams.
 */
export const shuffleParamsSchema = type({
    arr: 'unknown[]?',
    isDestructive: 'boolean?',
    preventIdentical: 'boolean?',
})

/**
 * Parameters for the cryptoString function.
 */
export interface CryptoStringParams {
    /**
     * The desired length of the random string. Must be a non-negative integer.
     * Defaults to `16`.
     */
    length?: number
    /**
     * The character set from which to generate the random string.
     * Can be a predefined string ('alphanumeric', 'numeric', 'alpha', 'hex', 'uppercase', 'lowercase')
     * or a custom string of characters (e.g., 'abc!@#$').
     * Defaults to 'alphanumeric'.
     */
    characterSet?: 'alphanumeric' | 'numeric' | 'alpha' | 'hex' | 'uppercase' | 'lowercase' | string
}

/**
 * ArkType schema for validating CryptoStringParams.
 */
export const cryptoStringParamsSchema = type({
    length: `number.integer>=0?`, // Length must be a non-negative integer
    characterSet: `string | 'alphanumeric' | 'numeric' | 'alpha' | 'hex' | 'uppercase' | 'lowercase' ?`,
})
