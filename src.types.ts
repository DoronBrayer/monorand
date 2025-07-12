// src.types.ts

import { type } from 'arktype'
import { Constants } from './src.constants.js' // IMPORTANT: This import is crucial for schemas

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
    lowerBound: `number >= ${Constants.MIN_SAFE_INT}?`,
    upperBound: `number <= ${Constants.MAX_SAFE_INT}?`,
    typeOfNum: "'integer'|'double'?",
    exclusion: "'none'|'lower bound'|'upper bound'|'both'?",
    maxFracDigits: 'number?',
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
