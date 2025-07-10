// src.types.ts

import { type } from 'arktype'
import { Constants } from './src.constants.js'

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
    maxFracDigits?: number // <-- CORRECTED: This MUST be 'number', not a string literal
}

/**
 * ArkType schema for validating RandomParams.
 */
export const randomParamsSchema = type({
    lowerBound: `number >= ${Constants.MIN_SAFE_INT}?`,
    upperBound: `number <= ${Constants.MAX_SAFE_INT}?`,
    typeOfNum: "'integer'|'double'?",
    exclusion: "'none'|'lower bound'|'upper bound'|'both'?",
    // This schema string is correct for validation, it implies a number type.
    maxFracDigits: `${Constants.MIN_FRACTIONAL_DIGITS} <= number.integer <= ${Constants.MAX_FRACTIONAL_DIGITS}?`,
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
    // maxRetries is intentionally NOT re-added here as it will be an internal constant
}

/**
 * ArkType schema for validating ShuffleParams.
 */
export const shuffleParamsSchema = type({
    arr: 'unknown[]?',
    isDestructive: 'boolean?',
    preventIdentical: 'boolean?',
    // maxRetries is intentionally NOT re-added here as it will be an internal constant
})