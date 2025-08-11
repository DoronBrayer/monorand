// /shuffrand/src.types.ts

import { type } from 'arktype'
import { Constants } from './src.constants.js'

/**
 * Defines a reusable ArkType schema for a number that must be within the
 * JavaScript safe integer range (MIN_SAFE_INTEGER to MAX_SAFE_INTEGER).
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
    maxFracDigits?: number
}

/**
 * ArkType schema for validating RandomParams.
 */
export const randomParamsSchema = type({
    lowerBound: safeRangeNumberType.optional(),
    upperBound: safeRangeNumberType.optional(),
    typeOfNum: "'integer'|'double'?",
    exclusion: "'none'|'lower bound'|'upper bound'|'both'?",
    maxFracDigits: `0 <= number.integer <= 15?`
})

/**
 * Parameters for the cryptoShuffle function.
 */
export interface ShuffleParams<T> {
    arr?: T[]
    isDestructive?: boolean
    preventIdentical?: boolean
    /**
     * The starting index of the subarray to shuffle (inclusive).
     * Defaults to 0, shuffling from the beginning of the array.
     * Must be a non-negative integer within the array bounds.
     * If greater than or equal to `endIndex`, no shuffling occurs on the subarray.
     * @since 1.6.0
     */
    startIndex?: number

    /**
     * The ending index of the subarray to shuffle (exclusive).
     * Defaults to the array's length, shuffling to the end of the array.
     * Must be a non-negative integer within the array bounds (0 to arr.length).
     * If less than or equal to `startIndex`, no shuffling occurs on the subarray.
     * @since 1.6.0
     */
    endIndex?: number
}

/**
 * ArkType schema for validating ShuffleParams.
 * Note: startIndex and endIndex validation is handled by custom logic in the function
 * due to ArkType v2.1.20 issues with optional constrained fields.
 */
export const shuffleParamsSchema = type({
    arr: 'unknown[]?',
    isDestructive: 'boolean?',
    preventIdentical: 'boolean?',
    // Temporarily skip ArkType validation for these fields - let custom validation handle them
    startIndex: 'unknown?',
    endIndex: 'unknown?'
})

/**
 * Parameters for the cryptoString function.
 */
export interface CryptoStringParams {
    length?: number
    characterSet?: 'alphanumeric' | 'numeric' | 'alpha' | 'hex' | 'uppercase' | 'lowercase' | string
    /**
     * If true, ensures no character appears more than once in the result.
     * Defaults to `false`.
     */
    noRepeat?: boolean
}

/**
 * ArkType schema for validating CryptoStringParams.
 */
export const cryptoStringParamsSchema = type({
    length: `number.integer>=0?`,
    characterSet: `string | 'alphanumeric' | 'numeric' | 'alpha' | 'hex' | 'uppercase' | 'lowercase' ?`,
    noRepeat: 'boolean?'
})
