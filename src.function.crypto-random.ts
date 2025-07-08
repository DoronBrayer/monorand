// src.function.crypto-random.ts

/**
 * shuffrand - Cryptographically Secure Random Number Generation
 *
 * This file contains the core logic for generating cryptographically secure random numbers,
 * adhering to a flat, dot-categorized structure for clarity.
 *
 * @author Doron Brayer <doronbrayer@outlook.0com>
 * @license MIT
 */

// Import Node.js built-in modules for cryptographic randomness and assertions
import { webcrypto } from 'node:crypto';


// Import types, constants, and ArkType schema from their respective dot-categorized files
import { RandomNumParams, randomNumParamsSchema } from './src.types.js';
import { Constants } from './src.constants.js';

/**
 * Generates a cryptographically secure random number within a specified range.
 * Both lowerBound and upperBound are inclusive for both integers and doubles.
 *
 * @param {RandomNumParams} [rawParams={}] - The raw parameters object for generating the random number.
 * @param {number} [rawParams.lowerBound=0] - The lower bound (inclusive).
 * @param {number} [rawParams.upperBound=1] - The upper bound (inclusive).
 * @param {'integer'|'double'} [rawParams.typeOfNum='integer'] - The type of number to generate ('integer' or 'double').
 * @param {number | null} [rawParams.maxFracDigits=3] - The maximum number of fractional digits for doubles. Semi-ignored if 'integer' is targeted.
 * @param {'none'|'lower bound'|'upper bound'|'both'} [rawParams.exclusion='none'] - Which bound to exclude.
 * @returns {number} - The generated random number.
 * @throws {TypeError} - If input parameters do not conform to the schema or are not finite numbers.
 * @throws {Error} - If unable to generate a random number that satisfies exclusion constraints.
 */
export function cryptoRandom(rawParams: RandomNumParams = {}): number {
    let validatedParams: Required<RandomNumParams>; // Declare validatedParams, explicitly making all properties required after defaults

    // --- ArkType Input Validation and Default Application ---
    try {
        // Validate the raw input parameters using the ArkType schema.
        // If validation fails, ArkType's .assert() method will throw an ArkErrors instance.
        randomNumParamsSchema.assert(rawParams);

        // If validation passes, apply default values to ensure all properties are present
        // in 'validatedParams' for consistent subsequent logic.
        validatedParams = {
            lowerBound: rawParams.lowerBound ?? 0,
            upperBound: rawParams.upperBound ?? (rawParams.typeOfNum === 'integer' ? 1 : 1),
            typeOfNum: rawParams.typeOfNum ?? "integer",
            maxFracDigits: rawParams.maxFracDigits ?? 3,
            exclusion: rawParams.exclusion ?? "none"
        };
    } catch (e: any) {
        // Catch the ArkErrors instance thrown by .assert() and re-throw a TypeError
        // with a user-friendly summary of the validation problems.
        throw new TypeError(`Invalid cryptoRandom parameters: ${e.summary || e.message}`);
    }
    // --- END ArkType Input Validation and Default Application ---

    // Destructure parameters from the fully validated and defaulted 'validatedParams' object.
    // No need for default assignments here as they've been applied above.
    const {
        lowerBound: initialLowerBound,
        upperBound: initialUpperBound,
        typeOfNum,
        maxFracDigits,
        exclusion
    } = validatedParams;

    // The manual assert statements for lowerBound and upperBound type/finiteness
    // are now handled by ArkType validation and have been removed.

    // CRITICAL FIX: Only shortcut if no exclusion is applied for equal bounds
    if (initialLowerBound === initialUpperBound && exclusion === 'none') {
        return initialLowerBound;
    }
    // If bounds are equal AND exclusion is NOT 'none', we MUST proceed to check exclusion.

    // Ensure min is truly the lower bound and max is truly the upper bound
    let min = Math.min(initialLowerBound, initialUpperBound);
    let max = Math.max(initialLowerBound, initialUpperBound);

    const isDouble = typeOfNum === "double";

    // Clamp bounds to safe integer/double limits
    if (isDouble) {
        min = Math.max(Constants.MIN_SAFE_DOUBLE, Math.min(Constants.MAX_SAFE_DOUBLE, min));
        max = Math.max(Constants.MIN_SAFE_DOUBLE, Math.min(Constants.MAX_SAFE_DOUBLE, max));
    } else {
        // For integers, ensure bounds are integers themselves for clamping
        min = Math.ceil(Math.max(Constants.MIN_SAFE_INTEGER, Math.min(Constants.MAX_SAFE_INTEGER, min)));
        max = Math.floor(Math.max(Constants.MIN_SAFE_INTEGER, Math.min(Constants.MAX_SAFE_INTEGER, max)));
    }

    // --- NEW PRE-CHECK for impossible exclusion constraints (Integers) ---
    if (!isDouble) {
        // Calculate the range of integers that are *potentially* valid
        // This is [min, max] inclusive
        let currentMin = min;
        let currentMax = max;

        if (exclusion === 'lower bound' || exclusion === 'both') {
            currentMin++; // Exclude the original lower bound
        }
        if (exclusion === 'upper bound' || exclusion === 'both') {
            currentMax--; // Exclude the original upper bound
        }

        // If, after applying exclusions, the adjusted min is greater than the adjusted max,
        // it means there are no valid integers left.
        if (currentMin > currentMax) {
            throw new Error(
                `No valid integers exist within the range [${initialLowerBound}, ${initialUpperBound}] that satisfy the { exclusion: '${exclusion}' } constraint.`
            );
        }
    }
    // --- END NEW PRE-CHECK ---

    let result: number;
    let attempts = 0;
    const maxAttempts = Constants.MAX_GENERATION_ATTEMPTS;

    do {
        const bytes = new Uint32Array(1);
        webcrypto.getRandomValues(bytes);
        const value = bytes[0]; // Random integer from 0 to 2^32 - 1

        if (!isDouble) {
            // Integer generation: result is in [min, max] inclusive
            const range = max - min + 1; // Inclusive range
            result = min + Math.floor((value / Constants.UINT32_RANGE) * range); // Use UINT32_RANGE for integers
        } else {
            // Double generation: result is in [min, max] inclusive
            // CRITICAL CHANGE: Divide by UINT32_MAX_VALUE to make 'max' reachable
            result = (value / Constants.UINT32_MAX_VALUE) * (max - min) + min;

            // Apply rounding for doubles
            if (typeof maxFracDigits === "number" && maxFracDigits >= Constants.MIN_FRACTIONAL_DIGITS && maxFracDigits <= Constants.MAX_FRACTIONAL_DIGITS) {
                const multiplier = Math.pow(10, maxFracDigits);
                result = Math.round(result * multiplier) / multiplier;
            }
        }

        // Exclusion checks (using initial bounds for comparison)
        let isExcluded = false;

        if (exclusion === "lower bound" || exclusion === "both") {
            if (isDouble) {
                if (Math.abs(result - initialLowerBound) < Number.EPSILON * Math.max(Math.abs(initialLowerBound), 1)) {
                    isExcluded = true;
                }
            } else { // Integer
                if (result === initialLowerBound) {
                    isExcluded = true;
                }
            }
        }

        if (!isExcluded && (exclusion === "upper bound" || exclusion === "both")) {
            if (isDouble) {
                if (Math.abs(result - initialUpperBound) < Number.EPSILON * Math.max(Math.abs(initialUpperBound), 1)) {
                    isExcluded = true;
                }
            } else { // Integer
                if (result === initialUpperBound) {
                    isExcluded = true;
                }
            }
        }

        if (isExcluded) {
            attempts++;
            continue;
        }

        break;
    } while (attempts < maxAttempts);

    if (attempts >= maxAttempts) {
        throw new Error(
            `Unable to generate a random number within the range [${initialLowerBound}, ${initialUpperBound}] that satisfies the { exclusion: '${exclusion}' } constraint after ${maxAttempts} attempts. Consider adjusting bounds or exclusion.`
        );
    }

    return result;
}