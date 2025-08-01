// src.types.ts (Final & Corrected)

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
    maxFracDigits: `0 <= number.integer <= 15?`,
})

/**
 * Parameters for the cryptoShuffle function.
 */
export interface ShuffleParams<T> {
    arr?: T[]
    isDestructive?: boolean
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
    noRepeat: 'boolean?',
})
