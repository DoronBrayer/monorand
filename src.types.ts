// src.types.ts

/**
 * shuffrand Type Definitions
 *
 * This file defines the core type interfaces used throughout the shuffrand module,
 * adhering to a flat, dot-categorized structure for clarity.
 *
 * @author Doron Brayer <doronbrayer@outlook.com>
 * @license MIT
 */

// Import ArkType for defining schemas that mirror TypeScript types
import { type, Type } from 'arktype';

// Type definitions for parameters
export type NumberType = "integer" | "double";

export interface RandomNumParams {
    /**
     * The lower bound for the random number (inclusive).
     * Defaults to 0 if not provided.
     */
    lowerBound?: number;
    /**
     * The upper bound for the random number (inclusive).
     * Defaults to 1 if not provided.
     */
    upperBound?: number;
    /**
     * The type of number to generate: 'integer' or 'double'.
     * Defaults to 'double'.
     */
    typeOfNum?: NumberType;
    /**
     * The maximum number of fractional digits for 'double' type.
     * Semi-ignored if 'integer' is targeted. Defaults to 3.
     */
    maxFracDigits?: number | null;
    /**
     * Specifies which bounds to exclude from the result.
     * - 'none': No bounds are excluded.
     * - 'lower bound': Excludes the lower bound.
     * - 'upper bound': Excludes the upper bound.
     * - 'both': Excludes both bounds.
     */
    exclusion?: "lower bound" | "upper bound" | "both" | "none";
}

// Define the ArkType schema for RandomNumParams
// This schema provides runtime validation and can be used to infer types.
// It explicitly defines the structure and expected types for cryptoRandom's parameters.
export const randomNumParamsSchema = type({
    "lowerBound?": "number",
    "upperBound?": "number",
    "typeOfNum?": "'integer'|'double'",
    "maxFracDigits?": "number | null",
    "exclusion?": "'none'|'lower bound'|'upper bound'|'both'"
});

export interface ShuffleParams<T> {
    /**
     * The array to be shuffled.
     * Defaults to an empty array if not provided or not an array.
     */
    arr?: T[];
    /**
     * If true, the original array will be modified. If false, a new shuffled array will be returned.
     * Defaults to false.
     */
    isDestructive?: boolean;
}

// Define the ArkType schema for ShuffleParams
// This schema will be used for runtime validation of the input parameters for cryptoShuffle.
// Note: ArkType's array syntax with generics is handled by validating 'arr' as 'any[]'
// at runtime, as the generic type T is a TypeScript compile-time concept.
export const shuffleParamsSchema = type({
    "arr?": "unknown[]", // Optional array of any type at runtime
    "isDestructive?": "boolean" // Optional boolean
});