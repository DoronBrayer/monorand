// src.function.crypto-shuffle.ts

/**
 * shuffrand - Cryptographically Secure Array Shuffling
 *
 * This file contains the core logic for shuffling arrays using a cryptographically secure method,
 * adhering to a flat, dot-categorized structure for clarity.
 *
 * @author Doron Brayer <doronbrayer@outlook.com>
 * @license MIT
 */

// Import types and the cryptoRandom function from their respective dot-categorized files
import { ShuffleParams, shuffleParamsSchema } from './src.types.js' // Added shuffleParamsSchema
import { cryptoRandom } from './src.function.crypto-random.js'

/**
 * Shuffles an array using the cryptographically secure Fisher–Yates algorithm.
 * Wikipedia.org/wiki/Fisher–Yates_shuffle
 *
 * @param {ShuffleParams<T>} [rawParams={}] - The raw parameters for shuffling the array.
 * @param {T[]} [rawParams.arr=[]] - The array to shuffle.
 * @param {boolean} [rawParams.isDestructive=false] - Whether to shuffle the array in place (destructive) or create a new shuffled array (non-destructive).
 * @returns {T[]} - The shuffled array.
 * @throws {TypeError} - If input parameters do not conform to the schema.
 */
export function cryptoShuffle<T>(rawParams: ShuffleParams<T> = {}): T[] {
    let validatedParams: Required<ShuffleParams<T>> // Declare validatedParams, explicitly making all properties required

    // --- ArkType Input Validation and Default Application ---
    try {
        // Validate the raw input parameters using the ArkType schema.
        // If validation fails, ArkType's .assert() method will throw an ArkErrors instance.
        shuffleParamsSchema.assert(rawParams)

        // If validation passes, apply default values to ensure all properties are present
        // in 'validatedParams' for consistent subsequent logic.
        validatedParams = {
            arr: rawParams.arr ?? [],
            isDestructive: rawParams.isDestructive ?? false,
        }
    } catch (e: any) {
        // Catch the ArkErrors instance thrown by .assert() and re-throw a TypeError
        // with a user-friendly summary of the validation problems.
        throw new TypeError(`Invalid cryptoShuffle parameters: ${e.summary || e.message}`)
    }
    // --- END ArkType Input Validation and Default Application ---

    // The manual assert statement for 'arr' is now handled by ArkType validation and has been removed.
    // assert(Array.isArray(arr), "Input 'arr' must be an array.");

    const { arr, isDestructive } = validatedParams // Destructure from validatedParams

    const workingArray = isDestructive ? arr : [...arr]
    const length = workingArray.length

    for (let i = length - 1; i > 0; i--) {
        // Generate a cryptographically secure random index 'j' such that 0 <= j <= i (inclusive)
        // Since cryptoRandom now has an inclusive upper bound, we pass 'i'.
        const j = cryptoRandom({
            lowerBound: 0,
            upperBound: i, // Correct for Fisher–Yates (inclusive upper bound in cryptoRandom)
            typeOfNum: 'integer',
            exclusion: 'none', // Always 'none' for random index generation
        })

        // Swap elements at indices i and j
        ;[workingArray[i], workingArray[j]] = [workingArray[j], workingArray[i]]
    }

    return workingArray
}
